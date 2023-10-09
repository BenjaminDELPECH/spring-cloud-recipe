import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {authGuard} from "./auth.guard";

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./public/public.module').then(value => value.PublicModule)
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then(value => value.RecipesModule),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    bindToComponentInputs: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
