import BaseSynth from './BaseSynth';
// limiter?
class Synth extends BaseSynth {
    oscTypes = ['sine', 'saw', 'tri', 'pulse', 'noise']
    json = new URL('./json/filter-synth3.export.json', import.meta.url)
    // json = new URL('./json/filter-fm-synth.export.json', import.meta.url)
    
    constructor() {
        super()
        this.initDevice()
        this.bindMutableProps()
        this.defaults = {
            ...this.defaults, 
            osc: 'sine', 
            cutoff: 15000, 
            res: 0, 
            modi: 0, 
            harm: 0,
            moda: 0.01,
            modd: 0.1,
            mods: 1,
            modr: 4, 
            drift: 0, 
        }
    }

    /*
     * Settable params
    */
    set osc(type) { this.setDeviceParams('osc', this.oscTypes.indexOf(type) || 0) }
    set res(value) { this.setDeviceParams('res', value) }
    set cutoff(value) { this.setDeviceParams('cutoff', value) }
    set modi(value) { this.setDeviceParams('modi', value)}
    set harm(value) { this.setDeviceParams('harm', value)}
    set drift(value) { this.setDeviceParams('drift', value) }

    /*
     * Mutable params
    */
    _res(value, lag = 0.1) { this.mutateParam('res', value, lag)}
    _cutoff(value, lag = 0.1) { this.mutateParam('cutoff', value, lag)}
    _modi(value, lag = 0.1) { this.mutateParam('modi', value, lag)}
    _harm(value, lag = 0.1) { this.mutateParam('harm', value, lag)}
    _drift(value, lag = 0.1) { this.mutateParam('drift', value, lag)}
}

export default Synth