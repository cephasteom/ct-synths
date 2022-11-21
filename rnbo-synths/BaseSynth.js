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
    duration = 1000
    n = 60
    voices = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null}
    currentVoice = null
    nextVoice = null
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
            const [voice, n, status] = e.payload

            e.tag === 'out3' && status === 0 && (this.currentVoice = voice);
            e.tag === 'out3' && status === 0 && (console.log('current', voice));
            e.tag === 'out4' && (this.voices = {...this.voices, [voice]: status})
            e.tag === 'out4' && voice === 8 && this.calculateNextVoice()
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

    calculateNextVoice() {
        if(!this.nextVoice) return (this.nextVoice = 1)
        
        const currentIndex = this.currentVoice - 1
        const availableVoices = Object.entries(this.voices)
            .reduce((array, [key, value]) => {
                return value === 1 ? [...array, +key - 1] : array
            }, [])
            
        // if next index is available, use it
        if(availableVoices.includes(currentIndex + 1)) {
            this.nextVoice = currentIndex + 2
        } else {
            // otherwise use the first available voice after the current voice, wrapping around if necessary
            const nextIndex = availableVoices.find(index => index > currentIndex)
            this.nextVoice = nextIndex ? nextIndex + 1 : availableVoices[0] + 1
        }
        console.log('next', this.nextVoice)
    }

    setParams(params) {
        const settable = this.#settable()
        Object.entries(params).forEach(([key, value]) => {
            settable[key] && (settable[key](value))
        });
    }

    setDeviceParam(name, value) {  
        doAtTime(() => this.device.parametersById.get(name).value = value, (this.time/1000) - 1)
    }

    play(params = {}, time) {
        this.time = time * 1000
        this.getVoiceData()
        this.setParams(params)
        
        let noteOnEvent = new MIDIEvent(this.time, 0, [144, this.n, 66 * this.amp]);
        let noteOffEvent = new MIDIEvent(this.time + this.duration, 0, [128, this.n, 0]);

        this.device.scheduleEvent(noteOnEvent);
        this.device.scheduleEvent(noteOffEvent);
    }

    cut(time) {

    }

    set n(value) { this.n(value) }
    set dur(value) { this.duration = value * 1000 }
    set amp(value) { this.amp = value }
    set vol(value) { this.gain.gain.rampTo(value, 0.1, this.time/1000) }
    set osc(type) { this.setDeviceParam('osc', this.oscTypes.indexOf(type) || 0) }

    set a(value) { this.setDeviceParam('a', value) }
    set d(value) { this.setDeviceParam('d', value) }
    set s(value) { this.setDeviceParam('s', value) }
    set r(value) { this.setDeviceParam('r', value) }

    set moda(value) { this.setDeviceParam('moda', value) }
    set modd(value) { this.setDeviceParam('modd', value) }
    set mods(value) { this.setDeviceParam('mods', value) }
    set modr(value) { this.setDeviceParam('modr', value) }

    set res(value) { this.setDeviceParam('res', value) }
}

export default BaseSynth