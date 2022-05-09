import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuComponent } from './menu.component';
import { HttpClientModule } from '@angular/common/http';
import { ListService } from 'src/app/shared/services/list.service';
import { UserService } from 'src/app/shared/services/user.service';


describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports: [
        IonicModule.forRoot(),
        HttpClientModule
      ],
      providers: [
        { provide: ListService, useValue: { } },
        { provide: UserService, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
