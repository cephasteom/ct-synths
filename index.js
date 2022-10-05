import { immediate } from "tone"

import FMSynth from "./FMSynth";
import Sampler from "./Sampler";
import Granular from "./Granular";
import DrumSynth from "./DrumSynth";
import KarplusSynth from "./KarplusSynth";
import DuoSynth from "./DuoSynth";
import MonoSynth from "./MonoSynth";
import MetalSynth from "./MetalSynth";
import FlexSynth from "./FlexSynth";

export const CtFMSynth = FMSynth
export const CtSampler = Sampler
export const CtGranular = Granular
export const CtDrumSynth = DrumSynth
export const CtKarplusSynth = KarplusSynth
export const CtDuoSynth = DuoSynth
export const CtMonoSynth = MonoSynth
export const CtMetalSynth = MetalSynth
export const CtFlexSynth = FlexSynth

const synthMap = {
    drum: DrumSynth, 
    duo: DuoSynth,
    flex: FlexSynth,
    fm: FMSynth,
    granular: Granular,
    metal: MetalSynth,
    mono: MonoSynth,
    sampler: Sampler,
}

export const synthParams = (type) => {
    const synth = synthMap[type] && new synthMap[type]()
    const params = synth && [
        ...Object.keys(synth.settable),
        ...Object.keys(synth.mutable)
    ]
    synth && synth.dispose(immediate())
    return params
}