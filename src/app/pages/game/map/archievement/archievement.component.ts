import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { endpoints } from '../../../../shared/constants/end-points';
import { Point } from '../../../../shared/interfaces/point.inteface';
import { ArchievementsService } from '../../../../shared/services/archievement-service.service';
import { Archievement } from '../../../../shared/interfaces/archievement.interface';

@Component({
  selector: 'app-archievement',
  templateUrl: './archievement.component.html',
  styleUrl: './archievement.component.scss'
})
export class ArchievementComponent implements OnInit, OnDestroy {

  @Input() point: Point = {} as Point;
  @ViewChild('archievement_container') archievement_container!: ElementRef<HTMLDivElement>;
  @ViewChild('image_archievement') image_archievement!: ElementRef<HTMLDivElement>;
  private archievementId: string = '';
  public archievementToRepresent: Archievement = {} as Archievement;
  private hideTimeout: any;

  constructor(private archievementService: ArchievementsService) { }

  async ngOnInit() {
    this.archievementId = this.point.archievement ? this.point.archievement : '';
    await this.archievementService.getArchievementById(this.archievementId);
    this.archievementToRepresent = this.archievementService.getArchievement;
    this.image_archievement.nativeElement.style.backgroundImage = `url('${endpoints.urlImageArchievement}${this.getNameArchievementImage()}')`;
    this.setHideTimeout();
  }

  ngOnDestroy() {
    clearTimeout(this.hideTimeout);

  }

  getNameArchievementImage(): string {
    return this.archievementToRepresent.image.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  private setHideTimeout() {
    this.hideTimeout = setTimeout(() => {
      this.hideComponent();
    }, 5000);
  }

  private hideComponent() {
    this.archievement_container.nativeElement.style.display = 'none';
  }
}
