import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {take} from "rxjs";

interface SignInPayload {
  email: string,
  password: string
}

interface SignUpPayload {
  email: string,
  password: string
}

interface JwtResponse {
  token: string,
  refreshToken: string,
  username: string,
  roles: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly AUTH_URL = "/api/user"

  constructor(private httpClient: HttpClient) {
  }

  signIn(signinPayload: SignInPayload) {
    return this.httpClient.post<JwtResponse>(this.AUTH_URL + "/sign-in", signinPayload).pipe(
      take(1),
      tap(value => {
        this.storeJwtToken(value.token)
      }))
  }

  signUp(signUpPayload: SignUpPayload) {
    return this.httpClient.post<JwtResponse>(this.AUTH_URL + "/sign-up", signUpPayload);
  }

  public getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private storeJwtToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

}
