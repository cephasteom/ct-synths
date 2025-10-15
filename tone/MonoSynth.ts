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
}

export default MonoSynth;