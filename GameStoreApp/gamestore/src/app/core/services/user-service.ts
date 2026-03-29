import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';

const USER_URL = 'http://localhost:5001/api/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<{ userId: number; name: string; email: string }> {
    return this.http.post<{ userId: number; name: string; email: string }>(`${USER_URL}/login`, credentials, { headers: this.headers });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(USER_URL);
  }
  
  getUser(userId: number): Observable<any> {
    return this.http.get(`${USER_URL}/${userId}`);
  }

  addUser(data: any): Observable<any> {
    return this.http.post(USER_URL, data, { headers: this.headers });
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${USER_URL}/${id}`, data, { headers: this.headers });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${USER_URL}/${id}`, { headers: this.headers });
  }
}
