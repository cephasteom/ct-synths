import BaseSynth from "./BaseSynth";
import { synthParams } from "./data";

class Synth extends BaseSynth {
    json = new URL('./json/synth.export.json', import.meta.url)
    params = [...this.params, ...synthParams]
    defaults = { ...this.defaults, osc: 0, drift: 0 }

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

}

export default Synth