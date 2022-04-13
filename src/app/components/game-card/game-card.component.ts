import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VisualizationEnum } from 'src/app/shared/enums/visualization.enum';
import { UserStructure } from 'src/app/shared/interfaces/user-structure.interface';
import { Game } from 'src/app/shared/models/game.model';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {

  @Input() game: Game;
  @Input() ownScore = false;
  @Input() addToList = false;
  @Input() isStatusBarVisible = false;
  @Input() isCompactVisualizationSelected = false;

  @Output() addToListEventEmitter: EventEmitter<any> = new EventEmitter<any>();


  constructor(private router: Router) { }

  ngOnInit() {}

  public onClickNavigateToGame(gameId: number): void {
    this.router.navigate([`/game/${gameId}`]);
  }

  public onClickAddToListButton(event: any, game: Game): void {
    event.stopPropagation();
    this.addToListEventEmitter.emit(game);
  }

}
