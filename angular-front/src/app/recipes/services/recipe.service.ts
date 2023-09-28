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
  private BASE_URL = 'http://localhost:3000'
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
    const foodNutrients$ = this.httpClient.get<FoodNutrient[]>(this.BASE_URL + "/foodNutrients")
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
    recipeFood.id = Math.round(Math.random() * 1000000)
    const recipe = this._recipe.value
    recipe?.recipeFoods.push(recipeFood)
    return this.httpClient.put<Recipe>(this.getBaseUrl() + "/" + recipeId, recipe)
      .subscribe(response => {
        this._recipe.next(response)
        this.loadRecipes()
        this.loadRecipeNutritionalValues(response)
      })
  }

  updateRecipeFood(recipeId: number, recipeFoodId: number, recipeFood: RecipeFood) {
    const recipe = this._recipe.value
    const i = recipe?.recipeFoods.findIndex(e => e.id === recipeFoodId)
    if (i === -1) {
      console.error('not found')
    }
    recipeFood.id = recipeFoodId
    recipe!.recipeFoods[i!] = recipeFood
    return this.httpClient.put<Recipe>(this.getBaseUrl() + "/" + recipeId, recipe)
      .subscribe(response => {
        this._recipe.next(response)
        this.loadRecipes()
        this.loadRecipeNutritionalValues(response);
      })
  }

  deleteRecipeFood(recipeId: string, recipeFood: RecipeFood) {
    const recipe = this._recipe.value
    const i = recipe?.recipeFoods.findIndex(e => e.id === recipeFood.id)
    if (i === -1) {
      console.error('not found')
    }
    recipe!.recipeFoods = recipe!.recipeFoods.filter(e => e.id !== recipeFood.id)
    this._recipe.next(recipe);
    this.httpClient.put<Recipe>(this.getBaseUrl() + "/" + recipeId, recipe)
      .subscribe(response => {
        this._recipe.next(response)
        this.loadRecipes()
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
