import BaseSynth from "./BaseSynth";
import { synthParams } from "./data";

class Synth extends BaseSynth {
    
    params = [...this.params, ...synthParams]
    defaults = { ...this.defaults, osc: 0, drift: 0 }

    constructor(args = {}) {
        super()
        this.json = args.lite 
            ? new URL('./json/synth-lite.export.json', import.meta.url)
            : new URL('./json/synth.export.json', import.meta.url)
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

}

export default Synth