import { formatCurve } from "./utils/tone";
import { formatOscType, formatModOscType } from "./utils/oscillators";
import { min } from "./utils/core";
import { FMSynth } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets

class FM extends BaseSynth {    
    constructor(params) {
        super(params)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new FMSynth()
        this.envelope.dispose() // not needed
        this.envelope = this.synth.envelope
        this.synth.connect(this.panner)
    }

    // Envelope params
    set moda(value) { this.synth.modulationEnvelope.attack = value }
    set modd(value) { this.synth.modulationEnvelope.decay = value }
    set mods(value) { this.synth.modulationEnvelope.sustain = value }
    set modr(value) { this.synth.modulationEnvelope.release = value }

    set modacurve(value) { this.synth.modulationEnvelope.attackCurve = formatCurve(value) }
    set moddcurve(value) { this.synth.modulationEnvelope.decayCurve = formatCurve(value) }
    set modrcurve(value) { this.synth.modulationEnvelope.releaseCurve = formatCurve(value) }    
    
    set modcurve(value) { 
        this.modacurve = formatCurve(value)
        this.moddcurve = formatCurve(value)
        this.modrcurve = formatCurve(value)
    }
    // !/ Envelope params

    // oscillator params
    set osc(type) { this.synth.set({ oscillator: { type: formatOscType(type) } }) }
    set oscmodosc(type) { this.synth.set({ oscillator: { modulationType: formatOscType(type) } }) }
    
    set count(value) { this.synth.oscillator._oscillator.count = min(value, 10) }
    set width(value) { this.synth.oscillator._oscillator.width?.setValueAtTime(value, 0) }
    set spread(value) { this.synth.oscillator.set({spread: value})}

    set modosc(type) { this.synth.oscillator._oscillator._modulator?.set({ type: formatModOscType(type) } )}
    // !/ oscillator params

    set harm(value) { this.synth.harmonicity.setValueAtTime(value, this.time || 0) }
    set modi(value) { this.synth.modulationIndex.setValueAtTime(value, this.time || 0) }

    _harm(value, time, lag = 0.1) { this.synth.harmonicity.rampTo(value, lag, time) }
    _harm = this._harm.bind(this)

    _modi(value, time, lag = 0.1) { this.synth.modulationIndex.rampTo(value, lag, time) }
    _modi = this._modi.bind(this)

    _width(value, time, lag=0.1) { this.synth.oscillator._oscillator.width?.rampTo(value, lag, time) }
    _width = this._width.bind(this)

    _moddetune(value, time, lag = 0.1) { 
        this.synth.oscillator._oscillator._modulator?.detune.cancelScheduledValues(time)
        this.synth.oscillator._oscillator._modulator?.detune.rampTo(value, lag, time) 
    }
    _moddetune = this._detune.bind(this)
}


export default FM