import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const userUrl = 'http://localhost:5001/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(userId: number): Observable<any> {
    return this.http.get(`${userUrl}/${userId}`)
  }

  addUser(data: any): Observable<any> {
    return this.http.post(userUrl, data)
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${userUrl}/${id}`, data)
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${userUrl}/${id}`)
  }
}
