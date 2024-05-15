import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formMessages } from '../../../../../shared/constants/error-messages';
import { User } from '../../../../../shared/interfaces/user.interface';
import { emailPattern, passwordPattern } from '../../../../../shared/constants/patterns';
import { UserService } from '../../../../../shared/services/user/user-service.service';
import { ValidatorsService } from '../../../../../shared/services/user/validators.service';
import { AuthService } from '../../../../../shared/services/user/auth-service.service';
import { GameConfigService } from '../../../../../shared/services/game/game-config.service';

/**
 * Componente que representa la página de configuración de la cuenta.
 */
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {
  public currentUser: User = {} as User;
  public users: User[] = [];
  public errorMessage: string = '';
  public isChangeEmailFormSubmitted: boolean = false;
  public isChangePasswordFormSubmitted: boolean = false;
  public changeEmailForm: FormGroup = this.fb.group({
    newEmail: ['', [Validators.required, Validators.pattern(emailPattern)]],
    confirmEmail: ['', [Validators.required]]
  }, {
    validators: [this.validatorsService.isFieldOneEquealFieldTwo('newEmail', 'confirmEmail')]
  });
  public changePasswordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.pattern(passwordPattern)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: [this.validatorsService.isFieldOneEquealFieldTwo('newPassword', 'confirmPassword')]
  });
  public deleteAccountForm: FormGroup = new FormGroup({});
  public rebootAccountForm: FormGroup = new FormGroup({});


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
    private registeredUsersService: UserService,
    private router: Router,
    private gameConfigService: GameConfigService
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser;
  }

  /**
   * Muestra el formulario con el ID especificado.
   * @param idForm: el ID del formulario que se mostrará.
   */
  displayForm(idForm: string): void {
    const form = document.getElementById(idForm);
    if (form && form.classList.contains("d-none")) {
      form.classList.remove("d-none");
      form.classList.add("d-flex");
    } else if (form && form.classList.contains("d-flex")) {
      form.classList.remove("d-flex");
      form.classList.add("d-none");
    }
  }

  /**
   * Recupera la lista de usuarios de forma asincrónica.
   * @returns Una promesa que se resuelve cuando se recupera la lista de usuarios.
   */
  async getUsers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.registeredUsersService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Comprueba si el correo electrónico especificado es un usuario registrado.
   * @param email: el correo electrónico a comprobar.
   * @returns Verdadero si el correo electrónico es un usuario registrado, falso en caso contrario.
   */
  isRegisteredUser(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  /**
   * Cambia el correo electrónico del usuario actual.
   * @param newEmail: el nuevo correo electrónico.
   */
  async changeEmail(newEmail: string) {
    this.isChangeEmailFormSubmitted = true;
    if (!this.changeEmailForm.invalid) {
      await this.getUsers();
      if (this.isRegisteredUser(newEmail)) {
        this.errorMessage = 'El usuario ya está registrado. Ingrese otras credenciales';
      } else {
        this.currentUser.email = newEmail;
        this.userService.updateEmail(newEmail, this.currentUser.user_id).subscribe({
          next: (userData: User) => {
            this.authService.setCurrentUser(userData);
          },
          error: (error: any) => {
            console.log(error);
          }
        });
        this.changeEmailForm.reset();
      }
    }
  }

  /**
   * Cambia la contraseña del usuario actual.
   * @param newPassword: la nueva contraseña.
   */
  changePassword(newPassword: string): void {
    this.isChangePasswordFormSubmitted = true;
    if (!this.changePasswordForm.invalid) {
      this.currentUser.password = newPassword;
      this.userService.updatePassword(newPassword, this.currentUser.user_id).subscribe({
        next: (userData: User) => {
          this.authService.setCurrentUser(userData);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
      this.changePasswordForm.reset();
    }
  }

  /**
   * Elimina la cuenta de usuario actual.
   */
  deleteAccount() {
    this.userService.deleteUser(this.currentUser.user_id).subscribe({
      next: (userData: User) => {
        this.authService.setCurrentUser(userData);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  /**
   * Reinicia la cuenta de usuario actual.
   */
  rebootAccount() {
    this.userService.rebootUser(this.currentUser.user_id).subscribe({
      next: (userData: User) => {
        this.authService.setCurrentUser(userData);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    this.gameConfigService.rebootGameConfig();
  }

  /**
   * Comprueba si un campo de un formulario es válido.
   * @param field: el campo a comprobar.
   * @param form: el formulario a verificar.
   * @returns Verdadero si el campo es válido, falso en caso contrario.
   */
  isValidField(field: string, form: FormGroup): boolean | null {
    return this.validatorsService.isValidField(field, form);
  }

  /**
   * Obtiene el mensaje de error de un campo de un formulario.
   * @param field: el campo para el que se obtiene el mensaje de error.
   * @param form: el formulario del que se obtiene el mensaje de error.
   * @returns El mensaje de error para el campo, o nulo si no hay ningún error.
   */
  getFieldError(field: string, form: FormGroup): string | null {
    const fieldMessage = formMessages.find((message) => message.name === field);
    if (!fieldMessage) return null;

    const errors = form.controls[field].errors || {};

    for (const error of fieldMessage.errors) {
      if (errors[error.type]) {
        return error.message;
      }
    }

    return null;
  }
}
