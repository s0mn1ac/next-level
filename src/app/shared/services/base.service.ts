import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface ServiceParams {
  url: string;
  body?: any;
  params?: any;
  callback: any;
  loading?: boolean;
  error?: boolean;
  headers?: HttpHeaders;
  responseType?: any;
  result: any;
}

@Injectable()
export class BaseService {

  constructor(protected http: HttpClient) { }

  protected serviceGet(serviceParams: ServiceParams): any {
    return this.http.get(serviceParams.url,
      this.getOptions(serviceParams))
      .toPromise().then((apiResponse) => serviceParams.callback(apiResponse));
  }

  protected servicePost(serviceParams: ServiceParams): any {
    return this.http.post(serviceParams.url,
      serviceParams.body,
      this.getOptions(serviceParams))
      .toPromise().then((apiResponse) => serviceParams.callback(apiResponse));
  }

  protected servicePut(serviceParams: ServiceParams): any {
    return this.http.put(serviceParams.url,
      serviceParams.body,
      this.getOptions(serviceParams))
      .toPromise().then((apiResponse) => serviceParams.callback(apiResponse));
  }

  protected serviceDelete(serviceParams: ServiceParams): any {
    const requestOptions = this.getOptions(serviceParams);
    requestOptions.body = serviceParams.body;
    return this.http.delete(serviceParams.url,
      requestOptions)
      .toPromise().then((apiResponse) => serviceParams.callback(apiResponse));
  }

  private getOptions(serviceParams: ServiceParams): any {
    return {
      headers: serviceParams.headers,
      responseType: serviceParams.responseType,
      observe: 'response',
      withCredentials: false,
      params: serviceParams.params
    };
  }

}
