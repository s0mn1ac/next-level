import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActionSheetController, IonicModule, LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { GameService } from 'src/app/shared/services/game.service';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import { LibraryPage } from './library.page';

describe('LibraryPage', () => {
  let component: LibraryPage;
  let fixture: ComponentFixture<LibraryPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: { } },
        { provide: TranslocoService, useValue: { } },
        { provide: LoadingService, useValue: { } },
        { provide: LoadingController, useValue: { } },
        { provide: ListService, useValue: { } },
        { provide: GameService, useValue: { } },
        { provide: ActionSheetController, useValue: { } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
