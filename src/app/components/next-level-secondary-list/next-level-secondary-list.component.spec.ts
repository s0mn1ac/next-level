import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NextLevelSecondaryListComponent } from './next-level-secondary-list.component';

describe('NextLevelSecondaryListComponent', () => {
  let component: NextLevelSecondaryListComponent;
  let fixture: ComponentFixture<NextLevelSecondaryListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NextLevelSecondaryListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NextLevelSecondaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
