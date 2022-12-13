import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MessageEvent } from '@rnbo/js'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
class BaseEffect {
    self = this.constructor
    defaults = {}
    device = null
    ready = false
    params = []
    defaults = {}

    constructor() {
        this.output = new Gain(1);
        this.input = new Gain(1);
    }

    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        
        this.device = await createDevice({ context, patcher });
        this.device.node.connect(this.output._gainNode._nativeAudioNode);
        this.input._gainNode._nativeAudioNode.connect(this.device.node);
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
                settable[key] && settable[key](value, time)
            })
    }

    set(params = {}, time) {
        if(!this.ready) return

        this.setParams(params, time)
        this.messageDevice('set', 1, time)
    }

    mutate(params = {}, time, lag = 0.1) {
        if(!this.ready) return
        
        this.setParams(params, time)
        this.messageDevice('mutate', lag * 1000, time)
    }

}

export default BaseEffect