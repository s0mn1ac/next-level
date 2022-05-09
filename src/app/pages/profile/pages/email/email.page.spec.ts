import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { EmailPage } from './email.page';

describe('EmailPage', () => {
  let component: EmailPage;
  let fixture: ComponentFixture<EmailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: FormBuilder, useValue: { } },
        { provide: AuthService, useValue: { } },
        { provide: LoadingService, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
