import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {RecipeService} from "../../services/recipe.service";
import {Recipe} from "../../models/Recipe";
import {Location} from "@angular/common";

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
    <mat-card class="md-margin">
      <mat-card-title style="padding:0.5rem;">
        <div fxLayout>
          <button mat-icon-button (click)="goBack()" fxShow="true">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="" fxFlexAlign="center">{{(recipe | async)?.name}}</div>
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

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  @Input('id') recipeId?: string;

  recipe: Subject<Recipe | null> = new Subject();

  foodRows: Subject<RecipeFoodRow[]> = new Subject<RecipeFoodRow[]>();
  displayedColumns: string[] = ['quantity', 'measure', 'foodName']
  subscriptionRecipe: Subscription;

  constructor(protected recipeService: RecipeService, private location: Location) {
    this.subscriptionRecipe = this.recipeService.recipe.subscribe(value => {
      if (!value) return
      this.foodRows.next(
        this.mapToRows(value)
      )
      this.recipe.next(value)
    })
  }

  ngOnDestroy(): void {

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
