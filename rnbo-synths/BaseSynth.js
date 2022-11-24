import { context as toneContext, Oscillator, Gain } from 'tone';
import { getClassSetters, getClassMethods, isMutableKey } from '../utils/core'
import { doAtTime } from "../utils/tone";
import { createDevice, MIDIEvent, TimeNow, MessageEvent } from '@rnbo/js'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;

// current issue:
// all mutable params working, but after voice 16 they stop working

// gain node doesn't work if there isn't a tone node connected to it
// so we create a dummy node to connect to
// hardly ideal, but it works
const dummy = new Oscillator({volume: -Infinity, frequency: 0, type: 'sine1'}).start();
class BaseSynth {
    self = this.constructor
    defaults = {n: 60, dur: 0.25, amp: 1, vol: 1, a: 0.01, d: 0.1, s: 0.5, r: 0.1, moda: 0.01, modd: 0.1, mods: 0.5, modr: 0.1, pan: 0}
    device = null
    voices = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
    events = []
    mutation = null
    
    constructor() {
        this.gain = new Gain(1);
        dummy.connect(this.gain);
    }

    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        this.device = await createDevice({ context, patcher });
        this.device.node.connect(this.gain._gainNode._nativeAudioNode);
        this.device.messageEvent.subscribe(e => {
            if(e.tag !== 'out3') return
            const [voice, n, status] = e.payload
            const index = voice - 1
            this.voices[index] = n; // update voice status
            
            // if last voice, schedule events and mutation
            if(voice === this.voices.length) { 
                this.events.forEach(cb => cb()) 
                this.mutation && this.mutation()
                this.events = []
                this.mutations = null
            }
        });
    }  

    bindMutableProps() {
        const props = this.mutable()
        Object.keys(props).forEach((key) => this[key] = this[key].bind(this))
    }

    connect(node) { 
        this.gain.disconnect();
        this.gain.connect(node)
    }

    settable() {
        return [
            ...getClassSetters(BaseSynth), 
            ...getClassSetters(this.self)
        ].reduce((obj, key) => ({
            ...obj,
            [key]: (value) => this[key] = value
        }), {})
    }

    mutable() {
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

    play(params = {}, time) {
        const ps = {...this.defaults, ...params}

        // cue event callback to be triggered
        this.events = [
            ...this.events,
            () => {
                this.setParams(ps)
        
                const {n, dur, amp} = ps
                let noteOnEvent = new MIDIEvent(time * 1000, 0, [144, n, 66 * amp]);
                let noteOffEvent = new MIDIEvent((time + dur) * 1000, 0, [128, n, 0]);
                
                // reset lag
                this.setDeviceParams('lag', 0.01)
                this.device.scheduleEvent(noteOnEvent);
                this.device.scheduleEvent(noteOffEvent)
            }
        ]

        // fetch fresh data from the synth, calls all cued events and mutations
        this.getVoiceData()
        
    }

    setParams(params) {
        const settable = this.settable()
        Object.entries(params).forEach(([key, value]) => {
            settable[key] && (settable[key](value))
        });
    }

    setDeviceParams(name, value, isActive = false) {
        this.voices.forEach((voice, index) => {
            if((!isActive && voice > 0) || (isActive && voice === 0)) return 
            this.device.parametersById.get(`poly/${index + 1}/${name}`).value = value
        })
    } 

    /*
     * Settable params
    */
    set vol(value) { this.setDeviceParams('vol', value * 0.5) }
    set pan(value) { this.setDeviceParams('pan', (value + 1)/2) }

    set a(value) { this.setDeviceParams('a', value * 1000) }
    set d(value) { this.setDeviceParams('d', value * 1000) }
    set s(value) { this.setDeviceParams('s', value * 1000) }
    set r(value) { this.setDeviceParams('r', value * 1000) }

    set moda(value) { this.setDeviceParams('moda', value * 1000) }
    set modd(value) { this.setDeviceParams('modd', value * 1000) }
    set mods(value) { this.setDeviceParams('mods', value * 1000) }
    set modr(value) { this.setDeviceParams('modr', value * 1000) }

    mutate(params = {}, time, lag) {
        const props = this.mutable()

        // cue up the mutation
        const mutation = () => {
            Object.entries(params).forEach(([key, value]) => {
                props[key] && props[key](value, lag)
            })
        }
        
        // fetch fresh voice data and trigger mutations
        doAtTime(() => {
            this.mutation = mutation
            this.getVoiceData()
        }, time)
    }

    mutateParam(name, value, lag = 0.1) {
        this.setDeviceParams('lag', lag * 1000, true)
        this.setDeviceParams(name, value, true)
    }

    /*
     * Mutable params
    */
    _n(value, lag = 0.1) { this.mutateParam('n', value, lag)}
    _vol(value, lag = 0.1) { this.mutateParam('vol', value * 0.5, lag)}
    _pan(value, lag = 0.1) { this.mutateParam('pan', (value + 1)/2, lag)}

    cut(time) {
        const message = new MessageEvent((time * 1000) - 10, "cut", [ 1 ]);
        this.device.scheduleEvent(message);
    }
}

export default BaseSynth