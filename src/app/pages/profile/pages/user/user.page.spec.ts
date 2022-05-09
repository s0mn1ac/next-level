import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

import { UserPage } from './user.page';

describe('UserPage', () => {
  let component: UserPage;
  let fixture: ComponentFixture<UserPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: FormBuilder, useValue: { } },
        { provide: UserService, useValue: { } },
        { provide: LoadingService, useValue: { } },
        { provide: ToastService, useValue: { } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
