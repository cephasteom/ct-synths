import { context as toneContext, Gain } from 'tone';
import { dummy } from './utils';
import { createDevice, MIDIEvent, MessageEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
const ps = [
    'dur', 'n', 'pan', 'amp', 'vol', 
    'a', 'd', 's', 'r', 'acurve', 'dcurve', 'rcurve', 
    'moda', 'modd', 'mods', 'modr', 'modacurve', 'moddcurve', 'modrcurve', 
    'fila', 'fild', 'fils', 'filr', 'filacurve', 'fildcurve', 'filrcurve', 
    'res', 'cutoff',
    'dist', 'drive',
    'ring', 'ringf', 'ringspread', 'ringmode',
    'chdepth', 'chlfo', 'chspread',
    'hicut', 'locut',
]

class BaseSynth extends RNBODevice {
    self = this.constructor
    params = ps
    static get baseKeys() {
        return ps
    }
    defaults = {
        dur: 1000, n: 60, pan: 0.5, vol: 1, amp: 1, 
        a: 10, d: 100, s: 0.8, r: 1000, 
        moda: 10, modd: 100, mods: 0.8, modr: 1000,
        fila: 10, fild: 100, fils: 0.8, filr: 1000,
        res: 0, cutoff: 20000,
    }
    
    constructor() {
        super()
    }

    play(params = {}, time) {
        if(!this.ready) return

        const ps = {...this.defaults, ...params }
        const { n, amp, dur } = ps

        // TODO: check this for pops, revert to this.state.last if necessary
        n === this.state.n && this.cut(time)
        this.setParams(ps, time, 0)
        
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, (n || 60), amp * 66]);
        this.device.scheduleEvent(noteOnEvent);
        
        const noteOffEvent = new MIDIEvent((time * 1000) + (dur || 500), 0, [128, n, 0]);
        this.device.scheduleEvent(noteOffEvent)
    }

    cut(time, ms = 10) {
        if(!this.ready) return
        this.messageDevice('cut', ms, time)
    }
}

export default BaseSynth