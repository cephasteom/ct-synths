import ToneInstrument from "./ToneInstrument";
import { PluckSynth as TonePluckSynth } from "tone";

class PluckSynth extends ToneInstrument {
    constructor() {
        super(TonePluckSynth)
        this.defaults = {
            ...this.defaults,
        }
        this.init()
    }
}

export default PluckSynth;