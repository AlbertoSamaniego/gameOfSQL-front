import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchievementComponent } from './archievement.component';

describe('ArchievementComponent', () => {
  let component: ArchievementComponent;
  let fixture: ComponentFixture<ArchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchievementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
