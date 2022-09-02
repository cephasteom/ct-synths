import { mtf } from "./utils/core";
import { PluckSynth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets

class Karplus extends BaseSynth {   
    constructor(fxParams) {
        super(fxParams)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new PluckSynth()
        this.synth.connect(this.panner)
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        
        this.synth.triggerAttackRelease(mtf(params.n + (this.octave * 12)) || 220, this.duration, time, this.amplitude)
        
        this.endTime = time + this.duration + this.envelope.release + 0.1
        this.dispose(this.endTime)
    }

    set resonance(value) { this.synth.resonance = value }
    set res(value) { this.synth.resonance = value }
    set dampening(value) { this.synth.dampening = value }
    set damp(value) { this.synth.dampening = value }

}


export default Karplus