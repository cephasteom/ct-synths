import { MIDIEvent } from '@rnbo/js'
import BaseSynth from "./BaseSynth";
import { droneParams } from "./data";

class DroneSynth extends BaseSynth {
    json = new URL('./json/drone.export.json', import.meta.url)
    params = [...this.params, ...droneParams]
    defaults = { 
        ...this.defaults, 
        vol: 1, amp: 1,
        lforate: 0.1, lfodepth: 0.1, spread: 1, offset: 0, damp: 0.5, dynamic: 0.5, rand: 1, slide: 100, pitch: 0.5,
        dur: 40000, a: 1000, d: 0, s: 1, r: 1000, res: 1, moda: 5000, modd: 5000
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

export default DroneSynth