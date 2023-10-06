import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConversionFactor} from "../models/ConversionFactor";

@Injectable({
  providedIn: 'root'
})
export class ConversionFactorService {
  private BASE_URL = '/api/food-nutrients/conversion-factors'
  constructor(private httpClient: HttpClient) {
  }

  getConversionFactors(): Observable<ConversionFactor[]> {
    return this.httpClient.get<ConversionFactor[]>(this.getConversionFactorUrl())
  }

  getConversionFactorUrl() {
    return this.BASE_URL
  }
}
