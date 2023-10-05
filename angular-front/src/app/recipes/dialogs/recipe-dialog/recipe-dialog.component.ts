import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Recipe} from "../../models/Recipe";
import {RecipeService} from "../../services/recipe.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Food} from "../../models/Food";
import {RecipeFood} from "../../models/RecipeFood";
import {ConversionFactor} from "../../models/ConversionFactor";

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


              <app-search-add-food
                      (addFoodEmitter)="addRecipeFood($event)"
                      [alreadyAddedFoods]="alreadyAddedFoods"
              />


            <mat-list formArrayName="foods">
              <mat-list-item *ngFor="let recipeFood of recipeFoods.controls; let i = index" [formGroupName]="i">
                <div fxLayout="row" fxFlexFill>
                  <div fxLayoutAlign="center center">{{recipeFood.value.food.name}}</div>
                  <div>
                    <mat-form-field>
                      <mat-label>Quantité</mat-label>
                      <input matInput placeholder="Quantité"
                             formControlName="quantity"
                             type="number"
                             required>
                    </mat-form-field>
                  </div>
                  <div>
                    <mat-form-field>
                      <mat-label>Portion</mat-label>
                      <mat-select formControlName="conversionFactor">
                        <ng-container *ngIf="recipeFood.value.food.conversionFactors">
                          <mat-option
                            *ngFor="let conversionFactor of recipeFood.value.food.conversionFactors"
                            [value]="conversionFactor">
                            {{conversionFactor.measure.name}}
                          </mat-option>
                        </ng-container>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <div fxFlexOffset="auto">
                    <button mat-icon-button color="primary" (click)="removeRecipeFood(recipeFood.value)">
                      <mat-icon aria-label="Delete">delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>

          </form>
          <mat-divider></mat-divider>

          <div mat-dialog-actions>
              <button mat-button (click)="dialogRef.close()">Close</button>
              <button mat-button (click)="onSubmitRecipe()">Valider</button>
          </div>
      </div>
  `,
  styleUrls: ['./recipe-dialog.component.css']
})
export class RecipeDialogComponent {
  recipeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<RecipeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Recipe | null,
              private formBuilder: FormBuilder,
              private recipeService: RecipeService,
  ) {
    this.recipeForm = this.initializeForm();
    console.log(this.recipeForm)
  }

  get recipeFoods(): FormArray<FormGroup> {
    return <FormArray<FormGroup>>this.recipeForm.get('foods')
  }

  protected get alreadyAddedFoods(): Food[] {
    return this.recipeFoods.controls.map(e => e.value).map(e => e.food)
  }

  isFieldError(fieldName: string) {
    const field = this.recipeForm.get(fieldName)
    if (!field) {
      console.error('field dont exist')
      return
    }
    return field.invalid && field.errors && (field.dirty || field.touched)
  }

  removeRecipeFood(recipeFood: RecipeFood) {
    const index = this.recipeFoods.value.findIndex(e => e.food.id === recipeFood.food.id)
    this.recipeFoods.removeAt(index)
  }

  addRecipeFood(food: Food) {
    const test = this.createRecipeFood(food);
    this.recipeFoods.push(test)
  }


  getTitle() {
    return this.data?.id ? 'éditer la recette' : 'Nouvelle recette';
  }

  onSubmitRecipe() {
    if (!this.recipeForm.valid) {
      this.recipeForm.markAsTouched()
      return
    }

    const recipeFoods: RecipeFood[] = this.recipeFoods.value.map(e => {
      return {
        food: e.food,
        quantity: e.quantity,
        conversionFactor: e.conversionFactor
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

  private initializeForm(): FormGroup {
    const formArray = this.initializeRecipeFoodFormArray();
    return this.initializeRecipeForm(formArray);
  }

  private initializeRecipeForm(formArray: FormArray) {
    return this.formBuilder.group({
      name: new FormControl(this.data?.name, Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(255),
        Validators.required
      ])),
      foods: formArray
    })
  }

  private initializeRecipeFoodFormArray() {
    const formArray = this.formBuilder.array<FormGroup>([])
    this.data?.recipeFoods?.forEach(value => {
      formArray.push(this.createRecipeFood(value.food))
    })
    return formArray;
  }

  private createRecipeFood(food: Food): FormGroup {
    return this.formBuilder.group({
      food: new FormControl<Food>(food),
      conversionFactor: new FormControl<ConversionFactor>(food.conversionFactors[0]),
      quantity: new FormControl<number>(1)
    });
  }
}
