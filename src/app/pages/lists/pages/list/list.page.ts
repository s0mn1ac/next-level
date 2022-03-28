import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData, DocumentReference, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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


  // private async initData(): Promise<void> {
  //   this.games = await this.gameService.getGames();
  //   console.log(this.games);
  // }

  //

  public list: List;

  public games: Game[] = [];

  public isInEditMode = false;

  private paramsSubscription$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    this.initParamsSubscription();
  }

  ngOnDestroy(): void {
    this.cancelParamsSubscription();
  }

  public onClickAddButton(): void {
    //
  }

  public onClickEditButton(): void {
    this.isInEditMode = true;
  }

  public onClickSaveButton(): void {
    this.isInEditMode = false;
  }

  public onClickCancelButton(): void {
    this.isInEditMode = false;
  }

  public async onClickDeleteButton(): Promise<void> {
    await this.loadingService.show('deletingList');
    await this.databaseService.deleteList(this.list);
    await this.loadingService.hide();
    this.router.navigate(['lists']);
  }

  private initParamsSubscription(): void {
    this.paramsSubscription$ = this.activatedRoute.params.subscribe((params: Params) => {
      this.initData(params?.id);
    });
  }

  private async initData(listId: string): Promise<void> {
    // await this.loadingService.show('loadingGames');
    this.getList(listId);
  }

  private async getList(listId: string): Promise<void> {
    this.list = await this.databaseService.getList(listId);
    console.log(this.list);
  }

  private cancelParamsSubscription(): void {
    this.paramsSubscription$?.unsubscribe();
  }

}
