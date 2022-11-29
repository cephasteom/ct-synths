import BaseEffect from "./BaseEffect";

class Reverb extends BaseEffect {
    json = new URL("./json/rnbo.platereverb.json", import.meta.url);

    constructor() {
        super();
        this.initDevice();
        this.bindMutableProps();
        this.defaults = { ...this.defaults, mix: 0 };
    }
}

export default Reverb;