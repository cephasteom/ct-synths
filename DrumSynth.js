import { mtf } from "./utils/core";
import { formatCurve } from "./utils/tone";
import { MembraneSynth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets

class DrumSynth extends BaseSynth {    
    synth;
    
    constructor(fxParams) {
        super(fxParams)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new MembraneSynth()
        this.envelope.dispose() // not needed
        this.envelope = this.synth.envelope
        this.synth.connect(this.panner)
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        
        this.synth.triggerAttackRelease(mtf(params.n) || 220, this.dur, time, this.amp)
        
        this.disposeTime = time + this.dur + this.synth.envelope.release + 0.1
        this.dispose(this.disposeTime)
    }

    set octs(value) { this.synth.octaves = value }
}


export default DrumSynth