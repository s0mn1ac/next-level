import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActionSheetController, AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { BoardPage } from './board.page';

describe('BoardPage', () => {
  let component: BoardPage;
  let fixture: ComponentFixture<BoardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TranslocoService, useValue: { } },
        { provide: LoadingService, useValue: { } },
        { provide: LoadingController, useValue: { } },
        { provide: ListService, useValue: { } },
        { provide: AlertController, useValue: { } },
        { provide: ActionSheetController, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
