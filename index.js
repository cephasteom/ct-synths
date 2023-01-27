import Synth from "./rnbo/Synth";
import Sampler from "./rnbo/Sampler";
import Granulator from "./rnbo/Granulator";
import Additive from "./rnbo/Additive";
import FXChain from "./rnbo/FXChain";

export const CtSynth = Synth
export const CtSampler = Sampler
export const CtGranulator = Granulator
export const CtAdditive = Additive
export const CtFXChain = FXChain

export const synthTypes = ['synth', 'sampler', 'granular', 'additive']
export const synthParams = (type) => {
    switch(type) {
        case 'synth': return Synth.baseKeys.concat(Synth.keys).join(', ')
        case 'sampler': return Synth.baseKeys.concat(Sampler.keys).join(', ')
        case 'granular': return Synth.baseKeys.concat(Granulator.keys).join(', ')
        case 'additive': return Synth.baseKeys.concat(Additive.keys).join(', ')
        case 'fx': return FXChain.keys.join(', ')
        default: Synth.baseKeys
    }
}
