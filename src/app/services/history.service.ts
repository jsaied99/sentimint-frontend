import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// let domainName = 'https://api.sentimint.jamals.me/';
// let domainName = 'http://localhost:5001/';
let domainName = 'https://api.v2.jamals.me/';

// let domainName = 'https://api.sentimint.jamals.me:5000/';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  // private historyUrl = 'https://jamalsaied.net:8888/all_queries?uid=DaXKIgYZgNWDATuUBx4mUkt6dQp2';
  private historyUrl = domainName + 'all_queries?uid=';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,) { }

  // add parameter for current userId
  getHistory(userId: string | null) { 
    let url = this.historyUrl+userId;
    console.log(url);
    return this.http.get<any>(url);
  }
}