import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'
import { baseSynthParams } from './data'
import type { Dictionary } from '../types'

/**
 * The BaseSynth class contains methods shared by all instruments in the CT-Synths library. 
 * It should not be instantiated directly.
 * @class
 * @extends RNBODevice
 */ 
class BaseSynth extends RNBODevice {
    self = this.constructor

    static get baseKeys() {
        return baseSynthParams
    }

    defaults: Dictionary = {
        dur: 1, n: 60, pan: 0.5, vol: 1, amp: 1, hold: 0,
        a: 10, d: 100, s: 0.8, r: 1000, 
        moda: 10, modd: 100, mods: 0.8, modr: 1000,
        fila: 10, fild: 100, fils: 0.8, filr: 1000,
        res: 0, cutoff: 20000, detune: 0,
    }
    
    constructor() {
        super()
        this.params = baseSynthParams
        this.dur = this.dur.bind(this)
        this.n = this.n.bind(this)
        this._n = this._n.bind(this)
        this.pan = this.pan.bind(this)
        this._pan = this._pan.bind(this)
        this.vol = this.vol.bind(this)
        this._vol = this._vol.bind(this)
        this.amp = this.amp.bind(this)
        this._amp = this._amp.bind(this)
        this.hold = this.hold.bind(this)
        this.a = this.a.bind(this)
        this.acurve = this.acurve.bind(this)
        this.d = this.d.bind(this)
        this.dcurve = this.dcurve.bind(this)
        this.s = this.s.bind(this)
        this.r = this.r.bind(this)
        this.rcurve = this.rcurve.bind(this)
        this.moda = this.moda.bind(this)
        this.modacurve = this.modacurve.bind(this)
        this.modd = this.modd.bind(this)
        this.moddcurve = this.moddcurve.bind(this)
        this.mods = this.mods.bind(this)
        this.modr = this.modr.bind(this)
        this.modrcurve = this.modrcurve.bind(this)
        this.fila = this.fila.bind(this)
        this.filacurve = this.filacurve.bind(this)
        this.fild = this.fild.bind(this)
        this.fildcurve = this.fildcurve.bind(this)
        this.fils = this.fils.bind(this)
        this.filr = this.filr.bind(this)
        this.filrcurve = this.filrcurve.bind(this)
        this.res = this.res.bind(this)
        this._res = this._res.bind(this)
        this.cutoff = this.cutoff.bind(this)
        this._cutoff = this._cutoff.bind(this)
        this.detune = this.detune.bind(this)
        this._detune = this._detune.bind(this)
    }

    /**
     * Trigger a musical event with the given parameters, at the given time.
     * @param {Dictionary} params - parameters to set
     * @param {number} time - time to trigger event in seconds
     * @returns {void}
     */ 
    play(params: Dictionary = {}, time: number): void {
        if(!this.ready) return

        const ps = {...this.defaults, ...params }
        const { n, amp } = ps

        n === this.state.n && this.cut(time)
        this.setParams(ps, time)
        
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, (n || 60), amp * 127]);
        this.device.scheduleEvent(noteOnEvent);
    }

    /**
     * Release any events playing at the given note
     * @param {number} n - midi note number
     * @param {number} time - time to release note
     * @returns {void}
     */ 
    release(n: number, time: number): void {
        if(!this.ready) return
        
        const noteOffEvent = new MIDIEvent((time * 1000) + 10, 0, [128, n, 0]);
        this.device.scheduleEvent(noteOffEvent)
    }

    /**
     * Cut all events playing at the given time
     * @param {number} time - time to cut events
     * @param {number} ms - time in ms taken to release events
     * @returns {void}
     */ 
    cut(time: number, ms: number = 10): void {
        if(!this.ready) return
        this.messageDevice('cut', ms, time)
    }

    /**
     * Set the duration of an event
     * @param {number} value - duration in ms
     * @param {number} time - time to set parameter in seconds
     * @default 1000
     * @returns {void}
     */ 
    dur(value: number, time: number): void { this.messageDevice('dur', value, time) }

    /**
     * Set the midi note number of an event
     * @param {number} value - midi note number
     * @param {number} time - time to set parameter in seconds
     * @default 60
     * @returns {void}
     */ 
    n(value: number, time: number): void { this.messageDevice('n', value, time) }
    _n(value: number, time: number): void { this.messageDevice('_n', value, time) }

    /**
     * Set the pan of an event
     * @param {number} value - pan value, from 0 to 1
     * @param {number} time - time to set parameter in seconds
     * @default 0.5
     * @returns {void}
     */ 
    pan(value: number, time: number): void { this.messageDevice('pan', value, time) }
    _pan(value: number, time: number): void { this.messageDevice('_pan', value, time) }


    /**
     * Set the amplitude of an event
     * @param {number} value - amplitude value, from 0 to 1
     * @param {number} time - time to set parameter in seconds
     * @default 1
     * @returns {void}
     */ 
    amp(value: number, time: number): void { this.messageDevice('amp', value, time) }
    _amp(value: number, time: number): void { this.messageDevice('_amp', value, time) }

    /**
     * Set the volume of an event
     * @param {number} value - volume value, from 0 to 1
     * @param {number} time - time to set parameter in seconds
     * @default 1
     * @returns {void}
     */ 
    vol(value: number, time: number): void { this.messageDevice('vol', value, time) }
    _vol(value: number, time: number): void { this.messageDevice('_vol', value, time) }

    /**
     * Set the hold of an event
     * @param {number} value - hold value, from 0 to 1??
     * @param {number} time - time to set parameter in seconds
     * @default 0
     */ 
    hold(value: number, time: number) { this.messageDevice('hold', value, time) }

    /**
     * Set the attack of an event
     * @param {number} value - attack value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 10
     * @returns {void}
     */ 
    a(value: number, time: number): void { this.messageDevice('a', value, time) }

    /**
     * Set the decay of an event
     * @param {number} value - decay value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 100
     * @returns {void}
     */ 
    d(value: number, time: number): void { this.messageDevice('d', value, time) }

    /**
     * Set the sustain of an event
     * @param {number} value - sustain value, from 0 to 1
     * @param {number} time - time to set parameter in seconds
     * @default 0.5
     * @returns {void}
     */ 
    s(value: number, time: number): void { this.messageDevice('s', value, time) }

    /**
     * Set the release of an event
     * @param {number} value - release value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 1000
     * @returns {void}
     */ 
    r(value: number, time: number): void { this.messageDevice('r', value, time) }

    /**
     * Set the attack curve of an event
     * @param {number} value - attack curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    acurve(value: number, time: number): void { this.messageDevice('acurve', value, time) }

    /**
     * Set the decay curve of an event
     * @param {number} value - decay curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    dcurve(value: number, time: number): void { this.messageDevice('dcurve', value, time) }

    /**
     * Set the release curve of an event
     * @param {number} value - release curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    rcurve(value: number, time: number): void { this.messageDevice('rcurve', value, time) }

    /**
     * Set the attack of the modulation envelope of an event
     * @param {number} value - attack value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 10
     * @returns {void}
     */ 
    moda(value: number, time: number): void { this.messageDevice('moda', value, time) }

    /**
     * Set the decay of the modulation envelope of an event
     * @param {number} value - decay value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 100
     * @returns {void}
     */ 
    modd(value: number, time: number): void { this.messageDevice('modd', value, time) }

    /**
     * Set the sustain of the modulation envelope of an event
     * @param {number} value - sustain value, from 0 to 1
     * @param {number} time - time to set parameter in seconds
     * @default 0.8
     * @returns {void}
     */ 
    mods(value: number, time: number): void { this.messageDevice('mods', value, time) }

    /**
     * Set the release of the modulation envelope of an event
     * @param {number} value - release value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 1000
     * @returns {void}
     */ 
    modr(value: number, time: number): void { this.messageDevice('modr', value, time) }

    /**
     * Set the attack curve of the modulation envelope of an event
     * @param {number} value - attack curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    modacurve(value: number, time: number): void { this.messageDevice('modacurve', value, time) }

    /**
     * Set the decay curve of the modulation envelope of an event
     * @param {number} value - decay curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    moddcurve(value: number, time: number): void { this.messageDevice('moddcurve', value, time) }

    /**
     * Set the release curve of the modulation envelope of an event
     * @param {number} value - release curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    modrcurve(value: number, time: number): void { this.messageDevice('modrcurve', value, time) }

    /**
     * Set the attack of the filter envelope of an event
     * @param {number} value - attack value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 10
     * @returns {void}
     */ 
    fila(value: number, time: number): void { this.messageDevice('fila', value, time) }

    /**
     * Set the decay of the filter envelope of an event
     * @param {number} value - decay value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 100
     * @returns {void}
     */ 
    fild(value: number, time: number): void { this.messageDevice('fild', value, time) }

    /**
     * Set the sustain of the filter envelope of an event
     * @param {number} value - sustain value, from 0 to 1
     * @param {number} time - time to set parameter in seconds
     * @default 0.8
     * @returns {void}
     */ 
    fils(value: number, time: number): void { this.messageDevice('fils', value, time) }

    /**
     * Set the release of the filter envelope of an event
     * @param {number} value - release value in ms
     * @param {number} time - time to set parameter in seconds
     * @default 1000
     * @returns {void}
     */ 
    filr(value: number, time: number): void { this.messageDevice('filr', value, time) }

    /**
     * Set the attack curve of the filter envelope of an event
     * @param {number} value - attack curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    filacurve(value: number, time: number): void { this.messageDevice('filacurve', value, time) }

    /**
     * Set the decay curve of the filter envelope of an event
     * @param {number} value - decay curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    fildcurve(value: number, time: number): void { this.messageDevice('fildcurve', value, time) }

    /**
     * Set the release curve of the filter envelope of an event
     * @param {number} value - release curve value, from -1 to 1
     * @param {number} time - time to set parameter in seconds
     * @returns {void}
     */ 
    filrcurve(value: number, time: number): void { this.messageDevice('filrcurve', value, time) }

    /**
     * Set the resonance of the filter of an event
     * @param {number} value - resonance value, from 0 to 1
     * @param {number} time - time to set parameter in seconds
     * @default 0
     * @returns {void}
     */ 
    res(value: number, time: number): void { this.messageDevice('res', value, time) }
    _res(value: number, time: number): void { this.messageDevice('_res', value, time) }

    /**
     * Set the cutoff of the filter of an event
     * @param {number} value - cutoff value, in Hz
     * @param {number} time - time to set parameter in seconds
     * @default 20000
     * @returns {void}
     */ 
    cutoff(value: number, time: number): void { this.messageDevice('cutoff', value, time) }
    _cutoff(value: number, time: number): void { this.messageDevice('_cutoff', value, time) }

    /**
     * Detune the pitch of an event
     * @param {number} value - detune value, in semitones
     * @param {number} time - time to set parameter in seconds
     * @default 0
     * @returns {void}
     */ 
    detune(value: number, time: number): void { this.messageDevice('detune', value, time) }
    _detune(value: number, time: number): void { this.messageDevice('_detune', value, time) }
}

export default BaseSynth