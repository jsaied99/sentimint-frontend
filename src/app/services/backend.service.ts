import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

let domainName = 'https://api.sentimint.jamals.me/';
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

  public getSentimentAnalysis(uid: string, hashtag: string, limit: number){

    const url = domainName + 'twitter_api';
    return this.http.post(url, {uid: uid, topic: hashtag, limit: limit});
  }
}
