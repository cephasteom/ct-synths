import { min } from "../utils/core";
import BaseSynth from "./BaseSynth";

// TODO: if no duration, do the length of the sample

class Sampler extends BaseSynth {
    json = new URL('./json/sampler.export.json', import.meta.url)
    params = [...this.params, 'i', 'snap', 'bank', 'begin', 'end', 'loop', 'rate']
    defaults = { ...this.defaults, i: 0, snap: 0 }
    banks = {}
    currentBank = null
    maxI = null

    constructor() {
        super()
        this.initParams()
        this.initDevice()
    }
    
    /*
        *   Load a set of samples into the sampler
        *   @param {Array} urls - an array of urls
        *   @example
        *   [
        *       "https://tonejs.github.io/audio/505/kick.wav",
        *       "https://tonejs.github.io/audio/505/snare.wav",
        *       "https://tonejs.github.io/audio/505/hh.wav",
        *   ];
        * 
    */
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

export default Sampler