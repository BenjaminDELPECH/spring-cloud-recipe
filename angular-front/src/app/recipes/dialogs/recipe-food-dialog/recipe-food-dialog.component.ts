import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../../services/recipe.service";
import {RecipeFood} from "../../models/RecipeFood";
import {ConversionFactor} from "../../models/ConversionFactor";
import {BehaviorSubject, take} from "rxjs";
import {ConversionFactorService} from "../../services/conversion-factor.service";
import {Food} from "../../models/Food";

export interface RecipeFoodDialogData {
  recipeFood: RecipeFood | undefined,
  recipeId: number
}

@Component({
  selector: 'app-recipe-food-dialog',
  template: `
    <h1 mat-dialog-title>{{getTitle()}}</h1>
    <div mat-dialog-content>
      Aliment selectionné : {{recipeFoodForm.get('food')?.value?.name}}
      <form [formGroup]="recipeFoodForm" fxFlexFill fxFlexAlign (ngSubmit)="onSubmit()">
        <app-search-add-food
          (addFoodEmitter)="setRecipeFood($event)"
          [showLastSelected]="true"
          [alreadyAddedFoods]="alreadyFoods"></app-search-add-food>
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
          <mat-select formControlName="conversionFactor">
            <mat-option *ngFor="let convFactor of conversionFactorsSubject | async" [value]="convFactor">
              {{convFactor.measure.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
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
              private conversionFactorService: ConversionFactorService) {
    this.recipeFoodForm = this.initializeForm()
    this.setAlreadyFoods()
    this.initializeConversionFactor();

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

  setRecipeFood(foodMinimal: Food) {
    this.recipeFoodForm.get('food')?.setValue(foodMinimal)
    this.setAlreadyFoods()
  }

  setAlreadyFoods(): void {
    console.log("alreadyFood")
    const food = this.recipeFoodForm.get('food')?.value
    if (food) {
      this.alreadyFoods = [food]
    } else {
      this.alreadyFoods = []
    }

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

  private initializeConversionFactor() {
    this.conversionFactorService.getConversionFactors().pipe(take(1))
      .subscribe(value => {
        this.conversionFactorsSubject.next(value);
        if (this.data.recipeFood?.conversionFactor) {
          this.recipeFoodForm.get('conversionFactor')?.setValue(
            value.find(e => e.id === this.data.recipeFood?.conversionFactor.id)
          )
        }
      })
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      food: new FormControl(this.data.recipeFood?.food, Validators.required),
      conversionFactor: new FormControl<ConversionFactor | undefined>(this.data.recipeFood?.conversionFactor, Validators.required),
      quantity: new FormControl(this.data.recipeFood?.quantity, [Validators.required, Validators.min(1), Validators.max(100000)])
    });
  }

}
