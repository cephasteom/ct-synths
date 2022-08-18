import { GrainPlayer, context, Param, Signal, Loop, Transport, Clock } from "tone";
import BaseSynth from "./BaseSynth";
import { doAtTime } from "./utils/tone";

// TODO: presets
class Granular extends BaseSynth {    
    synth;
    #n = 60
    #buffer
    #begin = 0
    #bufferLength
    rateRamp
    clock
    
    constructor(buffer) {
        super()
        this.#buffer = buffer
        this.#bufferLength = buffer.length/context.sampleRate
        this.#initGraph()
    }

    #initGraph() {
        this.synth = new GrainPlayer({loop: true, grainSize: 0.1, overlap: 0.05})
        this.synth.buffer.set(this.#buffer)
        this.synth.connect(this.envelope)
        this.envelope.set({attack: 0.01, decay: 0, sustain: 1, release: 0.1})
        this.rateRamp = new Signal(this.synth.playbackRate, 'number')
        this.pitchRamp = new Signal(0, 'number')
        this.clock = new Clock(time => {
            // set playbackRate
            this.synth.playbackRate !== this.rateRamp.value && this.synth.set({playbackRate: this.rateRamp.getValueAtTime(time)});
            // set detune value (cents)
            this.synth.detune !== this.pitchRamp.value && this.synth.set({detune: this.pitchRamp.getValueAtTime(time)});
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
        this.synth.start(this.time, this.#begin, duration)
        this.envelope.triggerAttackRelease(duration - this.envelope.release, this.time, this.amp)
        
        this.disposeTime = time + duration + 0.2
        this.dispose(this.disposeTime)
    }

    set note(value) { 
        this.pitchRamp.setValueAtTime((value - 60) * 100, this.time) 
    }

    set begin(value) { 
        this.#begin = this.#bufferLength * value
        this.synth.set({loopStart: this.#begin})
    }
    set end(value) { this.synth.set({loopEnd: this.#bufferLength * value}) }
    set overlap(overlap) { this.synth.set({overlap}) }

    set rate(value) { this.rateRamp.setValueAtTime(value, this.time) }
    set size(grainSize) { this.synth.set({grainSize}) }
    set direction(value) { this.synth.set({reverse: value < 0})}

    // Speed at which the playback moves through the buffer
    _rate(value, time, lag = 0.1) { 
        this.rateRamp.cancelScheduledValues(time)
        this.rateRamp.exponentialRampTo(value, lag, time)
    }
    _rate = this._rate.bind(this)
    
    _n(value, time, lag = 0.1) { 
        this.pitchRamp.cancelScheduledValues(time)
        this.pitchRamp.rampTo(Math.floor((value - 60) * 100), lag, time)
    }
    _n = this._n.bind(this)


}

export default Granular