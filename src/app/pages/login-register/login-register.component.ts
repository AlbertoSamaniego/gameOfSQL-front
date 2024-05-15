import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../shared/services/user/validators.service';
import { UserService } from '../../shared/services/user/user-service.service';
import { User } from '../../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { passwordPattern, emailPattern } from '../../shared/constants/patterns';
import { formMessages } from '../../shared/constants/error-messages';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss',
})
/**
 * Representa el componente Iniciar sesión y registrarse.
 * Este componente maneja la autenticación y el registro del usuario.
 */
export class LoginRegisterComponent {

  public signInForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
    repeatPassword: ['', [Validators.required]],
  }, {
    validators: [this.validatorsService.isFieldOneEquealFieldTwo('password', 'repeatPassword')]
  });

  public passwordRecoveryForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
  });

  public isSignUpFormSubmitted: boolean = false;
  public isSignInFormSubmitted: boolean = false;
  public isPasswordRecoveryFormSubmitted: boolean = false;
  public users: User[] = [];
  public errorMessage: string = '';
  public loggedUser: User | null = null;


  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private registeredUsersService: UserService,
    private router: Router,
  ) { }

  /**
   * Inicializa el componente.
   * - agrega detectores de eventos a los botones de registro e inicio de sesión para alternar la clase de "cambio" en el contenedor principal.
   * - agrega un detector de eventos al elemento newPassword para alternar la visualización de newPasswordForm.
   * - agrega un detector de eventos de pulsación de tecla para abrir una ventana emergente con credenciales de inicio de sesión cuando se presiona Alt+Shift+A.
   */
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
    document.addEventListener('keydown', (event) => {
      if (event.altKey && event.shiftKey && (event.key === 'a' || event.key === 'A')) {
        const content = "url:https://game-of-sql.ddev.site/es/user/login\nuser: Gestor de contenido\ncontraseña: Gestor2024GOT";
        const popupWindow = window.open('', '_blank', 'width=600,height=400');
        if (popupWindow) {
          popupWindow.document.write('<pre>' + content + '</pre>');
        } else {
          alert('La ventana emergente fue bloqueada por el navegador. Asegúrate de desbloquear las ventanas emergentes para este sitio.');
        }
      }
    });
  }


  /**
   * Comprueba si un campo específico en un formulario es válido.
   *
   * @param field: el nombre del campo a verificar.
   * @param form: el objeto FormGroup que representa el formulario.
   * @returns Un valor booleano que indica si el campo es válido o no, o nulo si el campo no se encuentra en el formulario.
   */
  isValidField(field: string, form: FormGroup): boolean | null {
    return this.validatorsService.isValidField(field, form);
  }

  /**
   * Recupera el mensaje de error de un campo específico en un formulario.
   * @param field: el nombre del campo.
   * @param form: el objeto FormGroup que representa el formulario.
   * @returns El mensaje de error para el campo, o nulo si no se encuentra ningún mensaje de error.
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

  /**
   * Recupera la lista de usuarios de forma asíncrona.
   * @returns Una promesa que se resuelve cuando la lista de usuarios se recupera correctamente.
   *La promesa se rechaza si hay un error.
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
   * Comprueba si un usuario con el correo electrónico especificado está registrado.
   * @param email: el correo electrónico a comprobar.
   * @returns `true` si un usuario con el correo electrónico especificado está registrado, `false` en caso contrario.
   */
  isRegisteredUser(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  /**
   * Comprueba si el correo electrónico y la contraseña proporcionados coinciden con las credenciales de usuario.
   * @param email: el correo electrónico a comprobar.
   * @param contraseña: la contraseña a verificar.
   * @returns Verdadero si las credenciales son válidas, falso en caso contrario.
   */
  isCredentialsValid(email: string, password: string): boolean {
    return this.users.some(user => user.email === email && user.password === password);
  }

  /**
   * Maneja el evento de envío al registrarse.
   * Marca todos los controles del formulario como tocados, establece el indicador de envío del formulario,
   * comprueba si el formulario es válido, comprueba si el usuario ya está registrado,
   * agrega el usuario, almacena la identificación del usuario y navega a la página de inicio del juego.
   */
  async OnSignUpSubmit() {
    this.signUpForm.markAllAsTouched();
    this.isSignUpFormSubmitted = true;
    if (!this.signUpForm.invalid) {
      await this.getUsers();
      if (this.isRegisteredUser(this.signUpForm.value.email)) {
        this.errorMessage = 'El usuario ya está registrado. Ingrese otras credenciales';
      } else {
        await firstValueFrom(this.registeredUsersService.addUser(this.signUpForm.value.email, this.signUpForm.value.password));
        await this.storeIdUser(this.signUpForm.value.email);
        this.router.navigate(['/game/home-game']);
      }
    };
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Marca todos los controles del formulario como tocados, establece el indicador de envío del formulario,
   * y realiza comprobaciones de validación antes de iniciar sesión como usuario.
   * Si las credenciales son válidas, almacena la identificación del usuario y navega a la página de inicio del juego.
   * En caso contrario, muestra un mensaje de error.
   */
  async OnSignInSubmit() {
    this.signInForm.markAllAsTouched();
    this.isSignInFormSubmitted = true;
    if (!this.signInForm.invalid) {
      await this.getUsers();
      if (this.isCredentialsValid(this.signInForm.value.email, this.signInForm.value.password)) {
        await this.storeIdUser(this.signInForm.value.email)
        this.router.navigate(['/game/home-game']);
      } else {
        this.errorMessage = 'Credenciales inválidas';
      }
    }
  }

  /**
   * Maneja el evento de envío para el formulario de recuperación de contraseña.
   * Marca todos los controles del formulario como tocados, establece el indicador de envío del formulario en verdadero,
   * recupera la lista de usuarios y envía un correo electrónico a la dirección de correo electrónico del usuario
   * con la nueva contraseña si el usuario está registrado.
   */
  async OnRecoverPasswordSubmit() {
    this.passwordRecoveryForm.markAllAsTouched();
    this.isPasswordRecoveryFormSubmitted = true;
    await this.getUsers();
    if (this.isRegisteredUser(this.passwordRecoveryForm.value.email)) {
    } else {
      //TODO: Enviar un email al correo del usuario con la nueva contraseña mediante el módulo SMTP de Drupal
    }
  }

  /**
   * Almacena la identificación del usuario en el almacenamiento local según el correo electrónico proporcionado.
   * @param email: el correo electrónico del usuario.
   */
  async storeIdUser( email: string) {
    await this.getUsers();
    const user = this.users.find(user => user.email === email);
    localStorage.setItem('user', JSON.stringify(user?.user_id));
  }
}



