import { AmplitudeEnvelope, Gain, Panner, Distortion, BitCrusher, Filter } from "tone";
import { getDisposable, getClassSetters, getClassMethods, isMutableKey, getSchedulable } from './utils/core'
import { doAtTime, formatCurve } from "./utils/tone";
class BaseSynth {
    time = null;
    duration = 1;
    amplitude = 1;
    envelope;
    self = this.constructor
    #disposed = false
    endTime;
    onDisposeAction;
    disposeID = null;
    fx = []
    
    constructor(fxParams) {
        this.gain = new Gain(1)
        this.panner = new Panner(0).connect(this.gain)
        this.envelope = new AmplitudeEnvelope({attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8}).disconnect()
        this.envelope.connect(this.panner)
        fxParams && this.#initFX(fxParams)
    }
    
    #initFX(fxParams) {
        this.fx = Object.entries(fxParams).map(([key, value]) => {
            switch (key) {
                case 'dist':
                    return new Distortion({distortion: value})
                case 'crush':
                    return new BitCrusher({crush: value})
                case 'hicut':
                    return new Filter({frequency: value, type: "lowpass"})
                case 'locut':
                    return new Filter({frequency: value, type: "highpass"})
                default:
                    return false
            }
        }).filter(effect => effect)
    }

    #settable() {
        return [
            ...getClassSetters(BaseSynth), 
            ...getClassSetters(this.self)
        ].reduce((obj, key) => ({
            ...obj,
            [key]: (value) => this[key] = value
        }), {})
    }

    #mutable() {
        return [
            ...getClassMethods(BaseSynth), 
            ...getClassMethods(this.self)
        ]
            .filter(isMutableKey)
            .reduce((obj, key) => ({
                ...obj,
                [key]: this[key]
            }), {})
    }

    setParams(params) {
        const settable = this.#settable()
        Object.entries(params).forEach(([key, value]) => {
            settable[key] && (settable[key](value))
        });
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(params)
        this.envelope.triggerAttackRelease(this.duration, time, this.amplitude)
        
        this.endTime = time + this.duration + this.envelope.release + 0.5
        this.dispose(this.endTime)
    }

    mutate(params = {}, time, lag) {
        const props = this.mutable
        Object.entries(params).forEach(([key, value]) => {
            props[key] && props[key](value, time, lag)
        })
    }
    
    cut(time) {
        this.gain.gain.rampTo(0, 0.1, time)
        this.endTime = time + 0.2
        this.dispose(this.endTime)
    }

    connect(node) {
        this.gain.disconnect()
        this.gain.chain(...this.fx, node)
    }

    chain(...nodes) {
        this.gain.disconnect()
        this.gain.chain(...this.fx, ...nodes)
    }

    dispose(time) {
        this.disposeID = doAtTime(() => {
            if(this.#disposed) return
            
            [...getDisposable(this), ...this.fx].forEach(prop => prop.dispose())
            this.onDisposeAction && this.onDisposeAction()
            this.#disposed = true
            console.log('disposed!')
        }, time)
    } 

    set dur(value) { this.duration = value }
    set amp(value) { this.amplitude = value }
    set vol(value) { this.amplitude = value }

    set a(value) { this.envelope && (this.envelope.attack = value) }
    set d(value) { this.envelope && (this.envelope.decay = value) }
    set s(value) { this.envelope && (this.envelope.sustain = value) }
    set r(value) { this.envelope && (this.envelope.release = value) }
    
    set acurve(value) { this.envelope && (this.envelope.attackCurve = formatCurve(value)) }
    set dcurve(value) { this.envelope && (this.envelope.decayCurve = formatCurve(value)) }
    set rcurve(value) { this.envelope && (this.envelope.releaseCurve = formatCurve(value)) }    

    set curve(value) { 
        this.acurve = formatCurve(value)
        this.dcurve = formatCurve(value)
        this.rcurve = formatCurve(value)
    }

    set pan(value) { this.panner.pan.setValueAtTime(value, 0) }
    
    _pan(value, time, lag = 0.1) { this.panner.pan.rampTo(value, lag, time) }
    _pan = this._pan.bind(this)

    _amp(value, time, lag = 0.1) { this.gain.gain.rampTo(value, lag, time) }
    _amp = this._amp.bind(this)
    
    _vol(value, time, lag = 0.1) { this.gain.gain.rampTo(value, lag, time) }
    _vol = this._vol.bind(this)


    get settable() { return this.#settable() }
    get mutable() { return this.#mutable() }
    get automated() { return getSchedulable(this)}
    get disposeTime() { return this.endTime }
}

export default BaseSynth