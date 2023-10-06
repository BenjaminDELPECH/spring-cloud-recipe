import {Nutrient} from "./Nutrient";

export interface FoodNutrient {
  id: number,
  foodId: number,
  nutrientId: number,
  value: number
}

export interface FoodNutrientValue {
  foodId: number,
  nutrient: Nutrient,
  value: number
}


export interface NutritionalValue {
  nutrient: Nutrient,
  value: number,
  percentage: number
}

export interface RecipeNutritionalValues {
  foodNutrientValues: FoodNutrientValue[],
  recipeId: number,
}
