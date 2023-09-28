import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {RecipeService} from "../../services/recipe.service";
import {Subject, Subscription} from "rxjs";
import {Recipe} from "../../models/Recipe";
import {MatDialog} from "@angular/material/dialog";
import {RecipeDialogComponent} from "../../dialogs/recipe-dialog/recipe-dialog.component";

interface RecipeRow {
  id: number,
  name: string,
  recipeFoods: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-list',
  template: `
    <div style="display: flex;height: 100%;width:100%;flex-flow: wrap">
      <div style="width: 100%;">
        <table mat-table [dataSource]="recipeListRows" style="padding:1rem;" class="mat-elevation-z2">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Nom</th>
            <td mat-cell *matCellDef="let element"
            ><a [href]="'recipes/'+element.id">{{element.name}}</a></td>
          </ng-container>
          <ng-container matColumnDef="recipeFoods">
            <th mat-header-cell *matHeaderCellDef> Ingrédients</th>
            <td mat-cell *matCellDef="let row"> {{row.recipeFoods}} </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>
              <button mat-icon-button color="primary" label="lol" (click)="openRecipeDialog()">
                <mat-icon aria-label="Example icon-button with a heart icon">add</mat-icon>
              </button>
            </th>

            <td mat-cell *matCellDef="let row; let i=index;">
              <button mat-icon-button color="primary" (click)="deleteRecipe(row.id)">
                <mat-icon aria-label="Delete">delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns;"
          ></tr>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipeList: Recipe[] = []
  recipeListRows: Subject<RecipeRow[]> = new Subject<RecipeRow[]>();
  displayedColumns: string[] = ['name', 'recipeFoods', 'actions']
  subscriptionRecipe: Subscription;

  constructor(private recipeService: RecipeService,
              private dialogService: MatDialog) {
    this.subscriptionRecipe = this.recipeService.recipes.subscribe(value => {
      this.recipeList = value
      this.recipeListRows.next(
        this.mapToRows(value)
      )
    })
  }

  ngOnInit(): void {
    this.recipeService.loadRecipes()
  }

  ngOnDestroy(): void {
    this.subscriptionRecipe?.unsubscribe();
  }

  openRecipeDialog(recipeId?: number) {
    const recipe: Recipe | undefined = this.recipeList.find(e => e.id === recipeId)
    this.dialogService.open(
      RecipeDialogComponent, {
        data: recipe,
      })
  }

  deleteRecipe(recipeId: number) {
    this.recipeService.deleteRecipe(recipeId);
  }

  private mapToRows(value: Recipe[]) {
    return value.map(e => {
      return {
        id: e.id!!,
        name: e.name,
        recipeFoods: e.recipeFoods.map(e => e.food.name).join(' ,')
      }
    });
  }
}
