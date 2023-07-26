import BaseSynth from "./BaseSynth";
import { min } from "./utils";
import type { Dictionary } from "../types";

/**
 * Granular Synth
 * @example
 * s0.p.set({inst: 'granular'})
 */ 
class Granular extends BaseSynth {
    /** @hidden */
    json = new URL('./json/granular.export.json', import.meta.url)

    /** @hidden */
    defaults: Dictionary = { 
        ...this.defaults, 
        i: 0, 
        snap: 0, 
        rate: 1, 
        a: 0, 
        d: 10, 
        s: 1, 
        r: 100, 
        bpm: 60, 
        grainrate: 16, 
        grainsize: 0.125, 
        grainslope: 0.01, 
        grainpan: 0.2, 
        direction: 1,
        begin: 0,
        end: 1,
    
    }

    /** @hidden */
    banks: Dictionary = {}

    /** @hidden */
    currentBank = ''

    /** @hidden */
    loadedBuffers = []

    /** @hidden */
    maxI = 0

    /** @hidden */
    constructor(urls?: string[]) {
        super()
        this.init(urls)

        this.bank = this.bank.bind(this)
        this.i = this.i.bind(this)
        this.snap = this.snap.bind(this)
        this.rate = this.rate.bind(this)
        this._rate = this._rate.bind(this)
        this.grainrate = this.grainrate.bind(this)
        this._grainrate = this._grainrate.bind(this)
        this.grainsize = this.grainsize.bind(this)
        this._grainsize = this._grainsize.bind(this)
        this.grainslope = this.grainslope.bind(this)
        this._grainslope = this._grainslope.bind(this)
        this.grainpan = this.grainpan.bind(this)
        this._grainpan = this._grainpan.bind(this)
        this.direction = this.direction.bind(this)
        this._direction = this._direction.bind(this)
        this.begin = this.begin.bind(this)
        this.end = this.end.bind(this)
        this.loop = this.loop.bind(this)
        this.bpm = this.bpm.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /** @hidden */
    async init(urls?: string[]) {
        await this.initDevice()
        urls && this.load(urls)
    } 
    
    /** @hidden */
    async load(urls: string[]) {
        this.ready = false
        const dependencies: {id: string, file: string}[] = urls.map((file, i) => ({id: `b${i}`, file}))
        this.maxI = dependencies.length <= 32 ? dependencies.length : 32

        // @ts-ignore
        const results = await this.device.loadDataBufferDependencies(dependencies.splice(0, 32));
        
        results.forEach(result => {
            result.type === "success"
                ? console.log(`Successfully loaded buffer with id ${result.id}`)
                : console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
        });
        
        this.i(this.state.i || 0, 0)
        this.ready = true
    }

    /**
     * Load a bank of samples
     * @param name - name of the bank
     */ 
    async bank(name: string) {
        if(name === this.currentBank || !this.banks[name]) return
        this.currentBank = name 
        // clear buffers to free up resources
        Array.from({length: 32}, (_, i) => this.device.releaseDataBuffer(`b${i}`))
        this.loadedBuffers = []
        this.maxI = min(this.banks[name].length, 32)
    }

    /**
     * Index of sample in bank
     * @param value - index of sample in bank
     */ 
    async i(value: number, time: number) {
        if(!this.currentBank) return
        const index = value % this.maxI
        
        // @ts-ignore
        if(!this.loadedBuffers.includes(index)) {
            const fileResponse = await fetch(this.banks[this.currentBank][index]);
	        fileResponse.arrayBuffer()
                .then(arrayBuf => this.context.decodeAudioData(arrayBuf))
                .then(audioBuf => {
                    this.device.setDataBuffer(`b${index}`, audioBuf)
                    // @ts-ignore
                    this.loadedBuffers.push(index)
                })
        } 
        this.messageDevice('i', index, time)
    }

    /**
     * Snap sample length to divisions of a beat
     * @param value - number of divisions to snap to, 0 means don't snap
     */
    snap(value: number = 0, time: number): void { this.messageDevice('snap', value, time) } 

    /**
     * Playback rate
     * @param value - playback rate, > 0 is forward, < 0 is reverse. 1 is normal speed, 2 is double speed, etc.
     */
    rate(value: number = 1, time: number): void { this.messageDevice('rate', value, time) }
    
    /**
     * Mutate playback rate
     * @param value - playback rate, > 0 is forward, < 0 is reverse. 1 is normal speed, 2 is double speed, etc.
     */
    _rate(value: number = 1, time: number): void { this.messageDevice('_rate', value, time) } 

    /**
     * Grain rate
     * @param value - grain rate, number of grains per cycle or canvas
     */
    grainrate(value: number = 16, time: number): void { this.messageDevice('grainrate', value, time) }
    
    /**
     * Mutate grain rate
     * @param value - grain rate, number of grains per cycle or canvas
     */
    _grainrate(value: number = 16, time: number): void { this.messageDevice('_grainrate', value, time) } 

    /**
     * Grain size
     * @param value - grain size, length of grain in beats
     */
    grainsize(value: number = 0.125, time: number): void { this.messageDevice('grainsize', value, time) }

    /**
     * Mutate grain size
     * @param value - grain size, length of grain in beats
     */
    _grainsize(value: number = 0.125, time: number): void { this.messageDevice('_grainsize', value, time) }

    /**
     * Grain slope
     * @param value - grain slope, attack of grain, 0 - 1
     */
    grainslope(value: number = 0.01, time: number): void { this.messageDevice('grainslope', value, time) }
    
    /**
     * Mutate grain slope
     * @param value - grain slope, attack of grain, 0 - 1
     */
    _grainslope(value: number = 0.01, time: number): void { this.messageDevice('_grainslope', value, time) }
    
    /**
     * Grain pan
     * @param value - grain pan, amount of randomess in grain panning, 0 - 1
     */
    grainpan(value: number = 0.2, time: number): void { this.messageDevice('grainpan', value, time) }
    
    /**
     * Mutate grain pan
     * @param value - grain pan, amount of randomess in grain panning, 0 - 1
     */
    _grainpan(value: number = 0.2, time: number): void { this.messageDevice('_grainpan', value, time) }

    /**
     * Playback direction
     * @param value - playback direction, 1 = forward, -1 = backward
     */
    direction(value: number = 1, time: number): void { this.messageDevice('direction', value, time) }
    
    /**
     * Mutate playback direction
     * @param value - playback direction, 1 = forward, -1 = backward
     */
    _direction(value: number = 1, time: number): void { this.messageDevice('_direction', value, time) }
    
    /**
     * Playback position start
     * @param value - playback position start, 0 is the beginning of the sample, 1 is the end
     */
    begin(value: number = 0, time: number): void { this.messageDevice('begin', value, time) }
    
    /**
     * Playback position end
     * @param value - playback position end, 0 is the beginning of the sample, 1 is the end
     */
    end(value: number = 1, time: number): void { this.messageDevice('end', value, time) }

    /**
     * Loop, whether to loop when playback reaches the end of the sample
     * @param value - loop, 0 is off, 1 is on
     */
    loop(value: number = 0, time: number): void { this.messageDevice('loop', value, time) }
    
    /**
     * Bpm, beats per minute. Zen passes this value for you.
     * Used to calculate grainsize and grainrate in beats
     * @param value - bpm, beats per minute
     * @hidden
     */
    bpm(value: number = 120, time: number): void { this.messageDevice('bpm', value, time) } 

}

export default Granular