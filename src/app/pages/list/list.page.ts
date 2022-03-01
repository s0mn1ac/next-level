import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/shared/models/game.model';
import { GameService } from 'src/app/shared/services/game.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {

  public paramsSubscription$: Subscription;

  public games: Game[];

  public id: string;

  public isInEditMode = false;

  constructor(private activatedRoute: ActivatedRoute, private gameService: GameService) { }

  ngOnInit() {
    this.initParamsSubscription();
    this.initData();
  }

  ngOnDestroy(): void {
    this.paramsSubscription$?.unsubscribe();
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

  public onClickDeleteButton(): void {
    //
  }

  private initParamsSubscription(): void {
    this.paramsSubscription$ = this.activatedRoute.params.subscribe((params: Params) => this.id = params.id);
  }

  private async initData(): Promise<void> {
    this.games = await this.gameService.getGames();
    console.log(this.games);
  }

}
