import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MessageEvent } from '@rnbo/js'

class RNBODevice {
    device = null
    ready = false
    json = null
    context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
    
    state = {
        last: 60,
    }

    constructor() {
        this.input = new Gain(1);
        this.output = new Gain(1);
        dummy.connect(this.output);
        dummy.connect(this.input);
    }

    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        
        this.device = await createDevice({ context: this.context, patcher });
        this.device.node.connect(this.output._gainNode._nativeAudioNode);
        this.input._gainNode._nativeAudioNode.connect(this.device.node);

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
        console.log(params)
        const settable = this.settable
        Object.entries(params)
            .forEach(([key, value]) => {
                this.state[key] = value
                settable[key] && settable[key](value, time)
            })
    }

    mutate(params = {}, time, lag = 100) {
        if(!this.ready) return
        const ps = Object.entries(params).reduce((obj, [key, value]) => ({ ...obj, [`_${key}`]: value }), {})
        this.setParams(ps, time, 1)
        this.messageDevice('mutate', lag, time)
    }

}

export default RNBODevice