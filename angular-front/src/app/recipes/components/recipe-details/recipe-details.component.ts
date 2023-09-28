import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {RecipeService} from "../../services/recipe.service";
import {Recipe} from "../../models/Recipe";
import {Location} from "@angular/common";
import {RecipeFood} from "../../models/RecipeFood";
import {RecipeFoodDialogComponent} from "../../dialogs/recipe-food-dialog/recipe-food-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {NutritionalValue} from "../../models/NutritionalValues";

interface RecipeFoodRow {
  id: number,
  foodName: string,
  foodId: number,
  measure: string,
  quantity: number
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-details',
  template: `
    <mat-grid-list cols="2">
      <mat-grid-tile>
        <mat-card class="md-margin">
          <mat-card-title style="">
            <div fxLayout>
              <button mat-icon-button (click)="goBack()" fxShow="true">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <div class="" fxFlexAlign="center">{{(recipeSubject | async)?.name}}</div>
            </div>
          </mat-card-title>
          <mat-card-content fxFlex fxLayout="column">

            <mat-divider></mat-divider>
            <table mat-table [dataSource]="foodRows" class="mat-elevation-z0">
              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef> Quantité</th>
                <td mat-cell *matCellDef="let element">{{element.quantity}}</td>
              </ng-container>
              <ng-container matColumnDef="measure">
                <th mat-header-cell *matHeaderCellDef> Mesure</th>
                <td mat-cell *matCellDef="let element">{{element.measure}}</td>
              </ng-container>
              <ng-container matColumnDef="foodName">
                <th mat-header-cell *matHeaderCellDef> Aliment</th>
                <td mat-cell *matCellDef="let element">{{element.foodName}}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>
                  <button mat-icon-button color="primary" label="lol" (click)="openRecipeFoodDialog()">
                    <mat-icon aria-label="Example icon-button with a heart icon">add</mat-icon>
                  </button>
                </th>

                <td mat-cell *matCellDef="let row; let i=index;">
                  <button mat-icon-button color="primary" (click)="openRecipeFoodDialog(row.id)">
                    <mat-icon aria-label="Edit">edit</mat-icon>
                  </button>

                  <button mat-icon-button color="primary" (click)="deleteRecipeFood(row.id)">
                    <mat-icon aria-label="Delete">delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card class="md-margin">
          <app-nutritional-values [nutritionalValues]="nutritionalValues | async"/>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  @Input('id') recipeId?: string;

  recipe?: Recipe;
  recipeSubject: Subject<Recipe | null> = new Subject();

  nutritionalValues: Subject<NutritionalValue[]> = new Subject();

  foodRows: Subject<RecipeFoodRow[]> = new Subject<RecipeFoodRow[]>();
  displayedColumns: string[] = ['quantity', 'measure', 'foodName', 'actions']
  subscriptionRecipe: Subscription;
  subscriptionNutritionalValues: Subscription;

  constructor(protected recipeService: RecipeService,
              private dialogService: MatDialog,
              private location: Location) {
    this.subscriptionRecipe = this.recipeService.recipe.subscribe(value => {
      if (!value) return
      this.foodRows.next(
        this.mapToRows(value)
      )
      this.recipeSubject.next(value)
      this.recipe = value;
    })
    this.subscriptionNutritionalValues = this.recipeService.recipeNutritionalValues.subscribe(value => {
      if (!value) {
        return;
      }
      console.log(value)
      this.nutritionalValues.next(value.nutrientValues)
    })
  }

  ngOnDestroy(): void {
    this.subscriptionRecipe.unsubscribe();
    this.subscriptionNutritionalValues.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.recipeId) {
      return;
    }
    this.recipeService.loadRecipe(this.recipeId)
  }

  goBack() {
    this.location.back()
  }

  openRecipeFoodDialog(recipeFoodId?: number) {
    const recipeFood: RecipeFood | undefined = this.recipe?.recipeFoods.find(e => e.id === recipeFoodId)
    this.dialogService.open(
      RecipeFoodDialogComponent, {
        data: {
          recipeFood: recipeFood,
          recipeId: this.recipeId
        }
      })
  }

  deleteRecipeFood(recipeFoodId: number) {
    const recipeFood: RecipeFood | undefined = this.recipe?.recipeFoods.find(e => e.id === recipeFoodId)
    this.recipeService.deleteRecipeFood(this.recipeId!.toString(), recipeFood!);
  }

  private mapToRows(value: Recipe): RecipeFoodRow[] {
    return value.recipeFoods.map(e => {
      return {
        id: e.id!!,
        foodId: e.food.id!!,
        foodName: e.food.name,
        measure: e.conversionFactor.measure.name,
        quantity: e.quantity
      }
    });
  }
}
