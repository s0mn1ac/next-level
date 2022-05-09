import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AdministrationService } from 'src/app/shared/services/administration.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { UserAdministrationPage } from './user-administration.page';

describe('UserAdministrationPage', () => {
  let component: UserAdministrationPage;
  let fixture: ComponentFixture<UserAdministrationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAdministrationPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: LoadingService, useValue: { } },
        { provide: AdministrationService, useValue: { } },
        { provide: ActivatedRoute, useValue: { } },
        { provide: FormBuilder, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserAdministrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
