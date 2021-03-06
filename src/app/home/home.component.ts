import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { getAuth } from "firebase/auth";
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import {ScatterPlotComponent} from "../scatter-plot/scatter-plot.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('pieChart') pie!: PieChartComponent;
  @ViewChild('scatterPlot') scatter!: ScatterPlotComponent;

  dataLoaded: boolean = false;
  loading: boolean = false;
  rawData!: any;

  randomTopics = ['Bitcoin', 'Trump', 'Ukraine Russian War', 'Mizzou', 'Pizza Gate'];

  error: string | null = null;

  averageSentiment: number | string = "No Data";
  numberOfTweets: number = 0;
  averageSentimentInterpretation: string = "No Data";

  hashtagSentimentForm!: FormGroup;

  hashTagSearchValue: string | null = null;

  averageLengthTweet: number = 0;
  standardDeviation: number = 0;
  average_tweet_length: number = 0;
  algorithm = 'vader';

  constructor(private api: BackendService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.hashtagSentimentForm = this.fb.group({
      hashtag: new FormControl('', Validators.required),
      tweetsNum: new FormControl('', Validators.required)
    });
  }

  public getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  public exampleQuery(){

    let hashtag_value = this.randomTopics[this.getRandomInt(0, this.randomTopics.length)];
    this.hashtagSentimentForm.setValue({
      hashtag: hashtag_value,
      tweetsNum: 100
    });
    this.analyzeTweets();
  }
  public analyzeTweets(){

    this.error = null;

    if(this.hashtagSentimentForm.valid){

      const formValues = this.hashtagSentimentForm.value;
      this.hashTagSearchValue = formValues.hashtag;
      let tweetsNum = formValues.tweetsNum;

      // if(tweetsNum % 10 != 0){
      //   this.error = "Number of tweets must be multiple of 10";
      //   this.loading = false;
      //   return;
      // }

      let uid: string | null = this.getUid();
      if(uid && this.hashTagSearchValue && tweetsNum){

        this.loading = true;

        this.api.getSentimentAnalysis(uid, this.hashTagSearchValue, tweetsNum, this.algorithm).subscribe((response: any) => {

          console.log(response);

          if(response['status'] == 1){

            this.rawData = response['data'];;

            this.numberOfTweets = this.rawData['texts'].length;

            if(this.numberOfTweets > 0){
              this.averageSentiment = this.getAverageSentimentScoreOfTweets(this.rawData, this.numberOfTweets);
              this.averageSentimentInterpretation = this.getAverageSentimentScoreInterpretation(parseFloat(this.averageSentiment));
              this.standardDeviation = this.rawData['std'];
              this.average_tweet_length= this.rawData['average_tweet_length'];
              if(this.dataLoaded){
                this.pie.pieChartBrowser();
                this.scatter.addScatterChart();
              }
              this.loading = false;
              this.dataLoaded = true;
            }
            else {
              this.error = "Invalid search";
              this.loading = false;
            }
          }
          else {
            this.error = "Server error or Invalid Search";
            this.loading = false;
          }
        });
      }
      else {
        console.log("One of the fields is not initialized");
      }
    }
    else {
      this.error = "Invalid input";
      this.loading = false;
    }
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

    if(averageSentimentScore >= 60){
      return 'Positive';
    }
    else if(averageSentimentScore > 33 && averageSentimentScore < 60){
      return 'Somewhat Positive';
    }
    else if(averageSentimentScore < -33){
      return 'Negative';
    }
    else if(averageSentimentScore >= -33 && averageSentimentScore <= 33){
      return 'Neutral';
    }
    else {
      return 'Error';
    }
  }
}
