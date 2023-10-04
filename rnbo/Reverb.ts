import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'
import type { Dictionary } from '../types'

const patcher = fetch(new URL('./json/fx-reverb.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())

/**
 * The Reverb chained to the end of each stream. Is initialised only when reverb parameter is greater than 0.
 * @example
 * s0.p.reverb.set(0.5)
 */ 
class FXReverb extends RNBODevice {
    /** @hidden */
    constructor() {
        super()
        this.defaults = { reverb: 0, rsize: 0.5, rdamp: 0.25, rdiff: 0.25, rjitter: 0, rdecay: 0.25 }
        this.patcher = patcher
        this.initDevice()

        this.reverb = this.reverb.bind(this)
        this._reverb = this._reverb.bind(this)
        this.rsize = this.rsize.bind(this)
        this._rsize = this._rsize.bind(this)
        this.rdamp = this.rdamp.bind(this)
        this._rdamp = this._rdamp.bind(this)
        this.rdiff = this.rdiff.bind(this)
        this._rdiff = this._rdiff.bind(this)
        this.rjitter = this.rjitter.bind(this)
        this._rjitter = this._rjitter.bind(this)
        this.rdecay = this.rdecay.bind(this)
        this._rdecay = this._rdecay.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /** @hidden */
    set(params: Dictionary = {}, time: number) {
        if(!this.ready) return
        const ps = {...this.defaults, ...params }
        this.setParams(ps, time)

        const triggerEvent = new MIDIEvent(time * 1000, 0, [144, 60, 127]);
        this.device.scheduleEvent(triggerEvent);
    }

    /**
     * Reverb amount
     * @param value - 0 to 1
     */
    reverb(value: number = 0, time: number): void { this.messageDevice('reverb', value, time) }

    /**
     * Mutate the reverb amount
     * @param value - 0 to 1
     */
    _reverb(value: number = 0, time: number): void { this.messageDevice('_reverb', value, time) }

    /**
     * Reverb size
     * @param value - 0 to 1
     */ 
    rsize(value: number = 0.25, time: number): void { 
        this.messageDevice('rsize', value, time) 
    }

    /**
     * Mutate the reverb size
     * @param value - 0 to 1
     */ 
    _rsize(value: number = 0.25, time: number): void { this.messageDevice('_rsize', value, time) }

    /**
     * Reverb dampening
     * @param value - 0 to 1
     */ 
    rdamp(value: number = 0.25, time: number): void { this.messageDevice('rdamp', value, time) }

    /**
     * Mutate the reverb dampening
     * @param value - 0 to 1
     */ 
    _rdamp(value: number = 0.25, time: number): void { this.messageDevice('_rdamp', value, time) }

    /**
     * Reverb diffusion
     * @param value - 0 to 1
     */ 
    rdiff(value: number = 0.25, time: number): void { this.messageDevice('rdiff', value, time) }

    /**
     * Mutate the reverb diffusion
     * @param value - 0 to 1
     */ 
    _rdiff(value: number = 0.25, time: number): void { this.messageDevice('_rdiff', value, time) }

    /**
     * Reverb jitter
     * @param value - 0 to 1
     */ 
    rjitter(value: number = 0, time: number): void { this.messageDevice('rjitter', value, time) }

    /**
     * Mutate the reverb jitter
     * @param value - 0 to 1
     */
    _rjitter(value: number = 0, time: number): void { this.messageDevice('_rjitter', value, time) }

    /**
     * Reverb decay
     * @param value - 0 to 1
     */ 
    rdecay(value: number = 0.25, time: number): void { this.messageDevice('rdecay', value, time) }

    /**
     * Mutate the reverb decay
     * @param value - 0 to 1
     */ 
    _rdecay(value: number = 0.25, time: number): void { this.messageDevice('_rdecay', value, time) }
}

export default FXReverb