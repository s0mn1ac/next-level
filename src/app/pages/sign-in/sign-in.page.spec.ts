import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { SignInPage } from './sign-in.page';

describe('SignInPage', () => {
  let component: SignInPage;
  let fixture: ComponentFixture<SignInPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: { } },
        { provide: LoadingService, useValue: { } },
        { provide: LoadingController, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
