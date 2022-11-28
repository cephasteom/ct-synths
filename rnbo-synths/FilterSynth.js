import BaseSynth from './BaseSynth';
// limiter?
class FilterSynth extends BaseSynth {
    oscTypes = ['sine', 'saw', 'tri', 'pulse', 'noise']
    json = new URL('./json/filter-synth.export.json', import.meta.url)
    
    constructor() {
        super()
        this.initDevice()
        this.bindMutableProps()
        this.defaults = {...this.defaults, osc: 'tri', res: 0.5}
    }

    /*
     * Settable params
    */
    set osc(type) { this.setDeviceParams('osc', this.oscTypes.indexOf(type) || 0) }
    set res(value) { this.setDeviceParams('res', value) }
    set cutoff(value) { this.setDeviceParams('cutoff', value) }
    set drift(value) { this.setDeviceParams('drift', value) }

    /*
     * Mutable params
    */
    _res(value, lag = 0.1) { this.mutateParam('res', value, lag)}
    _cutoff(value, lag = 0.1) { this.mutateParam('cutoff', value, lag)}
    _drift(value, lag = 0.1) { this.mutateParam('drift', value, lag)}
}

export default FilterSynth