import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {RecipeService} from "../../services/recipe.service";
import {Recipe} from "../../models/Recipe";
import {Location} from "@angular/common";
import {RecipeFood} from "../../models/RecipeFood";
import {RecipeFoodDialogComponent} from "../../dialogs/recipe-food-dialog/recipe-food-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {NutritionalValue} from "../../models/NutritionalValues";
import {ActivatedRoute} from "@angular/router";

interface RecipeFoodRow {
  id: number,
  foodName: string,
  foodId: number,
  measure?: string,
  quantity: number
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-details',
  template: `
    <div fxLayout="column" fxLayoutGap="20px">
      <div fxLayout="row" fxLayoutGap="20px">
        <mat-card fxFlex="50">
          <mat-card-header>
            <mat-card-title>
              <button mat-icon-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
              </button>
              {{(recipeSubject | async)?.name}}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
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

        <mat-card fxFlex="50">
          <mat-card-content>
            <app-nutritional-values [nutritionalValues]="nutritionalValues | async"></app-nutritional-values>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
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
  private queryParamSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected recipeService: RecipeService,
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
      this.nutritionalValues.next(value)
    })
    this.queryParamSubscription = this.activatedRoute.params.pipe(
    ).subscribe(params => {
      const id = params['id'];
      this.recipeService.loadRecipe(id);
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.queryParamSubscription.unsubscribe();
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
    this.recipeService.deleteRecipeFood(recipeFood!);
  }

  private mapToRows(value: Recipe): RecipeFoodRow[] {
    return value.recipeFoods.map(e => {
      return {
        id: e.id!!,
        foodId: e.food.id!!,
        foodName: e.food.name,
        measure: e.conversionFactor?.measure.name,
        quantity: e.quantity
      }
    });
  }
}
