import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {RecipeService} from "../../services/recipe.service";
import {Recipe} from "../../models/Recipe";
import {Location} from "@angular/common";
import {RecipeFood} from "../../models/RecipeFood";
import {RecipeFoodDialogComponent} from "../../dialogs/recipe-food-dialog/recipe-food-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {NutritionalValue} from "../../models/NutritionalValues";
import {ActivatedRoute, Router} from "@angular/router";

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
      <div fxLayout="row" fxLayoutGap="20px" fxLayout.xs="column">
        <!-- Partie recette -->
        <div fxFlex="50" fxFlex.xs="100">
          <mat-card style="height: auto !important;">
            <mat-card-header>
              <mat-card-title>
                <div style="display: flex; align-items: center;">
                  <button mat-icon-button (click)="goBack()" style="margin-right: 8px;">
                    <mat-icon>arrow_back</mat-icon>
                  </button>
                  <span>{{(recipeSubject | async)?.name}}</span>
                </div>
              </mat-card-title>
            </mat-card-header>
            <mat-card-content fxFlex>
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
                    <button mat-flat-button color="primary"    (click)="openRecipeFoodDialog()" style="display: flex; align-items: center;">
                      <mat-icon style="margin-right: 8px;">add</mat-icon>
                      <span style="line-height: 24px;">Ajouter aliment</span>
                    </button>
                  </th>

                  <td mat-cell *matCellDef="let row; let i=index;">
                    <button mat-icon-button color="primary" (click)="openRecipeFoodDialog(row.id)">
                      <mat-icon aria-label="Edit">edit</mat-icon>
                    </button>

                    <button mat-icon-button color="warn" (click)="deleteRecipeFood(row.id)">
                      <mat-icon aria-label="Delete">delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
              </table>

            </mat-card-content>
          </mat-card>
        </div>
        <!-- Partie valeur nutritionnelle -->
        <div fxFlex="50" fxFlex.xs="100">
          <app-nutritional-values [nutritionalValues]="nutritionalValues | async"></app-nutritional-values>
        </div>
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
    private router: Router,
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
    this.router.navigate(['recipes'])
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
