import BaseSynth from "./BaseSynth";

const patcher = fetch(new URL('./json/superfm.export.json', import.meta.url))
    .then(rawPatcher => rawPatcher.json())

/**
 * An all purpose synth with filters and FM
 * @example
 * s0.p.set({inst: 'synth'})
 */ 
class Synth extends BaseSynth {
    /** @hidden */
    constructor() {
        super()
        this.defaults = { ...this.defaults, 
            op1a: 10, op1d: 100, op1s: 0.8, op1r: 1000, op1ratio: 1, op1gain: 1, op1fb: 0,
            op2a: 10, op2d: 100, op2s: 0.8, op2r: 1000, op2ratio: 1, op2gain: 1, op2fb: 0,
            op3a: 10, op3d: 100, op3s: 0.8, op3r: 1000, op3ratio: 1, op3gain: 1, op3fb: 0,
        }
        this.patcher = patcher

        this.initDevice()
        
        this.op1a = this.op1a.bind(this)
        this.op1d = this.op1d.bind(this)
        this.op1s = this.op1s.bind(this)
        this.op1r = this.op1r.bind(this)
        this.a = this.op1a
        this.d = this.op1d
        this.s = this.op1s
        this.r = this.op1r
        this.op1ratio = this.op1ratio.bind(this)
        this._op1ratio = this._op1ratio.bind(this)
        this.op1gain = this.op1gain.bind(this)
        this._op1gain = this._op1gain.bind(this)
        this.op1fb = this.op1fb.bind(this)
        this._op1fb = this._op1fb.bind(this)
        
        this.op2a = this.op2a.bind(this)
        this.op2d = this.op2d.bind(this)
        this.op2s = this.op2s.bind(this)
        this.op2r = this.op2r.bind(this)
        this.op2ratio = this.op2ratio.bind(this)
        this._op2ratio = this._op2ratio.bind(this)
        this.op2gain = this.op2gain.bind(this)
        this._op2gain = this._op2gain.bind(this)
        this.op2fb = this.op2fb.bind(this)
        this._op2fb = this._op2fb.bind(this)

        this.op3a = this.op3a.bind(this)
        this.op3d = this.op3d.bind(this)
        this.op3s = this.op3s.bind(this)
        this.op3r = this.op3r.bind(this)
        this.op3ratio = this.op3ratio.bind(this)
        this._op3ratio = this._op3ratio.bind(this)
        this.op3gain = this.op3gain.bind(this)
        this._op3gain = this._op3gain.bind(this)
        this.op3fb = this.op3fb.bind(this)
        this._op3fb = this._op3fb.bind(this)
            
        this.params = Object.getOwnPropertyNames(this)
    }

    op1a(value: number = 0, time: number): void { this.messageDevice('op1a', value, time) }
    op1d(value: number = 0, time: number): void { this.messageDevice('op1d', value, time) }
    op1s(value: number = 0, time: number): void { this.messageDevice('op1s', value, time) }
    op1r(value: number = 0, time: number): void { this.messageDevice('op1r', value, time) }

    op1ratio(value: number = 0, time: number): void { this.messageDevice('op1ratio', value, time) }
    _op1ratio(value: number = 0, time: number): void { this.messageDevice('_op1ratio', value, time) }

    op1gain(value: number = 0, time: number): void { this.messageDevice('op1gain', value, time) }
    _op1gain(value: number = 0, time: number): void { this.messageDevice('_op1gain', value, time) }

    op1fb(value: number = 0, time: number): void { this.messageDevice('op1fb', value, time) }
    _op1fb(value: number = 0, time: number): void { this.messageDevice('_op1fb', value, time) }

    op2a(value: number = 0, time: number): void { this.messageDevice('op2a', value, time) }
    op2d(value: number = 0, time: number): void { this.messageDevice('op2d', value, time) }
    op2s(value: number = 0, time: number): void { this.messageDevice('op2s', value, time) }
    op2r(value: number = 0, time: number): void { this.messageDevice('op2r', value, time) }

    op2ratio(value: number = 0, time: number): void { this.messageDevice('op2ratio', value, time) }
    _op2ratio(value: number = 0, time: number): void { this.messageDevice('_op2ratio', value, time) }

    op2gain(value: number = 0, time: number): void { this.messageDevice('op2gain', value, time) }
    _op2gain(value: number = 0, time: number): void { this.messageDevice('_op2gain', value, time) }

    op2fb(value: number = 0, time: number): void { this.messageDevice('op2fb', value, time) }
    _op2fb(value: number = 0, time: number): void { this.messageDevice('_op2fb', value, time) }    

    op3a(value: number = 0, time: number): void { this.messageDevice('op3a', value, time) }
    op3d(value: number = 0, time: number): void { this.messageDevice('op3d', value, time) }
    op3s(value: number = 0, time: number): void { this.messageDevice('op3s', value, time) }
    op3r(value: number = 0, time: number): void { this.messageDevice('op3r', value, time) }

    op3ratio(value: number = 0, time: number): void { this.messageDevice('op3ratio', value, time) }
    _op3ratio(value: number = 0, time: number): void { this.messageDevice('_op3ratio', value, time) }

    op3gain(value: number = 0, time: number): void { this.messageDevice('op3gain', value, time) }
    _op3gain(value: number = 0, time: number): void { this.messageDevice('_op3gain', value, time) }

    op3fb(value: number = 0, time: number): void { this.messageDevice('op3fb', value, time) }
    _op3fb(value: number = 0, time: number): void { this.messageDevice('_op3fb', value, time) }        
}

export default Synth