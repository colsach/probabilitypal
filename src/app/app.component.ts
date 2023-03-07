import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DistributionService } from './services/distribution.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private distService:DistributionService;
  public distTypes:Array<any> = []
  constructor(private platform:Platform) {
    this.distService = new DistributionService(platform);
    this.distTypes = this.distService.getMenuLabels();
    this.distTypes = [{name:'',labels:[{title:'Overview',url:'/distribution/overview',icon:'home'}]},...this.distTypes]
    //console.log(this.distTypes)
  }
}
