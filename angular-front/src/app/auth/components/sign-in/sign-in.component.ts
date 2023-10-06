import {Component, Input, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignInPayload} from "../../models/SignInPayload";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Dialog} from "@angular/cdk/dialog";


@Component({
  selector: 'app-sign-in',
  template: `
    <mat-card *ngIf="isSignInPage">
      <mat-card-header>
        <mat-card-title>Connexion</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="accent" (click)="swapSignInSignUp()">Pas encore inscrit ? S'inscrire
        </button>
        <div *ngIf="!!registered">
          Inscription réussie, vous pouvez vous connecter.
        </div>
        <form [formGroup]="signInForm" (ngSubmit)="onSignIn()">
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Email">
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Password">
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">Sign In</button>
        </form>
      </mat-card-content>
    </mat-card>
    <mat-card *ngIf="isSignInPage===false">
      <mat-card-header>
        <mat-card-title>Inscription</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="accent" (click)="swapSignInSignUp()">Déjà inscrit ? Se connecter</button>
        <form [formGroup]="signUpForm" (ngSubmit)="onSignUp()">
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Email">
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Password">
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">Sign Up</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnDestroy {
  @Input('registered') registered?: string;
  signInForm: FormGroup;
  signUpForm: FormGroup;
  private subscription?: Subscription;

  isSignInPage = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar,
    private dialog: Dialog
  ) {
    this.signInForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
    this.signUpForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSignIn() {
    if (this.signInForm.valid === false) {
      this.signInForm.markAsTouched()
      return
    }
    const payload: SignInPayload = this.signInForm.value;
    this.authService.signIn(payload).subscribe(value => {
      this.dialog.closeAll()
      this.snackBar.open('Vous etes bien connecté', 'close', {duration: 2000, panelClass: 'successSnack'});
      window.location.href = '/'
    })
  }

  onSignUp() {
    const payload: SignInPayload = this.signUpForm.value;
    this.subscription = this.authService.signUp(payload).subscribe(value => {
      // Vous pouvez ajouter une logique supplémentaire ici, comme la navigation vers une autre page
      this.router.navigate(['auth', 'signIn'], {
        queryParams: {
          registered: 'true'
        }
      });
    });
  }

  swapSignInSignUp() {
    this.isSignInPage = !this.isSignInPage;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
