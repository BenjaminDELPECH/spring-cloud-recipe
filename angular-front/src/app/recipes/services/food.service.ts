import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Food} from "../models/Food";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private BASE_URL = 'http://localhost:3000'
  private FOOD_MINIMAL_URL = '/foods-minimal'

  constructor(private httpClient: HttpClient) {
  }


  getFoods(): Observable<Food[]> {
    return this.httpClient.get<Food[]>(this.getFoodMinimalUrl())
  }

  getFoodMinimalUrl() {
    return this.BASE_URL + this.FOOD_MINIMAL_URL;
  }
}
