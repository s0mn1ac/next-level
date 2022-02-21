import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  public darkModeBehavior = new BehaviorSubject<boolean>(this.getDarkModeValue());

  public readonly darkModeObservable: Observable<boolean> = this.darkModeBehavior.asObservable().pipe(distinctUntilChanged());

  public onChangeDarkModeValue(isDarkModeEnabled: boolean): void {
    this.darkModeBehavior.next(isDarkModeEnabled);
    this.setDarkModeValue(isDarkModeEnabled);
  }

  private getDarkModeValue(): boolean {
    return localStorage.getItem('nextLevelModeSelected') === 'dark';
  }

  private setDarkModeValue(isDarkModeEnabled: boolean): void {
    localStorage.setItem('nextLevelModeSelected', isDarkModeEnabled ? 'dark' : 'light');
  }

}
