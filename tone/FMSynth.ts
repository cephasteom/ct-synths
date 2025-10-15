import ToneInstrument from "./ToneInstrument";
import { FMSynth as ToneFMSynth } from "tone";

class FMSynth extends ToneInstrument {
    constructor() {
        super(ToneFMSynth)
        this.defaults = {
            ...this.defaults,
            harm: 1,
            modi: 1,
        }
        this.init()

        

    }

    harm(value: number = 1, time: number): void { this.setParam('harmonicity', value, time) }
    _harm(value: number = 1, time: number, lag: number = 100): void { this.mutateParam('harmonicity', value, time, lag) }

    modi(value: number = 100, time: number): void { this.setParam('modulationIndex', value, time) }
    _modi(value: number = 100, time: number, lag: number = 100): void { this.mutateParam('modulationIndex', value, time, lag) } 
}

export default FMSynth;