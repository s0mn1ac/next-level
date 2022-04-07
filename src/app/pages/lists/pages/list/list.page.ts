import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentData, DocumentReference, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController, IonCheckbox } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { NextLevelModalComponent } from 'src/app/components/next-level-modal/next-level-modal.component';
import { NextLevelModalOptions } from 'src/app/shared/interfaces/next-level-modal-options.interface';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { Game } from 'src/app/shared/models/game.model';
import { List } from 'src/app/shared/models/list.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { GameService } from 'src/app/shared/services/game.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {

  @ViewChild('nextLevelModal') nextLevelModal: NextLevelModalComponent;

  public list: List;

  public gamesToDelete: number[] = [];

  public deleteGamesModalOptions: NextLevelModalOptions;
  public deleteListModalOptions: NextLevelModalOptions;

  public isInEditMode = false;

  private paramsSubscription$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translocoService: TranslocoService,
    private loadingService: LoadingService,
    private databaseService: DatabaseService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.initOptions();
    this.initParamsSubscription();
  }

  ngOnDestroy(): void {
    this.cancelParamsSubscription();
  }

  public onClickShowNextLevelModal(nextLevelModalOptions: NextLevelModalOptions): void {
    this.nextLevelModal.show(nextLevelModalOptions);
  }

  public onClickNavigateToGame(gameId: number): void {
    this.router.navigate([`/game/${gameId}`]);
  }

  public async onClickChangeListName(): Promise<void> {

    const alert = await this.alertController.create({
      header: this.translocoService.translate('lists.list.listName'),
      inputs: [
        {
          name: 'listName',
          type: 'text',
          value: this.list.name,
          placeholder: this.translocoService.translate('lists.list.listName')
        }
      ],
      buttons: [
        {
          text: this.translocoService.translate('buttons.cancel'),
          role: 'cancel',
        }, {
          text: this.translocoService.translate('buttons.change'),
          handler: async (event: any) => {
            await this.loadingService.show('modifyingList');
            await this.databaseService.changeListName(this.list, event.listName);
            await this.getList(this.list.id);
            await this.loadingService.hide();
          }
        }
      ]
    });

    await alert.present();
  }

  public async onClickDeleteList(): Promise<void> {
    await this.loadingService.show('deletingList');
    await this.databaseService.deleteList(this.list);
    await this.loadingService.hide();
    this.router.navigate(['/lists']);
  }

  public async onClickDeleteGamesFromList(): Promise<void> {
    const gamesToDelete: Game[] = this.gamesToDelete.map((gameId: number) => this.list.games.find((game: Game) => game.id === gameId ));
    await this.loadingService.show('deletingGames');
    for await (const game of gamesToDelete) {
      this.databaseService.deleteGameFromList(game, this.list);
    }
    await this.getList(this.list.id);
    await this.loadingService.hide();
    this.onClickChangeEditMode();
  }

  public onClickChangeEditMode(): void {
    this.isInEditMode = !this.isInEditMode;
    this.gamesToDelete = [];
  }

  public updateGamesToDeleteList(isSelected: boolean, game: Game): void {
    if (isSelected) {
      this.gamesToDelete.push(game.id);
      return;
    }
    const position: number = this.gamesToDelete?.findIndex((id: number) => id === game.id);
    this.gamesToDelete.splice(position, 1);
  }

  private initOptions(): void {

    this.deleteGamesModalOptions = {
      icon: 'trash-outline',
      title: this.translocoService.translate('lists.list.deleteGames.deleteGamesHeader'),
      description: this.translocoService.translate('lists.list.deleteGames.deleteGamesBody'),
      buttonColor: 'danger',
      buttonName: this.translocoService.translate('buttons.delete'),
      command: () => this.onClickDeleteGamesFromList()
    };

    this.deleteListModalOptions = {
      icon: 'trash-outline',
      title: this.translocoService.translate('lists.list.deleteList.deleteListHeader'),
      description: this.translocoService.translate('lists.list.deleteList.deleteListBody'),
      buttonColor: 'danger',
      buttonName: this.translocoService.translate('buttons.delete'),
      command: () => this.onClickDeleteList()
    };
  }

  private initParamsSubscription(): void {
    this.paramsSubscription$ = this.activatedRoute.params.subscribe((params: Params) => {
      this.initData(params?.id);
    });
  }

  private async initData(listId: string): Promise<void> {
    await this.loadingService.show('loadingGames');
    await this.getList(listId);
    await this.loadingService.hide();
  }

  private async getList(listId: string): Promise<void> {
    this.list = await this.databaseService.getList(listId);
  }

  private cancelParamsSubscription(): void {
    this.paramsSubscription$?.unsubscribe();
  }

}
