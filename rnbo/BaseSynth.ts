import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'
import { baseSynthParams } from './data'
import type { Dictionary } from '../types'

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
    }

    play(params: Dictionary = {}, time: number) {
        
        if(!this.ready) return

        const ps = {...this.defaults, ...params }
        const { n, amp } = ps

        n === this.state.n && this.cut(time)
        this.setParams(ps, time)
        
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, (n || 60), amp * 127]);
        this.device.scheduleEvent(noteOnEvent);
    }

    release(n: number, time: number) {
        if(!this.ready) return
        // schedule note off event
        const noteOffEvent = new MIDIEvent((time * 1000) + 10, 0, [128, n, 0]);
        this.device.scheduleEvent(noteOffEvent)
    }

    cut(time: number, ms: number = 10) {
        if(!this.ready) return
        this.messageDevice('cut', ms, time)
    }
}

export default BaseSynth