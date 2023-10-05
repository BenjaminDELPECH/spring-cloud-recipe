import {Food} from "./Food";
import {ConversionFactor} from "./ConversionFactor";

export interface MealMinimal {
  id?: number,
}
export interface RecipeFood {
  id?: number,
  meal?: MealMinimal,
  food: Food,
  conversionFactor?: ConversionFactor,
  quantity: number
}
