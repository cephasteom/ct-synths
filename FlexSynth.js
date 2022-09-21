import { formatCurve } from "./utils/tone";
import { formatModOscType } from "./utils/oscillators";
import { Synth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets

class Flex extends BaseSynth {    
    constructor(params) {
        super(params)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new Synth()
        this.envelope.dispose() // not needed
        this.envelope = this.synth.envelope
        this.synth.connect(this.panner)
    }

    set spread(value) { this.synth.oscillator.set({spread: value})}

    set harm(value) { this.synth.oscillator._oscillator.harmonicity?.setValueAtTime(value, this.time || 0) }
    set modi(value) { this.synth.oscillator._oscillator.modulationIndex?.setValueAtTime(value, this.time || 0) }

    _harm(value, time, lag = 0.1) { this.synth.oscillator._oscillator.harmonicity?.rampTo(value, lag, time) }
    _harm = this._harm.bind(this)

    _modi(value, time, lag = 0.1) { this.synth.oscillator._oscillator.modulationIndex?.rampTo(value, lag, time) }
    _modi = this._modi.bind(this)
}


export default Flex