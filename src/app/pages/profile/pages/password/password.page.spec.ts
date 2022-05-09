import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { PasswordPage } from './password.page';

describe('PasswordPage', () => {
  let component: PasswordPage;
  let fixture: ComponentFixture<PasswordPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: FormBuilder, useValue: { } },
        { provide: AuthService, useValue: { } },
        { provide: LoadingService, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
