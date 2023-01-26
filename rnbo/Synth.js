import BaseSynth from "./BaseSynth";

class Synth extends BaseSynth {
    json = new URL('./json/synth.export.json', import.meta.url)
    params = [...this.params, 'osc', 'drift', 'harm', 'modi']
    static get keys() {
        return ['osc', 'drift', 'harm', 'modi']
    }
    defaults = { ...this.defaults, osc: 0, res: 0, cutoff: 20000, drift: 0 }

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

}

export default Synth