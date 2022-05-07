import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// let domainName = 'https://api.sentimint.jamals.me/';
// let domainName = 'http://localhost:5001/';
let domainName = 'https://api.v2.jamals.me/';
// let domainName = 'https://api.sentimint.jamals.me:5000/';

@Injectable({
  providedIn: 'root'
})

export class BackendService {

  constructor(private http: HttpClient) { }


  public getHistory(){

      return this.http.get(
        domainName + 'all_queries'
      );
  }

  public getSentimentAnalysis(uid: string, hashtag: string, limit: number, algorithm: string){

    const url = domainName + 'twitter_api';
    return this.http.post(url, {uid: uid, topic: hashtag, limit: limit, algorithm: algorithm});
  }
}
