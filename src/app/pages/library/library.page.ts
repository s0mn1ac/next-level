import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/shared/models/game.model';
import { List } from 'src/app/shared/models/list.model';
import { ResponseData } from 'src/app/shared/models/response-data.model';
import { GameService } from 'src/app/shared/services/game.service';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit, OnDestroy {

  public games: Game[] = [];

  public breakpoints: number[] = [0, 0.5];
  public initialBreakpoint = 0.5;

  public lists: List[] = [];

  public lastSearchValue: string;

  public hasDataToShow: boolean;

  private lists$: Subscription;

  private actionSheet: HTMLIonActionSheetElement;

  private nextUrl: string;

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
    private gameService: GameService,
    private loadingService: LoadingService,
    private listService: ListService,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy(): void {
    this.cancelListsSubscription();
  }

  public async onClickAddToListButton(game: Game): Promise<void> {
    this.actionSheet = await this.actionSheetController.create({
      header: this.translocoService.translate('library.addToList.addToListHeader'),
      subHeader: this.translocoService.translate('library.addToList.addToListBody'),
      buttons: this.lists !== undefined && this.lists?.length > 0
        ? this.lists?.map((list: List) => ({ text: list?.name, handler: () => this.addGameToList(game, list) }))
        : [{ text: this.translocoService.translate('library.createList'), handler: () => this.router.navigate(['/lists']) }]
    });
    await this.actionSheet.present();
  }

  public async onRefresh(event: any): Promise<void> {
    await this.onSearch(this.lastSearchValue);
    event.target.complete();
  }

  public async onSearch(value: string): Promise<void> {

    this.lastSearchValue = value;

    if (value == null) {
      await this.getLastReleasedGames();
      await this.loadingService.hide();
      return;
    }

    const responseData: ResponseData = await this.gameService.getFilteredGames(value);
    this.games = responseData.results;
    this.nextUrl = responseData.next;
    this.hasDataToShow = this.games !== undefined && this.games?.length > 0;
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
    this.hasDataToShow = this.games !== undefined && this.games?.length > 0;
  }

  private async initData(): Promise<void> {
    this.nextUrl = null;
    this.initListsSubscription();
    await this.loadingService.show('loadingLibrary');
    await this.getLastReleasedGames();
    await this.loadingService.hide();
  }

  private initListsSubscription(): void {
    this.lists$ = this.listService.listsObservable.subscribe((lists: List[]) => this.loadLists(lists));
  }

  private loadLists(lists: List[]): void {
    this.lists = lists;
  }

  private async addGameToList(game: Game, list: List): Promise<void> {
    await this.loadingService.show('addingGameToList');
    await this.actionSheet?.dismiss();
    const fullGameInfo: Game = await this.gameService.getGameInfo(game.id);
    await this.listService.addGame(fullGameInfo, list.id);
    await this.loadingService.hide();
  }

  private cancelListsSubscription(): void {
    this.lists$?.unsubscribe();
  }

}
