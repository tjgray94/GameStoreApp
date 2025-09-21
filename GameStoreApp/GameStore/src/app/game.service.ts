import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Game } from './game';
// import { Games } from './games';

const baseUrl = 'http://localhost:5001/api/games';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  // Placed inside class because file is stored locally 
  private _gameUrl: string = "/assets/games.json";

  constructor(private http: HttpClient) { }

  httpOptions = { headers: new HttpHeaders({'Content-Type':'application/json'}) }

  getGame(gameId: number): Observable<any> {
    return this.http.get(`${baseUrl}/${gameId}`)
  }

  getGamesByUserId(userId: number, page: number = 0, size: number = 10, filter?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter) {
      params = params.set('filter', filter);
    }
    
    return this.http.get(`${baseUrl}/user/${userId}`, { params });
  }

  addGame(game: Game): Observable<any> {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(baseUrl, game, {headers: options})
    .pipe(
      catchError(this.handleError)
    )
  }
  
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  updateGame(game: Game): Observable<any> {
    const options = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.put<any>(`${baseUrl}/${game.gameId}`, game, {headers: options}).pipe(
      tap((_: any) => console.log(`updated game id=${game.gameId}`)),
      catchError(this.handleError)
    );
  }

  update(userId: any, gameId: any, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/${userId}/${gameId}`, data)
  }

  deleteGame(gameId: number): Observable<any> {
    const url = `${baseUrl}/${gameId}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    )
  }

  delete(userId: any, gameId: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${userId}/${gameId}`)
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl)
  }
  
  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
