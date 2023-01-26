import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MIDIEvent, MessageEvent } from '@rnbo/js'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
const ps = [
    'dur', 'n', 'pan', 'amp', 'vol', 
    'a', 'd', 's', 'r', 'acurve', 'dcurve', 'rcurve', 
    'moda', 'modd', 'mods', 'modr', 'modacurve', 'moddcurve', 'modrcurve', 
    'fila', 'fild', 'fils', 'filr', 'filacurve', 'fildcurve', 'filrcurve', 
    'res', 'cutoff',
    'dist', 'drive',
    'ring', 'ringf', 'ringspread', 'ringmode',
    'hicut', 'locut'
]

class BaseSynth {
    self = this.constructor
    device = null
    ready = false
    params = ps
    static get baseKeys() {
        return ps
    }
    defaults = {
        dur: 1000, n: 60, pan: 0.5, vol: 1, amp: 1, 
        a: 10, d: 100, s: 0.8, r: 1000, 
        moda: 10, modd: 100, mods: 0.8, modr: 1000,
        fila: 10, fild: 100, fils: 0.8, filr: 1000,
        res: 0, cutoff: 20000,
        ring: 0, ringf: 0, ringspread: 0, ringmode: 0,
        hicut: 0, locut: 0
    }
    state = {
        last: 60,
    }

    
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

    play(params = {}, time) {
        if(!this.ready) return

        const ps = {...this.defaults, ...params }
        console.log(ps.hicut)
        this.setParams(ps, time, 0)
        
        const { n, amp, dur } = ps
        
        // cut if the same note is played twice in a row to prevent pops
        n === this.state.last && this.cut(time)
        this.state.last = n
        
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, (n || 60), amp * 66]);
        this.device.scheduleEvent(noteOnEvent);
        
        const noteOffEvent = new MIDIEvent((time * 1000) + (dur || 500), 0, [128, n, 0]);
        this.device.scheduleEvent(noteOffEvent)
    }

    cut(time, ms = 10) {
        if(!this.ready) return
        this.messageDevice('cut', ms, time)
    }

    mutate(params = {}, time, lag = 0.1) {
        if(!this.ready) return
        const ps = Object.entries(params).reduce((obj, [key, value]) => ({ ...obj, [`_${key}`]: value }), {})
        this.setParams(ps, time, 1)
        this.messageDevice('mutate', lag * 1000, time)
    }

}

export default BaseSynth