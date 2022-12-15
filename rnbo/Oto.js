import BaseSynth from "./BaseSynth";
import { min } from "../utils/core";

class Oto extends BaseSynth {
    json = new URL('./json/oto.export.json', import.meta.url)
    defaults = { n: 60, pan: 0.5, vol: 1 }
    instDefaults = {
        synth: { osc: 0, res: 0, cutoff: 20000, drift: 0, a: 10, d: 10, s: 0.8, r: 100 },
        sampler: { i: 0, begin: 0, end: 1, loop: 0, rate: 1, a: 0, d: 0, s: 1, r: 100 },
    }
    banks = {}
    currentBank = null
    maxI = null

    params = [
        ...this.params, 
        'osc', 'res', 'cutoff', 'drift', // synth params
        'i', 'snap', 'bank', 'begin', 'end', 'loop', 'rate', 'bpm', // sampler params
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

        const results = await this.device.loadDataBufferDependencies(dependencies.splice(0, this.maxI));
        
        results.forEach(result => {
            result.type === "success"
                ? console.log(`Successfully loaded buffer with id ${result.id}`)
                : console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
        });
    }

    // Load banks of samples
    async bank(name) {
        if(name === this.currentBank || !this.banks[name]) return
        this.currentBank = name 
        this.load(this.banks[name])
    }

    // ensure that the sample index is within the range of the loaded samples
    i(value, time) {
        this.messageDevice('i', value%this.maxI, time)
    }

}

export default Oto