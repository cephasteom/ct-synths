import { mtf, formatOscType } from "./utils/core";
import { formatCurve } from "./utils/tone";
import { FMSynth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets

class Sampler extends BaseSynth {    
    synth;
    
    constructor() {
        super()
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new FMSynth()
        this.envelope.dispose() // not needed
        this.envelope = this.synth.envelope
        this.synth.connect(this.panner)
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        
        this.synth.triggerAttackRelease(mtf(params.n) || 220, this.dur, time, this.amp * 1.25)
        
        this.disposeTime = time + this.dur + this.synth.envelope.release + 0.1
        this.dispose(this.disposeTime)
    }
}

export default Sampler