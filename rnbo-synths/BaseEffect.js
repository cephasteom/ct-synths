import { context as toneContext, Oscillator, Gain } from 'tone';
import { getClassSetters, getClassMethods, isMutableKey, isSettableKey } from '../utils/core'
import { doAtTime } from "../utils/tone";
import { createDevice, MIDIEvent, TimeNow, MessageEvent } from '@rnbo/js'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;

// current issue:
// all mutable params working, but after voice 16 they stop working

// gain node doesn't work if there isn't a tone node connected to it
// so we create a dummy node to connect to
// hardly ideal, but it works
const dummy = new Oscillator({volume: -Infinity, frequency: 0, type: 'sine1'}).start();

class BaseEffect {
    self = this.constructor
    defaults = {}
    device = null
    automated = []
    
    constructor() {
        this.output = new Gain(1);
        this.input = new Gain(1);
        dummy.connect(this.output);
    }

    async initDevice()  {
        const rawPatcher = await fetch(this.json);
        const patcher = await rawPatcher.json();
        
        this.device = await createDevice({ context, patcher });
        this.device.node.connect(this.output._gainNode._nativeAudioNode);
        this.input._gainNode._nativeAudioNode.connect(this.device.node);
    }  

    bindMutableProps() {
        const props = this.mutable
        Object.keys(props).forEach((key) => this[key] = this[key].bind(this))
    }

    connect(node) { 
        this.output.disconnect();
        this.output.connect(node)
    }

    setParam(name, value, time) {
        doAtTime(() => {
            this.device.parametersById.get('lag').value = 0.01
            this.device.parametersById.get(name).value = value
        }, time)
    }

    mutateParam(name, value, time, lag = 0.1) {
        doAtTime(() => {
            this.device.parametersById.get('lag').value = lag
            this.device.parametersById.get(name).value = value
        }, time)
    }

    get settable() { 
        return getClassMethods(this.self)
            .filter(isSettableKey)
            .reduce((obj, key) => ({ ...obj, [key]: this[key] }), {})
    }

    get mutable() {
        return getClassMethods(this.self)
            .filter(isMutableKey)
            .reduce((obj, key) => ({ ...obj, [key]: this[key] }), {})
    }

    get keys() {
        return Object.keys(this.settable)
    }
}

export default BaseEffect