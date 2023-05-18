import BaseSynth from "./BaseSynth";
import { acidParams } from "./data";

class AcidSynth extends BaseSynth {
    json = new URL('./json/acid.export.json', import.meta.url)
    params = [...this.params, ...acidParams]
    defaults = { 
        ...this.defaults, 
        slide: 10, fil: 0.5, osc: 0.6, sub: 0.5,
        dur: 100, a: 10, d: 100, s: 0.5, r: 50, fila: 10, fild: 100, fils: 0.1, filr: 100, res: 0.8, cutoff: 7500,
    }

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

}

export default AcidSynth