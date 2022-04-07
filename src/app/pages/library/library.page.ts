import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetButton, ActionSheetController, IonModal } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { Game } from 'src/app/shared/models/game.model';
import { List } from 'src/app/shared/models/list.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { GameService } from 'src/app/shared/services/game.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage {

  public lastReleasedGames: Game[] = [];

  public breakpoints: number[] = [0, 0.5];
  public initialBreakpoint = 0.5;

  public allLists: List[] = [];

  constructor(
    private translocoService: TranslocoService,
    private gameService: GameService,
    private loadingService: LoadingService,
    private databaseService: DatabaseService,
    private actionSheetController: ActionSheetController
  ) { }

  ionViewWillEnter() {
    this.initData();
  }

  public async onClickAddToListButton(game: Game): Promise<void> {
    const actionSheet: HTMLIonActionSheetElement = await this.actionSheetController.create({
      header: this.translocoService.translate('library.addToList.addToListHeader'),
      subHeader: this.translocoService.translate('library.addToList.addToListBody'),
      buttons: this.allLists?.map((list: List) => ({ text: list?.name, handler: () => this.addGameToList(game, list) }))
    });
    await actionSheet.present();
  }

  private async getLastReleasedGames(): Promise<void> {
    this.lastReleasedGames = await this.gameService.getLastReleasedGames();
  }

  private async initData(): Promise<void> {
    await this.loadingService.show('loadingLists');
    await Promise.all([
      this.getAllLists(),
      this.getLastReleasedGames()
    ]);
    await this.loadingService.hide();
  }

  private async getAllLists(): Promise<void> {
    this.allLists = await this.databaseService.getAllLists();
  }

  private async addGameToList(game: Game, list: List): Promise<void> {
    const fullGameInfo: Game = await this.gameService.getGameInfo(game.id);
    await this.databaseService.addGameToList(fullGameInfo, list);
  }

}
