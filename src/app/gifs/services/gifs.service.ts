import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'r3aXHLVCyAMlisZkr6z9BroL8sfzBN1p';
const urlBase = 'https://api.giphy.com/v1/gifs';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _historial: string[] = [];

  constructor(private http: HttpClient) {
    this.readLocalStorage();
    console.log('GifsService ready');
  }

  get historial() {
    return [...this._historial];
  }

  private organizeHistorial(tag: string) {
    tag = tag.trim().toLowerCase();

    if(this._historial.includes(tag)) {
      this._historial = this._historial.filter((oldTag) => oldTag !== tag);
    }

    this._historial.unshift(tag);
    this._historial = this._historial.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('historial', JSON.stringify(this._historial));
  }

  private readLocalStorage(): void {
    if(!localStorage.getItem('historial')) return;

    this._historial = JSON.parse(localStorage.getItem('historial')!);

    if(this._historial.length === 0) return;

    this.searchTag(this._historial[0]);
  }

  searchTag(query: string): void {
    if(query.trim().length === 0) return;
    this.organizeHistorial(query);

    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('q', query)
      .set('limit', '10');

    this.http.get<SearchResponse>(`${urlBase}/search`, { params })
      .subscribe( res => {
        this.gifList = res.data;
        console.log(this.gifList);
      });
  }

}
