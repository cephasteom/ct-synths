import { FMSynth, Gain, gainToDb, Mono, MonoSynth, mtof, Panner, PluckSynth, PolySynth, Synth } from "tone";

class ToneInstrument {
    /** @hidden */
    private synth: PolySynth;

    /** @hidden */
    private panner: Panner;

    /** @hidden */
    private ready = false

    defaults: Record<string, any> = {
        n: 60, amp: 0.5, dur: 500, nudge: 0, pan: 0.5, vol: 0.5,
        a: 10, d: 100, s: 0.5, r: 500,
    }

    constructor(synth: typeof Synth | typeof MonoSynth | typeof PluckSynth | typeof FMSynth) {
        this.synth = new PolySynth(synth as any, {
            envelope: {
                attack: this.defaults.a / 1000,
                decay: this.defaults.d / 1000,
                sustain: this.defaults.s,
                release: this.defaults.r / 1000,
            }
        });
        this.panner = new Panner(0);
        this.synth.connect(this.panner);
    }

    /** @hidden */
    connect(node: Gain) { this.panner.connect(node) }

    /** @hidden */
    disconnect() { this.synth.disconnect() }

    /** @hidden */
    dispose() { this.synth.dispose() }

    /**
     * Plays a very short, quiet note on all voices to initialize them
     * @hidden
     */
    init() {
        const now = this.synth.context.currentTime;
        // warm up 8 voices
        const testNotes = ["C4", "E4", "G4", "B4", "D5", "F5", "A5", "C6"];
        // amp=0 prevents audible sound
        testNotes.forEach(n => this.synth.triggerAttackRelease(n, 0.01, now, 0)); 

        // set defaults on each voice
        Object.entries(this.defaults).forEach(([key, value]) => {
            // @ts-ignore
            this.synth._voices.forEach(v => v[key] !== undefined && (v[key] = value))
        })

        this.ready = true
    }

    play(params: Record<string, any> = {}, time: number): void {
        if(!this.ready) return

        params = {...this.defaults, ...params }
        
        // call method on synth for each param, if it exists
        Object.entries({...this.defaults, ...params })
            .forEach(([key, value]) => {
                // @ts-ignore
                if(this[key]) this[key](value, time)
            })

        this.synth.triggerAttackRelease(mtof(params.n), params.dur / 1000, time + (params.nudge / 1000), params.amp);
    }

    mutate(params: Record<string, any> = {}, time: number, lag: number = 100): void {
        if(!this.ready) return
        Object.entries(params)
            .forEach(([key, value]) => {
                // @ts-ignore
                if(this[`_${key}`]) this[`_${key}`](value, time, lag)
            })
    }

    setParam(key: string, value: any, time: number): void {
        // @ts-ignore
        this.synth._voices.forEach(v => v[key].rampTo(value, 0.01, time));
    }

    mutateParam(key: string, value: any, time: number, lag: number = 100): void {
        // @ts-ignore
        this.synth._activeVoices
            .filter((v: any) => !v.released) // only modify voices that are currently active
            .forEach((v: any) => v.voice[key].rampTo(value, lag / 1000, time));
    }

    vol(value: number = 1, time: number): void { this.synth.volume.rampTo(gainToDb(value), 0.01, time) }
    _vol(value: number = 1, time: number, lag: number = 100): void { this.synth.volume.rampTo(gainToDb(value), lag / 1000, time) }

    pan(value: number = 0.5, time: number): void { this.panner.pan.rampTo(value * 2 - 1, 0.01, time) }
    _pan(value: number = 0.5, time: number, lag: number = 100): void { this.panner.pan.rampTo(value * 2 - 1, lag / 1000, time) }

    _n(value: number = 60, time: number, lag: number = 100): void { 
        // @ts-ignore
        this.mutateParam('frequency', mtof(value), time, lag)
    }

    detune(value: number = 0, time: number): void { this.setParam('detune', value, time) }
    _detune(value: number = 0, time: number, lag: number = 100): void { this.mutateParam('detune', value, time, lag) }

    // @ts-ignore
    a(value: number = 1000): void { this.synth._voices.forEach(v => v.envelope.attack = value / 1000);}

    // @ts-ignore
    d(value: number = 100): void { this.synth._voices.forEach(v => v.envelope.decay = value / 1000); }

    // @ts-ignore
    s(value: number = 0.5): void { this.synth._voices.forEach(v => v.envelope.sustain = value); }

    // @ts-ignore
    r(value: number = 500): void { this.synth._voices.forEach(v => v.envelope.release = value / 1000); }
}

export default ToneInstrument;