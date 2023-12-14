import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { LoginData } from 'src/app/interfaces/login-data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  async login(loginData: LoginData) {
    const userExists = await this.authService.getUserByEmail(loginData.email);

    if (userExists) { // L'email ja l'estem utilitzant amb google
      alert('Aquest correu ja està en ús. Si us plau, inicia sessió amb Google.');
    } else { // L'email no l'utilitzem amb google
      this.authService
        .login(loginData)
        .then(() => this.router.navigate(['/home']))
        .catch((e) => console.log(e.message));
    }
  }

  loginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .then(() => this.router.navigate(['/home']))
      .catch((e) => console.log(e.message));
  }
}