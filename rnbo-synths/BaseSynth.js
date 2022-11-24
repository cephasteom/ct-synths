import { context as toneContext, Oscillator, Gain } from 'tone';
import { getClassSetters, getClassMethods, isMutableKey } from '../utils/core'
import { doAtTime } from "../utils/tone";
import { createDevice, MIDIEvent, TimeNow, MessageEvent } from '@rnbo/js'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;

// gain node doesn't work if there isn't a tone node connected to it
// so we create a dummy node to connect to
// hardly ideal, but it works
const dummy = new Oscillator({volume: -Infinity, frequency: 0, type: 'sine1'}).start();
class BaseSynth {
    self = this.constructor
    defaults = {n: 60, dur: 1, amp: 1, vol: 1}
    device = null
    voices = [0,0,0,0, 0,0,0,0, 0,0,0,0]
    events = []
    
    constructor() {
        this.gain = new Gain(1).toDestination();
        dummy.connect(this.gain);
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
            
            if(index === this.voices.length - 1) { 
                this.events.forEach(cb => cb()) // if last voice, schedule events
                this.events = [] // clear events
                console.log(this.voices)
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
        
        // messages the synth and sets params on reply
        this.getVoiceData()

        // create event callback to be triggered when we get status message back from synth
        // ensures we have fresh data before setting params
        this.events = [
            ...this.events,
            () => {
                // if all voices are busy, ignore
                // if(this.voices.every(v => v > 0)) return 
                
                this.setParams(ps)
        
                const {n, dur, amp} = ps
                let noteOnEvent = new MIDIEvent(time * 1000, 0, [144, n, 66 * amp]);
                let noteOffEvent = new MIDIEvent((time + dur) * 1000, 0, [128, n, 0]);
                
                // reset lag
                this.device.parametersById.get('lag').value = 10;
                this.device.scheduleEvent(noteOnEvent);
                this.device.scheduleEvent(noteOffEvent)
            }
        ]
        
    }

    setParams(params) {
        const settable = this.settable()
        Object.entries(params).forEach(([key, value]) => {
            settable[key] && (settable[key](value))
        });
    }

    setInactiveDeviceParams(name, value) {  
        this.voices.forEach((voice, index) => {
            // if voice is active, ignore
            if(voice > 0) return 
            // target only params of inactive voices
            this.device.parametersById.get(`poly/${index + 1}/${name}`).value = value
        })
    }    

    /*
     * Settable params
    */
    set vol(value) { this.setInactiveDeviceParams('vol', value) }

    set a(value) { this.setInactiveDeviceParams('a', value * 1000) }
    set d(value) { this.setInactiveDeviceParams('d', value * 1000) }
    set s(value) { this.setInactiveDeviceParams('s', value * 1000) }
    set r(value) { this.setInactiveDeviceParams('r', value * 1000) }

    set moda(value) { this.setInactiveDeviceParams('moda', value * 1000) }
    set modd(value) { this.setInactiveDeviceParams('modd', value * 1000) }
    set mods(value) { this.setInactiveDeviceParams('mods', value * 1000) }
    set modr(value) { this.setInactiveDeviceParams('modr', value * 1000) }

    mutate(params = {}, time, lag) {
        const props = this.mutable()
        Object.entries(params).forEach(([key, value]) => {
            props[key] && props[key](value, time, lag)
        })
    }

    mutateParam(name, value, time, lag = 0.1) {
        doAtTime(() => {
            this.device.parametersById.get('lag').value = lag * 1000;
            this.device.parametersById.get(name).value = value
        }, time)
    }

    /*
     * Mutable params
    */
    _n(value, time, lag = 0.1) { this.mutateParam('n', value, time, lag)}
    _vol(value, time, lag = 0.1) { this.mutateParam('vol', value, time, lag)}

    cut(time) {
        const message = new MessageEvent((time * 1000) - 10, "cut", [ 1 ]);
        this.device.scheduleEvent(message);
    }
}

export default BaseSynth