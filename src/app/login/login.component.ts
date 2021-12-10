import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatTab } from '@angular/material/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { UsersService } from '../users/users.service';
import { login, signup } from '../users/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  mensaje: string = 'test';

  @Output() messageEvent = new EventEmitter<string>();

  // login
  user: string = '';
  password: string = '';

  // TODO: esto debería estar en el componente "signup"
  // registro
  signupUser: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  signupConfirmPassword: string = '';

  selected = new FormControl(0);

  snackBarDefault: any = {
    horizontalPosition: 'end',
    verticalPosition: 'top',
    duration: 2000,
  };

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private UsersService: UsersService
  ) {}

  ngOnInit(): void {
    this.UsersService.isLoggedIn.subscribe((res) => {
      if (res) {
        this.router.navigate(['./courses']);
      }
    });
  }

  login() {
    const data: login = {
      user: this.user,
      password: this.password,
    };

    this.UsersService.login(data).subscribe((res) => {
      if (res.success) {
        this.snackBar.open(
          'Login exitoso',
          '',
          this.snackBarDefault
        );

        this.router.navigate(['./courses']);
      } else {
        this.snackBar.open(
          'Usuario y/o contraseña equivocados',
          '',
          this.snackBarDefault
        );
      }
    });

    this.user = '';
    this.password = '';
  }

  signup() {
    if (this.signupPassword !== this.signupConfirmPassword) {
      this.snackBar.open(
        'Las contraseñas no coinciden',
        '',
        this.snackBarDefault
      );

      return;
    }

    const data: signup = {
      user: this.signupUser,
      email: this.signupEmail,
      password: this.signupPassword,
    };

    this.UsersService.signup(data).subscribe((res) => {
      if (res.success) {
        this.snackBar.open(
          'Inicia sesión para ingresar',
          '',
          this.snackBarDefault
        );

        this.selected.setValue(0);
      } else {
        this.snackBar.open('Ocurrió un error', '', this.snackBarDefault);
      }
    });

    this.signupUser = '';
    this.signupEmail = '';
    this.signupPassword = '';
    this.signupConfirmPassword = '';
  }
}
