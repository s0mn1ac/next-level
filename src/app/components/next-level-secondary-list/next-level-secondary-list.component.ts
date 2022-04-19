import { Component, Input, OnInit } from '@angular/core';
import { List } from 'src/app/shared/models/list.model';

@Component({
  selector: 'app-next-level-secondary-list',
  templateUrl: './next-level-secondary-list.component.html',
  styleUrls: ['./next-level-secondary-list.component.scss'],
})
export class NextLevelSecondaryListComponent implements OnInit {

  @Input() list: List;

  constructor() { }

  ngOnInit() {}

}
