import {ConversionFactor} from "./ConversionFactor";

export interface Food {
  id: number,
  name: string,
  conversionFactors: ConversionFactor[]
}

export interface FoodMinimal {
  id: number,
  name: string
}
