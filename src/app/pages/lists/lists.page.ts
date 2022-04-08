import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  private lists$: Subscription;

  constructor(
    private loadingService: LoadingService,
    private databaseService: DatabaseService,
    private listService: ListService
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
    // await this.loadingService.show('creatingList');
    await this.listService.addList({ id: 'test0', name: 'Test0', isPublic: false, games: [] });
    // await this.loadingService.hide();
    // await this.initData();
  }

  private initListsSubscription(): void {
    this.lists$ = this.listService.listsObservable.subscribe((lists: List[]) => this.loadLists(lists));
  }

  private loadLists(lists: List[]): void {
    this.lists = lists;
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
