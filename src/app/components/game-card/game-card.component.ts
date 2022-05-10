import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StatusEnum } from 'src/app/shared/enums/status.enum';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { Game } from 'src/app/shared/models/game.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit, OnDestroy {

  @Input() game: Game;
  @Input() ownScore = false;
  @Input() addToList = false;
  @Input() isStatusBarVisible = false;

  @Output() addToListEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public statusEnum: typeof StatusEnum = StatusEnum;

  public isDarkModeEnabled: boolean;

  private user$: Subscription;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initUserSubscription();
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();
  }

  public onClickNavigateToGame(gameId: number): void {
    this.router.navigate([`/game/${gameId}`]);
  }

  public onClickAddToListButton(event: any, game: Game): void {
    event.stopPropagation();
    this.addToListEventEmitter.emit(game);
  }

  private initUserSubscription(): void {
    this.user$ = this.userService.userObservable.subscribe((value: UserStructure) => this.setIsDarkModeEnabled(value));
  }

  private setIsDarkModeEnabled(userStructure: UserStructure): void {
    if (userStructure == null) {
      return;
    }
    this.isDarkModeEnabled = userStructure.mode === 'dark';
  }

}
