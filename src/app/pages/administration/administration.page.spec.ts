import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AdministrationService } from 'src/app/shared/services/administration.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { AdministrationPage } from './administration.page';

describe('AdministrationPage', () => {
  let component: AdministrationPage;
  let fixture: ComponentFixture<AdministrationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrationPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: LoadingService, useValue: { } },
        { provide: AdministrationService, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
