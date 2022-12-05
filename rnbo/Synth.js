import BaseSynth from "./BaseSynth";
class Synth extends BaseSynth {
    json = new URL('./json/synth.export.json', import.meta.url)
    params = [...this.params, 'osc', 'res', 'cutoff', 'drift']

    constructor() {
        super()
        this.initDevice()
        this.initParams()
    }

}

export default Synth