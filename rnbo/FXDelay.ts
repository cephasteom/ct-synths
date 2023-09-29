import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'
import type { Dictionary } from '../types'

const patcher = fetch(new URL('./json/fx-delay.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())

/**
 * The chain of effect applied to the output of each stream. Each effect remains inactive until the amount is set to a value greater than 0.
 * @example
 * s0.p.reverb.set(0.5)
 */ 
class FXDelay extends RNBODevice {
    /** @hidden */
    constructor() {
        super()
        this.defaults = { delay: 0, dtime: 500, dfb: 0.5, dspread: 0, dcolour: 0.5, dfilter: 0 }
        this.patcher = patcher
        this.initDevice()

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
}

export default FXDelay