import {Component, OnInit, ViewChild} from '@angular/core';
import { HistoryService } from '../services/history.service';
import { QueriesService } from '../services/queries.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getAuth } from "firebase/auth";
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import {ScatterPlotComponent} from "../scatter-plot/scatter-plot.component";
import {QueriesComponent} from "../queries/queries.component";

export interface tweet_data{
  tweet: string,
  score: number,
  interpretation: string
}

export interface api_response{
  texts: tweet_data[],
  topic: string,
  average_sentiment: number,
  average_sentiment_interpretation: string,
  average_tweet_length: number,
  query_date: string,
  lang_list: Record<string, number>
}

export interface response{
  data: api_response[],
  status: string
}
export interface topic{
  topic: Record<string, topic_body>
}

export interface topic_body{
  average_sentiment: Array<number>,
  average_tweet_length: Array<number>,
  query_dates: Array<Date>
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @ViewChild('pieChart') pie!: PieChartComponent;
  @ViewChild('pieChartLang') pieLang!: PieChartComponent;
  @ViewChild('scatterPlot') scatter!: ScatterPlotComponent;
  @ViewChild('lineChart') line!: QueriesComponent;


  loading: boolean = true;
  index: number = 0;
  started = false;
  myTest: response = {data: [{texts: [], topic: "blank topic", average_sentiment: 0, average_sentiment_interpretation: "Neutral", average_tweet_length: 0, query_date: ' ', lang_list: {}}], status: "undefined status"};
  number_tweets: number = 0;
  average_tweet_length: number = 0;
  selected_api_response?: api_response;
  topic_obj?: topic;
  all_topics?: Array<topic> ;
  averageSentiment: number | string = "No Data";
  averageSentimentInterpretation: string = "No Data";
  queryChart: boolean = false;
  langsLabels?: Array<string>;
  langsValues?: Array<number>;
  // otherTest: any = [];
  constructor(private historyService: HistoryService, private http: HttpClient,
    private queriesService: QueriesService) { }

  ngOnInit(): void {
   let uid: string | null= this.getUid();
   this.historyService.getHistory(uid).subscribe(data => {
        this.myTest = data;
        this.started = true;
        this.loading = false;
        this.queriesService.getAllTopics().subscribe(data => {
          this.all_topics = data['data'];
        });

    });
   

  }

  onSelect(this_response: api_response): void {


    this.selected_api_response= this_response;
    this.langsLabels = Object.keys(this_response['lang_list']);
    this.langsValues = Object.values(this_response['lang_list']);

    this.number_tweets = this_response['texts'].length;
    if (this.all_topics){
      for(let i = 0; i < this.all_topics.length; i++){
        let key = Object.keys(this.all_topics[i])[0];
        if (key == this_response['topic']){
          this.topic_obj = this.all_topics[i];
        }
      }
    }
    this.averageSentiment = this_response['average_sentiment'];
    this.averageSentimentInterpretation = this_response['average_sentiment_interpretation'];
    this.average_tweet_length= this_response['average_tweet_length'];

    if(this.index != 0){
      this.pie.data = this.selected_api_response;
      this.pie.hashtag = this.selected_api_response['topic'];
      this.pieLang.langsLabels = Object.keys(this.selected_api_response['lang_list']);
      this.pieLang.langsValues = Object.values(this.selected_api_response['lang_list']);
      
      this.queriesService.getTopic(this.selected_api_response['topic']).subscribe(data => {
        this.topic_obj = data;
        this.line.data = this.topic_obj;
        this.line.hashtag = data['topic'];
        this.line.addScatterChart();
        this.queryChart = true;
      });

      this.scatter.data = this.selected_api_response;
      this.scatter.hashtag = this.selected_api_response['topic'];
      this.pie.pieChartBrowser();
      this.pieLang.pieChartLangs();
      this.scatter.addScatterChart();
  
    }

    this.index++;
  }

  public getAverageSentimentScoreOfTweets(jsonDataList: any, numberOfTweets: number){

    let total: number = 0;

    for(let i = 0; i < numberOfTweets; i++){
      total+= jsonDataList['texts'][i]['score'];
    }

    let average: number = total / numberOfTweets;

    let roundedAverage: string = average.toFixed(4);

    return roundedAverage;
  }

  public getAverageSentimentScoreInterpretation(averageSentimentScore: number): string {

    if(averageSentimentScore >= 0.6){
      return 'Positive';
    }
    else if(averageSentimentScore > 0.33 && averageSentimentScore < 0.6){
      return 'Somewhat Positive';
    }
    else if(averageSentimentScore < -0.33 && averageSentimentScore > -0.6 ){
      return 'Somewhat Negative';
    }
    else if(averageSentimentScore <= -0.6){
      return 'Negative';
    }
    else if(averageSentimentScore >= -0.33 && averageSentimentScore <= 0.33){
      return 'Neutral';
    }
    else {
      return 'Error';
    }
  }

  public getAverageTweetLength(){

  }

  public getUid(): string | null{
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      return user.uid;
    } else {
      console.log("Not logged in so can't get uid");
      return null;
    }
  }

}
