import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PickerColumnOption, PickerController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/shared/models/game.model';
import { Score } from 'src/app/shared/models/score.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { GameService } from 'src/app/shared/services/game.service';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, OnDestroy {

  public game: Game;

  public isGameDataLoaded = false;
  public isStatusBarVisible = false;

  private paramsSubscription$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translocoService: TranslocoService,
    private loadingService: LoadingService,
    private databaseService: DatabaseService,
    private listService: ListService,
    private gameService: GameService,
    private pickerController: PickerController
  ) { }

  ngOnInit() {
    this.initParamsSubscription();
  }

  ngOnDestroy(): void {
    this.cancelParamsSubscription();
  }

  public async onClickUpdateGameStatus(): Promise<void> {
    this.game.completed = !this.game.completed;
    this.listService.modifyGame(this.game.id, 'completed', this.game.completed);
  }

  public async onClickChangeUserScore(): Promise<void> {

    const picker = await this.pickerController.create({
      columns: [{ name: `score`, options: this.getPickerColumnOptions(), selectedIndex: this.game.score.value }],
      buttons: [
        {
          text: this.translocoService.translate('buttons.cancel'),
          role: 'cancel',
        },
        {
          text: this.translocoService.translate('buttons.change'),
          handler: (value) => {
            this.game.score = new Score(value.score.value);
            this.listService.modifyGame(this.game.id, 'score', JSON.parse(JSON.stringify(this.game.score)));
          }
        }
      ]
    });

    await picker.present();
  }

  private getPickerColumnOptions(): PickerColumnOption[] {
    const pickerColumnOptions: PickerColumnOption[] = [];
    for (let i = 0; i <= 100; i++) {
      pickerColumnOptions.push({ text: `${i}`, value: i });
    }
    return pickerColumnOptions;
  }

  private initParamsSubscription(): void {
    this.paramsSubscription$ = this.activatedRoute.params.subscribe((params: Params) => {
      this.initData(params?.id);
    });
  }

  private async initData(gameId: string): Promise<void> {
    await this.loadingService.show('loadingGameData');
    await this.getGame(gameId);
    await this.loadingService.hide();
  }

  private async getGame(gameId: string): Promise<void> {
    let game: Game = await this.listService.getGame(gameId);
    this.isStatusBarVisible = true;
    if (game?.name === undefined) {
      game = await this.gameService.getGameInfo(gameId);
      this.isStatusBarVisible = false;
    }
    this.game = game;
    console.log(this.game);
    this.isGameDataLoaded = true;
  }

  private cancelParamsSubscription(): void {
    this.paramsSubscription$?.unsubscribe();
  }

}
