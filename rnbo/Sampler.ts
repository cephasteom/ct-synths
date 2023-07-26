import BaseSynth from "./BaseSynth";
import { min } from "./utils";
import type { Dictionary } from "../types";

/**
 * Sampler
 * @example
 * s0.p.set({inst: 'sampler'})
 */ 
class Sampler extends BaseSynth {
    /** @hidden */
    json = new URL('./json/sampler.export.json', import.meta.url)

    /** @hidden */
    defaults: Dictionary = { ...this.defaults, 
        i: 0, snap: 0, rate: 1, a: 5, d: 10, s: 1, r: 100, bpm: 120, begin: 0, end: 1, loop: 0, oneshot: 0, loopsize: 1
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
        this.begin = this.begin.bind(this)
        this.end = this.end.bind(this)
        this.loop = this.loop.bind(this)
        this.loopsize = this.loopsize.bind(this)
        this._loopsize = this._loopsize.bind(this)
        this.oneshot = this.oneshot.bind(this)
        this.bpm = this.bpm.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /** @hidden */
    async init(urls?: string[]) {
        await this.initDevice()
        urls && this.load(urls)
    } 
    
    /*
        *   Load a set of samples into the sampler
        *   @param {Array} urls - an array of urls
        *   @example
        *   [
        *       "https://tonejs.github.io/audio/505/kick.wav",
        *       "https://tonejs.github.io/audio/505/snare.wav",
        *       "https://tonejs.github.io/audio/505/hh.wav",
        *   ];
        * 
    */
    /** @hidden */
    async load(urls: string[]) {
        this.ready = false
        const dependencies = urls.map((file, i) => ({id: `b${i}`, file}))
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
     * Loop, whether to loop when playback reaches the end of the sample or loopsize (see loopsize)
     * @param value - loop, 0 is off, 1 is on
     */
    loop(value: number = 0, time: number): void { this.messageDevice('loop', value, time) }

    /**
     * Loop size, the size of the loop
     * @param value - loop size, 0 - 1
     */ 
    loopsize(value: number = 1, time: number): void { this.messageDevice('loopsize', value, time) }

    /**
     * Mutate loop size, the size of the loop
     * @param value - loop size, 0 - 1
     */
    _loopsize(value: number = 1, time: number): void { this.messageDevice('_loopsize', value, time) }
    
    /**
     * Oneshot, always play the entire sample or not
     * @param value - oneshot, 0 is off, 1 is on
     */
    oneshot(value: number = 0, time: number): void { this.messageDevice('oneshot', value, time) } 
    
    /**
     * Bpm, beats per minute. Zen passes this value for you.
     * Used to calculate grainsize and grainrate in beats
     * @param value - bpm, beats per minute
     * @hidden
     */
    bpm(value: number = 120, time: number): void { this.messageDevice('bpm', value, time) } 


}

export default Sampler