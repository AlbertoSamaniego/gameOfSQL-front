import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Point } from '../../../../shared/interfaces/point.inteface';
import { User } from '../../../../shared/interfaces/user.interface';
import { endpoints } from '../../../../shared/constants/end-points';

@Component({
  selector: 'app-point-detail',
  templateUrl: './point-detail.component.html',
  styleUrls: ['./point-detail.component.scss']
})
export class PointDetailComponent implements OnInit {
  @Input() point: Point = {} as Point;
  @Input() currentUser: User | undefined = {} as User;
  @Output() hideComponentEvent: EventEmitter<void> = new EventEmitter<void>();
  segments: string[] = [];
  currentSegmentIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.initComponent();
    }, 100);
  }

  initComponent(): void {
    this.addShieldToDOM(this.getNameShieldImage());
    this.splitHistoryIntoSegments();
  }

  getNameShieldImage(): string {
    return this.currentUser?.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  addShieldToDOM(shieldName: string): void {
    const shieldDiv = document.getElementById('shield');
    if (shieldDiv) {
      shieldDiv.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
    }
  }

  splitHistoryIntoSegments(): void {
    if (this.point && this.point.history) {
      const words = this.point.history.split(' ');
      const segmentSize = 150;
      for (let i = 0; i < words.length; i += segmentSize) {
        this.segments.push(words.slice(i, i + segmentSize).join(' '));
      }
    }
  }

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

  hideComponent(): void {
    const pointDetail = document.getElementById('container');
    if (pointDetail) {
      pointDetail.style.display = 'none';
    }
  }

  clearComponent(): void {
    this.segments = [];
    this.currentSegmentIndex = 0;
  }

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
