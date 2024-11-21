import { FeeConfig } from "@/model";


export class EntryFeeCalculator {

    constructor(private config: FeeConfig) {}

    public setConfig(config: FeeConfig) {
        this.config = config;
    }


}