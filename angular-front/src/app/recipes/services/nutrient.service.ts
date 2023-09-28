import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Nutrient} from "../models/Nutrient";

@Injectable({
  providedIn: 'root'
})
export class NutrientService {
  private BASE_URL = 'http://localhost:3000'
  private nutrients: Nutrient[] = []

  constructor(private httpClient: HttpClient) {
  }

  getNutrients(): Observable<Nutrient[]> {
    if (this.nutrients.length) {
      return of(this.nutrients)
    }
    return this.httpClient.get<Nutrient[]>(this.BASE_URL + "/nutrients");
  }


}
