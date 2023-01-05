import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MIDIEvent, MessageEvent } from '@rnbo/js'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;

class BaseSynth {
    self = this.constructor
    device = null
    ready = false
    params = ['n', 'pan', 'amp', 'vol', 'a', 'd', 's', 'r', 'moda', 'modd', 'mods', 'modr', 'fila', 'fild', 'fils', 'filr']
    defaults = {n: 60, pan: 0.5, vol: 1, amp: 1, a: 10, d: 100, s: 0.8, r: 1000, moda: 10, modd: 100, mods: 0.8, modr: 1000, a: 10, d: 100, s: 1, r: 1000}
    state = {}
    // manually handle note on/off separate to n, to prevent stale note offs from truncating notes
    note = 0

    constructor() {
        this.output = new Gain(1);
        dummy.connect(this.output);
    }

    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        
        this.device = await createDevice({ context, patcher });
        this.device.node.connect(this.output._gainNode._nativeAudioNode);
        dummy.connect(this.output);
        this.ready = true
    }  

    initParams() {
        this.params.forEach(key => {
            if(this[key]) return
            this[key] = (value, time, isMutation = 0) => this.messageDevice(key, [value, isMutation], time)
        })
        Object.keys(this.settable).forEach(key => this[key] = this[key].bind(this))
    }

    messageDevice(tag, payload, time) {
        const message = new MessageEvent((time * 1000) - 10, tag, payload);
        this.device.scheduleEvent(message);
    }

    connect(node) { 
        this.output.disconnect();
        this.output.connect(node)
    }

    get settable() { 
        return this.params.reduce((obj, key) => ({ ...obj, [key]: this[key] }), {})
    }

    setParams(params, time, isMutation = 0) {
        const settable = this.settable
        Object.entries(params)
            .forEach(([key, value]) => {
                // prevent needless mutation messages
                if(this.state[key] === value && isMutation) return
                this.state[key] = value
                settable[key] && settable[key](value, time, isMutation)
            })
    }

    play(params = {}, time) {
        if(!this.ready) return
        const ps = {...this.defaults, ...params }
        this.setParams(ps, time, 0)
        const {dur, n} = ps
        
        // use note numbers to handle on/off rather than pitch
        // send n as the velocity
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, this.note, n]);
        const noteOffEvent = new MIDIEvent((time * 1000) + (dur || 500), 0, [128, this.note, 0]);
        this.device.scheduleEvent(noteOnEvent);
        this.device.scheduleEvent(noteOffEvent)
        
        this.note = (this.note + 1) % 128
    }

    cut(time) {
        if(!this.ready) return
        this.messageDevice('cut', 1, time)
    }

    mutate(params = {}, time, lag = 0.1) {
        if(!this.ready) return
        
        this.setParams(params, time, 1)
        this.messageDevice('mutate', lag * 1000, time)
    }

}

export default BaseSynth