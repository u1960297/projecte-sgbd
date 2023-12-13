import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginData } from 'src/app/interfaces/login-data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  register(data: LoginData) {
    this.authService
      .register(data)
      .then(() => this.router.navigate(['/login']))
      .catch((e) => {
        if (e.code === 'auth/email-already-in-use') {
          alert('El correu ja està en ús.');
        } else {
          console.log(e.message);
        }
      });
  }
}