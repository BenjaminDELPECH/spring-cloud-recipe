import {Food} from "./Food";
import {ConversionFactor} from "./ConversionFactor";

export interface RecipeFood {
  id?: number,
  food: Food,
  conversionFactor: ConversionFactor,
  quantity: number
}
