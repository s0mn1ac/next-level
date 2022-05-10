import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { ListTypeEnum } from 'src/app/shared/enums/list-type.enum';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { List } from 'src/app/shared/models/list.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { ListService } from 'src/app/shared/services/list.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit, OnDestroy {

  public lists: List[] = [];

  public hasDataToShow: boolean;

  private lists$: Subscription;

  constructor(
    private translocoService: TranslocoService,
    private loadingService: LoadingService,
    private listService: ListService,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.initListsSubscription();
  }

  ngOnDestroy(): void {
    this.lists$?.unsubscribe();
  }

  ionViewWillEnter() {
    // this.initData();
  }

  public async onClickAddButton(): Promise<void> {

    const alert = await this.alertController.create({
      header: this.translocoService.translate('lists.list.newList'),
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.translocoService.translate('lists.list.listName')
        }
      ],
      buttons: [
        {
          text: this.translocoService.translate('buttons.cancel'),
          role: 'cancel',
        }, {
          text: this.translocoService.translate('buttons.create'),
          handler: async (event: any) => {
            await this.loadingService.show('creatingList');
            await this.listService.addList({ name: event.name, isFavorite: false, games: [], type: ListTypeEnum.unset });
            await this.loadingService.hide();
          }
        }
      ]
    });

    await alert.present();
  }

  private initListsSubscription(): void {
    this.lists$ = this.listService.listsObservable?.subscribe((lists: List[]) => this.loadLists(lists));
  }

  private loadLists(lists: List[]): void {
    this.lists = lists;
    this.hasDataToShow = this.lists !== undefined && this.lists?.length > 0;
  }

  private async initData(): Promise<void> {
    await this.loadingService.show('loadingLists');
    await this.getAllLists();
    await this.loadingService.hide();
  }

  private async getAllLists(): Promise<void> {
    // this.allLists = await this.databaseService.getAllLists();
  }

}
