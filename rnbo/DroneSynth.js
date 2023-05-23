import BaseSynth from "./BaseSynth";
import { droneParams } from "./data";

class DroneSynth extends BaseSynth {
    json = new URL('./json/drone.export.json', import.meta.url)
    params = [...this.params, ...droneParams]
    defaults = { 
        ...this.defaults, 
        vol: 1, amp: 1,
        lforate: 0.1, lfodepth: 0.2, spread: 1, offset: 0, damp: 0.25, dynamic: 0.25, rand: 1, slide: 100, pitch: 0.5,
        dur: 40000, a: 5000, d: 5000, s: 1, r: 1000, res: 1
    }

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

}

export default DroneSynth