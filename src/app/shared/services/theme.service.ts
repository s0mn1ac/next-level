import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public themeBehavior = new BehaviorSubject<string>(this.getThemeValue());

  public readonly themeObservable: Observable<string> = this.themeBehavior.asObservable().pipe(distinctUntilChanged());

  public onChangeThemeValue(theme: string): void {
    this.themeBehavior.next(theme);
    this.setThemeValue(theme);
  }

  private getThemeValue(): string {
    return localStorage.getItem('nextLevelThemeSelected');
  }

  private setThemeValue(theme: string): void {
    localStorage.setItem('nextLevelThemeSelected', theme);
  }

}
