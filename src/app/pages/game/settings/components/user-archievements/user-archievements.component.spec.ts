import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserArchievementsComponent } from './user-archievements.component';

describe('UserArchievementsComponent', () => {
  let component: UserArchievementsComponent;
  let fixture: ComponentFixture<UserArchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserArchievementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserArchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
