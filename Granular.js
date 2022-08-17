import { GrainPlayer, context, Transport } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets
class Granular extends BaseSynth {    
    synth;
    #buffer
    #begin = 0
    
    constructor(buffer) {
        super()
        this.#buffer = buffer
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new GrainPlayer({loop: true, grainSize: 0.1, overlap: 0.05})
        this.synth.buffer.set(this.#buffer)
        this.synth.connect(this.envelope)
        this.envelope.set({attack: 0.01, decay: 0, sustain: 1, release: 0.1})
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        
        const duration = (params.dur || this.dur)
        this.synth.start(this.time, this.#begin, duration)
        this.envelope.triggerAttackRelease(duration + this.envelope.release, this.time, this.amp)
        
        this.disposeTime = time + duration + 0.1
        this.dispose(this.disposeTime)
    }
}

export default Granular