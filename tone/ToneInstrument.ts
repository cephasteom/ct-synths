import { AMSynth, FMSynth, Gain, gainToDb, MonoSynth, mtof, NoiseSynth, Panner, PluckSynth, PolySynth, Synth } from "tone";

type ChildSynth = typeof Synth | typeof MonoSynth | typeof PluckSynth | typeof FMSynth | typeof AMSynth | typeof NoiseSynth;

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
        osc: 0,
    }

    constructor(synth: ChildSynth) {
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

    /** @hidden */
    play(params: Record<string, any> = {}, time: number): void {
        if(!this.ready) return

        params = {...this.defaults, ...params }
        delete params.cut
        
        // call method on synth for each param, if it exists
        Object.entries({...this.defaults, ...params })
            .forEach(([key, value]) => {
                // @ts-ignore
                if(this[key]) this[key](value, time)
            })

        this.synth.triggerAttackRelease(mtof(params.n), params.dur / 1000, time + (params.nudge / 1000), params.amp);
    }

    /** @hidden */
    mutate(params: Record<string, any> = {}, time: number, lag: number = 100): void {
        if(!this.ready) return
        Object.entries(params)
            .forEach(([key, value]) => {
                // @ts-ignore
                if(this[`_${key}`]) this[`_${key}`](value, time, lag)
            })
    }

    /**
     * Cuts all voices at the given time
     * @param time 
     * @returns 
     */
    cut(time: number): void {
        if(!this.ready) return
        this.synth.releaseAll(time);
    }

    /** @hidden */
    setParam(key: string, value: any, time: number): void {
        // @ts-ignore
        this.synth._availableVoices.forEach(v => v[key].rampTo(value, 0.01, time));
    }

    /** @hidden */
    mutateParam(key: string, value: any, time: number, lag: number = 100): void {
        // @ts-ignore
        this.synth._activeVoices
            .filter((v: any) => !v.released) // only modify voices that are currently active
            .forEach((v: any) => v.voice[key].rampTo(value, lag / 1000, time));
    }

    /**
     * Sets the volume of the synth
     * @param value The volume value (0 to 1)
     * @param time The time to set the volume
     */
    vol(value: number = 1, time: number): void { 
        this.setParam('volume', gainToDb(value), time)
    }

    /**
     * Mutates the volume of the synth
     * @param value The volume value (0 to 1)
     * @param time The time to set the volume
     * @param lag The lag time for the volume change
     */
    _vol(value: number = 1, time: number, lag: number = 100): void { 
        this.mutateParam('volume', gainToDb(value), time, lag)
    }

    /**
     * Sets the panning of the synth
     * @param value The panning value (0 to 1)
     * @param time The time to set the panning
     */
    pan(value: number = 0.5, time: number): void { this.panner.pan.rampTo(value * 2 - 1, 0.01, time) }

    /**
     * Mutates the panning of the synth
     * @param value The panning value (0 to 1)
     * @param time The time to set the panning
     * @param lag The lag time for the panning change
     */
    _pan(value: number = 0.5, time: number, lag: number = 100): void { this.panner.pan.rampTo(value * 2 - 1, lag / 1000, time) }

    /**
     * Mutate the note of the synth
     * @param value Midi note number
     * @param time The time to set the note
     * @param lag The lag time for the note change
     */
    _n(value: number = 60, time: number, lag: number = 100): void { 
        // @ts-ignore
        this.mutateParam('frequency', mtof(value), time, lag)
    }

    /**
     * Sets the detune of the synth
     * @param value The detune value in cents
     * @param time The time to set the detune
     */
    detune(value: number = 0, time: number): void { this.setParam('detune', value, time) }

    /**
     * Mutates the detune of the synth
     * @param value The detune value in cents
     * @param time The time to set the detune
     * @param lag The lag time for the detune change
     */
    _detune(value: number = 0, time: number, lag: number = 100): void { this.mutateParam('detune', value, time, lag) }

    /**
     * Set the attack time of the synth envelope
     * @param value Attack time in milliseconds
     */
    // @ts-ignore
    a(value: number = 1000): void { this.synth._voices.forEach(v => v.envelope.attack = value / 1000);}

    /**
     * Set the decay time of the synth envelope
     * @param value Decay time in milliseconds
     */
    // @ts-ignore
    d(value: number = 100): void { this.synth._voices.forEach(v => v.envelope.decay = value / 1000); }

    /** Set the sustain level of the synth envelope
     * @param value Sustain level (0 to 1)
     */
    // @ts-ignore
    s(value: number = 0.5): void { this.synth._voices.forEach(v => v.envelope.sustain = value); }

    /** Set the release time of the synth envelope
     * @param value Release time in milliseconds
     */
    // @ts-ignore
    r(value: number = 500): void { this.synth._voices.forEach(v => v.envelope.release = value / 1000); }

    /** Set the oscillator type of the synth
     * @param value Oscillator type index (0: sine, 1: sawtooth, 2: triangle, 3: square)
     */
    osc(value: number = 0, time: number): void {
        const types = ['sine', 'sawtooth', 'triangle', 'square'];
        // @ts-ignore
        this.synth._availableVoices.forEach(v => v.oscillator.type = types[value % types.length] || 'sine');
    }
}

export default ToneInstrument;