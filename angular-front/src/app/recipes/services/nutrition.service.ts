import {Injectable} from '@angular/core';
import {Observable, ObservedValueOf} from "rxjs";
import {FoodNutrient, NutritionalValue} from "../models/NutritionalValues";
import {Nutrient} from "../models/Nutrient";
import {RecipeFood} from "../models/RecipeFood";

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  constructor() {
  }

  public getNutritionalValues(
    value: {
      foodNutrients$: ObservedValueOf<Observable<FoodNutrient[]>>;
      nutrients$: ObservedValueOf<Observable<Nutrient[]>>
    },
    foodIdList: number[],
    recipeFoodByFoodIdMap: Map<number, RecipeFood>) {
    const {nutrients$: nutrients, foodNutrients$: foodNutrients} = value
    return this.buildNutritionalValues(nutrients, foodNutrients, foodIdList, recipeFoodByFoodIdMap);
  }

  private buildNutritionalValues(nutrients: Nutrient[],
                                 foodNutrients: FoodNutrient[],
                                 foodIdList: number[],
                                 recipeFoodByFoodIdMap: Map<number, RecipeFood>) {
    const nutrientMapById = this.getNutrientsMap(nutrients);
    const nutritionalValuesByNutrientId = this.getNutrientValuesMap(
      foodNutrients,
      foodIdList,
      recipeFoodByFoodIdMap
    );
    return this.getNutrientValues(nutritionalValuesByNutrientId, nutrientMapById);
  }

  private getNutrientValues(nutritionalValuesByNutrientId: Map<number, number>,
                            nutrientMapById: Map<number, Nutrient>) {
    const nutritionalValues: NutritionalValue[] = []
    nutritionalValuesByNutrientId.forEach((value, nutrientId) => {
      if (!nutrientMapById.get(nutrientId)) {
        console.error("nutrientId has not been found : " + nutrientId)
      }
      nutritionalValues.push({
        nutrient: nutrientMapById.get(nutrientId)!,
        value: value
      })
    })
    return nutritionalValues;
  }

  private getNutrientsMap(nutrients: Nutrient[]) {
    const nutrientMapById: Map<number, Nutrient> = new Map<number, Nutrient>();
    nutrients.forEach(value => {
      nutrientMapById.set(value.id!, value)
    })
    return nutrientMapById;
  }

  private getNutrientValuesMap(foodNutrients: FoodNutrient[],
                               foodIdList: number[],
                               recipeFoodByFoodIdMap: Map<number, RecipeFood>) {
    const nutritionalValuesByNutrientId: Map<number, number> = new Map();
    foodNutrients.filter(e => foodIdList.find(foodId => foodId === e.foodId))
      .map(e => {
        const {nutrientId, foodId, value} = e
        const previousValue = nutritionalValuesByNutrientId.has(nutrientId) ? nutritionalValuesByNutrientId.get(nutrientId)! : 0;
        const recipeFood = recipeFoodByFoodIdMap.get(foodId)!
        const {conversionFactor, quantity} = recipeFood
        const valConverted = value * conversionFactor.factor * quantity
        nutritionalValuesByNutrientId.set(nutrientId, previousValue + valConverted)
      })
    return nutritionalValuesByNutrientId;
  }
}
