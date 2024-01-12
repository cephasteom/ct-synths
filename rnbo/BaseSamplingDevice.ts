import BaseSynth from './BaseSynth'
import type { Dictionary } from "../types";
import { samples } from "./data/samples";

class BaseSamplingDevice extends BaseSynth {
    /** @hidden */
    nextBuffer = 0

    /** @hidden */
    banks: Dictionary = {}

    /** @hidden */
    currentBank = ''

    /** @hidden */
    buffers: Dictionary = {}

    /** @hidden */
    constructor() {
        super()
        this.bank = this.bank.bind(this)
        this.i = this.i.bind(this)
    }

    /**
     * Specify which bank of samples you want to use
     * @param name - name of the bank
     */ 
    async bank(name: string) {
        this.currentBank = name 
    }

    /**
     * Provide an index to play a sample from the current bank
     * @param value - index of sample in bank
     */ 
    async i(value: number, time: number) {
        if(!this.currentBank) return
        const index = value % this.banks[this.currentBank].length
        const url = this.banks[this.currentBank][index]
        const ref = `${this.currentBank}-${index}`

        // check if the sample is already loaded into a buffer
        const i = Object.values(this.buffers).indexOf(url)
        
        // if it's not loaded, load it
        if(i < 0) {
            // check whether we've already fetched the sample
            const sample = samples[ref] || 
                await fetch(url)
                    .then(res => res.arrayBuffer())
                    .then(arrayBuf => this.context.decodeAudioData(arrayBuf))
                    .catch(err => console.log(err))

            const b = `b${this.nextBuffer}`
            // set buffer in rnbo device
            this.device.setDataBuffer(b, sample)
            // note that the buffer is loaded
            this.buffers[b] = url
            // note that the sample has been fetched
            samples[ref] = sample
            // increment next buffer index
            this.nextBuffer = (this.nextBuffer + 1) % 32
        }

        this.messageDevice('i', i, time)
    }
    
    
}

export default BaseSamplingDevice