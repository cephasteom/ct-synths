import { immediate } from "tone"

import Synth from "./rnbo/Synth";
import Sampler from "./rnbo/Sampler";
import Granulator from "./rnbo/Granulator";
import Additive from "./rnbo/Additive";

export const CtSynth = Synth
export const CtSampler = Sampler
export const CtGranulator = Granulator
export const CtAdditive = Additive

const synthMap = {
    // drum: DrumSynth, 
    // duo: DuoSynth,
    // flex: FlexSynth,
    // fm: FMSynth,
    // granular: Granular,
    // metal: MetalSynth,
    // mono: MonoSynth,
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