import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { GameCardComponent } from 'src/app/components/game-card/game-card.component';
import { NextLevelListComponent } from 'src/app/components/next-level-list/next-level-list.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ListComponent } from 'src/app/components/list/list.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { NextLevelModalComponent } from 'src/app/components/next-level-modal/next-level-modal.component';
import { NextLevelPrimaryListComponent } from 'src/app/components/next-level-primary-list/next-level-primary-list.component';
import { NextLevelNoteModalComponent } from 'src/app/components/next-level-note-modal/next-level-note-modal.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { LegalComponent } from 'src/app/components/legal/legal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    ListComponent,
    GameCardComponent,
    NextLevelListComponent,
    NextLevelPrimaryListComponent,
    NextLevelModalComponent,
    NextLevelNoteModalComponent,
    EmptyScreenComponent,
    LegalComponent
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    ListComponent,
    GameCardComponent,
    NextLevelListComponent,
    NextLevelPrimaryListComponent,
    NextLevelModalComponent,
    NextLevelNoteModalComponent,
    EmptyScreenComponent,
    LegalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslocoModule
  ]
})
export class ComponentsModule { }
