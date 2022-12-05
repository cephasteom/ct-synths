import BaseSynth from "./BaseSynth2";

class Synth2 extends BaseSynth {
    json = new URL('./json/synth.export.json', import.meta.url)
    params = [...this.params, 'osc', 'res', 'cutoff']

    constructor() {
        super()
        this.initDevice()
        this.initParams()
    }

}

export default Synth2