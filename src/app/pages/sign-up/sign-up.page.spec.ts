import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { SignUpPage } from './sign-up.page';

describe('SignUpPage', () => {
  let component: SignUpPage;
  let fixture: ComponentFixture<SignUpPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: { } },
        { provide: LoadingService, useValue: { } },
        { provide: LoadingController, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
