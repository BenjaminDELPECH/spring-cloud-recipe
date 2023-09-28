import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConversionFactor} from "../models/ConversionFactor";

@Injectable({
  providedIn: 'root'
})
export class ConversionFactorService {
  BASE_URL = 'http://localhost:3000'
  private CONVERSION_FACTORS_URL = '/conversionFactors'

  constructor(private httpClient: HttpClient) {
  }

  getConversionFactors(): Observable<ConversionFactor[]> {
    return this.httpClient.get<ConversionFactor[]>(this.getConversionFactorUrl())
  }

  getConversionFactorUrl() {
    return this.BASE_URL + this.CONVERSION_FACTORS_URL
  }
}
