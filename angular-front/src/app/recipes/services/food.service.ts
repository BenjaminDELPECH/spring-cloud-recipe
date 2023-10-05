import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Food, FoodMinimal} from "../models/Food";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private BASE_URL = '/api/food-nutrients'

  constructor(private httpClient: HttpClient) {
  }


  searchFoods(str: string): Observable<FoodMinimal[]> {
    return this.httpClient.get<FoodMinimal[]>(this.BASE_URL + `/foods?search=${str}`)
  }

  getCompleteFood(food: FoodMinimal) {
    return this.httpClient.get<Food>(this.BASE_URL + `/foods/${food.id}`)
  }
}
