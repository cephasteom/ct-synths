// TODO: improve typing

import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MessageEvent } from '@rnbo/js'
import type { Device } from '@rnbo/js'
import type { Dictionary } from '../types'
import type { Destination } from 'tone';

class RNBODevice {
    /** @hidden */
    input: Gain
    /** @hidden */
    output: Gain
    /** @hidden */
    device!: Device;
    /** @hidden */
    ready = false
    /** @hidden */
    json!: URL;
    /** @hidden */
    // @ts-ignore
    context: AudioContext = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
    /** @hidden */
    params!: string[];
    
    /** @hidden */
    state: Dictionary = {
        last: 60,
    }

    /** @hidden */
    constructor() {
        this.input = new Gain(1);
        this.output = new Gain(1);
        dummy.connect(this.output);
        dummy.connect(this.input);
    }

    /** @hidden */
    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        
        this.device = await createDevice({ context: this.context, patcher });
        // @ts-ignore
        this.device.node.connect(this.output._gainNode._nativeAudioNode);
        // @ts-ignore
        this.input._gainNode._nativeAudioNode.connect(this.device.node);

        this.ready = true
    }  

    /** @hidden */
    initParams() {
        this.params.forEach(key => {
            // @ts-ignore
            if(this[key]) return
            // @ts-ignore
            this[key] = (value, time) => this.messageDevice(key, value, time)
        })
        // @ts-ignore
        Object.keys(this.settable).forEach(key => this[key] = this[key].bind(this))
    }

    /** @hidden */
    messageDevice(tag: string, payload: any, time: number) {
        const message = new MessageEvent((time * 1000) - 10, tag, [ payload ]);
        this.device.scheduleEvent(message);
    }

    /** @hidden */
    connect(node: typeof Destination) { 
        this.output.disconnect();
        this.output.connect(node)
    }

    /** @hidden */
    get settable() { 
        return this.params.reduce((obj, key) => ({ 
            ...obj, 
            // @ts-ignore
            [key]: this[key] 
        }), {})
    }

    /** @hidden */
    setParams(params: Dictionary, time: number) {
        const settable = this.settable
        Object.entries(params)
            .forEach(([key, value]) => {
                this.state[key] = value
                // @ts-ignore
                settable[key] && settable[key](value, time)
            })
    }

    /**
     * Mutate given parameters on currently playing events
     * @param {Dictionary} params - key value pairs of parameters to mutate
     * @param {number} time - time in seconds to schedule the mutation
     * @param {number} lag - time in ms that the mutation will take to complete
     * @returns {void}
     */ 
    mutate(params: Dictionary = {}, time: number, lag: number = 100): void {
        if(!this.ready) return
        const ps = Object.entries(params).reduce((obj, [key, value]) => ({ ...obj, [`_${key}`]: value }), {})
        this.setParams(ps, time)
        this.messageDevice('mutate', lag, time)
    }
}

export default RNBODevice