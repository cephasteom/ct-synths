import BaseSynth from "./BaseSynth";

class Synth extends BaseSynth {
    json = new URL('./json/additive.export.json', import.meta.url)
    params = [...this.params, 'res', 'cutoff', 'drift', 'pmuln', 'pmul', 'pdisp', 'pexp']
    defaults = { 
        ...this.defaults, 
        osc: 0, 
        res: 0, 
        cutoff: 20000, 
        drift: 1, 
        pmuln: 0, // nth partial to multiply
        pmul: 0, // partial multiplier
        pdisp: 0, // partial dispersion (multiplies each partial by a small amount)
        pexp: 0.1 // amplitude rolloff exponent - 1 is linear, 0 is steep, 8 is gentle
    }

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

}

export default Synth