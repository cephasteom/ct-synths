import BaseSynth from "./BaseSynth";

class Synth extends BaseSynth {
    json = new URL('./json/synth.export.json', import.meta.url)
    params = [...this.params, 'osc', 'res', 'cutoff', 'drift']
    defaults = { ...this.defaults, osc: 0, res: 0, cutoff: 20000, drift: 0 }

    constructor() {
        super()
        this.initDevice()
        this.initParams()
    }

}

export default Synth