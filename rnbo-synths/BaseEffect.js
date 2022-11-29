import { context as toneContext, Oscillator, Gain } from 'tone';
import { getClassSetters, getClassMethods, isMutableKey } from '../utils/core'
import { doAtTime } from "../utils/tone";
import { createDevice, MIDIEvent, TimeNow, MessageEvent } from '@rnbo/js'

const context = toneContext.rawContext._nativeAudioContext || toneContext.rawContext._context;
const isSettableKey = string => string.charAt(0) !== '_' && string !== 'constructor'
const isMutableKey = string => string.charAt(0) === '_'

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
        this.device.node.connect(this.gain._gainNode._nativeAudioNode);
    }  

    bindMutableProps() {
        const props = this.mutable()
        Object.keys(props).forEach((key) => this[key] = this[key].bind(this))
    }

    connect(node) { 
        this.output.disconnect();
        this.output.connect(node)
    }

    setDeviceParam(name, value) {
        this.device.parametersById.get(name).value = value
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

    set lag(value) { this.setDeviceParam('lag', value) }
}

export default BaseEffect