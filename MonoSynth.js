import { formatCurve } from "./utils/tone";
import { min } from "./utils/core";
import { MonoSynth } from "tone";
import { formatOscType, formatModOscType } from "./utils/oscillators";
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
        this.envelope = this.synth.envelope
        this.filterEnvelope = this.synth.filterEnvelope
        this.synth.connect(this.panner)
    }

    set moda(value) { this.filterEnvelope.attack = value }
    set modd(value) { this.filterEnvelope.decay = value }
    set mods(value) { this.filterEnvelope.sustain = value }
    set modr(value) { this.filterEnvelope.release = value }

    set modacurve(value) { this.filterEnvelope.attackCurve = formatCurve(value) }
    set moddcurve(value) { this.filterEnvelope.decayCurve = formatCurve(value) }
    set modrcurve(value) { this.filterEnvelope.releaseCurve = formatCurve(value) }

    // oscillator params
    set osc(type) { this.synth.set({ oscillator: { type: formatOscType(type) } }) }
    set oscmodosc(type) { this.synth.set({ oscillator: { modulationType: formatOscType(type) } }) }
    
    set count(value) { this.synth.oscillator._oscillator.count = min(value, 10) }
    set width(value) { this.synth.oscillator._oscillator.width?.setValueAtTime(value, 0) }
    set spread(value) { this.synth.oscillator.set({spread: value})}

    set modosc(type) { this.synth.oscillator._oscillator._modulator?.set({ type: formatModOscType(type) } )}
    set moddetune(value) { this.synth.oscillator._oscillator._modulator?.detune.setValueAtTime(value, 0) }
    // !/ oscillator params

    _width(value, time, lag=0.1) { this.synth.oscillator._oscillator.width?.rampTo(value, lag, time) }
    _width = this._width.bind(this)

    _moddetune(value, time, lag = 0.1) { 
        this.synth.oscillator._oscillator._modulator?.detune.cancelScheduledValues(time)
        this.synth.oscillator._oscillator._modulator?.detune.rampTo(value, lag, time) 
    }
    _moddetune = this._detune.bind(this)
}


export default MnSynth