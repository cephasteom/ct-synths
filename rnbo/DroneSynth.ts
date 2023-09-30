import { MIDIEvent } from '@rnbo/js'
import type { Dictionary } from "../types";
import BaseSynth from "./BaseSynth";

const patcher = fetch(new URL('./json/drone.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())

class DroneSynth extends BaseSynth {
    constructor() {
        super()
        this.defaults = {
            ...this.defaults, 
            vol: 1, amp: 1,
            lforate: 0.1, lfodepth: 0.1, spread: 1, offset: 0, damp: 0.5, dynamic: 0.5, rand: 1, slide: 100, pitch: 0.5,
            dur: 40000, a: 1000, d: 0, s: 1, r: 1000, res: 1, moda: 5000, modd: 5000
        }
        this.patcher = patcher
        this.initDevice()

        this.lforate = this.lforate.bind(this)
        this._lforate = this._lforate.bind(this)
        this.lfodepth = this.lfodepth.bind(this)
        this._lfodepth = this._lfodepth.bind(this)
        this.spread = this.spread.bind(this)
        this._spread = this._spread.bind(this)
        this.offset = this.offset.bind(this)
        this._offset = this._offset.bind(this)
        this.damp = this.damp.bind(this)
        this._damp = this._damp.bind(this)
        this.dynamic = this.dynamic.bind(this)
        this._dynamic = this._dynamic.bind(this)
        this.rand = this.rand.bind(this)
        this._rand = this._rand.bind(this)
        this.slide = this.slide.bind(this)
        this._slide = this._slide.bind(this)
        this.pitch = this.pitch.bind(this)
        this._pitch = this._pitch.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    play(params = {}, time: number) {
        
        if(!this.ready) return

        const ps: Dictionary = {...this.defaults, ...params }
        const { n=60, amp=1 } = ps

        this.setParams(ps, time)
        
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, n, amp * 127]);
        this.device.scheduleEvent(noteOnEvent);
    }

    // TODO: annotate params
    lforate(value: number = 0.1, time: number): void { this.messageDevice('osc', value, time) }
    _lforate(value: number = 0.1, time: number): void { this.messageDevice('_osc', value, time) }
    lfodepth(value: number = 0.1, time: number): void { this.messageDevice('drift', value, time) }
    _lfodepth(value: number = 0.1, time: number): void { this.messageDevice('_drift', value, time) }
    spread(value: number = 1, time: number): void { this.messageDevice('spread', value, time) }
    _spread(value: number = 1, time: number): void { this.messageDevice('_spread', value, time) }
    offset(value: number = 0, time: number): void { this.messageDevice('offset', value, time) }
    _offset(value: number = 0, time: number): void { this.messageDevice('_offset', value, time) }
    damp(value: number = 0.5, time: number): void { this.messageDevice('damp', value, time) }
    _damp(value: number = 0.5, time: number): void { this.messageDevice('_damp', value, time) }
    dynamic(value: number = 0.5, time: number): void { this.messageDevice('dynamic', value, time) }
    _dynamic(value: number = 0.5, time: number): void { this.messageDevice('_dynamic', value, time) }
    rand(value: number = 1, time: number): void { this.messageDevice('rand', value, time) }
    _rand(value: number = 1, time: number): void { this.messageDevice('_rand', value, time) }
    slide(value: number = 100, time: number): void { this.messageDevice('slide', value, time) }
    _slide(value: number = 100, time: number): void { this.messageDevice('_slide', value, time) }
    pitch(value: number = 0.5, time: number): void { this.messageDevice('pitch', value, time) }
    _pitch(value: number = 0.5, time: number): void { this.messageDevice('_pitch', value, time) }
}

export default DroneSynth