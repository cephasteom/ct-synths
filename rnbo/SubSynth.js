import BaseSynth from "./BaseSynth";
import { subParams } from "./data";

class SubSynth extends BaseSynth {
    json = new URL('./json/sub.export.json', import.meta.url)
    params = [...this.params, ...subParams]
    defaults = { 
        ...this.defaults, 
        slide: 10, fat: 0.5, 
        dur: 1000, a: 100, d: 100, s: 0.75, r: 1000, fila: 0, fild: 100, fils: 1, filr: 100, res: 0,
        moda: 0, modd: 0
    }

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

}

export default SubSynth