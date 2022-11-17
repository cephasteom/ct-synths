import * as Tone from 'tone'
import { context as toneContext, Gain } from 'tone';
import { mtf, getDisposable, getClassSetters, getClassMethods, isMutableKey, getSchedulable } from '../utils/core'
import { doAtTime, formatCurve } from "../utils/tone";
import { createDevice, MIDIEvent } from '@rnbo/js'

// Finish settable and mutable events
// voice targetting

let context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
console.log(context)
let device = null;

const createFilterSynth = async () => {
    const rawPatcher = await fetch(new URL('./json/filter-synth.export.json', import.meta.url));
    const patcher = await rawPatcher.json();
    device = await createDevice({ context, patcher });
    device.node.connect(context.destination);
}

createFilterSynth()

class BaseSynth {
    self = this.constructor
    duration = 1000
    n = 60
    voice = null // ideally get an index to target the device with, so that each instance of the synth is locked to a voice?
    oscTypes = ['sine', 'saw', 'tri', 'pulse', 'noise']
    amp = 1
    
    constructor(params) {
        this.device = device
        console.log(device.parametersById.get("poly/16/osc"))
        // this.voice = device.getNextAvailableVoice()...
    }

    #settable() {
        return [
            ...getClassSetters(BaseSynth), 
            ...getClassSetters(this.self)
        ].reduce((obj, key) => ({
            ...obj,
            [key]: (value) => this[key] = value
        }), {})
    }

    #mutable() {
        return [
            ...getClassMethods(BaseSynth), 
            ...getClassMethods(this.self)
        ]
            .filter(isMutableKey)
            .reduce((obj, key) => ({
                ...obj,
                [key]: this[key]
            }), {})
    }

    setParams(params) {
        const settable = this.#settable()
        Object.entries(params).forEach(([key, value]) => {
            settable[key] && (settable[key](value))
        });
    }

    play(params = {}, time) {
        this.time = time * 1000
        this.setParams(params)

        let noteOnEvent = new MIDIEvent(this.time, 0, [144, this.n, 66 * this.amp]);
        let noteOffEvent = new MIDIEvent(this.time + this.duration, 0, [128, this.n, 0]);

        device.scheduleEvent(noteOnEvent);
        device.scheduleEvent(noteOffEvent);
    }

    set n(value) { this.n(value) }
    set dur(value) { this.duration = value * 1000 }
    set osc(type) { device.parametersById.get("osc").value = this.oscTypes.indexOf(type) || 0 }
    set amp(value) { this.amp = value }
}

export default BaseSynth