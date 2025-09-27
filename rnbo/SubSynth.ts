import pkg from '@rnbo/js';
const { MIDIEvent } = pkg;
import BaseSynth from "./BaseSynth";
import type { Dictionary } from "../types";

const patcher = fetch(new URL('./json/sub.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())
/**
 * A simple synth for creating sine wave sub bass sounds, with some FM modulation.
 * @example
 * s0.set({inst: 'sub'})
 */
class SubSynth extends BaseSynth {
    /** @hidden */
    constructor() {
        super()
        this.defaults = { 
            ...this.defaults,  
            dur: 1000, a: 100, d: 100, s: 0.75, r: 1000, fila: 0, fild: 100, fils: 1, filr: 100, res: 0,
            moda: 10, modd: 0,
            lfodepth: 0, lforate: 1,
        }
        this.patcher = patcher
        this.initDevice()
        
        this.fat = this.fat.bind(this)
        this._fat = this._fat.bind(this)
        this.slide = this.slide.bind(this)
        this.lforate = this.lforate.bind(this)
        this._lforate = this._lforate.bind(this)
        this.lfodepth = this.lfodepth.bind(this)
        this._lfodepth = this._lfodepth.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /** @hidden */
    play(params: Dictionary = {}, time: number = 0) {
        
        if(!this.ready) return

        const ps = {...this.defaults, ...params }
        const { n, amp } = ps

        this.setParams(ps, time)
        
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, (n || 60), amp * 127]);
        this.device.scheduleEvent(noteOnEvent);
    }

    /**
     * Synth fatness - amount of FM applied
     * @param value - 0 is not fat, 1 is max fat
     */
    fat(value: number = 0, time: number): void { this.messageDevice('fat', value, time) }
    
    /**
     * Mutate the synth fatness
     * @param value - 0 is not fat, 1 is max fat
     */
    _fat(value: number = 0, time: number): void { this.messageDevice('_fat', value, time) }
    
    /**
     * Portamento time
     * @param value - portamento time in ms
     */
    slide(value: number = 10, time: number): void { this.messageDevice('slide', value, time) } 

    /**
     * LFO rate
     * @param value - LFO rate in Hz
     */
    lforate(value: number = 1, time: number): void { this.messageDevice('lforate', value, time) }

    /**
     * Mutate the LFO rate
     * @param value - LFO rate in Hz
     */
    _lforate(value: number = 1, time: number): void { this.messageDevice('_lforate', value, time) }
    
    /**
     * LFO depth
     * @param value - LFO depth, 0 to 1
     */
    lfodepth(value: number = 0, time: number): void { this.messageDevice('lfodepth', value, time) }
    
    /**
     * Mutate the LFO depth
     * @param value - LFO depth, 0 to 1
     */
    _lfodepth(value: number = 0, time: number): void { this.messageDevice('_lfodepth', value, time) }
}

export default SubSynth