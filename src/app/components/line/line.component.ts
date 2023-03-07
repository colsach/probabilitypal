import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DistributionService, Line } from 'src/app/services/distribution.service';

const MAX_NUM_DEC = 3

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit {
  @Input() id!: number
  @Input() line!: Line
  @Input() color: boolean = true;
  @Input() distService!:DistributionService;
  @Input() dist!:string;
  @Input() prop!:string;
  @Output() paramsChange = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  public lineColor: any;
  public result:string = (NaN).toString();

  constructor() { }

  ngOnInit() {
    if (!this.color) {
      this.line.borderColor = 'transparent';
      this.result = this.distService.calcLine(this.dist,this.prop,this.line).toFixed(MAX_NUM_DEC);
    }
  }

  /**
   * Reacts when parameter value changes.
   * Sends change to parent component.
   * @param idx Parameter index
   * @param value New parameter value
   */
  public onParamChange(idx: number, value: number): void {
    if ((idx >= 0) && (idx < this.line.size) && this.color) {
      this.line.setParam(idx, value);
      this.paramsChange.emit(this.line);
    }
    if ((idx >= 0) && (idx < this.line.size) && (!this.color)) {
      this.line.setParam(idx, value);
      this.result = this.distService.calcLine(this.dist,this.prop,this.line).toFixed(MAX_NUM_DEC);
    }
  }

  /**
   * Tells parent component that this lines needs to be deleted
   */
  public onRemove(): void {
    this.onDelete.emit(true);
  }

}