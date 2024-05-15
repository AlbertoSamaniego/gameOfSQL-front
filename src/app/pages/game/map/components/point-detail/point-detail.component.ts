import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Point } from '../../../../../shared/interfaces/point.inteface';
import { User } from '../../../../../shared/interfaces/user.interface';
import { endpoints } from '../../../../../shared/constants/end-points';

@Component({
  selector: 'app-point-detail',
  templateUrl: './point-detail.component.html',
  styleUrls: ['./point-detail.component.scss']
})

/**
 * Componente que muestra los detalles de un punto en el mapa.
 */
export class PointDetailComponent implements OnInit {
  @Input() point: Point = {} as Point;
  @Input() currentUser: User | undefined = {} as User;
  @Output() hideComponentEvent: EventEmitter<void> = new EventEmitter<void>();
  segments: string[] = [];
  currentSegmentIndex: number = 0;

  constructor() { }

/**
 * Inicializa el componente.
 */
  ngOnInit(): void {
    setTimeout(() => {
      this.initComponent();
    }, 200);
  }

  /**
   * Inicializa el componente.
   */
  initComponent(): void {
    this.addShieldToDOM(this.getNameShieldImage());
    this.replaceHistoryString();
    this.splitHistoryIntoSegments();
  }

  /**
   * Obtiene el nombre de la imagen del escudo del usuario.
   * @returns el nombre de la imagen del escudo del usuario.
   */
  getNameShieldImage(): string {
    return this.currentUser?.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  /**
   * Añade el escudo del usuario al DOM.
   * @param shieldName nombre del escudo.
   */
  addShieldToDOM(shieldName: string): void {
    const shieldDiv = document.getElementById('shield');
    if (shieldDiv) {
      shieldDiv.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
    }
  }

  /**
   * Reemplaza el nombre del personaje y la casa en la historia.
   */
  replaceHistoryString(): void {
    if (this.point && this.point.history) {
      const replaceCharacterName = this.currentUser!.character_name + ' "' + this.currentUser!.character_nickname + '" ';
      const replaceHouseName = this.currentUser!.house_name;
      this.point.history = this.point.history.replace("Medger", replaceCharacterName).replace("Cerwyn", replaceHouseName);
    }
  }

  /**
   * Divide la historia en segmentos.
   */
  splitHistoryIntoSegments(): void {
    if (this.point && this.point.history) {
      const words = this.point.history.split(' ');
      const segmentSize = 150;
      for (let i = 0; i < words.length; i += segmentSize) {
        this.segments.push(words.slice(i, i + segmentSize).join(' '));
      }
    }
  }

  /**
   * Oculta el componente.
   */
  onNextSegmentClick(): void {
    if (this.currentSegmentIndex < this.segments.length - 1) {
      this.currentSegmentIndex++;
    } else {
      this.hideComponent();
      if(this.point.question !== false){
        this.hideComponentEvent.emit();
      }
    }
  }

  /**
   * Oculta el componente.
   */
  hideComponent(): void {
    const pointDetail = document.getElementById('container');
    if (pointDetail) {
      pointDetail.style.display = 'none';
    }
  }

  /**
   * Limpia el componente.
   */
  clearComponent(): void {
    this.segments = [];
    this.currentSegmentIndex = 0;
  }

  /**
   * Muestra el componente.
   * @param point - El punto a mostrar.
   */
  showComponent(point: Point): void {
    this.clearComponent();
    this.point = point;
    this.initComponent();
    const pointDetail = document.getElementById('container');
    if (pointDetail) {
      pointDetail.style.display = 'block';
    }
  }
}
