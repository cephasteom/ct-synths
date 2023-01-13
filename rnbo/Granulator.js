import { min } from "../utils/core";
import BaseSynth from "./BaseSynth";

// TODO: begin and end
class Granular extends BaseSynth {
    json = new URL('./json/granular3.export.json', import.meta.url)
    params = [...this.params, 'i', 'snap', 'bank', 'grainrate', 'grainsize', 'grainslope', 'grainpan', 'rate', 'bpm', 'direction', 'begin', 'end', 'loop']
    defaults = { 
        ...this.defaults, 
        i: 0, 
        snap: 0, 
        rate: 1, 
        a: 0, 
        d: 10, 
        s: 1, 
        r: 100, 
        bpm: 60, 
        grainrate: 16, 
        grainsize: 0.125, 
        grainslope: 0.01, 
        grainpan: 0.2, 
        direction: 1 
    }
    banks = {}
    currentBank = null
    maxI = null

    constructor() {
        super()
        this.initParams()
        this.initDevice()
    }
    
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
        this.messageDevice('i', [value%this.maxI, 0], time)
    }
}

export default Granular