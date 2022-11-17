import { mtf, min } from "../utils/core";
import { formatCurve } from "../utils/tone";
import { DuoSynth } from "tone";
import { formatOscType, formatModOscType } from "../utils/oscillators";
import BaseSynth from "./BaseSynth";

// TODO: presets
class DualSynth extends BaseSynth {    
    constructor(fxParams) {
        super(fxParams)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new DuoSynth({volume: -12, harmonicity: 1.01}) // two voices are too loud
        this.envelope.dispose() // not needed
        this.envelopes = [this.synth.voice0.envelope, this.synth.voice1.envelope]
        this.synths = [this.synth.voice0, this.synth.voice1]
        this.filterEnvelopes = [this.synth.voice0.filterEnvelope, this.synth.voice1.filterEnvelope]
        this.synth.connect(this.panner)
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        
        this.synth.triggerAttackRelease(mtf(params.n + (this.octave * 12)) || 220, this.duration, time, this.amplitude)
        
        this.endTime = time + this.duration + this.synth.voice0.envelope.release + 0.05
        this.dispose(this.endTime)
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

    set moda(value) { this.filterEnvelopes.forEach(env => env.attack = value) }
    set modd(value) { this.filterEnvelopes.forEach(env => env.decay = value) }
    set mods(value) { this.filterEnvelopes.forEach(env => env.sustain = value) }
    set modr(value) { this.filterEnvelopes.forEach(env => env.release = value) }

    set modacurve(value) { this.filterEnvelopes.forEach(env => env.attackCurve = formatCurve(value)) }
    set moddcurve(value) { this.filterEnvelopes.forEach(env => env.decayCurve = formatCurve(value)) }
    set modrcurve(value) { this.filterEnvelopes.forEach(env => env.releaseCurve = formatCurve(value)) }

    set modcurve(value) {
        this.modacurve = formatCurve(value)
        this.moddcurve = formatCurve(value)
        this.modrcurve = formatCurve(value)
    }

    set harm(value) { this.synth.harmonicity.setValueAtTime(value, this.time || 0) }

    _harm(value, time, lag = 0.1) { this.synth.harmonicity.rampTo(value, lag, time) }
    _harm = this._harm.bind(this)

    // LFOs
    set depth(value) { this.synth.vibratoAmount.setValueAtTime(value > 1 ? 1 : value, this.time) }
    set rate(value) { this.synth.vibratoRate.setValueAtTime(value, this.time || 0) }

    _depth(value, time, lag = 0.1) { this.synth.vibratoAmount.rampTo(value, lag, time) }
    _depth = this._depth.bind(this)

    _rate(value, time, lag = 0.1) { this.synth.vibratoRate.rampTo(value, lag, time) }
    _rate = this._rate.bind(this)

    _width(value, time, lag=0.1) { this.synths.forEach(s => s.oscillator._oscillator.width?.rampTo(value, lag, time)) }
    _width = this._width.bind(this)

    _moddetune(value, time, lag = 0.1) { 
        this.synths.forEach(s => s.oscillator._oscillator._modulator?.detune.cancelScheduledValues(time))
        this.synths.forEach(s => s.oscillator._oscillator._modulator?.detune.rampTo(value, lag, time))
    }
    _moddetune = this._detune.bind(this)

    // oscillator params
    set osc(type) { this.synths.forEach(s => s.set({ oscillator: { type: formatOscType(type) } })) }
    set oscmodosc(type) { this.synths.forEach(s => s.set({ oscillator: { modulationType: formatOscType(type) } })) }
    
    set count(value) { this.synths.forEach(s => s.oscillator._oscillator.count = min(value, 10)) }
    set width(value) { this.synths.forEach(s => s.oscillator._oscillator.width?.setValueAtTime(value, 0) )}
    set spread(value) { this.synths.forEach(s => s.oscillator.set({spread: value}))}

    set modosc(type) { this.synths.forEach(s => s.oscillator._oscillator._modulator?.set({ type: formatModOscType(type) } ))}
    set moddetune(value) { this.synths.forEach(s => s.oscillator._oscillator._modulator?.detune.setValueAtTime(value, 0) )}
    // !/ oscillator params
}


export default DualSynth