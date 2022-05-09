import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationPageRoutingModule } from './information-routing.module';

import { InformationPage } from './information.page';
import { TranslocoModule } from '@ngneat/transloco';
import { ComponentsModule } from 'src/app/shared/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InformationPageRoutingModule,
    TranslocoModule,
    ComponentsModule
  ],
  declarations: [InformationPage]
})
export class InformationPageModule {}
