import { formatCurve } from "./utils/tone";
import { wrap } from "./utils/core";
import { MetalSynth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets
class MtSynth extends BaseSynth {    
    constructor(fxParams) {
        super(fxParams)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new MetalSynth()
        this.envelope.dispose() // not needed
        this.envelopes = this.synth.envelope
        this.synth.connect(this.panner)
        console.log(this.synth._oscillators)
    }

    set harm(value) { this.synth.harmonicity = value }
    set modi(value) { this.synth.modulationIndex = value }
    set octs(value) { this.synth.octaves = value }
    set resonance(value) { this.synth.resonance = wrap(value, 0, 7000) }
    set res(value) { this.synth.resonance = wrap(value, 0, 7000) }

    _harm(value, time, lag = 0.1) { this.synth._oscillators.forEach(osc => osc.harmonicity.rampTo(value, lag, time)) }
    _harm = this._harm.bind(this)

    _modi(value, time, lag = 0.1) { this.synth._oscillators.forEach(osc => osc.modulationIndex.rampTo(value, lag, time)) }
    _modi = this._modi.bind(this)
}


export default MtSynth