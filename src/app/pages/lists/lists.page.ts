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
export class ListsPage implements OnInit {

  public allLists: List[] = [];

  constructor(
    private loadingService: LoadingService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    this.initData();
  }

  public async onClickAddButton(): Promise<void> {
    await this.loadingService.show('creatingList');
    await this.databaseService.addList({ id: 'test0', name: 'Test0', isPublic: false, games: [] });
    await this.loadingService.hide();
    await this.initData();
  }

  private async initData(): Promise<void> {
    await this.loadingService.show('loadingLists');
    await this.getAllLists();
    await this.loadingService.hide();
  }

  private async getAllLists(): Promise<void> {
    this.allLists = await this.databaseService.getAllLists();
  }

}
