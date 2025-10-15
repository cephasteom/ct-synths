import ToneInstrument from "./ToneInstrument";
import { MonoSynth as ToneMonoSynth } from "tone";

class MonoSynth extends ToneInstrument {
    constructor() {
        super(ToneMonoSynth)
        this.defaults = {
            ...this.defaults,
        }
        this.init()
    }

    // @ts-ignore
    fila(value: number = 1000): void { this.synth._voices.forEach(v => v.filterEnvelope.attack = value / 1000);}

    // @ts-ignore
    fild(value: number = 100): void { this.synth._voices.forEach(v => v.filterEnvelope.decay = value / 1000); }

    // @ts-ignore
    filr(value: number = 500): void { this.synth._voices.forEach(v => v.filterEnvelope.release = value / 1000); }

    // @ts-ignore
    fils(value: number = 0.5): void { this.synth._voices.forEach(v => v.filterEnvelope.sustain = value); }
}

export default MonoSynth;