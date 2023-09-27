import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {RecipeRoutingModule} from "./recipe-routing.module";
import {RecipeListComponent} from "./containers/recipe-list/recipe-list.component";
import {RecipeDetailsComponent} from "./components/recipe-details/recipe-details.component";
import {MatListModule} from "@angular/material/list";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RecipeDialogComponent} from './dialogs/recipe-dialog/recipe-dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatGridListModule} from "@angular/material/grid-list";

@NgModule({
  declarations: [RecipeListComponent, RecipeDetailsComponent, RecipeDialogComponent],
  imports: [
    MatDialogModule,
    CommonModule,
    RecipeRoutingModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    MatGridListModule
  ],
  exports: [
    RouterModule
  ]
})
export class RecipesModule {
}
