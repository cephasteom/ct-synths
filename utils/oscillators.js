export function formatOscType(type) {
    const types = {
        sine: 'sine', 
        square: 'square', 
        saw: 'sawtooth', 
        tri: 'triangle', 
        pulse: 'pulse', 
        pwm: 'pwm',
        fatsine: 'fatsine',
        fatsquare: 'fatsquare',
        fatsaw: 'fatsawtooth',
        fattri: 'fattriangle',
        fmsine: 'fmsine', 
        fmsquare: 'fmsquare', 
        fmsaw: 'fmsawtooth', 
        fmtri: 'fmtriangle',
        amsine: 'amsine', 
        amsquare: 'amsquare', 
        amsaw: 'amsawtooth', 
        amtri: 'amtriangle'
    }
    return Object.keys(types).includes(type) ? types[type] : 'sine'
}

export function formatModOscType(type) {
    const types = {
        sine: 'sine', 
        square: 'square', 
        saw: 'sawtooth', 
        tri: 'triangle'
    }
    return Object.keys(types).includes(type) ? types[type] : 'sine'
}