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
import { ListService } from 'src/app/shared/services/list.service';
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

  private params$: Subscription;
  private lists$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translocoService: TranslocoService,
    private loadingService: LoadingService,
    private listService: ListService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.initOptions();
    this.initParamsSubscription();
  }

  ngOnDestroy(): void {
    this.cancelParamsSubscription();
    this.cancelListsSubscription();
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
          name: 'name',
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
            await this.listService.modifyList(this.list.id, 'name', event.name);
            await this.loadingService.hide();
          }
        }
      ]
    });

    await alert.present();
  }

  public async onClickDeleteList(): Promise<void> {
    await this.loadingService.show('deletingList');
    await this.listService.deleteList(this.list.id);
    await this.loadingService.hide();
    this.router.navigate(['/lists']);
  }

  public async onClickDeleteGamesFromList(): Promise<void> {
    const gamesToDelete: Game[] = this.gamesToDelete.map((gameId: number) => this.list.games.find((game: Game) => game.id === gameId ));
    await this.loadingService.show('deletingGames');
    for await (const game of gamesToDelete) {
      this.listService.deleteGame(game.id, this.list.id);
    }
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
    this.params$ = this.activatedRoute.params.subscribe((params: Params) => {
      this.cancelListsSubscription();
      this.initListsSubscription(params?.id);
    });
  }

  private initListsSubscription(listId: string): void {
    this.lists$ = this.listService.listsObservable.subscribe((lists: List[]) => this.loadList(lists, listId));
  }

  private loadList(lists: List[], listId: string): void {
    this.list = lists?.find((list: List) => list.id === listId);
  }

  private cancelParamsSubscription(): void {
    this.params$?.unsubscribe();
  }

  private cancelListsSubscription(): void {
    this.lists$?.unsubscribe();
  }

}
