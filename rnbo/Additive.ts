import BaseSynth from "./BaseSynth";

const patcher = fetch(new URL('./json/additive.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())

/**
 * Additive Synth
 * @example s0.set({inst: 'additive'})
 */
class Synth extends BaseSynth {
    /** @hidden */
    constructor() {
        super()
        this.defaults = {
            ...this.defaults,
            osc: 0, 
            drift: 1, 
            pmuln: 0, // nth partial to multiply
            pmul: 0, // partial multiplier
            pdisp: 0, // partial dispersion (multiplies each partial by a small amount)
            pexp: 0.1 // amplitude rolloff exponent - 1 is linear, 0 is steep, 8 is gentle
        }
        this.patcher = patcher
        this.initDevice()
        
        this.osc = this.osc.bind(this)
        this._osc = this._osc.bind(this)
        this.drift = this.drift.bind(this)
        this._drift = this._drift.bind(this)
        this.pmuln = this.pmuln.bind(this)
        this._pmuln = this._pmuln.bind(this)
        this.pmul = this.pmul.bind(this)
        this._pmul = this._pmul.bind(this)
        this.pdisp = this.pdisp.bind(this)
        this._pdisp = this._pdisp.bind(this)
        this.pexp = this.pexp.bind(this)
        this._pexp = this._pexp.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /**
     * The oscillator type
     * Be careful when using FM with tri or square waves - RNBO bug
     * @param value - Sine wave is 0, sawtooth is 1, triangle is 2, square is 3
     * 
     */
    osc(value: number = 0, time: number): void { this.messageDevice('osc', value, time) }

    /**
     * Mutate the oscillator type
     * Be careful when using FM with tri or square waves - RNBO bug
     * @param value - Sine wave is 0, sawtooth is 1, triangle is 2, square is 3
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
     * The partial to multiply
     * @param value - 0+
     */
    pmuln(value: number = 0, time: number): void { this.messageDevice('pmuln', value, time) }

    /**
     * Mutate the partial to multiply
     * @param value - 0+
     */
    _pmuln(value: number = 0, time: number): void { this.messageDevice('_pmuln', value, time) }

    /**
     * The partial multiplier
     * @param value - 0+
     */
    pmul(value: number = 0, time: number): void { this.messageDevice('pmul', value, time) }

    /**
     * Mutate the partial multiplier
     * @param value - 0+
     */
    _pmul(value: number = 0, time: number): void { this.messageDevice('_pmul', value, time) }

    /**
     * The partial dispersion
     * @param value - 0+
     */
    pdisp(value: number = 0, time: number): void { this.messageDevice('pdisp', value, time) }

    /**
     * Mutate the partial dispersion
     * @param value - 0+
     */
    _pdisp(value: number = 0, time: number): void { this.messageDevice('_pdisp', value, time) }

    /**
     * The partial amplitude rolloff exponent
     * @param value - 0+
     */
    pexp(value: number = 0, time: number): void { this.messageDevice('pexp', value, time) }

    /**
     * Mutate the partial amplitude rolloff exponent
     * @param value - 0+
     */
    _pexp(value: number = 0, time: number): void { this.messageDevice('_pexp', value, time) }
}

export default Synth