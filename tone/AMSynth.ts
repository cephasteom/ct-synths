import ToneInstrument from "./ToneInstrument";
import { AMSynth as ToneAMSynth } from "tone";

class AMSynth extends ToneInstrument {
    constructor() {
        super(ToneAMSynth)
        this.defaults = {
            ...this.defaults,
            harm: 5,
            moda: 10, modd: 100, mods: 0.5, modr: 500,
            modosc: 0,
        }
        this.init()
    }

    /** Harmonicity ratio between carrier and modulator.
     * @param value Harmonicity value (ratio between carrier and modulator frequency)
     * @param time Time in seconds to reach the value
     */
    harm(value: number = 1, time: number): void { this.setParam('harmonicity', value, time) }

    /** Mutate the harmonicity of the modulator
     * @param value Harmonicity value (ratio between carrier and modulator frequency)
     * @param time Time in seconds to reach the value
     * @param lag The lag time for the change
     */
    _harm(value: number = 1, time: number, lag: number = 100): void { this.mutateParam('harmonicity', value, time, lag) }

    /** Attack time of the modulation envelope. In milliseconds.
     * @param value Attack time in milliseconds
     */
    // @ts-ignore
    moda(value: number = 1000): void { this.synth._voices.forEach(v => v.modulationEnvelope.attack = value / 1000);}

    /** Decay time of the modulation envelope. In milliseconds.
     * @param value Decay time in milliseconds
     */
    // @ts-ignore
    modd(value: number = 100): void { this.synth._voices.forEach(v => v.modulationEnvelope.decay = value / 1000); }

    /** Release time of the modulation envelope. In milliseconds.
     * @param value Release time in milliseconds
     */
    // @ts-ignore
    modr(value: number = 500): void { this.synth._voices.forEach(v => v.modulationEnvelope.release = value / 1000); }

    /** Sustain level of the modulation envelope. (0 to 1).
     * @param value Sustain level (0 to 1)
     */
    // @ts-ignore
    mods(value: number = 0.5): void { this.synth._voices.forEach(v => v.modulationEnvelope.sustain = value); }

    /** Modulation oscillator type. (0: sine, 1: sawtooth, 2: triangle, 3: square).
     * @param value Index to select oscillator type
     */
    // @ts-ignore
    modosc(value: number = 0): void {
        const types = ['sine', 'sawtooth', 'triangle', 'square'];
        // @ts-ignore
        this.synth._availableVoices.forEach(v => v.modulation.type = types[value % types.length]);
    }
}

export default AMSynth;