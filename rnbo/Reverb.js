import BaseEffect from "./BaseEffect";
class Reverb extends BaseEffect {
    json = new URL('./json/reverb.export.json', import.meta.url)
    params = ['reverb', 'size', 'decay', 'jitter', 'damp', 'diff']

    constructor() {
        super()
        this.initDevice()
        this.initParams()
    }

}

export default Reverb