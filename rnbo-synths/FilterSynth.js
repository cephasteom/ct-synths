import BaseSynth from './BaseSynth';
// todo: cutoff
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

    /*
     * Mutable params
    */
    _res(value, time, lag = 0.1) { this.mutateParam('res', value, time, lag)}
}

export default FilterSynth