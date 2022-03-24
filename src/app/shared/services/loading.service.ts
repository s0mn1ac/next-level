import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { UserStructure } from '../interfaces/user-structure.interface';
import { User } from '../interfaces/user.interface';
import { Game } from '../models/game.model';
import { List } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading: HTMLIonLoadingElement;

  constructor(private translocoService: TranslocoService, private loadingController: LoadingController) { }

  public async show(message: string): Promise<void> {
    this.loading = await this.loadingController.create({
      message: this.translocoService.translate(`loadingScreens.${message}`)
    });
    await this.loading.present();
  }

  public async hide(): Promise<void> {
    await this.loading.dismiss();
  }

}
