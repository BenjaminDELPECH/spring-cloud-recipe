import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Food, FoodMinimal} from "../../models/Food";
import {BehaviorSubject, debounceTime, filter, fromEvent, map, switchMap, take, tap} from "rxjs";
import {FoodService} from "../../services/food.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search-add-food',
  template: `
    <mat-form-field style="margin-top:2.5rem;">
      <mat-label>Ingrédients :</mat-label>
      <input type="text"
             aria-label="Ingrédient"
             placeholder="Chercher.."
             matInput
             id="foodSearch"
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
  showLastSelected: boolean = false;

  @Input()
  value?: Food;

  foods: FoodMinimal[] = []
  filteredFoods: BehaviorSubject<FoodMinimal[]> = new BehaviorSubject<FoodMinimal[]>([]);

  @Input()
  alreadyAddedFoods: Food[] = []

  @Output()
  addFoodEmitter: EventEmitter<Food> = new EventEmitter<Food>();

  constructor(private foodService: FoodService) {
  }

  ngAfterViewInit(): void {

    const foodSearch: HTMLInputElement = document.getElementById("foodSearch") as HTMLInputElement

    if (!foodSearch) {
      console.error("no food search")
    }
    if (this.value) {
      foodSearch!.value = this.value.name
    }
    const foodSearch$ = fromEvent<any>(foodSearch!, 'input')
    foodSearch$.pipe(
      debounceTime(100),
      tap(console.log),
      map(value => value.target.value),
      filter(value => value.length >= 2),
      switchMap(value => this.foodService.searchFoods(value)),
      map(e => this.filterFoodMinimals(e))
    ).subscribe(value => {
      this.filteredFoods.next(value)
      foodSearch!.innerHTML = ''
    })
  }

  addFood(food: FoodMinimal) {
    this.filteredFoods.next(this.foods)
    this.foodService.getCompleteFood(food).pipe(
      take(1)
    ).subscribe(food => {
      this.addFoodEmitter.emit(food)
    })
  }

  clickAddFood(option: FoodMinimal, foodSearch: HTMLInputElement) {
    this.addFood(option);
    if (this.showLastSelected) {
      foodSearch.value = option.name
      return
    }
    foodSearch.value = ''
  }

  private filterFoodMinimals(foodSearchResults: FoodMinimal[]) {
    return foodSearchResults
      .filter(e1 => this.alreadyAddedFoods.findIndex(e2 => e2.id === e1.id) === -1)
  }
}
