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
    // todo - get this dynamically from the patcher
    voices = [1,1,1,1,1,1,1,1]
    activeVoices = []
    currentVoice = null
    nextVoice = 0
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
            const index = voice - 1
            if(e.tag === 'out3') {
                status === 0 && (this.currentVoice = index)
                this.activeVoices = status === 1 
                    ? this.activeVoices.filter(v => v !== index)
                    : [...this.activeVoices, index]
            }
            if(e.tag === 'out4') {
                this.voices[index] = status
                voice === 8 && this.calculateNextVoice()
            }
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

        const nextVoice = this.voices.findIndex((voice, i) => {
            return voice === 1 // is available
            && (this.currentVoice === 7 ? i < this.currentVoice : i > this.currentVoice) // is after current voice
        })

        this.nextVoice = nextVoice < 0 ? this.activeVoices[0] : nextVoice
        console.log(this.currentVoice, this.nextVoice)
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