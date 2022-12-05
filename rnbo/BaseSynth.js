import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MIDIEvent, MessageEvent } from '@rnbo/js'
import { beatsToSeconds } from "../utils/tone";

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;

class BaseSynth {
    self = this.constructor
    defaults = {}
    device = null
    ready = false
    params = ['n', 'pan', 'vol', 'a', 'd', 's', 'r', 'moda', 'modd', 'mods', 'modr', 'fila', 'fild', 'fils', 'filr']

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
        this.params.forEach(key => this[key] = (value, time) => this.messageDevice(key, value, time))
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
                settable[key] && settable[key](value, time)
            })
    }

    play(params = {}, time) {
        if(!this.ready) return
        
        this.setParams(params, time)

        const {n, dur, amp} = params

        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, n, 66 * (amp || 1)]);
        const noteOffEvent = new MIDIEvent((time + beatsToSeconds(dur)) * 1000, 0, [128, n, 0]);

        this.device.scheduleEvent(noteOnEvent);
        this.device.scheduleEvent(noteOffEvent)
    }

    cut(time) {
        if(!this.ready) return
        this.messageDevice('cut', 1, time)
    }

    mutate(params = {}, time, lag = 0.1) {
        if(!this.ready) return
        this.setParams(params, time)
        this.messageDevice('mutate', lag * 1000, time)
    }
}

export default BaseSynth