import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { TranslocoModule } from '@ngneat/transloco';
import { ComponentsModule } from 'src/app/shared/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    TranslocoModule,
    ComponentsModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
