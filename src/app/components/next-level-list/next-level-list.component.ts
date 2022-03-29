import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/shared/models/game.model';
import { List } from 'src/app/shared/models/list.model';

@Component({
  selector: 'app-next-level-list',
  templateUrl: './next-level-list.component.html',
  styleUrls: ['./next-level-list.component.scss'],
})
export class NextLevelListComponent implements OnInit {

  @Input() list: List;

  constructor() { }

  ngOnInit() {}

  public getEmptySpaces(games: Game[]): any[] {
    return new Array(games?.length >= 4 ? 0 : 4 - games?.length);
  }

}
