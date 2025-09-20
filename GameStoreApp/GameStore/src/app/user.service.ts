import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

const userUrl = 'http://localhost:5001/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<{ userId: number; name: string; email: string }> {
    return this.http.post<{ userId: number; name: string; email: string }>(`${userUrl}/login`, credentials, { headers: this.jsonHeaders });
  }
  
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(userUrl);
  }
  
  getUser(userId: number): Observable<any> {
    return this.http.get(`${userUrl}/${userId}`);
  }

  addUser(data: any): Observable<any> {
    return this.http.post(userUrl, data, { headers: this.jsonHeaders });
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${userUrl}/${id}`, data, { headers: this.jsonHeaders });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${userUrl}/${id}`, { headers: this.jsonHeaders });
  }
}
