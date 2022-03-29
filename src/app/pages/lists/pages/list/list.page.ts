import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData, DocumentReference, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IonCheckbox } from '@ionic/angular';
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

  public list: List;

  public games: Game[] = [];

  public gamesToDelete: number[] = [];

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

  public async onClickChangeListName(): Promise<void> {
    console.log('onClickChangeListName');
  }

  public async onClickDeleteList(): Promise<void> {
    console.log('onClickDeleteList');
  }

  public async onClickDeleteGamesFromList(): Promise<void> {
    console.log('onClickDeleteGamesFromList');
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
