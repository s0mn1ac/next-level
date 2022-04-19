import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ListTypeEnum } from 'src/app/shared/enums/list-type.enum';
import { List } from 'src/app/shared/models/list.model';
import { ListService } from 'src/app/shared/services/list.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit, OnDestroy {

  public lists: List[];
  public secondaryLists: List[];

  public isInEditMode = false;

  private lists$: Subscription;

  constructor(
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.initListsSubscription();
  }

  ngOnDestroy(): void {
    this.lists$?.unsubscribe();
  }

  public onClickChangeEditMode(): void {
    this.isInEditMode = !this.isInEditMode;
  }

  public async onClickSaveChanges(): Promise<void> {
    this.lists?.map((list: List, index) => this.listService.modifyList(list?.id, 'position', index));
    this.onClickChangeEditMode();
  }

  public onClickDiscardChanges(): void {
    this.onClickChangeEditMode();
  }

  public onReorder(event: any): void {
    this.lists = event.detail.complete(this.lists);
  }

  private initListsSubscription(): void {
    this.lists$ = this.listService.listsObservable.subscribe((lists: List[]) => this.loadLists(lists));
  }

  private loadLists(lists: List[]): void {
    this.lists = lists?.filter((list: List) => list.type === ListTypeEnum.board)?.sort((a: List, b: List) => a.position - b.position);
  }

}
