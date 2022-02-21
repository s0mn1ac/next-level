import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MenuItemModel } from 'src/app/shared/models/menu-item.model';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  public darkModeBehavior = new BehaviorSubject<boolean>(this.getDarkModeValue());

  public readonly darkModeObservable: Observable<boolean> = this.darkModeBehavior.asObservable().pipe(distinctUntilChanged());

  // private isDarkModeEnabled: boolean;

  // public init(): void {
  //   this.isDarkModeEnabled = this.getDarkModeValue();
  // }

  public onChangeDarkModeValue(isDarkModeEnabled: boolean): void {
    this.darkModeBehavior.next(isDarkModeEnabled);
    this.setDarkModeValue(isDarkModeEnabled);
  }

  private getDarkModeValue(): boolean {
    return localStorage.getItem('nextLevelThemeSelected') === 'dark';
  }

  private setDarkModeValue(isDarkModeEnabled: boolean): void {
    localStorage.setItem('nextLevelThemeSelected', isDarkModeEnabled ? 'dark' : 'light');
  }

}
