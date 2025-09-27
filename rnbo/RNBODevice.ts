import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import type { Device, IPatcher } from '@rnbo/js'
import type { Dictionary } from '../types'
import pkg from '@rnbo/js';
const { createDevice, MessageEvent } = pkg;
import type { Destination } from 'tone';

class RNBODevice {
    defaults: Dictionary = {}
    /** @hidden */
    input: Gain
    /** @hidden */
    output: Gain
    /** @hidden */
    device!: Device;
    /** @hidden */
    ready = false
    /** @hidden */
    // @ts-ignore
    context: AudioContext = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
    /** @hidden */
    params!: string[];

    /** @hidden */
    patcher: Promise<IPatcher> | null = null
    
    /** @hidden */
    // Not used anymore? Remove?
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
        return this.patcher?.then((patcher: IPatcher) => createDevice({ context: this.context, patcher: patcher })
            .then(device => {
                this.device = device;
                
                // @ts-ignore
                device.node.connect(this.output._gainNode._nativeAudioNode);
                // @ts-ignore
                this.input._gainNode._nativeAudioNode.connect(device.node);
                
                this.ready = true;
            }));
    }

    /** @hidden */
    messageDevice(tag: string, payload: any, time: number) {
        const message = new MessageEvent((time * 1000) - 10, tag, [ payload ]);
        this.device.scheduleEvent(message);
    }

    /** @hidden */
    connect(node: typeof Destination | Gain) { 
        this.output.connect(node)
    }

    /** @hidden */
    disconnect() { this.output.disconnect() }

    /** @hidden */
    setParams(params: Dictionary, time: number) {
        Object.entries(params)
            // sort by key to ensure consistent order - also ensures bank is called before i
            .sort(([keyA, _]: [string, any], [keyB, __]: [string, any]) => keyA.localeCompare(keyB))
            // filter out parameters that are not in the params list
            .filter(([key, _]: [string, any]) => this.params.includes(key)) 
            // set the state and call the method if it exists
            .forEach(([key, value]) => {
                // don't send messages for unchanged values, unless it's i, which is async and causes bugs
                if(key !== 'i' && this.state[key] === value) return
                this.state[key] = value
                // @ts-ignore
                this[key] && this[key](value, time)
            })
    }

    /**
     * Mutate given parameters on currently playing events
     * @param {Dictionary} params - key value pairs of parameters to mutate
     * @param {number} time - time in seconds to schedule the mutation
     * @param {number} lag - time in ms that the mutation will take to complete
     * @returns {void}
     * @hidden
     */ 
    mutate(params: Dictionary = {}, time: number, lag: number = 100): void {
        if(!this.ready) return
        const { nudge } = params
        const ps = Object.entries(params).reduce((obj, [key, value]) => ({ ...obj, [`_${key}`]: value }), {})
        this.setParams(ps, time)
        this.messageDevice('mutate', lag, time + (nudge || 0) / 1000)
    }
}

export default RNBODevice