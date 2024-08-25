import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent {
  spinner = false;
  role!: string
  hide = true;
  fb!: FormBuilder
  form!: FormGroup


  constructor(private router: Router, private authService: AuthenticationService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.role = 'CLIENTE'
    this.fb = new FormBuilder()
    this.adaptFormGroup()
  }

  adaptFormGroup() {
    switch (this.role) {
      case 'CLIENTE':
        this.form = this.fb.group(customerForm, {validators: passwordMatchingValidation}
        )
        break
      case 'RISTORATORE':
        this.form = this.fb.group(ristoratoreForm, {validators: passwordMatchingValidation}
        )
        break
      default:
        this.form = this.fb.group(riderForm, {validators: passwordMatchingValidation}
        )
    }
  }

  login() {
    this.router.navigate(['login'])
  }

  register() {
    let user = this.form.getRawValue()
    delete user.confirmPassword
    user.role = this.role
    if (this.role === 'RISTORATORE') {
      user.menu = []
      user.working = false
    } else if (this.role === 'RIDER') {
      delete user.restaurant_name
      user.working = true
    } else delete user.restaurant_name

    this.authService.signUp(user).then((data: any) => this.snackBar.open(data, "Ok")).catch(error => this.snackBar.open(error.statusText, "Ok"))
  }
}

export const passwordMatchingValidation: (control: AbstractControl) => (void | null) = (control: AbstractControl): null | void => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password?.value === confirmPassword?.value ? null : confirmPassword?.setErrors({notmatching: true});
};

export const customerForm = {
  username: ['', Validators.required],
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required],
  restaurant_name: ['', []],
  address: ['', Validators.required],
  cap: ['', Validators.required],
  city: ['', Validators.required]
}

export const ristoratoreForm = {
  username: ['', Validators.required],
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required],
  restaurant_name: ['', Validators.required],
  address: ['', Validators.required],
  cap: ['', Validators.required],
  city: ['', Validators.required]
}

export const riderForm = {
  username: ['', Validators.required],
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}

