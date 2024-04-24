import { Component } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {

  displayForm(idForm: string): void {
    const form = document.getElementById(idForm);
    if (form && form.classList.contains("d-none")) {
      form.classList.remove("d-none");
      form.classList.add("d-flex");
    }else if(form && form.classList.contains("d-flex")){
      form.classList.remove("d-flex");
      form.classList.add("d-none");
    }
  }
}
