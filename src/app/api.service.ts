import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders().set("token", localStorage.getItem('token'));
    return httpHeaders;
  }
  constructor(private httpClient: HttpClient) { }

  login(body: any): Observable<any> {
    return this.httpClient.post('/auth/login', body);
  }

  checkUsernameAvailability(username: String): Observable<any> {
    return this.httpClient.post('/auth/checkUsernameAvailability', { username: username });
  }

  signup(body: any): Observable<any> {
    return this.httpClient.post('/auth/signup', body);
  }

  fetchUsers(): Observable<any> {
    return this.httpClient.post('/api/getUsers', {}, { headers: this.getHeaders() });
  }

  addNewChat(user: any): Observable<any> {
    return this.httpClient.post('/api/addNewChat', { user: user }, { headers: this.getHeaders() })
  }

  fetchChats(): Observable<any> {
    return this.httpClient.post('/api/fetchChats', {}, { headers: this.getHeaders() });
  }

  fetchSelfData(): Observable<any> {
    return this.httpClient.post('/api/fetchSelfData', {}, { headers: this.getHeaders() });
  }
}