import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Recipe} from "../models/Recipe";
import {HttpClient} from "@angular/common/http";

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

  constructor(private httpClient: HttpClient) {
  }

  loadRecipes() {
    this.httpClient.get<Recipe[]>(this.getBaseUrl()).subscribe(value => {
      console.log(value);
      this._recipes.next(value)
    })
  }

  loadRecipe(id: string) {
    this.httpClient.get<Recipe>(this.getBaseUrl() + "/" + id).subscribe(value => {
      console.log(value);
      this._recipe.next(value);
    })
  }


  getBaseUrl() {
    return this.BASE_URL + this.RECIPE_URL;
  }

  createRecipe(value: Recipe) {
    this.httpClient.post<Recipe>(this.getBaseUrl(), value).subscribe(value => {
      console.log(value);
      const recipes = this._recipes.value
      recipes.push(value)
      this._recipes.next(recipes)
    })
  }

  updateRecipe(id: number, value: Recipe) {
    this.httpClient.put<Recipe>(this.getBaseUrl() + "/" + id, value).subscribe(response => {
      console.log(value)
      const recipes = this._recipes.value
      const index = recipes.findIndex(e => e.id === response.id)
      recipes[index] = response
      this._recipes.next(recipes)
    })
  }

  deleteRecipe(id: number) {
    this.httpClient.delete<void>(this.getBaseUrl() + "/" + id).subscribe(response => {
      console.log(response)
      const recipes = this._recipes.value.filter(e => e.id !== id)
      this._recipes.next(recipes)
    })
  }
}
