export const synthTypes = ['synth', 'sampler', 'granular', 'additive']

export const fxParams = [
    'dist', 'drive',
    'ring', 'ringf', 'ringspread', 'ringmode',
    'chorus', 'chdepth', 'chlfo', 'chspread',
    'hicut', 'locut',
    'delay', 'dtime', 'dfb', 'dspread', 'dcolour', 'dfilter',
    'reverb', 'rsize', 'rdamp', 'rdiff', 'rjitter', 'rdecay',
    'gain', 'lthresh'
]

export const baseSynthParams = [
    'dur', 'n', 'pan', 'amp', 'vol', 'hold',
    'a', 'd', 's', 'r', 'acurve', 'dcurve', 'rcurve', 
    'moda', 'modd', 'mods', 'modr', 'modacurve', 'moddcurve', 'modrcurve', 
    'fila', 'fild', 'fils', 'filr', 'filacurve', 'fildcurve', 'filrcurve', 
    'res', 'cutoff', 'detune'
]

export const additiveParams = ['drift', 'pmuln', 'pmul', 'pdisp', 'pexp']

export const granularParams = ['i', 'snap', 'bank', 'grainrate', 'grainsize', 'grainslope', 'grainpan', 'rate', 'bpm', 'direction', 'begin', 'end', 'loop']

export const samplerParams = ['i', 'snap', 'bank', 'begin', 'end', 'loop', 'rate', 'bpm', 'oneshot', 'loopsize']

export const synthParams = ['osc', 'drift', 'harm', 'modi']

export const acidParams = ['osc', 'slide', 'fil', 'sub']

export const subParams = ['fat', 'slide']

export const droneParams = ['lforate', 'lfodepth', 'spread', 'offset', 'damp', 'dynamic', 'rand', 'slide', 'pitch']

export const params = (type) => {
    switch(type) {
        case 'synth': return baseSynthParams.concat(synthParams).join(', ')
        case 'sampler': return baseSynthParams.concat(samplerParams).join(', ')
        case 'granular': return baseSynthParams.concat(granularParams).join(', ')
        case 'additive': return baseSynthParams.concat(additiveParams).join(', ')
        case 'acid': return baseSynthParams.concat(acidParams).join(', ')
        case 'fx': return fxParams.join(', ')
        default: 'invalid or no type'
    }
}
