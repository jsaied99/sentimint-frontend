import { AfterViewInit, Component, ElementRef, ViewChild, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
// Chart.register(ChartDataLabels);

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.css']
})
export class QueriesComponent implements AfterViewInit {


  @ViewChild('lineCanvas') public lineCanvas!: ElementRef;

  @Input() data!: any | undefined;
  @Input() hashtag!: string | null;

  lineChart: any;

  scatterPlotBubbleRadius: number = 10;
  test = ['(12)', '(13)','(12)', '(13)'];
  scatterPlotBubbleColor: string = 'rgb(199,0,252)';
  legendFontSize: number = 14;
  titleFontSize: number = 16;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.addScatterChart();
  }

  formatQueryCount(count: number): string {
    return '(' + count.toLocaleString() + ')';
  }

  getPlotPoints(){

    if(this.data){
      let key = Object.keys(this.data)[0];
      let plotPoints = [];
      let vdate = this.data[key]['query_date'][0];
      // console.log(typeof vdate);
      // console.log();
      for(let i = 0; i < this.data[key]['average_sentiment'].length; i++){
        // console.log(this.formatQueryCount(this.data[key]['query_count'][i]));
        plotPoints.push({x: this.data[key]['query_date'][i], y: this.data[key]['average_sentiment'][i], });
      }
      return plotPoints;

    }
    else {
      return []
    }
  }

  addScatterChart(): void {

    if(this.lineChart){
      this.lineChart.destroy();
    }

    const data = {
      datasets: [{
        label: 'Average Sentiment',
        data: this.getPlotPoints(),
        backgroundColor: this.scatterPlotBubbleColor,
        datalabels: {
        color: 'black',
        // align: 'top',
        labels: {
          value: {},
          title: {
            color: 'blue'

          },
        },
        // anchor: 'end',
        // align: 'top',
      }
      }],
    };
    console.log("data");
    console.log(data);


    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: data,
      // plugins: [ChartDataLabels],
      options: {
        scales: {
          // x: {
          //   type: 'linear',
          //   title: {
          //     display: true,
          //     text: 'Tweets',
          //     font: {
          //       size: this.legendFontSize
          //     }
          //   },
          //   position: 'bottom',
          //   // ticks: {
          //   //   stepSize: 1
          //   // }
          // },
          y: {
            // max: 101,
            // min: -101,
            title: {
              display: true,
              text: 'Sentiment Score',
              font: {
                size: this.legendFontSize
              }
            },
            // ticks: {
            //   stepSize: 5
            // }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Sentiment Scores for ' + this.hashtag + ' Tweets',
            font: {
              size: this.titleFontSize
            }
          },
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: this.legendFontSize
              }
            }
          },
          // datalabels:{},

          
        }
      }
    });
  }
}
