import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../shared/services/validators.service';
import { UserService } from '../../shared/services/user-service.service';
import { User } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss',
})
export class LoginRegisterComponent {

  //Rules validations for the form sign in
  public signInForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  //Rules validations for the form sign up
  public signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
    password: ['', [Validators.required, Validators.pattern(this.validatorsService.passwordPattern)]],
    repeatPassword: ['', [Validators.required]],
  }, {
    validators: [this.validatorsService.isFieldOneEquealFieldTwo('password', 'repeatPassword')]
  });

  //Rules validations for the form password recovery
  public passwordRecoveryForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
  });

  public isSignUpFormSubmitted: boolean = false;
  public isSignInFormSubmitted: boolean = false;
  public isPasswordRecoveryFormSubmitted: boolean = false;
  public users: User[] = [];


  constructor(private fb: FormBuilder, private validatorsService: ValidatorsService, private registeredUsersService: UserService) { }

  ngOnInit(): void {
    const signupBtn: HTMLElement | null = document.getElementById("signup-btn");
    const signinBtn: HTMLElement | null = document.getElementById("signin-btn");
    const mainContainer: Element | null = document.querySelector(".container");
    const newPassword: HTMLElement | null = document.getElementById("newPassword");
    const newPasswordForm: HTMLElement | null = document.querySelector('.password-recovery-form');

    if (mainContainer) {
      if (signupBtn) {
        signupBtn.addEventListener("click", () => {
          mainContainer.classList.toggle("change");
        });
      }
      if (signinBtn) {
        signinBtn.addEventListener("click", () => {
          mainContainer.classList.toggle("change");
        });
      }
    }
    if (newPassword && newPasswordForm) {
      newPassword.addEventListener("click", () => {
        if (newPasswordForm.style.display === 'none') {
          newPasswordForm.style.display = 'block';
        } else {
          newPasswordForm.style.display = 'none';
        }
      });
    }
  }

  isValidField(field: string, form: FormGroup): boolean | null {
    return this.validatorsService.isValidField(field, form);
  }

  getFieldError(field: string, form: FormGroup): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Campo obligatorio';
        case 'pattern':
          if (field === 'email') {
            return 'Correo electrónico inválido';
          } else if (field === 'password') {
            return 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y tener al menos 6 caracteres';
          }
          break;
        case 'notEqual':
          if (field === 'repeatPassword') {
            return 'Las contraseñas no coinciden';
          }
          break;
        default:
          return null;
      }
    }
    return null;
  }

  async getUsers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.registeredUsersService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          console.log('Users:', this.users);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          reject(error);
        }
      });
    });
  }

  isRegisteredUser(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  isCredentialsValid(email: string, password: string): boolean {
    return this.users.some(user => user.email === email && user.password === password);
  }

  async OnSignUpSubmit() {
    console.log('submited from: ', this.signUpForm.value, this.signUpForm.invalid);
    this.signUpForm.markAllAsTouched();
    this.isSignUpFormSubmitted = true;
    if(!this.signUpForm.invalid) {
      await this.getUsers();
      //Check if the user is already registered
      if (this.isRegisteredUser(this.signUpForm.value.email)) {
        console.log('El usuario ya está registrado');
      } else {
        console.log('El usuario no está registrado');
      }
    };
  }

  async OnSignInSubmit() {
    console.log('submited from: ', this.signInForm.value, this.signInForm.invalid);
    this.signInForm.markAllAsTouched();
    this.isSignInFormSubmitted = true;
    if(!this.signInForm.invalid) {
      await this.getUsers();
      //Check if the user is on the database
      if (this.isCredentialsValid(this.signInForm.value.email, this.signInForm.value.password)) {
        console.log('2',this.users);
        console.log('Las credenciales son válidas');
      } else {
        console.log('2',this.users);
        console.log('Las credenciales no son válidas');
      }
    }
  }

  async OnRecoverPasswordSubmit() {
    console.log('submited from: ', this.passwordRecoveryForm.value, this.passwordRecoveryForm.invalid);
    this.passwordRecoveryForm.markAllAsTouched();
    this.isPasswordRecoveryFormSubmitted = true;
    await this.getUsers();
    //Check if the user is already registered
    if (this.isRegisteredUser(this.passwordRecoveryForm.value.email)) {
      console.log('El usuario ya está registrado');
    } else {
      console.log('El usuario no está registrado');
    }
  }
}



