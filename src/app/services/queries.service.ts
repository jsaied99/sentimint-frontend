import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


let domainName = 'https://api.sentimint.jamals.me/';
@Injectable({
  providedIn: 'root'
})
export class QueriesService {

  private historyUrl = domainName + 'topic/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,) { }

  // add parameter for current userId
  getTopic(topic: string | null) { 
    let url = this.historyUrl + topic;
    console.log(url);
    return this.http.get<any>(url);
  }
  getAllTopics() {
    let url = domainName + 'all_topics';
    console.log(url);
    return this.http.get<any>(url);
  }

}
