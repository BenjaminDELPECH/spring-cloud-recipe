import {Component, Input, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignInPayload} from "../../models/SignInPayload";
import {AuthService} from "../../services/auth.service";
import {Subscription, take} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Dialog} from "@angular/cdk/dialog";


@Component({
  selector: 'app-sign-in',
  template: `
    <mat-card *ngIf="isSignInPage">
      <mat-card *ngIf="errorMessage">
        <mat-card-content>
          <mat-error>{{errorMessage}}</mat-error>
        </mat-card-content>
      </mat-card>
      <mat-card-header>
        <mat-card-title>Connexion</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="accent" (click)="swapSignInSignUp()">Pas encore inscrit ? S'inscrire</button>
        <div *ngIf="!!registered">
          Inscription réussie, vous pouvez vous connecter.
        </div>
        <form [formGroup]="signInForm" (ngSubmit)="onSignIn()" style="margin-top: 0.5rem;">
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
      <mat-card *ngIf="errorMessage">
        <mat-card-content>
          <mat-error>{{errorMessage}}</mat-error>
        </mat-card-content>
      </mat-card>
      <mat-card-header>
        <mat-card-title>Inscription</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="accent" (click)="swapSignInSignUp()">Déjà inscrit ? Se connecter</button>
        <form [formGroup]="signUpForm" (ngSubmit)="onSignUp()" style="margin-top: 0.5rem;">
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

  public errorMessage: string | null = null;

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
    this.authService.signIn(payload)
      .pipe(
        take(1)
      )
      .subscribe({
        next: () => {
          this.dialog.closeAll()
          this.snackBar.open('Vous etes bien connecté', 'close', {duration: 2000, panelClass: 'successSnack'});
          window.location.href = '/'
        },
        error: (error) => {
          this.errorMessage = error.error;
        }
      })
  }

  onSignUp() {
    if (this.signUpForm.valid === false) {
      this.signUpForm.markAsTouched()
      return
    }
    const payload: SignInPayload = this.signUpForm.value;
    this.subscription = this.authService.signUp(payload)
      .pipe(
        take(1)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['auth', 'signIn'], {
            queryParams: {
              registered: 'true'
            }
          });
        },
        error: (error) => {
          this.errorMessage = error.error;
        }
      })
  }

  swapSignInSignUp() {
    this.isSignInPage = !this.isSignInPage;
    this.errorMessage = '';
  }

  ngOnDestroy()
    :
    void {
    this.subscription?.unsubscribe();
  }

}
