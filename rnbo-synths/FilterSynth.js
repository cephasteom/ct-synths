import BaseSynth from './BaseSynth';

class FilterSynth extends BaseSynth {
    self = this.constructor
    oscTypes = ['sine', 'saw', 'tri', 'pulse', 'noise']
    json = new URL('./json/filter-synth.export.json', import.meta.url)
    events = []
    
    constructor() {
        super()
        this.initDevice()
        this.bindMutableProps()
    }

    /*
     * Settable params
    */
    set osc(type) { this.setInactiveDeviceParams('osc', this.oscTypes.indexOf(type) || 0) }
    set res(value) { this.setInactiveDeviceParams('res', value) }

    /*
     * Mutable params
    */
    _res(value, time, lag = 0.1) { this.mutateParam('res', value, time, lag)}
}

export default FilterSynth