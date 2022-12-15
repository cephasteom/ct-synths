import BaseSynth from "./BaseSynth";
import { min } from "../utils/core";

class Oto extends BaseSynth {
    json = new URL('./json/oto.export.json', import.meta.url)
    defaults = { ...this.defaults, i: 0, snap: 0 }
    banks = {}
    currentBank = null
    maxI = null

    params = [
        ...this.params, 
        'osc', 'res', 'cutoff', 'drift', // synth params
        'i', 'snap', 'bank', 'begin', 'end', 'loop', 'rate', // sampler params
        'reverb', 'revfb1', 'revfb2', 'damp', 'diff', // reverb params
    ]

    constructor() {
        super()
        this.initDevice()
        this.initParams()
    }

    async load(urls) {
        const dependencies = urls.map((file, i) => ({id: `b${i}`, file}))
        this.maxI = min(dependencies.length, 32)

        const results = await this.device.loadDataBufferDependencies(dependencies.splice(0, 32));
        
        results.forEach(result => {
            result.type === "success"
                ? console.log(`Successfully loaded buffer with id ${result.id}`)
                : console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
        });
    }

    async bank(name) {
        if(name === this.currentBank) return
        this.currentBank = name 
        this.banks[name] && this.load(this.banks[name])
    }

    i(value, time) {
        this.messageDevice('i', value%this.maxI, time)
    }

}

export default Oto