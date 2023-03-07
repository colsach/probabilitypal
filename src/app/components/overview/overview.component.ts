import { Component, OnInit, Input } from '@angular/core';
import { DistributionService } from 'src/app/services/distribution.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() distService!:DistributionService;
  @Input() typeLabels!:Array<any>;
  public chartData:Array<Array<any>> = []
  constructor() { }

  ngOnInit() {
    //console.log('getting chartData');
    
    //this.chartData = this.distService.getOverviewData(this.typeLabels);
    //console.log(this.chartData);
  }

}
