import {Component} from '@angular/core';
import {Router, Routes} from "@angular/router";
import {routes} from "./app-routing.module";
import {AuthService} from "./auth/services/auth.service";

@Component({
  selector: 'app-root',
  template: `
      <mat-toolbar color="primary">
          <mat-toolbar-row>
              <button mat-icon-button (click)="sidenav.toggle()" fxShow="true" fxHide.gt-sm>
                  <mat-icon>menu</mat-icon>
              </button>
              <span (click)="goToHome()" style="cursor: pointer">My recipes.com</span>
              <span class="menu-spacer"></span>
              <div fxShow="true" fxHide.lt-md style="margin-left:2rem;">
                  <ng-template ngFor [ngForOf]="routes" let-route>
                      <a [routerLink]="route.path" mat-button>
                          {{route.path}}
                      </a>
                  </ng-template>
              </div>
              <div fxShow="true" fxHide.lt-md style="margin-left:auto;">
                  <!-- Si l'utilisateur est connecté -->
                  <ng-container *ngIf="isLoggedIn; else notLoggedIn">
                      <mat-icon>account_circle</mat-icon>
                      <button mat-icon-button (click)="logout()">
                          <mat-icon>logout</mat-icon>
                      </button>
                  </ng-container>
                  <!-- Si l'utilisateur n'est pas connecté -->
                  <ng-template #notLoggedIn>
                      <a mat-button [routerLink]="'/login'">Me connecter</a>
                      <a mat-button [routerLink]="'/register'">M'inscrire</a>
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
  pathListToShowInMenu: string[] = ['recipes']
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.routes = routes.filter(e1 => this.pathListToShowInMenu.find(e2 => e1.path === e2))
    this.isLoggedIn = !!authService.getJwtToken()
  }

  goToHome() {
    this.router.navigate(['/home'])
  }

  logout() {
    this.authService.setJwtToken("");
    window.location.href = '/'
  }
}
