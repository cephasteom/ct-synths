import { min } from "../utils/core";
import BaseSynth from "./BaseSynth";

// todo: mono mode
class Sampler extends BaseSynth {
    json = new URL('./json/sampler.export.json', import.meta.url)
    params = [...this.params, 'i', 'snap', 'bank', 'begin', 'end', 'loop', 'rate', 'bpm', 'oneshot', 'loopsize']
    defaults = { ...this.defaults, 
        i: 0, snap: 0, rate: 1, a: 5, d: 10, s: 1, r: 100, bpm: 120, begin: 0, end: 1, loop: 0, oneshot: 0, loopsize: 1 
    }
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
        this.ready = false
        const dependencies = urls.map((file, i) => ({id: `b${i}`, file}))
        this.maxI = min(dependencies.length, 32)

        const results = await this.device.loadDataBufferDependencies(dependencies.splice(0, 32));
        
        results.forEach(result => {
            result.type === "success"
                ? console.log(`Successfully loaded buffer with id ${result.id}`)
                : console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
        });

        this.i(this.state.i || 0)
        this.ready = true
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