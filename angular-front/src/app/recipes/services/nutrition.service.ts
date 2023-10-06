import {Injectable} from '@angular/core';
import {Observable, ObservedValueOf} from "rxjs";
import {NutritionalValue, RecipeNutritionalValues} from "../models/NutritionalValues";
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
      recipeNutritionalValue$: ObservedValueOf<Observable<RecipeNutritionalValues>>;
      nutrients$: ObservedValueOf<Observable<Nutrient[]>>
    },
    foodIdList: number[],
    recipeFoodByFoodIdMap: Map<number, RecipeFood>) {
    const {nutrients$: nutrients, recipeNutritionalValue$: recipeNutritionalValues} = value
    return this.buildNutritionalValues(nutrients, recipeNutritionalValues, foodIdList, recipeFoodByFoodIdMap);
  }

  private buildNutritionalValues(nutrients: Nutrient[],
                                 recipeNutritionalValues: RecipeNutritionalValues,
                                 foodIdList: number[],
                                 recipeFoodByFoodIdMap: Map<number, RecipeFood>) {
    const nutrientMapById = this.getNutrientsMap(nutrients);
    return this.getNutrientValuesMap(
      recipeNutritionalValues,
      foodIdList,
      recipeFoodByFoodIdMap,
      nutrientMapById
    );
  }

  private getNutrientsMap(nutrients: Nutrient[]) {
    const nutrientMapById: Map<number, Nutrient> = new Map<number, Nutrient>();
    nutrients.forEach(value => {
      nutrientMapById.set(value.id!, value)
    })
    return nutrientMapById;
  }

  private getNutrientValuesMap(recipeNutritionalValues: RecipeNutritionalValues,
                               foodIdList: number[],
                               recipeFoodByFoodIdMap: Map<number, RecipeFood>,
                               nutrientMapById: Map<number, Nutrient>): NutritionalValue[] {
    const nutritionalValuesByNutrientId: Map<number, number> = new Map();
    recipeNutritionalValues.foodNutrientValues.filter(e => foodIdList.find(foodId => foodId === e.foodId))
      .map(e => {
        const {nutrient, foodId, value} = e
        const nutrientId = nutrient.id!;
        const previousValue = nutritionalValuesByNutrientId.has(nutrientId) ? nutritionalValuesByNutrientId.get(nutrientId)! : 0;
        const recipeFood = recipeFoodByFoodIdMap.get(foodId)!
        const {conversionFactor, quantity} = recipeFood
        if (!conversionFactor) {
          return
        }
        const valConverted = value * conversionFactor?.factor ? conversionFactor.factor : 0 * quantity
        nutritionalValuesByNutrientId.set(nutrientId, previousValue + valConverted)
      })
    const nutritionalValues: NutritionalValue[] = [];
    nutritionalValuesByNutrientId.forEach((nutrientValue: number, nutrientId: number) => {
      const nutrient: Nutrient = nutrientMapById.get(nutrientId)!;
      let percentage = (nutrientValue / nutrient.requirement) * 100;
      percentage = Math.min(percentage, 100);
      nutritionalValues.push({
        nutrient: nutrient,
        value: nutrientValue,
        percentage: percentage
      })
    })
    return nutritionalValues;
  }
}
