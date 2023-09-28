import {Nutrient} from "./Nutrient";

export interface FoodNutrient {
  id: number,
  foodId: number,
  nutrientId: number,
  value: number
}

export interface NutritionalValue {
  nutrient: Nutrient,
  value: number
}

export interface RecipeNutritionalValues {
  nutrientValues: NutritionalValue[],
  recipeId: number,
}
