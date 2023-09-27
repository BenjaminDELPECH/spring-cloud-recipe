import {ConversionFactor} from "./ConversionFactor";

export interface Food {
  id?: number,
  name: string,
  conversionFactors: ConversionFactor[]
}
