import {RecipeFood} from "./RecipeFood";

export interface Recipe {
  id?: number,
  name: string,
  recipeFoods: RecipeFood[]
}
