import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  baseUrl = 'http://127.0.0.1:8080';

  get(){
    return this.http.get(this.baseUrl + '/api/GetUser');
  }

  post(data) {
    return this.http.post(this.baseUrl + '/api/SaveUser', data);
  }

  update(data) {
    return this.http.post(this.baseUrl + '/api/UpdateUser', data);
  }

  delete(id) {
    return this.http.post(this.baseUrl + '/api/DeleteUser', id);
  }
}
