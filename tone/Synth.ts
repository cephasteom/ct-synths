import ToneInstrument from "./ToneInstrument";
import { Synth as ToneSynth } from "tone";

class Synth extends ToneInstrument {
    constructor() {
        super(ToneSynth)
    }
}

export default Synth;