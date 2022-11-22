import * as Tone from 'tone'
import { context as toneContext, Panner, Gain } from 'tone';
import { mtf, getDisposable, getClassSetters, getClassMethods, isMutableKey, getSchedulable } from '../utils/core'
import { doAtTime, formatCurve } from "../utils/tone";
import { createDevice, MIDIEvent, TimeNow, MessageEvent } from '@rnbo/js'

// current problem - mutable params and lag
// how to do n in the patch

let context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;

// gain node doesn't work if there isn't a tone node connected to it
// so we create a dummy node to connect to
// hardly ideal, but it works
const dummy = new Tone.Oscillator({volume: -Infinity, frequency: 0, type: 'sine1'}).start();

class BaseSynth {
    self = this.constructor
    defaults = {n: 60, dur: 1, amp: 1}
    params = {}
    device = null
    // todo - get this dynamically from the patcher
    voices = [0,0,0,0,0,0,0,0]
    oscTypes = ['sine', 'saw', 'tri', 'pulse', 'noise']
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

    mutateParam(name, value, time, lag = 0.1) {
        this.device.parametersById.get('lag').value = lag 
        doAtTime(() => this.device.parametersById.get(name).value = value, time)
    }

    play(params = {}, time = Tone.now()) {
        this.time = time * 1000
        this.params = {...this.defaults, ...params}
        
        this.getVoiceData()
        
        const {n, dur, amp} = this.params

        let noteOnEvent = new MIDIEvent(this.time, 0, [144, n, 66 * amp]);
        let noteOffEvent = new MIDIEvent(this.time + (dur * 1000), 0, [128, n, 0]);
        
        if(this.voices.every(v => v > 0)) return // if all voices are busy, ignore
        
        this.device.scheduleEvent(noteOnEvent);
        this.device.scheduleEvent(noteOffEvent)
    }

    cut(time) {
        const message = new MessageEvent(time * 989, "cut", [ 1 ]);
        this.device.scheduleEvent(message);
    }

    
    mutate(params = {}, time, lag) {
        const props = this.mutable
        Object.entries(params).forEach(([key, value]) => {
            props[key] && props[key](value, time, lag)
        })
    }

    set vol(value) { this.setInactiveDeviceParams('vol', value) }
    set osc(type) { this.setInactiveDeviceParams('osc', this.oscTypes.indexOf(type) || 0) }
    set res(value) { this.setInactiveDeviceParams('res', value) }

    set a(value) { this.setInactiveDeviceParams('a', value * 1000) }
    set d(value) { this.setInactiveDeviceParams('d', value * 1000) }
    set s(value) { this.setInactiveDeviceParams('s', value * 1000) }
    set r(value) { this.setInactiveDeviceParams('r', value * 1000) }

    set moda(value) { this.setInactiveDeviceParams('moda', value * 1000) }
    set modd(value) { this.setInactiveDeviceParams('modd', value * 1000) }
    set mods(value) { this.setInactiveDeviceParams('mods', value * 1000) }
    set modr(value) { this.setInactiveDeviceParams('modr', value * 1000) }

    _n(value, time, lag = 0.1) { this.mutateParam('n', value, time, lag)}
    // TODO: do this programmatically
    _n = this._n.bind(this)

    _vol(value, time, lag = 0.1) { this.mutateParam('vol', value, time, lag)}
    _vol = this._vol.bind(this)

    _res(value, time, lag = 0.1) { this.mutateParam('res', value, time, lag)}
    _res = this._res.bind(this)


}

export default BaseSynth