import { mtf } from "./utils/core";
import { formatCurve } from "./utils/tone";
import { DuoSynth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets

class DualSynth extends BaseSynth {    
    synth;
    
    constructor(fxParams) {
        super(fxParams)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new DuoSynth()
        this.envelope.dispose() // not needed
        this.envelopes = [this.synth.voice0.envelope, this.synth.voice1.envelope]
        this.synth.connect(this.panner)
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        
        this.synth.triggerAttackRelease(mtf(params.n) || 220, this.dur, time, this.amp)
        
        this.disposeTime = time + this.dur + this.synth.voice0.envelope.release + 0.1
        this.dispose(this.disposeTime)
    }

    set a(value) { this.envelopes.forEach(env => env.attack = value) }
    set d(value) { this.envelopes.forEach(env => env.decay = value) }
    set s(value) { this.envelopes.forEach(env => env.sustain = value) }
    set r(value) { this.envelopes.forEach(env => env.release = value) }
    
    set acurve(value) { this.envelopes.forEach(env => env.attackCurve = formatCurve(value)) }
    set dcurve(value) { this.envelopes.forEach(env => env.decayCurve = formatCurve(value)) }
    set rcurve(value) { this.envelopes.forEach(env => env.releaseCurve = formatCurve(value)) }    

    set curve(value) { 
        this.acurve = formatCurve(value)
        this.dcurve = formatCurve(value)
        this.rcurve = formatCurve(value)
    }

    set harm(value) { this.synth.harmonicity.setValueAtTime(value, this.time) }

    _harm(value, time, lag = 0.1) { this.synth.harmonicity.rampTo(value, lag, time) }
    _harm = this._harm.bind(this)

    // LFOs
    set depth(value) { this.synth.vibratoAmount.setValueAtTime(value > 1 ? 1 : value, this.time) }
    set rate(value) { this.synth.vibratoRate.setValueAtTime(value, this.time) }

    _depth(value, time, lag = 0.1) { this.synth.vibratoAmount.rampTo(value, lag, time) }
    _depth = this._depth.bind(this)

    _rate(value, time, lag = 0.1) { this.synth.vibratoRate.rampTo(value, lag, time) }
    _rate = this._rate.bind(this)
}


export default DualSynth