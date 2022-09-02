import { mtf } from "./utils/core";
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
        
        this.synth.triggerAttackRelease(mtf(params.n + (this.octave * 12)) || 220, this.duration, time, this.amplitude)
        
        this.endTime = time + this.duration + this.synth.envelope.release + 0.1
        this.dispose(this.endTime)
    }

    set octs(value) { this.synth.octaves = value }
}


export default DrumSynth