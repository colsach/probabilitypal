import { Component, OnInit, Input } from '@angular/core';
import { DistributionService, Line } from 'src/app/services/distribution.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent implements OnInit {
  @Input() label!: { dist: string, name: string, title: string, description: Array<{ text: string, id: string, type:string }>, distLink: string, funcLink: string };
  @Input() distService!: DistributionService;

  public lines: Array<Line> = []
  public exist: boolean = true;
  constructor() { }

  ngOnInit() {
    this.exist = this.distService.checkEquation(this.label.dist, this.label.name);
    this.lines = this.distService.getLinesProp(this.label.dist);
  }


}
