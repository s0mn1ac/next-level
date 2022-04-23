import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ItemReorderEventDetail } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { NextLevelModalComponent } from 'src/app/components/next-level-modal/next-level-modal.component';
import { ListTypeEnum } from 'src/app/shared/enums/list-type.enum';
import { NextLevelModalOptions } from 'src/app/shared/interfaces/next-level-modal-options.interface';
import { List } from 'src/app/shared/models/list.model';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit, OnDestroy {

  @ViewChild('nextLevelModal') nextLevelModal: NextLevelModalComponent;

  public board: List[];
  public lists: List[];

  public listSelected: List;

  public deleteListModalOptions: NextLevelModalOptions;

  public isInEditMode = false;

  private lists$: Subscription;

  private actionSheet: HTMLIonActionSheetElement;

  constructor(
    private translocoService: TranslocoService,
    private loadingService: LoadingService,
    private listService: ListService,
    private actionSheetController: ActionSheetController
  ) { }

  ionViewWillEnter(): void {
    this.listSelected = undefined;
    this.isInEditMode = false;
  }

  async ngOnInit(): Promise<void> {
    await this.loadingService.show('updatingBoard');
    this.initOptions();
    this.initListsSubscription();
  }

  ngOnDestroy(): void {
    this.lists$?.unsubscribe();
  }

  public onClickChangeEditMode(): void {
    this.isInEditMode = !this.isInEditMode;
  }

  public async onClickSaveChanges(): Promise<void> {
    this.updateListsPosition();
    this.onClickChangeEditMode();
  }

  public async onClickAddListToBoard(): Promise<void> {
    this.actionSheet = await this.actionSheetController.create({
      header: this.translocoService.translate('board.addToBoard.addToBoardHeader'),
      subHeader: this.translocoService.translate('board.addToBoard.addToBoardBody'),
      buttons: this.lists?.map((list: List) => ({ text: list?.name, handler: () => this.addListToBoard(list) }))
    });
    await this.actionSheet.present();
  }

  public async onClickDeleteListFromBoard(): Promise<void> {
    await this.loadingService.show('updatingBoard');
    await this.listService.modifyList(this.listSelected.id, 'type', ListTypeEnum.unset);
  }

  public onClickShowNextLevelModal(nextLevelModalOptions: NextLevelModalOptions, list?: List): void {
    this.listSelected = list;
    this.nextLevelModal.show(nextLevelModalOptions);
  }

  public onReorder(event: any): void {
    this.board = event.detail.complete(this.board);
  }

  private initOptions(): void {

    this.deleteListModalOptions = {
      icon: 'trash-outline',
      title: this.translocoService.translate('board.deleteFromBoard.deleteFromBoardHeader'),
      description: this.translocoService.translate('board.deleteFromBoard.deleteFromBoardBody'),
      buttonColor: 'danger',
      buttonName: this.translocoService.translate('buttons.delete'),
      command: () => this.onClickDeleteListFromBoard()
    };
  }

  private initListsSubscription(): void {
    this.lists$ = this.listService.listsObservable.subscribe((lists: List[]) => this.loadLists(lists));
  }

  private async loadLists(lists: List[]): Promise<void> {
    this.lists = lists?.filter((list: List) => list.type === ListTypeEnum.unset);
    this.board = lists?.filter((list: List) => list.type === ListTypeEnum.board)?.sort((a: List, b: List) => a.position - b.position);
    await this.loadingService.hide();
  }

  private updateListsPosition(): void {
    this.board?.map((list: List, index) => this.listService.modifyList(list?.id, 'position', index));
  }

  private async addListToBoard(list: List): Promise<void> {
    await this.loadingService.show('updatingBoard');
    await this.listService.modifyList(list.id, 'position', this.board?.length);
    await this.listService.modifyList(list.id, 'type', ListTypeEnum.board);
    this.updateListsPosition();
  }

}
