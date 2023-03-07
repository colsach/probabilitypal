import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DistributionService, Line } from 'src/app/services/distribution.service';

@Component({
  selector: 'app-line-list',
  templateUrl: './line-list.component.html',
  styleUrls: ['./line-list.component.scss'],
})
export class LineListComponent implements OnInit {
  @Input() lines!:Array<any>;
  @Input() chartRange:Array<any> = [];
  @Input() color:boolean = true;
  @Input() distService!:DistributionService;
  @Input() dist!:string;
  @Input() prop!:string;
  @Output() maxParamN = new EventEmitter();
  @Output() lineChange = new EventEmitter();
  @Output() rangeChange = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() add = new EventEmitter();

  public maxParamNum: number = 0;
  public maxParamNumBody : number = 0;
  public backgroundColor:Array<any> = []
  constructor() { /*console.log(this.chartRange, this.lines);*/ }

  ngOnInit() { this.setMaxParamNum(); this.setBackgroundColor(); }

    
  private setBackgroundColor(){
    if(this.color){
      this.lines.forEach((_,i) => {
        this.backgroundColor.push(this.lines[i].backgroundColor);
      })
    }
    else {
      this.lines.forEach((_,i) => {
        this.backgroundColor.push('transparent');
      })
    }
  }
  /**
   * Determines how many parameters one line has
   * to set width of scroll-viewport
   */
  private setMaxParamNum(): void {
    //* maxWidth = (120+(this.maxParamNum*150))+'px';
    let old = this.maxParamNum;
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].size > this.maxParamNum) {
        this.maxParamNum = this.lines[i].size;
      }
    }
    if (old < this.maxParamNum) {
      this.maxParamN.emit(this.maxParamNum);
    }
    if(this.maxParamNum <= 1){this.maxParamNumBody = 2;}
    else{this.maxParamNumBody = this.maxParamNum;}
  }

  /**
   * Reacts when parameter of line changes.
   * Tells parent component that change occured.
   * @param idx Line index
   * @param line Line with new parameter
   */
  public onLineChange(idx: number, line: Line):void {
    this.lineChange.emit({idx:idx,line:line});
  }

  /**
   * Reacts when delete button of line is clicked.
   * Tells parent component that change occured.
   * @param idx Line index
   */
  public onDelete(idx: number):void {
    this.delete.emit(idx);
  }

  /**
   * Reacts when display range changes.
   * Tells parent component that change occured.
   * @param idx Index to determin if min or max
   * @param value New value
   */
  public onRangeChange(idx: number, value: number):void {
    let range = [this.chartRange[0].value, this.chartRange[1].value];
    range[idx] = value;
    this.rangeChange.emit(range);
  }

  /**
   * Reacts when button 'Add Line' is clicked.
   * Tells parent component that change occured.
   */
  public onAddLine() :void {
    this.add.emit(true);
  }
}
