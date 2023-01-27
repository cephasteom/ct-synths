import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MessageEvent, MIDIEvent } from '@rnbo/js'

// TODO: Create RNBODevice class to contain logic shared between BaseSynth and FXChain
// Or, look at using a contract to define the interface for a device
const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
const ps = [
    'dist', 'drive',
    'ring', 'ringf', 'ringspread', 'ringmode',
    'chdepth', 'chlfo', 'chspread',
    'hicut', 'locut',
]

class FXChain {
    json = new URL('./json/fx.export.json', import.meta.url)
    self = this.constructor
    device = null
    ready = false
    params = ps
    static get baseKeys() {
        return ps
    }
    defaults = {
        dist: 0, drive: 0,
        ring: 0, ringf: 0, ringspread: 0, ringmode: 0,
        hicut: 0, locut: 0,
        chdepth: 0, chlfo: 0, chspread: 0,
    }
    state = {
        last: 60,
    }
    
    constructor() {
        this.input = new Gain(1);
        this.output = new Gain(1);
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        dummy.connect(this.output);
        dummy.connect(this.input);
        this.initDevice()
        this.initParams()
    }

    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        
        this.device = await createDevice({ context, patcher });
        this.input._gainNode._nativeAudioNode.connect(this.device.node);
        this.device.node.connect(this.output._gainNode._nativeAudioNode);
        
        console.log(this.device)
        this.ready = true
    }  

    initParams() {
        this.params.forEach(key => {
            if(this[key]) return
            this[key] = (value, time) => this.messageDevice(key, value, time)
        })
        Object.keys(this.settable).forEach(key => this[key] = this[key].bind(this))
    }

    messageDevice(tag, payload, time) {
        const message = new MessageEvent((time * 1000) - 10, tag, [ payload ]);
        this.device.scheduleEvent(message);
    }

    connect(node) { 
        this.output.disconnect();
        this.output.connect(node)
    }

    get settable() { 
        return this.params.reduce((obj, key) => ({ ...obj, [key]: this[key] }), {})
    }

    setParams(params, time) {
        const settable = this.settable
        Object.entries(params)
            .forEach(([key, value]) => {
                this.state[key] = value
                settable[key] && settable[key](value, time)
            })
    }

    set(params = {}, time) {
        if(!this.ready) return
        const ps = {...this.defaults, ...params }
        this.setParams(ps, time, 0)

        const triggerEvent = new MIDIEvent(time * 1000, 0, [144, 60, 127]);
        this.device.scheduleEvent(triggerEvent);
    }

    mutate(params = {}, time, lag = 0.1) {
        if(!this.ready) return
        const ps = Object.entries(params).reduce((obj, [key, value]) => ({ ...obj, [`_${key}`]: value }), {})
        this.setParams(ps, time, 1)
        this.messageDevice('mutate', lag * 1000, time)
    }

}

export default FXChain