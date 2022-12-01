import BaseEffect from "./BaseEffect";

class Reverb extends BaseEffect {
    json = new URL("./json/rnbo.platereverb2.json", import.meta.url);

    constructor() {
        super();
        this.initDevice();
        this.bindProps();
    }

    reverb(value, time = 0) { this.setParam("mix", value, time) }
    damp(value, time = 0) { this.setParam("damp", value, time) }
    diff(value, time = 0) { this.setParam("diff", value, time) }
    size(value, time = 0) { this.setParam("size", value, time) }
    decay(value, time = 0) { this.setParam("decay", value, time) }
    jitter(value, time = 0) { this.setParam("jitter", value, time) }

    _reverb(value, time, lag = 0.01) { this.mutateParam("mix", value, time, lag) }
    _damp(value, time, lag = 0.01) { this.mutateParam("damp", value, time, lag) }
    _diff(value, time, lag = 0.01) { this.mutateParam("diff", value, time, lag) }
    _size(value, time, lag = 0.01) { this.mutateParam("size", value, time, lag) }
    _decay(value, time, lag = 0.01) { this.mutateParam("decay", value, time, lag) }
    _jitter(value, time, lag = 0.01) { this.mutateParam("jitter", value, time, lag) }
}

export default Reverb;