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
    #dur
    #begin = 0
    #rate = 1

    constructor(buffer) {
        super()
        this.#buffer = buffer
        this.#dur = (buffer.length/context.sampleRate)
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new Player()
        this.synth._buffer.set(this.#buffer)
        this.envelope.dispose() // not needed
        this.synth.connect(this.panner)
    }

    #setPlaybackRate(mul = 1) {
        const playbackRate = this.#rate * Math.pow(2, (this.#n - 60)/12) * mul || 0.001
        this.synth.set({playbackRate})
    }

    // TODO: remove if everything works
    #formatParams(params) {
        return params
    }

    play(params = {}, time) {
        this.time = time
        this.setParams(this.#formatParams(params))
        
        this.synth.start(this.time, this.#begin, this.#dur)
        
        this.disposeTime = time + this.#dur + 0.1
        this.dispose(this.disposeTime)
    }
    
    set dur(value) { this.#dur = max(value, 0.11) }
    set n(value) {
        this.#n = value 
        this.#setPlaybackRate()
    }
    // TODO: is this passed on?
    set q(value) { this.#q = value}
    set a(fadeIn) { this.synth.set({fadeIn}) }
    set r(fadeOut) { this.synth.set({fadeOut}) }
    set begin(value) { this.#begin = (this.#buffer.length/context.sampleRate) * value}
    set rate(value) { 
        this.#rate = value 
        this.#setPlaybackRate()
    }
    // TODO: will the order be a problem here?
    set snap(value) {
        const { bpm } = Transport
        const sampleLength = this.#buffer.length/context.sampleRate
        const snapLength = (60/bpm.value/this.#q) * value
        this.#setPlaybackRate(sampleLength/snapLength)
    }
}

export default Sampler