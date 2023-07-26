import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'
import type { Dictionary } from '../types'

/**
 * The BaseSynth class contains methods shared by all instruments in the CT-Synths library. 
 * It should not be instantiated directly.
 * @class
 * @extends RNBODevice
 */ 
class BaseSynth extends RNBODevice {
    /** @hidden */
    defaults: Dictionary = {
        dur: 1, n: 60, pan: 0.5, vol: 1, amp: 1, hold: 0,
        a: 10, d: 100, s: 0.8, r: 1000, 
        moda: 10, modd: 100, mods: 0.8, modr: 1000,
        fila: 10, fild: 100, fils: 0.8, filr: 1000,
        res: 0, cutoff: 20000, detune: 0,
    }
    
    /** @hidden */
    constructor() {
        super()
        // this.params = baseSynthParams
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
     * @hidden
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
     * @hidden
     */ 
    release(n: number, time: number): void {
        if(!this.ready) return
        
        const noteOffEvent = new MIDIEvent((time * 1000) + 10, 0, [128, n, 0]);
        this.device.scheduleEvent(noteOffEvent)
    }

    /**
     * Cut all events playing at the given time
     * @param {number} ms - time in ms taken to release events
     * @example 
     * // when used in Zen, supply a list of streams to cut
     * s0.set({cut: [0,1]}) // cuts itself and s1
     */ 
    cut(time: number, ms: number = 5): void {
        if(!this.ready) return
        this.messageDevice('cut', ms, time)
    }

    /**
     * Set the duration of an event
     * @param {number} value - duration in ms
     */ 
    dur(value: number = 1000, time: number): void { this.messageDevice('dur', value, time) }

    /**
     * Set the midi note number of an event
     * @param {number} value - midi note number
     */ 
    n(value: number = 60, time: number): void { this.messageDevice('n', value, time) }

    /**
     * Mutate the midi note number of an event
     * @param {number} value - midi note number
     */ 
    _n(value: number = 60, time: number): void { this.messageDevice('_n', value, time) }

    /**
     * Set the pan of an event
     * @param {number} value - pan value, from 0 to 1
     */ 
    pan(value: number = 0.5, time: number): void { this.messageDevice('pan', value, time) }

    /**
     * Mutate the pan of an event
     * @param {number} value - pan value, from 0 to 1
     */ 
    _pan(value: number = 0.5, time: number): void { this.messageDevice('_pan', value, time) }


    /**
     * Set the amplitude of an event
     * @param {number} value - amplitude value, from 0 to 1
     */ 
    amp(value: number = 1, time: number): void { this.messageDevice('amp', value, time) }

    /**
     * Mutate the amplitude of an event
     * @param {number} value - amplitude value, from 0 to 1
     */ 
    _amp(value: number = 1, time: number): void { this.messageDevice('_amp', value, time) }

    /**
     * Set the volume of an event
     * @param {number} value - volume value, from 0 to 1
     */ 
    vol(value: number = 1, time: number): void { this.messageDevice('vol', value, time) }

    /**
     * Mutate the volume of an event
     * @param {number} value - volume value, from 0 to 1
     */ 
    _vol(value: number = 1, time: number): void { this.messageDevice('_vol', value, time) }

    /**
     * Set the hold of an event
     * @param {number} value - hold value, from 0 to 1??
     */ 
    hold(value: number, time: number) { this.messageDevice('hold', value, time) }

    /**
     * Set the attack of an event
     * @param {number} value - attack value in ms
     */ 
    a(value: number = 10, time: number): void { this.messageDevice('a', value, time) }

    /**
     * Set the decay of an event
     * @param {number} value - decay value in ms
     */ 
    d(value: number = 100, time: number): void { this.messageDevice('d', value, time) }

    /**
     * Set the sustain of an event
     * @param {number} value - sustain value, from 0 to 1
     */ 
    s(value: number = 0.5, time: number): void { this.messageDevice('s', value, time) }

    /**
     * Set the release of an event
     * @param {number} value - release value in ms
     */ 
    r(value: number = 1000, time: number): void { this.messageDevice('r', value, time) }

    /**
     * Set the attack curve of an event
     * @param {number} value - attack curve value, from -1 to 1
     */ 
    acurve(value: number, time: number): void { this.messageDevice('acurve', value, time) }

    /**
     * Set the decay curve of an event
     * @param {number} value - decay curve value, from -1 to 1
     */ 
    dcurve(value: number, time: number): void { this.messageDevice('dcurve', value, time) }

    /**
     * Set the release curve of an event
     * @param {number} value - release curve value, from -1 to 1
     */ 
    rcurve(value: number, time: number): void { this.messageDevice('rcurve', value, time) }

    /**
     * Set the attack of the modulation envelope of an event
     * @param {number} value - attack value in ms
     */ 
    moda(value: number = 10, time: number): void { this.messageDevice('moda', value, time) }

    /**
     * Set the decay of the modulation envelope of an event
     * @param {number} value - decay value in ms
     */ 
    modd(value: number = 100, time: number): void { this.messageDevice('modd', value, time) }

    /**
     * Set the sustain of the modulation envelope of an event
     * @param {number} value - sustain value, from 0 to 1
     */ 
    mods(value: number = 0.8, time: number): void { this.messageDevice('mods', value, time) }

    /**
     * Set the release of the modulation envelope of an event
     * @param {number} value - release value in ms
     */ 
    modr(value: number = 1000, time: number): void { this.messageDevice('modr', value, time) }

    /**
     * Set the attack curve of the modulation envelope of an event
     * @param {number} value - attack curve value, from -1 to 1
     */ 
    modacurve(value: number, time: number): void { this.messageDevice('modacurve', value, time) }

    /**
     * Set the decay curve of the modulation envelope of an event
     * @param {number} value - decay curve value, from -1 to 1
     */ 
    moddcurve(value: number, time: number): void { this.messageDevice('moddcurve', value, time) }

    /**
     * Set the release curve of the modulation envelope of an event
     * @param {number} value - release curve value, from -1 to 1
     */ 
    modrcurve(value: number, time: number): void { this.messageDevice('modrcurve', value, time) }

    /**
     * Set the attack of the filter envelope of an event
     * @param {number} value - attack value in ms
     */ 
    fila(value: number = 10, time: number): void { this.messageDevice('fila', value, time) }

    /**
     * Set the decay of the filter envelope of an event
     * @param {number} value - decay value in ms
     */ 
    fild(value: number = 100, time: number): void { this.messageDevice('fild', value, time) }

    /**
     * Set the sustain of the filter envelope of an event
     * @param {number} value - sustain value, from 0 to 1
     */ 
    fils(value: number = 0.8, time: number): void { this.messageDevice('fils', value, time) }

    /**
     * Set the release of the filter envelope of an event
     * @param {number} value - release value in ms
     */ 
    filr(value: number = 1000, time: number): void { this.messageDevice('filr', value, time) }

    /**
     * Set the attack curve of the filter envelope of an event
     * @param {number} value - attack curve value, from -1 to 1
     */ 
    filacurve(value: number, time: number): void { this.messageDevice('filacurve', value, time) }

    /**
     * Set the decay curve of the filter envelope of an event
     * @param {number} value - decay curve value, from -1 to 1
     */ 
    fildcurve(value: number, time: number): void { this.messageDevice('fildcurve', value, time) }

    /**
     * Set the release curve of the filter envelope of an event
     * @param {number} value - release curve value, from -1 to 1
     */ 
    filrcurve(value: number, time: number): void { this.messageDevice('filrcurve', value, time) }

    /**
     * Set the resonance of the filter of an event
     * @param {number} value - resonance value, from 0 to 1
     */ 
    res(value: number = 0, time: number): void { this.messageDevice('res', value, time) }

    /**
     * Mutate the resonance of the filter
     * @param {number} value - resonance value, from 0 to 1
     */ 
    _res(value: number = 0, time: number): void { this.messageDevice('_res', value, time) }

    /**
     * Set the cutoff of the filter of an event
     * @param {number} value - cutoff value, in Hz
     */ 
    cutoff(value: number = 20000, time: number): void { this.messageDevice('cutoff', value, time) }

    /**
     * Mutate the cutoff of the filter
     * @param {number} value - cutoff value, in Hz
     */ 
    _cutoff(value: number = 20000, time: number): void { this.messageDevice('_cutoff', value, time) }

    /**
     * Detune the pitch of an event
     * @param {number} value - detune value, in semitones
     */ 
    detune(value: number = 0, time: number): void { this.messageDevice('detune', value, time) }

    /**
     * Mutate the detune of the pitch
     * @param {number} value - detune value, in semitones
     */ 
    _detune(value: number = 0, time: number): void { this.messageDevice('_detune', value, time) }
}

export default BaseSynth