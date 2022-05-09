import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PickerColumnOption, PickerController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { NextLevelNoteModalComponent } from 'src/app/components/next-level-note-modal/next-level-note-modal.component';
import { StatusEnum } from 'src/app/shared/enums/status.enum';
import { Game } from 'src/app/shared/models/game.model';
import { UserScore } from 'src/app/shared/models/user-score.model';
import { GameService } from 'src/app/shared/services/game.service';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, OnDestroy {

  @ViewChild('nextLevelNoteModal') nextLevelNoteModal: NextLevelNoteModalComponent;

  public game: Game;

  public statusEnum: typeof StatusEnum = StatusEnum;

  public breakpoints: number[] = [0, 0.5];
  public initialBreakpoint = 0.5;

  public isGameDataLoaded = false;
  public isStatusBarVisible = false;

  private paramsSubscription$: Subscription;

  private selectedNoteIndex: number = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translocoService: TranslocoService,
    private loadingService: LoadingService,
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

  public async onClickUpdateGameStatus(status: StatusEnum): Promise<void> {
    this.game.status = status;
    this.listService.modifyGame(this.game.id, 'status', this.game.status);
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
            this.game.score = new UserScore(value.score.value);
            this.listService.modifyGame(this.game.id, 'score', JSON.parse(JSON.stringify(this.game.score)));
          }
        }
      ]
    });

    await picker.present();
  }

  public async onClickSaveNote(note: string): Promise<void> {
    if (this.selectedNoteIndex != null) {
      this.game.notes[this.selectedNoteIndex] = note;
    } else {
      if (!this.game.notes) {
        this.game.notes = [];
      }
      this.game.notes.push(note);
    }
    await this.listService.modifyGame(this.game.id, 'notes', this.game.notes);
    this.selectedNoteIndex = null;
  }

  public async onClickShowNote(note?: string, index?: number): Promise<void> {
    this.selectedNoteIndex = index;
    this.nextLevelNoteModal.show(note);
  }

  private getPickerColumnOptions(): PickerColumnOption[] {
    const pickerColumnOptions: PickerColumnOption[] = [];
    for (let i = 0; i <= 10; i++) {
      pickerColumnOptions.push({ text: `${i}`, value: i });
    }
    return pickerColumnOptions;
  }

  private initParamsSubscription(): void {
    this.paramsSubscription$ = this.activatedRoute.params?.subscribe((params: Params) => {
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
    this.isGameDataLoaded = true;
  }

  private cancelParamsSubscription(): void {
    this.paramsSubscription$?.unsubscribe();
  }

}
