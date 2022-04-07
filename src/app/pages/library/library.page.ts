import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetButton, ActionSheetController, IonModal } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { Game } from 'src/app/shared/models/game.model';
import { List } from 'src/app/shared/models/list.model';
import { ResponseData } from 'src/app/shared/models/response-data.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { GameService } from 'src/app/shared/services/game.service';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {

  public games: Game[] = [];

  public breakpoints: number[] = [0, 0.5];
  public initialBreakpoint = 0.5;

  public allLists: List[] = [];

  public lastSearchValue: string;

  private nextUrl: string;

  constructor(
    private translocoService: TranslocoService,
    private gameService: GameService,
    private loadingService: LoadingService,
    private databaseService: DatabaseService,
    private listService: ListService,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit(): void {
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

  public async onRefresh(event: any): Promise<void> {
    await this.onSearch(this.lastSearchValue);
    event.target.complete();
  }

  public async onSearch(value: string): Promise<void> {

    this.lastSearchValue = value;

    // await this.loadingService.show('loadingGames');

    if (value == null) {
      await this.getLastReleasedGames();
      await this.loadingService.hide();
      return;
    }

    const responseData: ResponseData = await this.gameService.getFilteredGames(value);
    this.games = responseData.results;
    this.nextUrl = responseData.next;
    // await this.loadingService.hide();
  }

  public async loadNextValues(event: any): Promise<void> {

    if (!this.nextUrl) {
      return;
    }

    const responseData: ResponseData = await this.gameService.getGamesByUrl(this.nextUrl);
    this.games = this.games.concat(responseData.results);
    this.nextUrl = responseData.next;

    event.target.complete();
    event.target.disabled = this.nextUrl == null;
  }

  private async getLastReleasedGames(): Promise<void> {
    const responseData: ResponseData = await this.gameService.getLastReleasedGames();
    this.games = responseData.results;
    this.nextUrl = responseData.next;
  }

  private async initData(): Promise<void> {
    await this.loadingService.show('loadingLists');
    this.nextUrl = null;
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
    await this.listService.addGame(fullGameInfo, list.id);
  }

}
