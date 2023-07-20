import BaseSynth from "./BaseSynth";
import type { Dictionary } from "../types";

/**
 * An all purpose synth with filters and FM
 * @example
 * s0.p.set({inst: 'synth'})
 */ 
class Synth extends BaseSynth {

    /** @hidden */
    defaults: Dictionary = { ...this.defaults, osc: 0, drift: 0, modi: 0, harm: 1 }

    /** @hidden */
    constructor(args: any = {}) {
        super()
        this.json = args.lite 
            ? new URL('./json/synth-lite.export.json', import.meta.url)
            : new URL('./json/synth.export.json', import.meta.url)

        this.initDevice()
        
        this.osc = this.osc.bind(this)
        this._osc = this._osc.bind(this)
        this.drift = this.drift.bind(this)
        this._drift = this._drift.bind(this)
        this.modi = this.modi.bind(this)
        this._modi = this._modi.bind(this)
        this.harm = this.harm.bind(this)
        this._harm = this._harm.bind(this)
            
        this.params = Object.getOwnPropertyNames(this)
    }

    /**
     * The oscillator type
     * @param value - Sine wave is 0, sawtooth is 1
     */ 
    osc(value: number = 0, time: number): void { this.messageDevice('osc', value, time) }

    /**
     * Mutate the oscillator type
     * @param value - Sine wave is 0, sawtooth is 1
     */ 
    _osc(value: number = 0, time: number): void { this.messageDevice('_osc', value, time) }

    /**
     * The oscillator drift
     * @param value - 0 is no drift, 1 is max drift
     */
    drift(value: number = 0, time: number): void { this.messageDevice('drift', value, time) } 

    /**
     * Mutate the oscillator drift
     * @param value - 0 is no drift, 1 is max drift
     */ 
    _drift(value: number = 0, time: number): void { this.messageDevice('_drift', value, time) }

    /**
     * The modulation index
     * @param value - 0+
     */
    modi(value: number = 0, time: number): void { this.messageDevice('modi', value, time) } 

    /**
     * Mutate the modulation index
     * @param value - 0+
     */ 
    _modi(value: number = 0, time: number): void { this.messageDevice('_modi', value, time) }

    /**
     * The harmonicity ratio
     * @param value - number > 0
     */
    harm(value: number = 1, time: number): void { this.messageDevice('harm', value, time) } 

    /**
     * Mutate the harmonicity ratio
     * @param value - number > 0
     */
    _harm(value: number = 1, time: number): void { this.messageDevice('_harm', value, time) }
}

export default Synth