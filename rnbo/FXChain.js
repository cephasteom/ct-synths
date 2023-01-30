import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'

const ps = [
    'dist', 'drive',
    'ring', 'ringf', 'ringspread', 'ringmode',
    'chorus', 'chdepth', 'chlfo', 'chspread',
    'hicut', 'locut',
    'delay', 'dtime', 'dfb', 'dspread', 'dcolour', 'dfilter',
]

class FXChain extends RNBODevice {
    json = new URL('./json/fx.export.json', import.meta.url)
    params = ps
    static get keys() {
        return ps
    }
    defaults = {
        dist: 0, drive: 0.25,
        ring: 0, ringf: 0.25, ringspread: 0, ringmode: 0,
        hicut: 0, locut: 0,
        chorus: 0, chdepth: 0.25, chlfo: 0.25, chspread: 0.25,
        delay: 0, dtime: 0, dfb: 0, dspread: 0, dcolour: 0, dfilter: 0, 
    }
    
    constructor() {
        super()
        this.params = [...this.params, ...this.params.map(p => `_${p}`)]
        this.initDevice()
        this.initParams()
    }

    set(params = {}, time) {
        if(!this.ready) return
        const ps = {...this.defaults, ...params }
        this.setParams(ps, time, 0)

        const triggerEvent = new MIDIEvent(time * 1000, 0, [144, 60, 127]);
        this.device.scheduleEvent(triggerEvent);
    }
}

export default FXChain