import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAdministrationPageRoutingModule } from './user-administration-routing.module';

import { UserAdministrationPage } from './user-administration.page';
import { TranslocoModule } from '@ngneat/transloco';
import { ComponentsModule } from 'src/app/shared/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserAdministrationPageRoutingModule,
    TranslocoModule,
    ComponentsModule
  ],
  declarations: [UserAdministrationPage]
})
export class UserPageModule {}
