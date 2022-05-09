import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslocoService, TranslocoTestingModule } from '@ngneat/transloco';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { ListPage } from './list.page';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: { } },
        { provide: ActivatedRoute, useValue: { } },
        { provide: TranslocoService, useValue: { } },
        // { provide: LoadingService, useValue: { } },
        { provide: ListService, useValue: { } },
        // { provide: AlertController, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
