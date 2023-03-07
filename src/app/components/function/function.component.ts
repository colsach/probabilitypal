import { Component, OnInit, Input } from '@angular/core';
import { DistributionService, Line } from 'src/app/services/distribution.service';

@Component({
  selector: 'app-function[distService]',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.scss'],
})
export class FunctionComponent implements OnInit {
  @Input() label!: { dist: string, name: string, title: string, description: Array<{ text: string, id: string, type:string }>, distLink: string, funcLink: string };
  @Input() distService!: DistributionService;

  public chartData!: { type: string; labels: Array<number>; range: Array<number>; datasets: Array<any>; options: any; plugins: Array<any>; legend: boolean; width: number };
  public lines: Array<Line> = []
  public maxParamNum: number = 0;
  public exist:boolean = true;

  constructor() { }

  ngOnInit() {
    /*
    for(let i = 0; i < 4; i++){
      this.lines = [...this.lines,...this.distService.getLines(this.label.dist,this.label.name)]
    }
    */
    this.chartData = {
      type: '',
      labels: [],
      datasets: [],
      options: {},
      plugins: [],
      range: [],
      legend: false,
      width: 0
    }
    //this.lines = this.distService.getLines2(this.label.dist,this.label.name);
    this.lines = this.distService.getLines2(this.label.dist, this.label.name);
    this.exist = this.distService.checkEquation(this.label.dist, this.label.name);
    //console.log('Function:',this.label.dist,'.',this.label.name,': lines =',this.lines)
    //this.chartData = this.distService.getChartData2(this.label.dist,this.label.name); 

    //console.log('Fetching chart data')
    setTimeout(() => {
      this.chartData = this.distService.getChartData2(this.label.dist, this.label.name);
      //this.setData();
    }, 300)
    //console.log('Function:',this.label.dist,'.',this.label.name,': chart =',this.chartData);  
  }
  public update(): void {
    console.log('Called update');
    let tmp = this.distService.getChartData2(this.label.dist, this.label.name);
    /*
    this.chartData.datasets = [...tmp.datasets];
    this.chartData.type = tmp.type;
    this.chartData.labels = [...tmp.labels];
    this.chartData.options = tmp.options;
    this.chartData.range = [...tmp.range];
    this.chartData.plugins = [...tmp.plugins];
    this.chartData.legend = tmp.legend;
    */

    this.chartData.datasets = tmp.datasets;
    this.chartData.type = tmp.type;
    this.chartData.labels = tmp.labels;
    this.chartData.options = tmp.options;
    this.chartData.range = tmp.range;
    this.chartData.plugins = tmp.plugins;
    this.chartData.legend = tmp.legend;

    //this.setData();
  }

  private setData(){
    for(let i = 0; i < this.chartData.datasets.length; i++){
      this.chartData.datasets[i].borderWidth = 7
    }
    this.chartData.options = {
      scales:{
        x:{
          display:false,
          grid:{
            display:false
          }
        },
        y:{
          display:false,
          grid:{
            display:false
          }
        }
      }
    };
    this.chartData.legend = false;
  }
  onMaxParamN(event: number) {
    this.maxParamNum = event;
  }
  onLineChange(event: { idx: number, line: Line }) {
    if ((event.idx >= 0) && (event.idx < this.lines.length)) {
      this.distService.onLineChange(this.label.dist, this.label.name, event.idx, event.line);
      this.lines = [...this.distService.getLines2(this.label.dist, this.label.name)];
      let tmp = this.distService.getChartData2(this.label.dist, this.label.name);
      this.chartData.datasets = [...tmp.datasets];
      //this.setData()
    }
  }
  onRangeChange(idx: number, event: number) {
    if ((idx >= 0) && (idx <= 1)) {
      let range = this.chartData.range;
      range[idx] = event;
      this.distService.onRangeChange(this.label.dist, this.label.name, range);
      let tmp = this.distService.getChartData2(this.label.dist, this.label.name);
      //console.log('before change:',this.chartData);
      this.chartData.range = tmp.range;
      this.chartData.labels = [...tmp.labels];
      this.chartData.datasets = [...tmp.datasets];
      this.chartData.options = tmp.options;
      //console.log('after change:',this.chartData);
      //this.setData()
    }
  }
  onDeleteLine(event: number) {
    if ((event >= 0) && (event < this.lines.length)) {
      this.distService.onDeleteLine(this.label.dist, this.label.name, event);
      this.lines = [...this.distService.getLines2(this.label.dist, this.label.name)];
      let tmp = this.distService.getChartData2(this.label.dist, this.label.name);
      this.chartData.datasets = [...tmp.datasets];
      //this.setData()
    }
  }
  onAddLine() {
    this.distService.onAddLine(this.label.dist, this.label.name);
    this.lines = [...this.distService.getLines2(this.label.dist, this.label.name)];
    let tmp = this.distService.getChartData2(this.label.dist, this.label.name);
    this.chartData.datasets = [...tmp.datasets];
    //this.setData()
  }

}
