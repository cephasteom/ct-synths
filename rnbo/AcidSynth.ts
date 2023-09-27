import BaseSynth from "./BaseSynth";

const patcher = fetch(new URL('./json/acid.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())
/**
 * A monophonic, acid bass synth.
 * @example
 * s0.p.set({inst: 'acid'})
 */ 
class AcidSynth extends BaseSynth {
    /** @hidden */
    constructor() {
        super()
        this.defaults = {
            ...this.defaults, 
            slide: 10, fil: 0.5, osc: 0.6, sub: 0.5,
            dur: 100, a: 10, d: 100, s: 0.5, r: 50, fila: 10, fild: 100, fils: 0.1, filr: 100, res: 0.8, cutoff: 7500,
        }
        this.patcher = patcher
        this.initDevice()

        this.slide = this.slide.bind(this)
        this.fil = this.fil.bind(this)
        this._fil = this._fil.bind(this)
        this.osc = this.osc.bind(this)
        this._osc = this._osc.bind(this)
        this.sub = this.sub.bind(this)
        this._sub = this._sub.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /**
     * The oscillator type
     * @param value - Sine wave is 0, sawtooth is 1
     */ 
    osc(value: number = 0.6, time: number): void { this.messageDevice('osc', value, time) }

    /**
     * Mutate the oscillator type
     * @param value - Sine wave is 0, sawtooth is 1
     */ 
    _osc(value: number = 0.6, time: number): void { this.messageDevice('_osc', value, time) }

    /**
     * Portamento time
     * @param value - portamento time in ms
     */
    slide(value: number = 10, time: number): void { this.messageDevice('slide', value, time) } 

    /**
     * Filter gain amount
     * @param value - 0 is no filter, 1 is max filter
     */
    fil(value: number = 0.5, time: number): void { this.messageDevice('fil', value, time) }
    
    /**
     * Mutate filter gain amount
     * @param value - 0 is no filter, 1 is max filter
     */
    _fil(value: number = 0.5, time: number): void { this.messageDevice('_fil', value, time) }
    
    /**
     * Sub oscillator gain amount
     * @param value - 0 is no sub, 1 is max sub
     */
    sub(value: number = 0.5, time: number): void { this.messageDevice('sub', value, time) }

    /**
     * Mutate sub oscillator gain amount
     * @param value - 0 is no sub, 1 is max sub
     */
    _sub(value: number = 0.5, time: number): void { this.messageDevice('_sub', value, time) } 
}

export default AcidSynth