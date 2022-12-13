import { immediate } from "tone"

import FMSynth from "./tone-synths/FMSynth";
// import Sampler from "./tone-synths/Sampler";
import Granular from "./tone-synths/Granular";
import DrumSynth from "./tone-synths/DrumSynth";
import KarplusSynth from "./tone-synths/KarplusSynth";
import DuoSynth from "./tone-synths/DuoSynth";
import MonoSynth from "./tone-synths/MonoSynth";
import MetalSynth from "./tone-synths/MetalSynth";
import FlexSynth from "./tone-synths/FlexSynth";
import Synth from "./rnbo/Synth";
import Sampler from "./rnbo/Sampler";
import Reverb from "./rnbo/Reverb";

export const CtFMSynth = FMSynth
// export const CtSampler = Sampler
export const CtGranular = Granular
export const CtDrumSynth = DrumSynth
export const CtKarplusSynth = KarplusSynth
export const CtDuoSynth = DuoSynth
export const CtMonoSynth = MonoSynth
export const CtMetalSynth = MetalSynth
export const CtFlexSynth = FlexSynth
export const CtSynth = Synth
export const CtSampler = Sampler
export const CtReverb = Reverb

const synthMap = {
    drum: DrumSynth, 
    duo: DuoSynth,
    flex: FlexSynth,
    fm: FMSynth,
    granular: Granular,
    metal: MetalSynth,
    mono: MonoSynth,
    // needs to worked differently with rnbo synths
    // sampler: Sampler,
    // synth: FilterSynth
}


const paramsMap = Object.keys(synthMap).reduce((obj, type) => {
    let synth = synthMap[type] && new synthMap[type]()
    const params = synth && [
        ...Object.keys(synth.settable),
        ...Object.keys(synth.mutable)
    ]
    synth && synth.dispose && synth.dispose(immediate())
    synth = null

    return {
        ...obj,
        [type]: params
    }
}, {})

export const synthParams = (type) => paramsMap[type] || null