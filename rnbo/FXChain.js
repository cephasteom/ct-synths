import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'

const ps = [
    'dist', 'drive',
    'ring', 'ringf', 'ringspread', 'ringmode',
    'chdepth', 'chlfo', 'chspread',
    'hicut', 'locut',
]

class FXChain extends RNBODevice {
    json = new URL('./json/fx.export.json', import.meta.url)
    params = ps
    static get baseKeys() {
        return ps
    }
    defaults = {
        dist: 0, drive: 0,
        ring: 0, ringf: 0, ringspread: 0, ringmode: 0,
        hicut: 0, locut: 0,
        chdepth: 0, chlfo: 0, chspread: 0,
    }
    state = {}
    
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