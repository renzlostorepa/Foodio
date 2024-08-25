import {Component, type OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {first} from 'rxjs';
import {FormControl, Validators,} from '@angular/forms';

// @ts-ignore
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  role: string = 'CLIENTE';
  hide = true;
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  spinner = false;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.spinner = true;
    this.authService
      .loginService(this.role, this.username.value, this.password.value)
      .pipe(first())
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        next: (res) => {
          localStorage.setItem('token', res.token);
          if (typeof this.username.value === "string") {
            localStorage.setItem('username', this.username.value);
          }
          this.spinner = false;
          this.router.navigate([this.role.toLowerCase()]);
        },
        error: (res) => {
          this.spinner = false;
          console.error('ERRORE');
        },
      });
  }

  register() {
    this.router.navigate(['/register'])
  }
}
