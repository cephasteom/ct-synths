import BaseSynth from "./BaseSynth";
import { min } from "./utils";

import { granularParams } from "./data";

class Granular extends BaseSynth {
    json = new URL('./json/granular.export.json', import.meta.url)
    params = [...this.params, ...granularParams]
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
    loadedBuffers = []
    maxI = null

    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initParams()
        this.initDevice()
    }
    
    async load(urls) {
        this.ready = false
        const dependencies = urls.map((file, i) => ({id: `b${i}`, file}))
        this.maxI = dependencies.length <= 32 ? dependencies.length : 32

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
        if(name === this.currentBank || !this.banks[name]) return
        this.currentBank = name 
        // clear buffers to free up resources
        Array.from({length: 32}, (_, i) => this.device.releaseDataBuffer(`b${i}`))
        this.loadedBuffers = []
        this.maxI = min(this.banks[name].length, 32)
    }

    async i(value, time) {
        if(!this.currentBank) return
        const index = value % this.maxI
        if(!this.loadedBuffers.includes(index)) {
            console.log('hello')
            const fileResponse = await fetch(this.banks[this.currentBank][index]);
	        fileResponse.arrayBuffer()
                .then(arrayBuf => this.context.decodeAudioData(arrayBuf))
                .then(audioBuf => {
                    this.device.setDataBuffer(`b${index}`, audioBuf)
                    this.loadedBuffers.push(index)
                })
        } 
        this.messageDevice('i', index, time)
    }
}

export default Granular