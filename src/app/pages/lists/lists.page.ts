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
    this.loadingService.show('loadingLists');
    this.cancelUserStructureSubscription();
    this.initUserStructureSubscription();
  }

  ngOnDestroy(): void {
    this.cancelUserStructureSubscription();
  }

  private initUserStructureSubscription(): void {
    this.userStructureSubscription$ = this.databaseService.getUserStructure().subscribe(data => this.loadAllLists(data));
  }

  private cancelUserStructureSubscription(): void {
    this.userStructureSubscription$?.unsubscribe();
  }

  private loadAllLists(userStructure: UserStructure): void {
    this.allLists = userStructure.lists;
    this.loadingService.hide();
  }

}
