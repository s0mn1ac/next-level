import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { GameCardComplexComponent } from 'src/app/components/game-card-complex/game-card-complex.component';
import { GameCardSimpleComponent } from 'src/app/components/game-card-simple/game-card-simple.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ListComponent } from 'src/app/components/list/list.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    ListComponent,
    GameCardSimpleComponent,
    GameCardComplexComponent
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    ListComponent,
    GameCardSimpleComponent,
    GameCardComplexComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslocoModule
  ]
})
export class ComponentsModule { }
