import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Food} from "../../models/Food";
import {BehaviorSubject, debounceTime, fromEvent, map, take, tap} from "rxjs";
import {FoodService} from "../../services/food.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search-add-food',
  template: `
    <mat-form-field style="margin-top:2.5rem;">
      <mat-label>Aliments :</mat-label>
      <input type="text"
             aria-label="Aliment"
             placeholder="Chercher.."
             matInput
             id="foodSearch"
             #foodSearch
             [matAutocomplete]="auto">
    </mat-form-field>
    <mat-autocomplete #auto="matAutocomplete">
      <mat-option
        *ngFor="let option of filteredFoods | async"
        [value]="option"
        (click)="clickAddFood(option, foodSearch)">{{option.name}}</mat-option>
    </mat-autocomplete>`,
  styleUrls: ['./search-add-food.component.css']
})
export class SearchAddFoodComponent implements AfterViewInit {
  @Input()
  showLastSelected: boolean = false

  foods: Food[] = []
  filteredFoods: BehaviorSubject<Food[]> = new BehaviorSubject<Food[]>([]);

  @Input()
  alreadyAddedFoods: Food[] = []

  @Output()
  addFoodEmitter: EventEmitter<Food> = new EventEmitter<Food>();

  constructor(private foodService: FoodService) {
    this.foodService.getFoods().pipe(
      take(1)
    ).subscribe(value => {
      this.foods = value
    })
  }

  ngAfterViewInit(): void {
    const foodSearch = document.getElementById("foodSearch")
    if (!foodSearch) {
      console.error("no food search")
    }
    const foodSearch$ = fromEvent<any>(foodSearch!, 'input')
    foodSearch$.pipe(
      debounceTime(50),
      tap(console.log),
      map(value => value.target.value),
      map(e => this.filterFoodMinimals(e))
    ).subscribe(value => {
      this.filteredFoods.next(value)
      foodSearch!.innerHTML = ''
    })
  }

  addFood(food: Food) {
    this.filteredFoods.next(this.foods)
    this.addFoodEmitter.emit(food)
  }

  clickAddFood(option: Food, foodSearch: HTMLInputElement) {
    this.addFood(option);
    if (this.showLastSelected) {
      foodSearch.value = option.name
      return
    }
    foodSearch.value = ''
  }

  private filterFoodMinimals(e: string) {
    return this.foods
      .filter(e => !this.alreadyAddedFoods.find(e2 => e.id === e2.id))
      .filter(food => food.name.toLowerCase().includes(e.toLowerCase()));
  }
}
