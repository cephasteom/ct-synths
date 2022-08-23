import { GrainPlayer, context, Signal, Clock, Transport } from "tone";
import BaseSynth from "./BaseSynth";

// TODO: presets
class Granular extends BaseSynth {    
    synth;
    #q = 48
    #n = 60
    #begin = 0
    #snap
    #bufferLength
    rateRamp
    clock
    
    constructor(fxParams, buffer) {
        super(fxParams)
        this.#bufferLength = buffer.length/context.sampleRate
        this.#initGraph(buffer)
    }

    #initGraph(buffer) {
        this.synth = new GrainPlayer({loop: true, grainSize: 0.1, overlap: 0.05, url: buffer})
        this.synth.connect(this.envelope)
        this.envelope.set({attack: 0.1, decay: 0, sustain: 1, release: 0.1})
        this.rateRamp = new Signal(this.synth.playbackRate, 'number')
        this.pitchRamp = new Signal(0, 'number')
        this.clock = new Clock(time => {
            // set playbackRate
            this.synth.set({playbackRate: this.rateRamp.getValueAtTime(time)});
            // set detune value (cents)
            this.synth.set({detune: this.pitchRamp.getValueAtTime(time)});
        }, 48).start();
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
        
        const duration = (params.dur || this.dur)
        this.synth.start(this.time, this.#begin, duration * 2) // * 2 to account for bug in grainplayer
        
        this.envelope.triggerAttackRelease(duration - this.envelope.release, this.time, this.amp)
        
        this.disposeTime = time + duration + 0.5
        this.dispose(this.disposeTime)
    }

    set note(value) { 
        const detune = (value - 60) * 100
        this.pitchRamp.value = detune
        this.synth.detune = detune
    }

    set q(value) { this.#q = value}

    set snap(value) {
        const { bpm } = Transport
        const snapLength = (60/bpm.value/this.#q) * value
        const snap = this.#bufferLength/snapLength
        this.rateRamp.value = snap
        this.synth.playbackRate = snap
    }

    set begin(value) { this.#begin = this.#bufferLength * value }
    set end(value) { this.synth.set({loopEnd: this.#bufferLength * value}) }
    set overlap(overlap) { this.synth.set({overlap}) }

    set rate(value) { 
        this.rateRamp.value = value
        this.synth.playbackRate = value
    }
    set size(value) { this.synth.set({grainSize: value}) }
    set direction(value) { this.synth.set({reverse: value < 0})}

    // Speed at which the playback moves through the buffer, overwritten by snap
    _rate(value, time, lag = 0.1) { 
        this.rateRamp.cancelScheduledValues(time)
        this.rateRamp.rampTo(value, lag, time)
    }
    _rate = this._rate.bind(this)
    
    // grain pitch - assumes note 60 is original speed of sample
    _n(value, time, lag = 0.01) {
        this.pitchRamp.cancelScheduledValues(time)
        this.pitchRamp.rampTo(Math.floor((value - 60) * 100), lag/10, time)
    }
    _n = this._n.bind(this)
}

export default Granular