import { mtf, formatOscType, max } from "./utils/core";
import { formatCurve } from "./utils/tone";
import { FMSynth, Player, context, Transport } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets

class Sampler extends BaseSynth {    
    synth;
    #q = 48
    #n = 60
    #buffer
    #begin = 0
    #rate = 1
    #playbackRate = 1

    constructor(buffer) {
        super()
        this.#buffer = buffer
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new Player({fadeOut: 0.1})
        this.synth._buffer.set(this.#buffer)
        this.envelope.dispose() // not needed
        this.synth.connect(this.panner)
    }

    #setPlaybackRate(mul = 1) {
        this.#playbackRate = this.#rate * Math.pow(2, (this.#n - 60)/12) * mul || 0.001
        this.synth.set({playbackRate: this.#playbackRate})
    }

    #formatParams(params) {
        return {
            ...params,
            note: params.n || this.#n
        }
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(this.#formatParams(params))
        
        const duration = params.dur || (this.#buffer.length/context.sampleRate) / this.#playbackRate

        this.synth.start(this.time, this.#begin, duration)
        
        this.disposeTime = time + duration + this.synth.fadeOut + 1

        this.dispose(this.disposeTime)
    }
    
    set note(value) {
        this.#n = value 
        this.#setPlaybackRate()
    }
    
    set a(fadeIn) { this.synth.set({fadeIn}) }
    set r(fadeOut) { this.synth.set({fadeOut}) }
    set begin(value) { this.#begin = (this.#buffer.length/context.sampleRate) * value}
    set rate(value) { 
        this.#rate = value 
        this.#setPlaybackRate()
    }
    // TODO: check from heree
    // TODO: will the order be a problem here?
    set q(value) { this.#q = value}
    set snap(value) {
        const { bpm } = Transport
        const sampleLength = this.#buffer.length/context.sampleRate
        const snapLength = (60/bpm.value/this.#q) * value
        this.#setPlaybackRate(sampleLength/snapLength)
    }
}

export default Sampler