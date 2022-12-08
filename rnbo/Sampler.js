import BaseSynth from "./BaseSynth";

class Sampler extends BaseSynth {
    json = new URL('./json/sampler.export.json', import.meta.url)
    params = [...this.params, 'i']

    constructor() {
        super()
        this.initParams()
    }
    
    async load(dependencies) {
        await this.initDevice()

        const results = await this.device.loadDataBufferDependencies(dependencies);
        results.forEach(result => {
            result.type === "success"
                ? console.log(`Successfully loaded buffer with id ${result.id}`)
                : console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
        });
    }
}

export default Sampler