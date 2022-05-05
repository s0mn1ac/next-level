import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {

  public twitterUrl: string;
  public facebookUrl: string;
  public instagramUrl: string;

  constructor() {
    this.twitterUrl = 'https://twitter.com/appnextlevel';
    this.instagramUrl = 'https://www.instagram.com/appnextlevel/';
  }

  ngOnInit() {
  }

  public openUrl(url: string): void {
    if (url === undefined) {
      return;
    }
    window.open(url, '_blank');
  }

}
