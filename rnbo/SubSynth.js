import { MIDIEvent } from '@rnbo/js'
import BaseSynth from "./BaseSynth";
import { subParams } from "./data";

class SubSynth extends BaseSynth {
    json = new URL('./json/sub.export.json', import.meta.url)
    params = [...this.params, ...subParams]
    defaults = { 
        ...this.defaults, 
        slide: 10, fat: 0.5, 
        dur: 1000, a: 100, d: 100, s: 0.75, r: 1000, fila: 0, fild: 100, fils: 1, filr: 100, res: 0,
        moda: 10, modd: 0,
        lfodepth: 0, lforate: 1,
    }

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

    play(params = {}, time) {
        
        if(!this.ready) return

        const ps = {...this.defaults, ...params }
        const { n, amp } = ps

        this.setParams(ps, time, 0)
        
        const noteOnEvent = new MIDIEvent(time * 1000, 0, [144, (n || 60), amp * 127]);
        this.device.scheduleEvent(noteOnEvent);
    }

}

export default SubSynth