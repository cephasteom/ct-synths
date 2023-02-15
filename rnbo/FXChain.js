import { MIDIEvent } from '@rnbo/js'
import RNBODevice from './RNBODevice'
import { fxParams } from './data'

class FXChain extends RNBODevice {
    json = new URL('./json/fx.export.json', import.meta.url)
    params = fxParams
    defaults = {
        dist: 0, drive: 0.25,
        ring: 0, ringf: 0.25, ringspread: 0, ringmode: 0,
        hicut: 0, locut: 0,
        chorus: 0, chdepth: 0.25, chlfo: 0.25, chspread: 0.25,
        delay: 0, dtime: 500, dfb: 0.5, dspread: 0, dcolour: 0.25, dfilter: 0, 
        reverb: 0, rsize: 0.25, rdamp: 0.25, rdiff: 0.25, rjitter: 0, rdecay: 0.25,
        gain: 1, lthresh: 1
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