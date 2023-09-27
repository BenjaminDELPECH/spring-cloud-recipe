import {RouterModule, Routes} from "@angular/router";
import {RecipeListComponent} from "./containers/recipe-list/recipe-list.component";
import {RecipeDetailsComponent} from "./components/recipe-details/recipe-details.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: RecipeListComponent
      },
      {
        path: ':id',
        component: RecipeDetailsComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule {
}
