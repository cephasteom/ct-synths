import { mtf, formatOscType } from "./utils/core";
import { formatCurve, timeToEvent } from "./utils/tone";
import { Oscillator, AmplitudeEnvelope, Multiply, Signal, Add } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: _n()

class FMSynth extends BaseSynth {
    #carrierWaveform
    #modulatorWaveform
    
    constructor(options = {carr: 'sine', mod: 'sine'}) {
        super()

        const { carr, mod } = options
        this.#carrierWaveform = formatOscType(carr)
        this.#modulatorWaveform = formatOscType(mod)

        this.#initGraph()
    }

    #initGraph() {
        // create carrier oscillator
        this.carrier = new Oscillator(220, this.#carrierWaveform).connect(this.envelope).start()
        
        // create modulator oscillator and envelope
        this.modulatorEnvelope = new AmplitudeEnvelope({attack: 0, decay: 0, sustain: 1, release: 1})
        this.modulator = new Oscillator(220, this.#modulatorWaveform).connect(this.modulatorEnvelope).start()
        
        // create signals to handle carr and mod frequencies
        this.carrierFrequency = new Signal(220, 'frequency')
        this.modulationFrequency = new Add().connect(this.carrier.frequency)
        
        // control harmonicity by multiplying the carrier frequency by ratio
        this.harmonicity = new Multiply(1).connect(this.modulator.frequency)
        this.carrierFrequency.connect(this.harmonicity)
        this.harmonicityRatio = new Signal(1.5).connect(this.harmonicity.factor)
        
        // multiply carrier frequency by the modulation envelope
        this.modulation = new Multiply()
        this.modulatorEnvelope.connect(this.modulation)
        this.carrierFrequency.connect(this.modulation.factor)
        
        // control modulation index my multiplying modulation by an index
        this.modulationIndex = new Multiply()
        this.modulation.connect(this.modulationIndex)
        this.modulationGain = new Signal(1).connect(this.modulationIndex.factor)

        // add carrier frequency signal to modulation index to get modulation frequency
        this.carrierFrequency.connect(this.modulationFrequency)
        this.modulationIndex.connect(this.modulationFrequency.addend)
    }

    play(params = {}, time) {
        this.setParams(params)
        this.note = params.n || 220
        
        this.envelope.triggerAttackRelease(this.dur, time, this.amp)
        this.modulatorEnvelope.triggerAttackRelease(this.dur, time, this.amp)
        
        this.disposeTime = time + this.dur + this.envelope.release + 0.1
        this.dispose(this.disposeTime)
    }

    set note(value) { this.carrierFrequency.linearRampTo(mtf(value), 0.01) }

    set moda(value) { this.modulatorEnvelope.attack = value }
    set modd(value) { this.modulatorEnvelope.decay = value }
    set mods(value) { this.modulatorEnvelope.sustain = value }
    set modr(value) { this.modulatorEnvelope.release = value }

    set modacurve(value) { this.modulatorEnvelope.attackCurve = formatCurve(value) }
    set moddcurve(value) { this.modulatorEnvelope.decayCurve = formatCurve(value) }
    set modrcurve(value) { this.modulatorEnvelope.releaseCurve = formatCurve(value) }    
    
    set modcurve(value) { 
        this.modacurve = formatCurve(value)
        this.moddcurve = formatCurve(value)
        this.modrcurve = formatCurve(value)
    }

    set harm(value) { this.harmonicityRatio.linearRampTo(value, 0.01) }
    set modi(value) { this.modulationIndex.linearRampTo(value, 0.01) }

    _harm(value, time, lag = 0.1) { this.harmonicityRatio.rampTo(value, lag, time) }
    _harm = this._harm.bind(this)

    _modi(value, time, lag = 0.1) { this.modulationIndex.rampTo(value, lag, time) }
    _modi = this._modi.bind(this)

}


export default FMSynth