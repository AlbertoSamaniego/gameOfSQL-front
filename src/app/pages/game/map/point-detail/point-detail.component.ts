import { Component, Input, OnInit } from '@angular/core';
import { Point } from '../../../../shared/interfaces/point.inteface';
import { User } from '../../../../shared/interfaces/user.interface';
import { endpoints } from '../../../../shared/constants/end-points';

@Component({
  selector: 'app-point-detail',
  templateUrl: './point-detail.component.html',
  styleUrls: ['./point-detail.component.scss']
})
export class PointDetailComponent implements OnInit {
  @Input() point: Point | undefined;
  @Input() currentUser: User | undefined;
  segments: string[] = [];
  currentSegmentIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    if (this.currentUser) {
      this.initComponent();
    } else {
      const currentUserInterval = setInterval(() => {
        if (this.currentUser) {
          clearInterval(currentUserInterval);
          this.initComponent();
        }
      }, 100);
    }
  }

  initComponent(): void {
    console.log(this.currentUser);
    this.addShieldToDOM(this.getNameShieldImage());
    this.splitHistoryIntoSegments();
  }

  getNameShieldImage(): string {
    console.log(this.currentUser?.url_shield);
    return this.currentUser?.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  addShieldToDOM(shieldName: string): void {
    const shieldDiv = document.getElementById('shield');
    if (shieldDiv) {
      console.log(`url('${endpoints.urlImageShield}${shieldName}')`);
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
    }
  }

  hideComponent(): void {
    const pointDetail = document.getElementById('container');
    if (pointDetail) {
      pointDetail.style.display = 'none';
    }
  }
}
