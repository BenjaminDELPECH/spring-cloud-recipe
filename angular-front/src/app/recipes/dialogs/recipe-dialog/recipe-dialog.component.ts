import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Recipe} from "../../models/Recipe";
import {RecipeService} from "../../services/recipe.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, debounceTime, fromEvent, map, take, tap} from "rxjs";
import {Food} from "../../models/Food";
import {FoodService} from "../../services/food.service";
import {RecipeFood} from "../../models/RecipeFood";

@Component({
  selector: 'app-recipe-dialog',
  template: `
    <h1 mat-dialog-title>{{getTitle()}}</h1>
    <div mat-dialog-content>
      <form [formGroup]="recipeForm" (ngSubmit)="onSubmitRecipe()" fxFlexFill fxFlexAlign>
        <mat-form-field>
          <input matInput
                 placeholder="Nom du repas"
                 formControlName="name"
                 required>
          <mat-error *ngIf="isFieldError('name') ">
            <div *ngIf="recipeForm.get('name')?.hasError('minlength')">
              Le nom doit faire 5 caractères minimum
            </div>
            <div *ngIf="recipeForm.get('name')?.hasError('maxlength')">
              Le nom doit faire 255 caractères maximum
            </div>
            <div *ngIf="recipeForm.get('name')?.hasError('required')">
              Le nom est obligatoire
            </div>
          </mat-error>
        </mat-form-field>

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
            (click)="addRecipeFood(option);foodSearch.value = ''">{{option.name}}</mat-option>
        </mat-autocomplete>

      </form>
      <mat-divider></mat-divider>
      <mat-list>
        <mat-list-item *ngFor="let food of foods.controls">
          <div fxLayout="row" fxFlexFill>
            <div fxLayoutAlign="center center">{{food.value.name}}</div>
            <div fxFlexOffset="auto">
              <button mat-icon-button color="primary" (click)="removeRecipeFood(food.value)">
                <mat-icon aria-label="Delete">delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-list-item>
      </mat-list>
      <div mat-dialog-actions>
        <button mat-button (click)="dialogRef.close()">Close</button>
        <button mat-button (click)="onSubmitRecipe()">Valider</button>
      </div>
    </div>
  `,
  styleUrls: ['./recipe-dialog.component.css']
})
export class RecipeDialogComponent implements AfterViewInit {
  recipeForm: FormGroup;
  foodsMinimal: Food[] = [];
  filteredFoods: BehaviorSubject<Food[]> = new BehaviorSubject<Food[]>([]);


  constructor(public dialogRef: MatDialogRef<RecipeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Recipe | null,
              private formBuilder: FormBuilder,
              private recipeService: RecipeService,
              private foodService: FoodService
  ) {
    const formArray = this.formBuilder.array([])
    console.log(this.data?.recipeFoods)
    this.data?.recipeFoods?.forEach(value => {
      formArray.push(this.createRecipeFood(value.food))
    })
    this.recipeForm = formBuilder.group({
      name: new FormControl(data?.name, Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(255),
        Validators.required
      ])),
      foods: formArray
    })
    this.foodService.getFoods().pipe(
      take(1)
    ).subscribe(value => {
      this.foodsMinimal = value
    })
  }


  get foods(): FormArray<FormControl<Food>> {
    return <FormArray<FormControl>>this.recipeForm.get('foods')
  }

  addRecipeFood(foodMinimal: Food) {
    this.foods.push(this.createRecipeFood(foodMinimal))
    this.foodsMinimal = this.foodsMinimal.filter(e => e.id !== foodMinimal.id)
    this.filteredFoods.next(this.foodsMinimal)

  }

  removeRecipeFood(foodMinimal: Food) {
    const index = this.foods.value.findIndex(e => e.id === foodMinimal.id)
    this.foods.removeAt(index)
    this.foodsMinimal.push(foodMinimal)
    this.filteredFoods.next(this.foodsMinimal)
  }

  onSubmitRecipe() {
    if (!this.recipeForm.valid) {
      this.recipeForm.markAsTouched()
      return
    }

    const recipeFoods: RecipeFood[] = this.foods.value.map(e => {
      return {
        id: e.id,
        food: e,
        quantity: 1,
        conversionFactor: {
          id: 1,
          factor: 0.5,
          measure: {
            id: 1,
            name: 'portion-test'
          },
        }
      }
    })
    const recipe: Recipe = {
      name: this.recipeForm.get('name')?.value,
      recipeFoods: recipeFoods
    }
    console.log(recipe)
    if (this.data) {
      this.recipeService.updateRecipe(this.data.id!!, recipe)
    } else {
      this.recipeService.createRecipe(recipe)
    }

    this.dialogRef.close()
  }

  ngAfterViewInit(): void {
    console.log(this.foodsMinimal)

    const foodSearch = document.getElementById("foodSearch")
    if (!foodSearch) {
      console.error("no food search")
    }
    const foodSearch$ = fromEvent<any>(foodSearch!, 'input')
    foodSearch$.pipe(
      tap(console.log),
      map(value => value.target.value),
      debounceTime(50),
      map(e => this.filterFoodMinimals(e))
    ).subscribe(value => {
      this.filteredFoods.next(value)
      console.log(value)
      foodSearch!.innerHTML = ''
    })
  }

  isFieldError(fieldName: string) {
    const field = this.recipeForm.get(fieldName)
    if (!field) {
      console.error('field dont exist')
      return
    }
    return field.invalid && field.errors && (field.dirty || field.touched)
  }

  getTitle() {
    return this.data?.id ? 'éditer la recette' : 'Nouvelle recette';
  }

  private createRecipeFood(foodMinimal: Food): FormControl {
    return new FormControl<Food>(foodMinimal, [])
  }

  private filterFoodMinimals(e: string) {
    const alreadyAdded = this.foods.controls.map(e => e.value);
    return this.foodsMinimal
      .filter(e => !alreadyAdded.find(e2 => e.id === e2.id))
      .filter(food => food.name.toLowerCase().includes(e.toLowerCase()));
  }
}
