import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { endpoints } from '../../../../../shared/constants/end-points';
import { Point } from '../../../../../shared/interfaces/point.inteface';
import { Archievement } from '../../../../../shared/interfaces/archievement.interface';
import { ArchievementsService } from '../../../../../shared/services/archievement/archievement-service.service';

@Component({
  selector: 'app-archievement',
  templateUrl: './archievement.component.html',
  styleUrl: './archievement.component.scss'
})

/**
 * Componente que muestra el logro obtenido por el usuario.
 */
export class ArchievementComponent implements OnInit, OnDestroy {

  @Input() point: Point = {} as Point;
  @ViewChild('archievement_container') archievement_container!: ElementRef<HTMLDivElement>;
  @ViewChild('image_archievement') image_archievement!: ElementRef<HTMLDivElement>;
  private archievementId: string = '';
  public archievementToRepresent: Archievement = {} as Archievement;
  private hideTimeout: any;

  constructor(private archievementService: ArchievementsService) { }

  /**
   * Inicializa el componente.
   */
  async ngOnInit() {
    this.archievementId = this.point.archievement ? this.point.archievement : '';
    await this.archievementService.getArchievementById(this.archievementId);
    this.archievementToRepresent = this.archievementService.getArchievement;
    this.image_archievement.nativeElement.style.backgroundImage =
      `url('${endpoints.urlImageArchievement}${this.getNameArchievementImage()}')`;
    this.setHideTimeout();
  }

  /**
   * Destruye el componente.
   */
  ngOnDestroy() {
    clearTimeout(this.hideTimeout);
  }

  /**
   * Obtiene el nombre de la imagen del logro.
   * @returns el nombre de la imagen del logro.
   */
  getNameArchievementImage(): string {
    return this.archievementToRepresent.image.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  /**
   * Establece el tiempo de espera para ocultar el componente.
   */
  private setHideTimeout() {
    this.hideTimeout = setTimeout(() => {
      this.hideComponent();
    }, 5000);
  }

  /**
   * Oculta el componente.
   */
  private hideComponent() {
    this.archievement_container.nativeElement.style.display = 'none';
  }
}
