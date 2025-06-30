import BaseSamplingDevice from "./BaseSamplingDevice";

const patcher = fetch(new URL('./json/wavetable.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())

/**
 * Wavetable
 * @example
 * s0.set({inst: 'wavetable'})
 */ 
class Wavetable extends BaseSamplingDevice {

    /** @hidden */
    constructor() {
        super()
        this.defaults = { 
            ...this.defaults, 
            dur: 1000, tablesize: 256, rows: 16, xlfo: 0.01, ylfo: 0.05,
            i: 0, cutoff: 500, res: 0.5
        }
        this.patcher = patcher
        this.initDevice()

        this.tablesize = this.tablesize.bind(this)
        this.rows = this.rows.bind(this)
        this.xlfo = this.xlfo.bind(this)
        this._xlfo = this._xlfo.bind(this)
        this.ylfo = this.ylfo.bind(this)
        this._ylfo = this._ylfo.bind(this)

        this.params = Object.getOwnPropertyNames(this)
    }

    /**
     * Number of wavetables
     * @param value
     */
    tablesize(value: number = 256, time: number): void { this.messageDevice('tablesize', value, time) } 

    /**
     * Number of rows in each table
     * @param value
     */
    rows(value: number = 16, time: number): void { this.messageDevice('rows', value, time) }
    
    /**
     * X LFO
     * @param value
     */
    xlfo(value: number = 0, time: number): void { this.messageDevice('xlfo', value, time) }

    /**
     * Mutate X LFO
     * @param value
     */
    _xlfo(value: number = 0, time: number): void { this.messageDevice('_xlfo', value, time) }

    /**
     * Y LFO
     * @param value
     */
    ylfo(value: number = 0, time: number): void { this.messageDevice('ylfo', value, time) }

    /**
     * Mutate Y LFO
     * @param value
     */
    _ylfo(value: number = 0, time: number): void { this.messageDevice('_ylfo', value, time) }


}

export default Wavetable