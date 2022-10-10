import { Synth } from "tone";
import { min } from "./utils/core";
import BaseSynth from "./BaseSynth";
import { formatOscType, formatModOscType } from "./utils/oscillators";

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

    // oscillator params
    set osc(type) { this.synth.set({ oscillator: { type: formatOscType(type) } }) }
    set oscmodosc(type) { this.synth.set({ oscillator: { modulationType: formatOscType(type) } }) }
    
    set count(value) { this.synth.oscillator._oscillator.count = min(value, 10) }
    set width(value) { this.synth.oscillator._oscillator.width?.setValueAtTime(value, 0) }
    set spread(value) { this.synth.oscillator.set({spread: value})}

    set modosc(type) { this.synth.oscillator._oscillator._modulator?.set({ type: formatModOscType(type) } )}
    set moddetune(value) { this.synth.oscillator._oscillator._modulator?.detune.setValueAtTime(value, 0) }
    // !/ oscillator params
    
    set harm(value) { this.synth.oscillator._oscillator.harmonicity?.setValueAtTime(value, this.time || 0) }
    set modi(value) { this.synth.oscillator._oscillator.modulationIndex?.setValueAtTime(value, this.time || 0) }

    _harm(value, time, lag = 0.1) { this.synth.oscillator._oscillator.harmonicity?.rampTo(value, lag, time) }
    _harm = this._harm.bind(this)

    _modi(value, time, lag = 0.1) { this.synth.oscillator._oscillator.modulationIndex?.rampTo(value, lag, time) }
    _modi = this._modi.bind(this)

    _width(value, time, lag=0.1) { this.synth.oscillator._oscillator.width?.rampTo(value, lag, time) }
    _width = this._width.bind(this)

    _moddetune(value, time, lag = 0.1) { 
        this.synth.oscillator._oscillator._modulator?.detune.cancelScheduledValues(time)
        this.synth.oscillator._oscillator._modulator?.detune.rampTo(value, lag, time) 
    }
    _moddetune = this._detune.bind(this)
}


export default Flex