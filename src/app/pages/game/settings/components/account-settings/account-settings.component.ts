import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../shared/interfaces/user.interface';
import { AuthService } from '../../../../../shared/services/auth-service.service';
import { UserService } from '../../../../../shared/services/user-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailPattern, passwordPattern } from '../../../../../shared/constants/patterns';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { formMessages } from '../../../../../shared/constants/error-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit{

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
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser;
  }

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

  isRegisteredUser(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  async changeEmail(newEmail: string) {
    this.isChangeEmailFormSubmitted = true;
    if(!this.changeEmailForm.invalid){
      await this.getUsers();
      if (this.isRegisteredUser(newEmail)) {
        this.errorMessage = 'El usuario ya está registrado. Ingrese otras credenciales';
      }else{
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

  changePassword(newPassword: string): void {
    this.isChangePasswordFormSubmitted = true;
    if(!this.changePasswordForm.invalid){
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

  rebootAccount(): void {

      this.userService.rebootUser(this.currentUser.user_id).subscribe({
        next: (userData: User) => {
          this.authService.setCurrentUser(userData);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
      this.router.navigate(['/game/home-game']);

  }

  isValidField(field: string, form: FormGroup): boolean | null {
    return this.validatorsService.isValidField(field, form);
  }

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
