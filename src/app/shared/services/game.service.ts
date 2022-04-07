import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BaseService } from 'src/app/shared/services/base.service';
import { ConverterService } from 'src/app/shared/services/converter.service';
import { Game } from '../models/game.model';
import { ResponseData } from '../models/response-data.model';

@Injectable({
  providedIn: 'root'
})
export class GameService extends BaseService {

  private url = 'https://api.rawg.io/api';
  private key = '?key=f5b9bcd495c6417d948da840a50adc5a';

  constructor(protected http: HttpClient, private converterService: ConverterService) {
    super(http);
  }

  public async getGames(): Promise<ResponseData> {
    const report = await this.getGamesReport();
    return this.converterService.convertGamesFromReport(report);
  }

  public async getGameInfo(id: number | string): Promise<Game> {
    const report = await this.getGameInfoReport(id);
    return this.converterService.convertGameInfoFromReport(report);
  }

  public async getFilteredGames(searchValue?: string): Promise<ResponseData> {
    const report = await this.getFilteredGamesReport(searchValue);
    return this.converterService.convertGamesFromReport(report);
  }

  public async getGamesByUrl(url: string): Promise<ResponseData> {
    const report = await this.getGamesByUrlReport(url);
    return this.converterService.convertGamesFromReport(report);
  }

  public async getLastReleasedGames(): Promise<ResponseData> {
    const report = await this.getLastReleasedGamesReport();
    return this.converterService.convertGamesFromReport(report);
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  private async getGamesReport(): Promise<any> {
    return this.serviceGet({
      url: `${this.url}/games${this.key}`,
      headers: new HttpHeaders({ token: 'f5b9bcd495c6417d948da840a50adc5a' }),
      callback: (response: any) => response.body,
      result: null
    });
  }

  private async getGameInfoReport(id: number | string): Promise<any> {
    return this.serviceGet({
      url: `${this.url}/games/${id}${this.key}`,
      headers: new HttpHeaders({ token: 'f5b9bcd495c6417d948da840a50adc5a' }),
      callback: (response: any) => response.body,
      result: null
    });
  }

  private async getFilteredGamesReport(searchValue?: string): Promise<any> {
    return this.serviceGet({
      url: `${this.url}/games${this.key}`,
      params: { search: searchValue },
      callback: (response: any) => response.body,
      result: null
    });
  }

  private async getGamesByUrlReport(url: string): Promise<any> {
    return this.serviceGet({
      url,
      callback: (response: any) => response.body,
      result: null
    });
  }

  private async getLastReleasedGamesReport(): Promise<any> {
    const dateStart: string = moment().subtract(1, 'month').format('YYYY-MM-DD');
    const dateEnd: string = moment().format('YYYY-MM-DD');
    return this.serviceGet({
      url: `${this.url}/games${this.key}`,
      params: { dates: `${dateStart},${dateEnd}` },
      callback: (response: any) => response.body,
      result: null
    });
  }

}
