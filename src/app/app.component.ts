import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DarkModeService } from './shared/services/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private darkModeSubscription$: Subscription;

  constructor(private darkModeService: DarkModeService) { }

  ngOnInit(): void {
    this.initializeDarkModeSubscription();
  }

  ngOnDestroy(): void {
    this.darkModeSubscription$?.unsubscribe();
  }

  private initializeDarkModeSubscription(): void {
    this.darkModeSubscription$ = this.darkModeService.darkModeObservable.subscribe((value: boolean) => this.setTheme(value));
  }

  private setTheme(isDarkModeEnabled): void {
    document.body.classList.toggle('dark', isDarkModeEnabled);
  }

}
