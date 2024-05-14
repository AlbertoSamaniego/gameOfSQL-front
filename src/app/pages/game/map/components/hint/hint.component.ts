import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Hint } from '../../../../../shared/interfaces/hint.interface';
import { endpoints } from '../../../../../shared/constants/end-points';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrl: './hint.component.scss'
})
export class HintComponent {
  @Input() hint: Hint = {} as Hint;
  @ViewChild('image_hint') image_hint!: ElementRef<HTMLDivElement>;
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.image_hint.nativeElement.style.backgroundImage = `url('${endpoints.urlImageHint}')`;
    }, 100);
  }
}
