import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Game } from '../models/game';

const baseUrl = 'http://localhost:5001/api/games';

@Injectable({
  providedIn: 'root',
})
export class GameService {

  constructor(private http: HttpClient) {}

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  getGame(gameId: number): Observable<any> {
    return this.http.get(`${baseUrl}/${gameId}`)
  }
  
  getGamesByUserId(
    userId: number,
    page: number = 0,
    size: number = 10,
    filter?: string,
    sortBy: string = 'id',
    sortDirection: string = 'asc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (filter) {
      params = params.set('filter', filter);
    }
    
    return this.http.get(`${baseUrl}/user/${userId}`, { params });
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(userId: any, gameId: any, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/${userId}/${gameId}`, data)
  }

  delete(userId: any, gameId: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${userId}/${gameId}`)
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl)
  }
}
