import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public breakpoints: number[] = [0, 0.3];
  public initialBreakpoint = 0.3;

  constructor() { }

  ngOnInit() {
  }

}
