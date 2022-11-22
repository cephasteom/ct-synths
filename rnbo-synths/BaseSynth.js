import * as Tone from 'tone'
import { context as toneContext, Panner, Gain } from 'tone';
import { mtf, getDisposable, getClassSetters, getClassMethods, isMutableKey, getSchedulable } from '../utils/core'
import { doAtTime, formatCurve } from "../utils/tone";
import { createDevice, MIDIEvent, TimeNow, MessageEvent } from '@rnbo/js'

// current problem - how to implement cut...


let context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;

// gain node doesn't work if there isn't a tone node connected to it
// so we create a dummy node to connect to
// hardly ideal, but it works
const dummy = new Tone.Oscillator({volume: -Infinity, frequency: 0, type: 'sine1'}).start();

class BaseSynth {
    self = this.constructor
    device = null
    params = {}
    // todo - get this dynamically from the patcher
    voices = [0,0,0,0,0,0,0,0]
    oscTypes = ['sine', 'saw', 'tri', 'pulse', 'noise']
    amp = 1
    json = new URL('./json/filter-synth.export.json', import.meta.url)
    
    constructor() {
        this.gain = new Gain(1);
        dummy.connect(this.gain);
        this.initDevice()
    }

    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        this.device = await createDevice({ context, patcher });
        this.device.node.connect(this.gain._gainNode._nativeAudioNode);
        this.device.messageEvent.subscribe(e => {
            if(e.tag !== 'out4') return
            const [voice, n, status] = e.payload
            const index = voice - 1
            this.voices[index] = n; // update voice status
            index === 7 && this.setParams(this.params) // if last voice, set params
        });

    }

    connect(node) {
        this.gain.connect(node);
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

    getVoiceData() {
        const message = new MessageEvent(TimeNow, "status", [ 1 ]);
        this.device.scheduleEvent(message);
    }

    setParams(params) {
        const settable = this.#settable()
        Object.entries(params).forEach(([key, value]) => {
            settable[key] && (settable[key](value))
        });
    }

    setInactiveDeviceParams(name, value) {  
        this.voices.forEach((voice, index) => {
            if(voice > 0) return // if voice is active, ignore
            this.device.parametersById.get(`poly/${index + 1}/${name}`).value = value
        })
    }

    play(params = {}, time) {
        this.time = time * 1000
        this.params = params
        
        this.getVoiceData()
        
        let noteOnEvent = new MIDIEvent(this.time, 0, [144, params.n, 66 * (params.n || this.amp)]);
        let noteOffEvent = new MIDIEvent(this.time + (params.dur * 1000), 0, [128, params.n, 0]);
        
        // TODO: extend polyphony on the fly?
        if(this.voices.every(v => v > 0)) return // if all voices are busy, ignore
        
        this.device.scheduleEvent(noteOnEvent);
        this.device.scheduleEvent(noteOffEvent)
    }

    // TODO: not working correctly
    cut(time) {
        this.device.parametersById.get('r').value = 10
        const message = new MessageEvent(time * 989, "cut", [ 1 ]);
        this.device.scheduleEvent(message);
    }

    set amp(value) { this.amp = value }
    set vol(value) { this.gain.gain.rampTo(value, 0.1, this.time/1000) }
    set osc(type) { this.setInactiveDeviceParams('osc', this.oscTypes.indexOf(type) || 0) }

    set a(value) { this.setInactiveDeviceParams('a', value) }
    set d(value) { this.setInactiveDeviceParams('d', value) }
    set s(value) { this.setInactiveDeviceParams('s', value) }
    set r(value) { this.setInactiveDeviceParams('r', value) }

    set moda(value) { this.setInactiveDeviceParams('moda', value) }
    set modd(value) { this.setInactiveDeviceParams('modd', value) }
    set mods(value) { this.setInactiveDeviceParams('mods', value) }
    set modr(value) { this.setInactiveDeviceParams('modr', value) }

    set res(value) { this.setInactiveDeviceParams('res', value) }
}

export default BaseSynth