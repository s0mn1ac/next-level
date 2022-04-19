import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NextLevelPrimaryListComponent } from './next-level-primary-list.component';

describe('NextLevelPrimaryListComponent', () => {
  let component: NextLevelPrimaryListComponent;
  let fixture: ComponentFixture<NextLevelPrimaryListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NextLevelPrimaryListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NextLevelPrimaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
