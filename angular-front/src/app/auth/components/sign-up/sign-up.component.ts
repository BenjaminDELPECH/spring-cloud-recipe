import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {SignInPayload} from "../../models/SignInPayload";

@Component({
  selector: 'app-sign-up',
  template: `
    <button mat-raised-button color="accent" (click)="router.navigate(['auth', 'signIn'])">Déjà inscrit ? Se connecter</button>
    <form [formGroup]="signUpForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" placeholder="Email">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" placeholder="Password">
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit">Sign Up</button>
    </form>`,
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnDestroy {
  signUpForm: FormGroup;
  private subscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {
    this.signUpForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
