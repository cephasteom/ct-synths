import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'
import { fxParams } from './data'
import type { Dictionary } from '../types'

/**
 * The chain of effect applied to the output of each stream. Each effect remains inactive until the amount is set to a value greater than 0.
 * @example
 * s0.p.reverb.set(0.5)
 */ 
class FXChain extends RNBODevice {
    /** @hidden */
    json = new URL('./json/fx.export.json', import.meta.url)

    /** @hidden */
    params = fxParams

    /** @hidden */
    defaults = {
        dist: 0, drive: 0.25,
        ring: 0, ringf: 0.25, ringspread: 0, ringmode: 0,
        hicut: 0, locut: 0,
        chorus: 0, chdepth: 0.25, chlfo: 0.25, chspread: 0.25,
        delay: 0, dtime: 500, dfb: 0.5, dspread: 0, dcolour: 0.25, dfilter: 0, 
        reverb: 0, rsize: 0.25, rdamp: 0.25, rdiff: 0.25, rjitter: 0, rdecay: 0.25,
        gain: 1, lthresh: 1
    }
    
    /** @hidden */
    constructor() {
        super()
        this.initDevice()

        this.dist = this.dist.bind(this)
        this._dist = this._dist.bind(this)
        this.drive = this.drive.bind(this)
        this._drive = this._drive.bind(this)
        this.ring = this.ring.bind(this)
        this._ring = this._ring.bind(this)
        this.ringf = this.ringf.bind(this)
        this._ringf = this._ringf.bind(this)
        this.ringspread = this.ringspread.bind(this)
        this._ringspread = this._ringspread.bind(this)
        this.ringmode = this.ringmode.bind(this)
        this._ringmode = this._ringmode.bind(this)
        this.hicut = this.hicut.bind(this)
        this._hicut = this._hicut.bind(this)
        this.locut = this.locut.bind(this)
        this._locut = this._locut.bind(this)
        this.chorus = this.chorus.bind(this)
        this._chorus = this._chorus.bind(this)
        this.chdepth = this.chdepth.bind(this)
        this._chdepth = this._chdepth.bind(this)
        this.chlfo = this.chlfo.bind(this)
        this._chlfo = this._chlfo.bind(this)
        this.chspread = this.chspread.bind(this)
        this._chspread = this._chspread.bind(this)
        this.delay = this.delay.bind(this)
        this._delay = this._delay.bind(this)
        this.dtime = this.dtime.bind(this)
        this._dtime = this._dtime.bind(this)
        this.dfb = this.dfb.bind(this)
        this._dfb = this._dfb.bind(this)
        this.dspread = this.dspread.bind(this)
        this._dspread = this._dspread.bind(this)
        this.dcolour = this.dcolour.bind(this)
        this._dcolour = this._dcolour.bind(this)
        this.dfilter = this.dfilter.bind(this)
        this._dfilter = this._dfilter.bind(this)
        this.reverb = this.reverb.bind(this)
        this._reverb = this._reverb.bind(this)
        this.rsize = this.rsize.bind(this)
        this._rsize = this._rsize.bind(this)
        this.rdamp = this.rdamp.bind(this)
        this._rdamp = this._rdamp.bind(this)
        this.rdiff = this.rdiff.bind(this)
        this._rdiff = this._rdiff.bind(this)
        this.rjitter = this.rjitter.bind(this)
        this._rjitter = this._rjitter.bind(this)
        this.rdecay = this.rdecay.bind(this)
        this._rdecay = this._rdecay.bind(this)
        this.gain = this.gain.bind(this)
        this._gain = this._gain.bind(this)
        this.lthresh = this.lthresh.bind(this)
        this._lthresh = this._lthresh.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /** @hidden */
    set(params: Dictionary = {}, time: number) {
        if(!this.ready) return
        const ps = {...this.defaults, ...params }
        this.setParams(ps, time)

        const triggerEvent = new MIDIEvent(time * 1000, 0, [144, 60, 127]);
        this.device.scheduleEvent(triggerEvent);
    }

    /**
     * The distortion amount
     * @param value - 0 to 1
     */ 
    dist(value: number = 0, time: number): void { this.messageDevice('dist', value, time) }

    /**
     * Mutate the distortion amount
     * @param value - 0 to 1
     */ 
    _dist(value: number = 0, time: number): void { this.messageDevice('_dist', value, time) }

    /**
     * The distortion drive
     * @param value - 0 to 1
     */ 
    drive(value: number = 0.5, time: number): void { this.messageDevice('drive', value, time) }

    /**
     * Mutate the distortion drive
     * @param value - 0 to 1
     */ 
    _drive(value: number = 0.5, time: number): void { this.messageDevice('_drive', value, time) }

    /**
     * Ring modulator amount
     * @param value - 0 to 1
     */ 
    
    ring(value: number = 0, time: number): void { this.messageDevice('ring', value, time) }

    /**
     * Mutate the ring modulator amount
     * @param value - 0 to 1
     */ 
    _ring(value: number = 0, time: number): void { this.messageDevice('_ring', value, time) }

    /**
     * Ring modulator pitch
     * @param value - 0 to 1
     */ 
    ringf(value: number = 0.25, time: number): void { this.messageDevice('ringf', value, time) }

    /**
     * Mutate the ring modulator pitch
     * @param value - 0 to 1
     */ 
    _ringf(value: number = 0.25, time: number): void { this.messageDevice('_ringf', value, time) }

    /**
     * Ring modulator spread
     * @param value - 0 to 1
     */ 
    ringspread(value: number = 0, time: number): void { this.messageDevice('ringspread', value, time) }

    /**
     * Mutate the ring modulator spread
     * @param value - 0 to 1
     */ 
    _ringspread(value: number = 0, time: number): void { this.messageDevice('_ringspread', value, time) }

    /**
     * Ring modulator mode
     * @param value - 0 to 1
     */ 
    ringmode(value: number = 0, time: number): void { this.messageDevice('ringmode', value, time) }

    /**
     * Mutate the ring modulator mode
     * @param value - 0 to 1
     */ 
    _ringmode(value: number = 0, time: number): void { this.messageDevice('_ringmode', value, time) }

    /**
     * Chorus amount
     * @param value - 0 to 1
     */ 
    chorus(value: number = 0, time: number): void { this.messageDevice('chorus', value, time) }

    /**
     * Mutate the chorus amount
     * @param value - 0 to 1
     */ 
    _chorus(value: number = 0, time: number): void { this.messageDevice('_chorus', value, time) }

    /**
     * Chorus depth
     * @param value - 0 to 1
     */
    chdepth(value: number = 0.25, time: number): void { this.messageDevice('chdepth', value, time) }

    /**
     * Mutate the chorus depth
     * @param value - 0 to 1
     */ 
    _chdepth(value: number = 0.25, time: number): void { this.messageDevice('_chdepth', value, time) }

    /**
     * Chorus LFO
     * @param value - 0 to 1
     */ 
    chlfo(value: number = 0.25, time: number): void { this.messageDevice('chlfo', value, time) }

    /**
     * Mutate the chorus LFO
     * @param value - 0 to 1
     */ 
    _chlfo(value: number = 0.25, time: number): void { this.messageDevice('_chlfo', value, time) }

    /**
     * Chorus spread
     * @param value - 0 to 1
     */ 
    chspread(value: number = 0.25, time: number): void { this.messageDevice('chspread', value, time) }

    /**
     * Mutate the chorus spread
     * @param value - 0 to 1
     */ 
    _chspread(value: number = 0.25, time: number): void { this.messageDevice('_chspread', value, time) }

    /**
     * Hicut filter
     * @param value - 0 to 1
     */
    
    hicut(value: number = 0, time: number): void { this.messageDevice('hicut', value, time) }

    /**
     * Mutate the hicut filter
     * @param value - 0 to 1
     */ 
    _hicut(value: number = 0, time: number): void { this.messageDevice('_hicut', value, time) }

    /**
     * Locut filter
     * @param value - 0 to 1
     */ 
    locut(value: number = 0, time: number): void { this.messageDevice('locut', value, time) }

    /**
     * Mutate the locut filter
     * @param value - 0 to 1
     */ 
    _locut(value: number = 0, time: number): void { this.messageDevice('_locut', value, time) }

    /**
     * Delay amount
     * @param value - 0 to 1
     */ 
    delay(value: number = 0, time: number): void { this.messageDevice('delay', value, time) }

    /**
     * Mutate the delay amount
     * @param value - 0 to 1
     */ 
    _delay(value: number = 0, time: number): void { this.messageDevice('_delay', value, time) }

    /**
     * Delay time
     * @param value - in ms
     */ 
    dtime(value: number = 500, time: number): void { this.messageDevice('dtime', value, time) }

    /**
     * Mutate the delay time - may cause clicks
     * @param value - in ms
     */ 
    _dtime(value: number = 500, time: number): void { this.messageDevice('_dtime', value, time) }

    /**
     * Delay feedback
     * @param value - 0 to 1
     */ 
    dfb(value: number = 0.5, time: number): void { this.messageDevice('dfb', value, time) }

    /**
     * Mutate the delay feedback
     * @param value - 0 to 1
     */ 
    _dfb(value: number = 0.5, time: number): void { this.messageDevice('_dfb', value, time) }

    /**
     * Delay spread
     * @param value - 0 to 1
     */ 
    dspread(value: number = 0, time: number): void { this.messageDevice('dspread', value, time) }

    /**
     * Mutate the delay spread
     * @param value - 0 to 1
     */ 
    _dspread(value: number = 0, time: number): void { this.messageDevice('_dspread', value, time) }

    /**
     * Delay colour
     * @param value - 0 to 1
     */
    dcolour(value: number = 0.25, time: number): void { this.messageDevice('dcolour', value, time) }

    /**
     * Mutate the delay colour
     * @param value - 0 to 1
     */ 
    _dcolour(value: number = 0.25, time: number): void { this.messageDevice('_dcolour', value, time) }

    /**
     * Delay filter
     * @param value - 0 to 1
     */ 
    
    dfilter(value: number = 0, time: number): void { this.messageDevice('dfilter', value, time) }

    /**
     * Mutate the delay filter
     * @param value - 0 to 1
     */ 
    _dfilter(value: number = 0, time: number): void { this.messageDevice('_dfilter', value, time) }

    /**
     * Reverb amount
     * @param value - 0 to 1
     */
    reverb(value: number = 0, time: number): void { this.messageDevice('reverb', value, time) }

    /**
     * Mutate the reverb amount
     * @param value - 0 to 1
     */ 
    _reverb(value: number = 0, time: number): void { this.messageDevice('_reverb', value, time) }

    /**
     * Reverb size
     * @param value - 0 to 1
     */ 
    rsize(value: number = 0.25, time: number): void { this.messageDevice('rsize', value, time) }

    /**
     * Mutate the reverb size
     * @param value - 0 to 1
     */ 
    _rsize(value: number = 0.25, time: number): void { this.messageDevice('_rsize', value, time) }

    /**
     * Reverb dampening
     * @param value - 0 to 1
     */ 
    rdamp(value: number = 0.25, time: number): void { this.messageDevice('rdamp', value, time) }

    /**
     * Mutate the reverb dampening
     * @param value - 0 to 1
     */ 
    _rdamp(value: number = 0.25, time: number): void { this.messageDevice('_rdamp', value, time) }

    /**
     * Reverb diffusion
     * @param value - 0 to 1
     */ 
    rdiff(value: number = 0.25, time: number): void { this.messageDevice('rdiff', value, time) }

    /**
     * Mutate the reverb diffusion
     * @param value - 0 to 1
     */ 
    _rdiff(value: number = 0.25, time: number): void { this.messageDevice('_rdiff', value, time) }

    /**
     * Reverb jitter
     * @param value - 0 to 1
     */ 
    rjitter(value: number = 0, time: number): void { this.messageDevice('rjitter', value, time) }

    /**
     * Mutate the reverb jitter
     * @param value - 0 to 1
     */
    _rjitter(value: number = 0, time: number): void { this.messageDevice('_rjitter', value, time) }

    /**
     * Reverb decay
     * @param value - 0 to 1
     */ 
    rdecay(value: number = 0.25, time: number): void { this.messageDevice('rdecay', value, time) }

    /**
     * Mutate the reverb decay
     * @param value - 0 to 1
     */ 
    _rdecay(value: number = 0.25, time: number): void { this.messageDevice('_rdecay', value, time) }

    /**
     * Gain of channel
     * @param value - 0 to 1
     */ 
    gain(value: number = 1, time: number): void { this.messageDevice('gain', value, time) }

    /**
     * Mutate the gain of channel
     * @param value - 0 to 1
     */ 
    _gain(value: number = 1, time: number): void { this.messageDevice('_gain', value, time) }

    /**
     * Limiter threshold
     * @param value - 0 to 1
     */ 
    lthresh(value: number = 1, time: number): void { this.messageDevice('lthresh', value, time) }

    /**
     * Mutate the limiter threshold
     * @param value - 0 to 1
     */ 
    _lthresh(value: number = 1, time: number): void { this.messageDevice('_lthresh', value, time) }
}

export default FXChain