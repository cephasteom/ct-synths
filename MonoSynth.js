import { mtf } from "./utils/core";
import { formatCurve } from "./utils/tone";
import { MonoSynth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets
class MnSynth extends BaseSynth {    
    constructor(fxParams) {
        super(fxParams)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new MonoSynth()
        this.envelope.dispose() // not needed
        this.envelopes = this.synth.envelope
        this.filterEnvelope = this.synth.filterEnvelope
        this.synth.connect(this.panner)
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        
        this.synth.triggerAttackRelease(mtf(params.n + (this.octave * 12)) || 220, this.duration, time, this.amplitude * 0.5)
        
        this.endTime = time + this.duration + this.synth.voice0.envelope.release + 0.1
        this.dispose(this.endTime)
    }  

    set moda(value) { this.filterEnvelope.attack = value }
    set modd(value) { this.filterEnvelope.decay = value }
    set mods(value) { this.filterEnvelope.sustain = value }
    set modr(value) { this.filterEnvelope.release = value }

    set modacurve(value) { this.filterEnvelope.attackCurve = formatCurve(value) }
    set moddcurve(value) { this.filterEnvelope.decayCurve = formatCurve(value) }
    set modrcurve(value) { this.filterEnvelope.releaseCurve = formatCurve(value) }

    // LFOs
    set depth(value) { this.synth.vibratoAmount.setValueAtTime(value > 1 ? 1 : value, this.time) }
    set rate(value) { this.synth.vibratoRate.setValueAtTime(value, this.time) }

    _depth(value, time, lag = 0.1) { this.synth.vibratoAmount.rampTo(value, lag, time) }
    _depth = this._depth.bind(this)

    _rate(value, time, lag = 0.1) { this.synth.vibratoRate.rampTo(value, lag, time) }
    _rate = this._rate.bind(this)
}


export default MnSynth