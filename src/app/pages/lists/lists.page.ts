import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { List } from 'src/app/shared/models/list.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit, OnDestroy {

  public allLists: List[] = [];

  private userStructureSubscription$: Subscription;

  constructor(
    private loadingService: LoadingService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    this.initData();
  }

  ngOnDestroy(): void {
    this.cancelUserStructureSubscription();
  }

  public async onClickAddButton(): Promise<void> {
    await this.loadingService.show('creatingList');
    await this.databaseService.addList({ id: 'test4', name: 'Test4', isPublic: false, games: [] });
    await this.loadingService.hide();
  }

  private async initData(): Promise<void> {
    await this.loadingService.show('loadingLists');
    this.cancelUserStructureSubscription();
    this.initUserStructureSubscription();
  }

  private initUserStructureSubscription(): void {
    this.databaseService.initUserStructureSubscription();
    this.userStructureSubscription$ = this.databaseService.userStructureObservable.subscribe(data => this.loadAllLists(data));
  }

  private cancelUserStructureSubscription(): void {
    this.userStructureSubscription$?.unsubscribe();
  }

  private async loadAllLists(userStructure: UserStructure): Promise<void> {
    this.allLists = userStructure.lists;
    console.log(this.allLists);
    await this.loadingService.hide();
  }

}
