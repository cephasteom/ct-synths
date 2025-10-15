import { mod } from "mathjs";
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

    harm(value: number = 1, time: number): void { this.setParam('harmonicity', value, time) }
    _harm(value: number = 1, time: number, lag: number = 100): void { this.mutateParam('harmonicity', value, time, lag) }

    // @ts-ignore
    moda(value: number = 1000): void { this.synth._voices.forEach(v => v.modulationEnvelope.attack = value / 1000);}

    // @ts-ignore
    modd(value: number = 100): void { this.synth._voices.forEach(v => v.modulationEnvelope.decay = value / 1000); }

    // @ts-ignore
    modr(value: number = 500): void { this.synth._voices.forEach(v => v.modulationEnvelope.release = value / 1000); }

    // @ts-ignore
    mods(value: number = 0.5): void { this.synth._voices.forEach(v => v.modulationEnvelope.sustain = value); }

    modosc(value: number = 0): void {
        const types = ['sine', 'sawtooth', 'triangle', 'square'];
        // @ts-ignore
        this.synth._availableVoices.forEach(v => v.modulation.type = types[value % types.length]);
    }
}

export default AMSynth;