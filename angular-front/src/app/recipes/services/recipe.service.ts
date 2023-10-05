import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable} from "rxjs";
import {Recipe} from "../models/Recipe";
import {HttpClient} from "@angular/common/http";
import {RecipeFood} from "../models/RecipeFood";
import {FoodNutrient, RecipeNutritionalValues} from '../models/NutritionalValues';
import {NutrientService} from "./nutrient.service";
import {NutritionService} from "./nutrition.service";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private BASE_URL = '/api/recipe-manager'
  private RECIPE_URL = '/recipes'


  private _recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);
  public readonly recipes: Observable<Recipe[]> = this._recipes.asObservable();

  private _recipe: BehaviorSubject<Recipe | null> = new BehaviorSubject<Recipe | null>(null);
  public readonly recipe: Observable<Recipe | null> = this._recipe.asObservable();

  private _recipeNutritionalValues: BehaviorSubject<RecipeNutritionalValues | null> = new BehaviorSubject<RecipeNutritionalValues | null>(null);
  public readonly recipeNutritionalValues: Observable<RecipeNutritionalValues | null> = this._recipeNutritionalValues.asObservable();

  constructor(private httpClient: HttpClient,
              private nutrient: NutrientService,
              private nutritionService: NutritionService
  ) {
  }

  loadRecipes() {
    this.httpClient.get<Recipe[]>(this.getBaseUrl()).subscribe(value => {
      console.log(value);
      this._recipes.next(value)
    })
  }

  loadRecipe(id: string) {
    this.httpClient.get<Recipe>(this.getBaseUrl() + "/" + id).subscribe(response => {
      console.log(response);
      this._recipe.next(response);
      this.loadRecipeNutritionalValues(response)
    })
  }

  loadRecipeNutritionalValues(recipe: Recipe) {
    if (!recipe.recipeFoods) {
      return
    }

    const recipeFoodByFoodIdMap: Map<number, RecipeFood> = new Map<number, RecipeFood>()
    const recipeFoods = recipe.recipeFoods;
    recipeFoods.forEach(value => {
      recipeFoodByFoodIdMap.set(value.food!.id!, value)
    })
    const foodIdList: number[] = recipeFoods.map(e => e.food.id!)
    const nutrients$ = this.nutrient.getNutrients()
    const foodNutrients$ = this.httpClient.get<FoodNutrient[]>(this.BASE_URL + `/food-nutrients/${recipe.id}`)
    forkJoin(({nutrients$, foodNutrients$}))
      .subscribe(value => {
        const nutritionalValues = this.nutritionService.getNutritionalValues(value, foodIdList, recipeFoodByFoodIdMap);
        this._recipeNutritionalValues.next({
          recipeId: recipe.id!,
          nutrientValues: nutritionalValues
        })
      })
  }

  getBaseUrl() {
    return this.BASE_URL + this.RECIPE_URL;
  }

  createRecipe(value: Recipe) {
    this.httpClient.post<Recipe>(this.getBaseUrl(), value)
      .subscribe(response => {
        console.log(response);
        const recipes = this._recipes.value
        recipes.push(response)
        this._recipes.next(recipes)
        this.loadRecipeNutritionalValues(response)
      })
  }

  updateRecipe(id: number, value: Recipe) {
    this.httpClient.put<Recipe>(this.getBaseUrl() + "/" + id, value)
      .subscribe(response => {
        console.log(value)
        const recipes = this._recipes.value
        const index = recipes.findIndex(e => e.id === response.id)
        recipes[index] = response
        this._recipes.next(recipes)
        this.loadRecipes()
        this.loadRecipeNutritionalValues(response)
      })
  }

  addRecipeFood(recipeId: number, recipeFood: RecipeFood) {
    return this.httpClient.put<Recipe>(this.getBaseUrl() + "/" + recipeId + "/add-recipe-food", recipeFood)
      .subscribe(response => {
        this._recipe.next(response);
        this.loadRecipeNutritionalValues(response);
      })
  }

  updateRecipeFood(recipeFoodId: number, recipeFood: RecipeFood) {
    recipeFood.id = recipeFoodId
    return this.httpClient.put<Recipe>(
      this.getBaseUrl() + "/update-recipe-food/" + recipeFoodId,
      recipeFood)
      .subscribe(response => {
        this._recipe.next(response)
        this.loadRecipeNutritionalValues(response);
      })
  }

  deleteRecipeFood(recipeFood: RecipeFood) {
    this.httpClient.delete<Recipe>(this.getBaseUrl() + "/" + recipeFood.id)
      .subscribe(response => {
        this._recipe.next(response)
        this.loadRecipeNutritionalValues(response)
      })

  }

  deleteRecipe(id: number) {
    this.httpClient.delete<void>(this.getBaseUrl() + "/" + id)
      .subscribe(response => {
        console.log(response)
        const recipes = this._recipes.value.filter(e => e.id !== id)
        this._recipes.next(recipes)
      })
  }
}
