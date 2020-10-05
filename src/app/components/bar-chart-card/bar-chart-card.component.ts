import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IChartistData, IChartistLineChart, ILineChartOptions} from 'chartist';
import * as Chartist from 'chartist';
import {Guid} from 'guid-typescript';

@Component({
  selector: 'app-bar-chart-card',
  templateUrl: './bar-chart-card.component.html',
  styleUrls: ['./bar-chart-card.component.css']
})
export class BarChartCardComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() title: string;
  @Input() desc: string;
  @Input() footerTitle: string;
  @Input() position: string;
  @Input() data: IChartistData;
  @Input() showPoint : boolean = false;
  @Input() interpolation : boolean = false;
  @Output() onLabelInterpolation : EventEmitter<any> = new EventEmitter();

  private options : ILineChartOptions;
  private chart : IChartistLineChart;
  public readonly guid : string;

  private viewDidLoad : boolean = false;

  constructor() {
    const tmp = Guid.create().toString();
    this.guid = 'chart_' + tmp.split('-').join('');
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes : SimpleChanges) {
    if(this.data)
      this.options = this.buildChartOptions(this.data.labels);

    if(this.viewDidLoad) {
      this.chart.update(this.data, this.options);
    }
  }

  public ngAfterViewInit() {
    if(this.data)
      this.options = this.buildChartOptions(this.data.labels);

    this.viewDidLoad = true;
    this.chart = new Chartist.Bar('.' + this.guid, this.data, this.options);
  }

  private buildChartOptions(labels : any[]) {
    return {
      height: '300px',
      chartPadding: { top: 25, right: 25, bottom: 0, left: 10},
      showPoint: this.showPoint,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return value;
        }
      }
    };
  }

}
