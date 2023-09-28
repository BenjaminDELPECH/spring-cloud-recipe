import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {NutritionalValue} from "../../models/NutritionalValues";

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
    <table mat-table [dataSource]="nutritionalRows">
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
  `,
  styleUrls: ['./nutritional-values.component.css']
})
export class NutritionalValuesComponent implements OnChanges {
  @Input()
  nutritionalValues: NutritionalValue[] | null = []
  nutritionalRows: NutritionalRows[] = []
  displayedColumns: string[] = ['nutrient', 'value', 'percentage']

  ngOnChanges(): void {
    if (!this.nutritionalValues) {
      return
    }
    this.nutritionalRows = this.nutritionalValues!.map(value => {
      const percentage = (value.value / value.nutrient.requirement) * 100;
      return {
        nutrientName: value.nutrient.name,
        value: Math.round(value.value) + " / " + value.nutrient.requirement + value.nutrient.unit,
        barColor: this.getBarColor(percentage),
        percentage: percentage
      }
    })
    console.log(this.nutritionalRows)
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
