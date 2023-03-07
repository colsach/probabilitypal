import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DistributionService } from '../services/distribution.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  public title: string = 'Title';

  public functionLabels: Array<any> = [];
  public propertyLabels: Array<any> = [];
  public overviewLabels: Array<any> = [];
  public availible: Array<any> = [];

  public distService: DistributionService;

  public preSelected:Array<any> = []
  public selected:Array<any> = []

  constructor(private activatedRoute: ActivatedRoute, private platform:Platform) {
    this.distService = new DistributionService(platform);
  }

  ngOnInit() {
    if (this.distService === undefined) {
      this.distService = new DistributionService(this.platform);
    }
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    if (this.folder === 'overview') {
      this.title = 'Overview';
      //console.log('getting overview labels');

      this.overviewLabels = this.distService.getMenuLabels();
    }
    else {
      this.title = this.distService.getTitle(this.folder)
      this.availible = this.distService.getFuncsProps(this.folder);
      //console.log("Availible functions & properties",this.availible);

      //this.functionLabels = this.distService.getFunctionLabels(this.folder,true);
      //this.propertyLabels = this.distService.getPropertyLabels(this.folder,true);
      let funcTmp = this.distService.getFunctionLabels(this.folder,true);
      let propTmp = this.distService.getPropertyLabels(this.folder,true);
      this.setPreSelected(funcTmp,propTmp);
      this.selected = [...this.getSelected(funcTmp,propTmp)];
      //console.log('ngOnInit.this.selected:',this.selected);
    }
  }

  private setPreSelected(funcList:Array<any>, propList:Array<any>){
    funcList.forEach((val,idx) => {
      this.preSelected.push(funcList[idx].name);
    })
    propList.forEach((val,idx) => {
      this.preSelected.push(propList[idx].name);
    })
  }
  private getSelected(funcList:Array<any>,propList:Array<any>) {
    let list:Array<{type:string, prm:any}> = []
    funcList.forEach((_,idx) => {
      list.push({type:'func',prm:funcList[idx]})
    })
    propList.forEach((_,idx) => {
      list.push({type:'prop',prm:propList[idx]})
    })
    return list;
  }
  private keepLabels(current: Array<any>, list: Array<any>) {
    let tmpLabels: Array<any> = [];
    current.forEach((val, idx) => {
      let toKeep = false;
      for (let i = 0; i < list.length; i++) {
        if (current[idx].name === list[i]) {
          toKeep = true;
          break;
        }
      }
      if (toKeep) {
        tmpLabels.push(current[idx]);
      }
    })
    return tmpLabels;
  }
  private keepLabels2(current: Array<any>, list: Array<any>) {
    let tmpLabels: Array<any> = [];
    current.forEach((val, idx) => {
      let toKeep = false;
      for (let i = 0; i < list.length; i++) {
        if (current[idx].prm.name === list[i]) {
          toKeep = true;
          break;
        }
      }
      if (toKeep) {
        tmpLabels.push(current[idx]);
      }
    })
    return tmpLabels;
  }
  private getMissingLabels(current: Array<any>, list: Array<any>) {
    let newLabels: Array<any> = []
    for (let i = 0; i < list.length; i++) {
      let gotAlready = false;
      for (let j = 0; j < current.length; j++) {
        if (list[i] === current[j].name) {
          gotAlready = true;
          break;
        }
      }
      if (!gotAlready) {
        newLabels.push(list[i]);
      }
    }
    return newLabels;
  }
  private getMissingLabels2(current: Array<any>, list: Array<any>) {
    let newLabels: Array<any> = []
    for (let i = 0; i < list.length; i++) {
      let gotAlready = false;
      for (let j = 0; j < current.length; j++) {
        if (list[i] === current[j].prm.name) {
          gotAlready = true;
          break;
        }
      }
      if (!gotAlready) {
        newLabels.push(list[i]);
      }
    }
    return newLabels;
  }
  handleSelectChange(event: any) {
    if (event.detail && event.detail.value) {
      /*
      let tmpLabels: Array<any> = [];
      this.functionLabels.forEach((val, idx) => {
        let toKeep = false;
        for (let i = 0; i < event.detail.value.length; i++) {
          if (this.functionLabels[idx].name === event.detail.value[i]) {
            toKeep = true;
            break;
          }
        }
        if (toKeep) {
          tmpLabels.push(this.functionLabels[idx]);
        }
      })
      let newLabels: Array<any> = []
      for (let i = 0; i < event.detail.value.length; i++) {
        let gotAlready = false;
        for (let j = 0; j < tmpLabels.length; j++) {
          if (event.detail.value[i] === tmpLabels[j].name) {
            gotAlready = true;
            break;
          }
        }
        if (!gotAlready) {
          newLabels.push(event.detail.value[i]);
        }
      }
      console.log('Tmp labels:', tmpLabels);
      console.log('New labels:', newLabels);
      */
     /*
      let tmpLabels: Array<any> = this.keepLabels(this.functionLabels, event.detail.value);
      this.functionLabels = [...tmpLabels,
      ...this.distService.getFuncLabels(this.folder, this.getMissingLabels(tmpLabels, event.detail.value))]
      let tmpLabels2 = this.keepLabels(this.propertyLabels, event.detail.value);
      //console.log(tmpLabels2);
      
      this.propertyLabels = [...tmpLabels2,
      ...this.distService.getPropLabels(this.folder, this.getMissingLabels(tmpLabels2, event.detail.value))]
      //this.functionLabels = this.distService.getFuncLabels(this.folder, event.detail.value);
      //this.propertyLabels = this.distService.getPropLabels(this.folder, event.detail.value);
      */
      let tmpLbl3 = this.keepLabels2(this.selected,event.detail.value);
      let missing = this.getMissingLabels2(tmpLbl3,event.detail.value);
      let funcTmp = this.distService.getFuncLabels(this.folder, missing);
      let propTmp = this.distService.getPropLabels(this.folder, missing);
      console.log('functions',funcTmp);
      console.log('porperties',propTmp);
      this.selected = [...tmpLbl3, ...this.getSelected(funcTmp,propTmp)];
      
      this.getSelected(this.functionLabels,this.propertyLabels);
      //console.log('this.functionLabels:',this.functionLabels);
      //console.log('this.propertyLabels:',this.propertyLabels);
      //console.log('this.selected:',this.selected);
    }
  }
}
