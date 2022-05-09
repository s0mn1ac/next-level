import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { ListsPage } from './lists.page';

describe('ListsPage', () => {
  let component: ListsPage;
  let fixture: ComponentFixture<ListsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListsPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TranslocoService, useValue: { } },
        { provide: LoadingService, useValue: { } },
        { provide: ListService, useValue: { } },
        { provide: AlertController, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
