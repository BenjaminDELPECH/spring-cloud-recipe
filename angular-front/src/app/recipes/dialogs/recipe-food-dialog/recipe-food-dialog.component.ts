import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../../services/recipe.service";
import {RecipeFood} from "../../models/RecipeFood";
import {ConversionFactor} from "../../models/ConversionFactor";
import {BehaviorSubject, take} from "rxjs";
import {Food} from "../../models/Food";
import {FoodService} from "../../services/food.service";

export interface RecipeFoodDialogData {
  recipeFood: RecipeFood | undefined,
  recipeId: number
}

@Component({
  selector: 'app-recipe-food-dialog',
  template: `
      <h1 mat-dialog-title>{{getTitle()}}</h1>
      <div mat-dialog-content>
          Ingrédient selectionné : {{recipeFoodForm.get('food')?.value?.name}}
          <form [formGroup]="recipeFoodForm" fxFlexFill fxFlexAlign (ngSubmit)="onSubmit()" >
              <app-search-add-food
                      [value]="data.recipeFood?.food"
                      (addFoodEmitter)="setRecipeFood($event)"
                      [showLastSelected]="true"
                      [alreadyAddedFoods]="alreadyFoods"></app-search-add-food>
              <ng-container *ngIf="recipeFoodForm.get('food')?.value">
                  <mat-form-field>
                      <mat-label>Quantité</mat-label>
                      <input matInput
                             placeholder="Quantité"
                             formControlName="quantity"
                             required>
                      <mat-error *ngIf="isFieldError('quantity') ">
                          <div *ngIf="recipeFoodForm.get('quantity')?.hasError('minlength')">
                              La quantité doit etre supérieure à 0
                          </div>
                          <div *ngIf="recipeFoodForm.get('quantity')?.hasError('maxlength')">
                              La quantité doit etre inférieur à 100000
                          </div>
                          <div *ngIf="recipeFoodForm.get('quantity')?.hasError('required')">
                              La quantité est obligatoire
                          </div>
                      </mat-error>
                  </mat-form-field>
                  <mat-form-field>
                      <mat-label>Portion</mat-label>
                      <mat-select formControlName="conversionFactor" [compareWith]="compareFn">
                          <mat-option *ngFor="let convFactor of conversionFactorsSubject | async" [value]="convFactor">
                              {{convFactor.measure.nameFrench}}
                          </mat-option>
                      </mat-select>
                  </mat-form-field>
              </ng-container>
          </form>
          <div mat-dialog-actions>
              <button mat-button (click)="dialogRef.close()">Close</button>
              <button mat-button (click)="onSubmit()">Valider</button>
          </div>
      </div>
  `,
  styleUrls: ['./recipe-food-dialog.component.css']
})
export class RecipeFoodDialogComponent {
  alreadyFoods: Food[] = []
  recipeFoodForm: FormGroup;
  conversionFactorsSubject: BehaviorSubject<ConversionFactor[]> = new BehaviorSubject<ConversionFactor[]>([]);

  constructor(public dialogRef: MatDialogRef<RecipeFoodDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: RecipeFoodDialogData,
              private formBuilder: FormBuilder,
              private recipeService: RecipeService,
              private foodService: FoodService) {
    this.recipeFoodForm = this.initializeForm()
    const recipeSubscription = recipeService.recipe.subscribe(value => {
      if (!value?.recipeFoods) {
        return
      }
      this.alreadyFoods = value?.recipeFoods.map(e => e.food)
    })
    if (!data.recipeFood) {
      return
    }
    this.foodService.getCompleteFood(data.recipeFood?.food!).pipe(
      take(1)
    ).subscribe(value => {
      this.conversionFactorsSubject.next(value.conversionFactors)
      const alreadySelected = (this.data.recipeFood?.conversionFactor)
      if (alreadySelected) {
        const already = value.conversionFactors.find(e => e.id === alreadySelected.id)
        this.recipeFoodForm.get('conversionFactor')?.setValue(already);
      }
    })
  }

  compareFn(c1: ConversionFactor, c2: ConversionFactor): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit() {
    if (!this.recipeFoodForm.valid) {
      this.recipeFoodForm.markAsTouched()
      return
    }
    if (this.data && this.data.recipeFood?.id) {
      const recipeFood = {...this.recipeFoodForm.value}
      recipeFood.meal = this.data.recipeFood.meal
      this.recipeService.updateRecipeFood(this.data.recipeId, this.data.recipeFood!.id!, recipeFood)
    } else {
      this.recipeService.addRecipeFood(this.data.recipeId, {...this.recipeFoodForm.value})
    }
    this.dialogRef.close()
  }

  setRecipeFood(food: Food) {
    this.recipeFoodForm.get('food')?.setValue(food)
    this.conversionFactorsSubject.next(food.conversionFactors);
  }

  getTitle() {
    return this.data?.recipeFood?.id ? 'éditer l\'ingrédient' : 'Nouvel ingrédient';
  }

  isFieldError(fieldName: string) {
    const field = this.recipeFoodForm.get(fieldName)
    if (!field) {
      console.error('field dont exist')
      return
    }
    return field.invalid && field.errors && (field.dirty || field.touched)
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      food: new FormControl(this.data.recipeFood?.food, Validators.required),
      conversionFactor: new FormControl<ConversionFactor | undefined>(this.data.recipeFood?.conversionFactor, Validators.required),
      quantity: new FormControl(this.data.recipeFood?.quantity, [Validators.required, Validators.min(1), Validators.max(100000)])
    });
  }

}
