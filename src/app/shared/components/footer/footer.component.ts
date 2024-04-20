import { Component } from '@angular/core';

import { faYoutube, faLinkedin, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'shared-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  faYoutube = faYoutube;
  faLinkedin = faLinkedin;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
}
