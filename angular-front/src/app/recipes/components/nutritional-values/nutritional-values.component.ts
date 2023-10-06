import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {NutritionalValue} from "../../models/NutritionalValues";
import {capitalizeFirstLetter} from "../../../utils/string-utils";
import {BehaviorSubject, Subject} from "rxjs";

export interface NutritionalRows {
  nutrientName: string,
  value: string,
  barColor: string,
  percentage: number
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nutritional-values',
  template: `
      <div fxLayout="column" fxLayoutGap="16px">
          <ng-container *ngFor="let entry of nutritionalValuesByNutrientGroupId | keyvalue"

          >
              <mat-card fxFlex="50">
                  <mat-card-content>
                      <table mat-table [dataSource]="entry.value">
                          <ng-container matColumnDef="nutrient">
                              <th mat-header-cell *matHeaderCellDef> Nutriment</th>
                              <td mat-cell *matCellDef="let element"
                              >{{element.nutrientName}}</td>
                          </ng-container>
                          <ng-container matColumnDef="value">
                              <th mat-header-cell *matHeaderCellDef> Valeur</th>
                              <td mat-cell *matCellDef="let row"> {{row.value}} </td>
                          </ng-container>
                          <ng-container matColumnDef="percentage">
                              <th mat-header-cell *matHeaderCellDef> Pourcentage</th>
                              <td mat-cell *matCellDef="let row">
                                  <div class="row bar" style="">
                                      <div class="percentage"
                                           [ngStyle]="{width: row.percentage+'%', backgroundColor: row.barColor}"></div>
                                  </div>
                              </td>
                          </ng-container>
                          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                          <tr
                                  mat-row
                                  *matRowDef="let row; columns: displayedColumns;"
                          ></tr>
                      </table>
                  </mat-card-content>
              </mat-card>
          </ng-container>
      </div>

  `,
  styleUrls: ['./nutritional-values.component.css']
})
export class NutritionalValuesComponent implements OnChanges {
  @Input()
  nutritionalValues: NutritionalValue[] | null = []

  nutritionalValuesByNutrientGroupId: Map<number, NutritionalRows[]> = new Map<number, NutritionalRows[]>();
  nutritionalValuesSubject: Subject<Map<number, NutritionalRows[]>> = new BehaviorSubject(new Map);

  /*  nutritionalRows: NutritionalRows[] = []*/
  displayedColumns: string[] = ['nutrient', 'value', 'percentage']

  ngOnChanges(): void {
    if (!this.nutritionalValues) {
      return
    }
    this.nutritionalValuesByNutrientGroupId = new Map<number, NutritionalRows[]>();
    this.nutritionalValues.forEach(value => {
      const {nutrientGroup} = value.nutrient
      const {id} = nutrientGroup
      if (this.nutritionalValuesByNutrientGroupId.has(id) === false) {
        this.nutritionalValuesByNutrientGroupId.set(id, []);
      }
      let nutritionalRows = this.nutritionalValuesByNutrientGroupId.get(id)!
      nutritionalRows.push(this.getNutritionalRow(value));
      this.nutritionalValuesByNutrientGroupId.set(
        id,
        nutritionalRows
      )
    })
    this.nutritionalValuesByNutrientGroupId.forEach((value, key) => {
      this.nutritionalValuesByNutrientGroupId.set(key, value.sort((a, b) => {
        if (a.nutrientName < b.nutrientName) {
          return -1;
        } else {
          return 1;
        }
      }))
    })
  }

  private getNutritionalRow(value: NutritionalValue) {
    const percentage = (value.value / value.nutrient.requirement) * 100;
    return {
      nutrientName: capitalizeFirstLetter(value.nutrient.friendlyNameFr ? value.nutrient.friendlyNameFr : value.nutrient.nameFr),
      value: Math.round(value.value) + " / " + value.nutrient.requirement + value.nutrient.unit,
      barColor: this.getBarColor(percentage),
      percentage: percentage
    }
  }

  getBarColor(percentage: number) {
    if (percentage > 85) {
      return "#46eb34"
    } else if (percentage > 75) {
      return "#cceb34"
    } else if (percentage > 50) {
      return "#eb9934"
    } else if (percentage > 25) {
      return "#eb4f34"
    }
    return "#eb3434"
  }


}
