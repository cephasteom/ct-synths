import BaseSynth from "./BaseSynth2";

class Synth2 extends BaseSynth {
    json = new URL('./json/synth.export.json', import.meta.url)

    constructor() {
        super()
        this.initDevice()
        this.bindProps()
    }

}

export default Synth2