import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { endpoints } from '../../../../../shared/constants/end-points';
import { User } from '../../../../../shared/interfaces/user.interface';
import { Shield } from '../../../../../shared/interfaces/shield.interface';
import { formMessages } from '../../../../../shared/constants/error-messages';
import { AuthService } from '../../../../../shared/services/user/auth-service.service';
import { ShieldsService } from '../../../../../shared/services/shield/shields.service';
import { ValidatorsService } from '../../../../../shared/services/user/validators.service';
import { UserService } from '../../../../../shared/services/user/user-service.service';

@Component({
  selector: 'app-game-profile',
  templateUrl: './game-profile.component.html',
  styleUrls: ['./game-profile.component.scss']
})
export class GameProfileComponent implements OnInit {

  public currentUser: User = {} as User;
  public shields: Shield[] = [];
  public urlShields: string[] = [];
  public indexShield!: number;
  public characterForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    house: ['', [Validators.required]],
    nickname: ['', [Validators.required]],
    motto: ['', [Validators.required]]
  });

  constructor(
    private authService: AuthService,
    private shieldService: ShieldsService,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser;
    this.setCharacterFormValues(this.currentUser.character_name, this.currentUser.house_name, this.currentUser.character_nickname, this.currentUser.house_motto);
    this.initShields();
  }

  setCharacterFormValues(name: string, house: string, nickname: string, motto: string) {
    this.characterForm.patchValue({
      name: name,
      house: house,
      nickname: nickname,
      motto: motto
    });
  }

  initShields() {
    this.shieldService.getShields(this.currentUser.premium_shields).subscribe((shields) => {
      this.shields = shields;
      this.shields.forEach((shield) => {
        const filename: string = shield.image.split("/").pop()!;
        this.urlShields.push(filename);
        this.addCurrentShieldToDOM(this.urlShields);
      });
    });
  }

  addCurrentShieldToDOM(urlShields: string[]) {
    const shieldElement = document.getElementById('user-shield') as HTMLInputElement;
    if (shieldElement) {
      shieldElement.style.backgroundImage = `url(${endpoints.urlImageShield}${this.getUserShieldImage()})`;
      this.indexShield = urlShields.indexOf(this.getUserShieldImage());
    }
  }

  showPreviousShield() {
    if (this.shields.length === 0) return;
    this.indexShield = (this.indexShield - 1 + this.shields.length) % this.shields.length;
    this.updateShieldImage();
  }

  showNextShield() {
    if (this.shields.length === 0) return;
    this.indexShield = (this.indexShield + 1) % this.shields.length;
    this.updateShieldImage();
  }

  updateShieldImage() {
    const shieldElement = document.getElementById('user-shield') as HTMLInputElement;
    if (shieldElement) {
      shieldElement.style.backgroundImage = `url(${endpoints.urlImageShield}${this.urlShields[this.indexShield]})`;
    }
  }

  getUserShieldImage(): string {
    return this.currentUser.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  filterNameShieldImage(fullUrl: string): string {
    return fullUrl.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  updateCharacter() {
    this.currentUser.character_name = this.characterForm.get('name')?.value;
    this.currentUser.house_name = this.characterForm.get('house')?.value;
    this.currentUser.character_nickname = this.characterForm.get('nickname')?.value;
    this.currentUser.house_motto = this.characterForm.get('motto')?.value;
    this.currentUser.url_shield = this.shields[this.indexShield].id.toString();
    if (this.characterForm.invalid) {
      this.characterForm.markAllAsTouched();
      return;
    }
    this.userService.updateCharacter(this.currentUser).subscribe({
      next: (user) => {
        this.authService.setCurrentUser(user);
      },
      error: (error) => {
        console.log(error);
      }
    });

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
