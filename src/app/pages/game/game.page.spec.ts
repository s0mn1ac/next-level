import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, PickerController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { GameService } from 'src/app/shared/services/game.service';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { GamePage } from './game.page';

describe('GamePage', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: { } },
        { provide: TranslocoService, useValue: { } },
        { provide: LoadingService, useValue: { } },
        { provide: ListService, useValue: { } },
        { provide: GameService, useValue: { } },
        { provide: PickerController, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
