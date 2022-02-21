import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languageBehavior = new BehaviorSubject<string>(this.getLanguageValue());

  public readonly languageObservable: Observable<string> = this.languageBehavior.asObservable().pipe(distinctUntilChanged());

  public onChangeLanguageValue(language: string): void {
    this.languageBehavior.next(language);
    this.setLanguageValue(language);
  }

  private getLanguageValue(): string {
    return localStorage.getItem('nextLevelLanguageSelected') ?? 'es';
  }

  private setLanguageValue(language: string): void {
    localStorage.setItem('nextLevelLanguageSelected', language);
  }

}
