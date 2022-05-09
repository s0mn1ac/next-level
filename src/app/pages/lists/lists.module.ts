import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListsPageRoutingModule } from './lists-routing.module';

import { ListsPage } from './lists.page';
import { TranslocoModule } from '@ngneat/transloco';
import { ComponentsModule } from 'src/app/shared/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ListsPageRoutingModule,
    TranslocoModule,
    ComponentsModule
  ],
  declarations: [ListsPage]
})
export class ListsPageModule {}
