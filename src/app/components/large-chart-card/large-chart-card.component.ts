import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IChartistData, IChartistLineChart, ILineChartOptions} from 'chartist';
import * as Chartist from 'chartist';
import * as ChartistLegend from 'chartist-plugin-legend';
import {Guid} from 'guid-typescript';

@Component({
  selector: 'app-large-chart-card',
  templateUrl: './large-chart-card.component.html',
  styleUrls: ['./large-chart-card.component.css']
})
export class LargeChartCardComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() title: string;
  @Input() data: IChartistData;
  @Input() showPoint : boolean = false;
  @Input() interpolation : boolean = false;
  @Input() linearColor: string;
  @Input() boxShadow: string;
  @Input() headerIcon: string;
  @Input() maxLabels: number = 10;
  @Input() reset: boolean = false;
  @Output() onLabelInterpolation : EventEmitter<any> = new EventEmitter();

  private options : ILineChartOptions;
  private chart : IChartistLineChart;
  public readonly guid : string;

  private viewDidLoad : boolean = false;
  private chartCreated = false;

  public constructor() {
    const tmp = Guid.create().toString();
    this.guid = 'chart_' + tmp.split('-').join('');
    const legend = new ChartistLegend();
  }

  public ngOnInit() {
  }

  private createOrUpdateChart() {
    if((!this.chartCreated || this.reset) && this.viewDidLoad && this.data) {
      this.options = this.buildChartOptions(this.data.labels);
      this.chart = new Chartist.Line('.' + this.guid, this.data, this.options);
      // this.chart = new Chartist.Line('.ct-chart', this.data, this.options);
      this.startAnimationForLineChart();
      this.chart.update(this.data, this.options);

      this.chartCreated = this.data.series.length > 0;

    } else {
      if(this.chart !== undefined && this.data) {
        this.chart = new Chartist.Line('.' + this.guid, this.data, this.options);
      }
    }
  }

  public ngOnChanges(changes : SimpleChanges) {
    if(this.data === undefined) {
      return;
    }

    this.createOrUpdateChart();
  }

  public ngAfterViewInit() {
    if(this.data) {
      this.options = this.buildChartOptions(this.data.labels);
    } else {
      this.options = {
        height: 400
      }
    }

    this.viewDidLoad = true;
    this.createOrUpdateChart();
  }

  private buildChartOptions(labels : any[]) {
    const num = labels.length;
    const max = this.maxLabels;
    const modulo = Math.round(num / max);

    let interpolation = undefined;

    if(this.interpolation)
      interpolation = Chartist.Interpolation.cardinal({tension: 0});
    else
      interpolation = Chartist.Interpolation.simple();

    return {
      height: 400,
      lineSmooth: interpolation,
      chartPadding: { top: 25, right: 25, bottom: 0, left: 10},
      showPoint: this.showPoint,
      fullWidth:true,
      plugins: [
        Chartist.plugins.legend({ })
      ],
      axisX: {
        labelInterpolationFnc: function(value, index) {
          if(num < max) {
            return value;
          }

          if (index % modulo === 0 && num > max)
            return value;

          return null;
        }
      }
    };
  }

  private startAnimationForLineChart() {
    let seq: any, delays: any, durations: any;

    seq = 0;
    delays = 80;
    durations = 500;

    setTimeout(() => {
      this.chart.off('draw');
    }, 750);

    this.chart.on('draw', function(data) {
      if (data.type === 'line' || data.type === 'area') {

        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }
}
