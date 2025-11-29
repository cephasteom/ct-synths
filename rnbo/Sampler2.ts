import BaseSamplingDevice from "./BaseSamplingDevice";

const patcher = fetch(new URL('./json/sampler2.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())

// the same as Sampler.ts except we supply snap as a target time value, removing the need for bpm calculations

/**
 * Sampler
 * @example
 * s0.set({inst: 'sampler'})
 */ 
class Sampler extends BaseSamplingDevice {

    /** @hidden */
    constructor() {
        super()
        this.defaults = { 
            ...this.defaults, 
            i: 0, snap: 0, rate: 1, a: 5, d: 10, s: 1, r: 100, begin: 0, end: 1, loop: 0, oneshot: 0, loopsize: 1
        }
        this.patcher = patcher
        this.initDevice()

        this.snap = this.snap.bind(this)
        this.rate = this.rate.bind(this)
        this._rate = this._rate.bind(this)
        this.begin = this.begin.bind(this)
        this.end = this.end.bind(this)
        this.loop = this.loop.bind(this)
        this.loopsize = this.loopsize.bind(this)
        this._loopsize = this._loopsize.bind(this)
        this.oneshot = this.oneshot.bind(this)

        this.params = Object.getOwnPropertyNames(this)
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
}

export default Sampler