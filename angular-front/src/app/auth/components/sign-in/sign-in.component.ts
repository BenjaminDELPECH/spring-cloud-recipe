import {Component, Input, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignInPayload} from "../../models/SignInPayload";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-sign-in',
  template: `
    <button mat-raised-button color="accent" (click)="router.navigate(['auth', 'signUp'])">Pas encore inscrit ? S'inscrire</button>
    <div *ngIf="!!registered">
      Inscription réussie, vous pouvez vous connecter.
    </div>
    <form [formGroup]="signInForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" placeholder="Email">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" placeholder="Password">
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit">Sign In</button>
    </form>`,
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnDestroy {
  @Input('registered') registered?: string;
  signInForm: FormGroup;
  private subscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signInForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  onSubmit() {
    if (this.signInForm.valid === false) {
      this.signInForm.markAsTouched()
      return
    }
    const payload: SignInPayload = this.signInForm.value;
    this.authService.signIn(payload).subscribe(value => {
      this.router.navigate(['/'])
      this.snackBar.open('Vous etes bien connecté', 'close', {duration: 2000, panelClass: 'successSnack'});
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
