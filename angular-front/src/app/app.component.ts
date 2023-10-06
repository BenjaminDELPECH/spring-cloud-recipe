import {Component} from '@angular/core';
import {Routes} from "@angular/router";
import {routes} from "./app-routing.module";

@Component({
  selector: 'app-root',
  template: `
      <mat-toolbar color="primary">
          <mat-toolbar-row>
              <button mat-icon-button (click)="sidenav.toggle()" fxShow="true" fxHide.gt-sm>
                  <mat-icon>menu</mat-icon>
              </button>
              <span>My recipes.com</span>
              <span class="menu-spacer"></span>
              <div fxShow="true" fxHide.lt-md>
                  <!-- The following menu items will be hidden on both SM and XS screen sizes -->
                  <ng-template ngFor [ngForOf]="routes" let-route>
                      <a [routerLink]="route.path" mat-button>
                          {{route.path}}
                      </a>
                  </ng-template>
              </div>
          </mat-toolbar-row>
      </mat-toolbar>
      <mat-sidenav-container fxFlexFill>
          <mat-sidenav #sidenav>
              <mat-nav-list>
                  <ng-template ngFor let-route [ngForOf]="routes">
                      <a [routerLink]="route.path" mat-list-item>
                          {{route.path}}
                      </a>
                  </ng-template>
              </mat-nav-list>
          </mat-sidenav>
          <mat-sidenav-content>
              <div style="padding: 1rem; box-sizing: border-box;">
                  <router-outlet></router-outlet>
              </div>
          </mat-sidenav-content>
      </mat-sidenav-container>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  routes: Routes = []

  constructor() {
    this.routes = routes
  }

}
