import { Injectable } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';

var distributions = require('@stdlib/stats/base/dists');
var linespace = require('@stdlib/array/linspace');

import * as funcProp from './data/funcProp.json';
import * as config from './data/config.json';
//import * as data from './data/data.json';
import * as addid from './data/additional.json';
import { Platform } from '@ionic/angular';

const MAX_NUM = 1000;

@Injectable({
  providedIn: 'root'
})
export class DistributionService {
  private _config: any = {};
  private _props: any = {};
  private _data: any = {};
  private _dists: any = {};
  private _addid: any = {};

  private mobile: boolean = false;

  constructor(private platform: Platform) {
    if (platform.is('mobile')) { this.mobile = true; console.log('running on mobile;') }
    this._config = JSON.parse(JSON.stringify(config));
    //this._data = JSON.parse(JSON.stringify(data));
    this._props = JSON.parse(JSON.stringify(funcProp));
    this._addid = JSON.parse(JSON.stringify(addid));
    this._dists = distributions;
  }

  private getDistributionTypes(): Array<string> {
    let distTypes: Array<string> = [];
    for (let dist of Object.keys(this._dists)) {
      if (dist === 'default') { continue; }

      let type = this._props[dist]['info']['type'];
      if (type !== undefined) {
        let availible = true;
        for (let i = 0; i < distTypes.length; i++) {
          if (distTypes[i] === type) { availible = false; }
        }
        if (availible) {
          distTypes.push(type);
        }
      }
    }
    return distTypes;
  }
  /*
  private readChartData(dist: string, func: string) {
    let chartType = this._props[dist]['functions'][func]['type'];
    let savedData = this._data[dist][func]['chart'];
    if ((chartType !== undefined) && (savedData !== undefined)) {
      if (chartType === 'line') {
        let labels: ChartData<'line'>['labels'] = savedData['chartLabels'];
        let datasets: ChartDataset<'line'> = savedData['chartDatasets'];
        let options: ChartOptions<'line'> = savedData['chartOptions'];
        let legend: boolean = savedData['chartLegend'];
        let plugins: Array<any> = savedData['chartPlugins'];
        let range: Array<number> = savedData['chartRange'];
        return {
          labels: labels,
          datasets: datasets,
          options: options,
          legend: legend,
          plugins: plugins,
          range: range,
          type: chartType
        }
      }
      else if (chartType === 'bar') {
        let labels: ChartData<'bar'>['labels'] = savedData['chartLabels'];
        let datasets: ChartDataset<'bar'> = savedData['chartDatasets'];
        let options: ChartOptions<'bar'> = savedData['chartOptions'];
        let legend: boolean = savedData['chartLegend'];
        let plugins: Array<any> = savedData['chartPlugins'];
        let range: Array<number> = savedData['chartRange'];
        return {
          labels: labels,
          datasets: datasets,
          options: options,
          legend: legend,
          plugins: plugins,
          range: range,
          type: chartType
        }
      }
    }
    return {}
  }
  */
  /*
  private analyseDescription(dist: string, func: string) {
    let des = this._props[dist]['functions'][func];
    let text: Array<{ text: string, code: boolean }> = [];
    if ((des !== undefined) && des.description) {
      //let title = des.name.toString().charAt(0).toLowerCase() + des.name.tostring().slice(1);
      let codeStart = des.description.toString().indexOf('<code>');
      let codeEnd = des.description.toString().indexOf('</code>')
      if ((codeStart > -1) && (codeEnd > -1) && (codeStart < codeEnd)) {
        text.push({
          text: des.description.toString().slice(0, codeStart),
          code: false
        })
        text.push({
          text: des.description.toString().slice(codeStart + ('<code>').length, codeEnd),
          code: true,

        })
        text.push({
          text: des.description.toString().slice(codeEnd + ('</code>').length),
          code: false
        })
      }
    }
    console.log('analysed:', text)
    return text;
  }
  */
  private analyseText(dist: string, func: string, type: string) {
    let funcInfo = this._props[dist][type][func];
    let text: Array<{ text: string, id: string, type: string }> = [];
    if ((funcInfo !== undefined) && funcInfo.description) {
      /*
      let tmpText = { text: funcInfo.description, result: text, end: false }
      let keep: boolean = true;
      while (keep) {
        let altText = tmpText.text;
        let newText = this.extractEntity(altText);
        if (newText !== '') {
          tmpText.text = newText;
        }
        else {
          keep = false;
        }
      }
      keep = true;
      while (keep) {
        let altText = tmpText.text;
        tmpText = this.extractLink(tmpText.text);
        //console.log(tmpText);
        if ((tmpText !== undefined) && (tmpText.text !== '') && (tmpText.result.length !== 0)) {
          text = [...text, ...tmpText.result];

          //console.log(text);
        }
        if (tmpText.end === true) {
          text = [...text, ...tmpText.result, ...tmpText.text];

          //console.log(text);
        }
        if ((tmpText.text === '') && (tmpText.result.length == 0)) {
          tmpText.text = altText;
          keep = false
        }
      }
      //console.log('switching loop',tmpText);
      keep = true;
      /*
      while (keep) {
        let altText = tmpText.text;
        tmpText = this.extractCode(tmpText.text);
        if ((tmpText !== undefined) && (tmpText.text !== '') && (tmpText.result.length !== 0)) {
          text = [...text, ...tmpText.result];
        }
        if (tmpText.end === true) {
          text = [...text, ...tmpText.result, ...tmpText.text];
        }
        if ((tmpText.text === '') && (tmpText.result.length == 0)) {
          text = [...text, { text: altText, id: 'text', type: '' }]
          keep = false
        }
      }
     */
      return this.extractImage(dist,
        this.extractBreak2(
          this.extractCode2(
            this.extractLink2(
              this.extractEntity2([{ text: funcInfo.description, id: 'text', type: '' }])))));
    }
    //console.log(text);
    return [];
  }
  private extractImage(dist: string, text: Array<{ text: string, id: string, type: string }>) {
    let result: Array<{ text: string, id: string, type: string }> = []
    for (let i = 0; i < text.length; i++) {
      let idxS = text[i].text.indexOf('<img>');
      let idxE = text[i].text.indexOf('</img>');
      if ((idxS > -1) && (idxE > -1) && (idxS < idxE)) {
        result.push({
          text: text[i].text.slice(0, idxS),
          id: text[i].id,
          type: text[i].type
        })
        result.push({
          text: text[i].text.slice(idxS + ('<img>').length, idxE),
          id: 'img',
          type: '../../../assets/equations/' + dist.toString() + '/' + dist.toString() + '-' + text[i].text.slice(idxS + ('<img>').length, idxE) + '.svg'
        })
        result.push({
          text: text[i].text.slice(idxE + ('</img>').length),
          id: text[i].id,
          type: text[i].type
        })
      }
      else {
        result.push(text[i]);
      }
    }
    return result;
  }
  private extractLink2(text: Array<{ text: string, id: string, type: string }>) {
    let result: Array<{ text: string, id: string, type: string }> = []
    for (let i = 0; i < text.length; i++) {
      let keep = true;
      let altText = text[i].text;
      while (keep) {
        //console.log('altText:', altText);
        let idxS = altText.indexOf('<link>');
        let idxE = altText.indexOf('</link>');
        let idxST = altText.indexOf('<t>');
        let idxET = altText.indexOf('</t>');
        //console.log("start:",idxS,"; end:", idxE,'; text:',text)
        if ((idxS > -1) && (idxE > -1) && (idxS < idxE) && (idxST > -1) && (idxET > -1) && (idxST < idxET)) {
          result.push({
            text: altText.slice(0, idxS),
            id: text[i].id,
            type: text[i].type
          })
          result.push({
            text: altText.slice(idxET + ('</t>').length, idxE),
            id: 'link',
            type: altText.slice(idxST + ('<t>').length, idxET)
          })
          //console.log("result", result);
          altText = altText.slice(idxE + ('</link>').length);
        }
        else if ((idxS > -1) && (idxE > -1) && (idxS < idxE)) {
          result.push({
            text: altText.slice(0, idxS),
            id: 'text',
            type: ''
          })
          result.push({
            text: altText.slice(idxS + ('<link>').length, idxE),
            id: 'link',
            type: ''
          })
          altText = altText.slice(idxE + ('</link>').length);
        }
        else {
          //console.log('no more found');
          result.push({
            text: altText,
            id: text[i].id,
            type: text[i].type
          })
          keep = false;
        }
      }
    }
    return result;
  }
  private extractCode2(text: Array<{ text: string, id: string, type: string }>) {
    let result: Array<{ text: string, id: string, type: string }> = []
    for (let i = 0; i < text.length; i++) {
      let keep = true;
      let altText = text[i].text;
      while (keep) {
        //console.log('altText:', altText);
        let idxS = altText.indexOf('<code>');
        let idxE = altText.indexOf('</code>');
        //console.log("start:",idxS,"; end:", idxE,'; text:',text)
        if ((idxS > -1) && (idxE > -1) && (idxS < idxE)) {
          result.push({
            text: altText.slice(0, idxS),
            id: text[i].id,
            type: text[i].type
          })
          result.push({
            text: altText.slice(idxS + ('<code>').length, idxE),
            id: 'code',
            type: ''
          })
          //console.log("result", result);
          altText = altText.slice(idxE + ('</code>').length);
        }
        else {
          //console.log('no more found');
          result.push({
            text: altText,
            id: text[i].id,
            type: text[i].type
          })
          keep = false;
        }
      }
    }
    return result;
  }
  private extractBreak2(text: Array<{ text: string, id: string, type: string }>) {
    let result: Array<{ text: string, id: string, type: string }> = []
    for (let i = 0; i < text.length; i++) {
      let keep = true;
      let altText = text[i].text;
      while (keep) {
        let idxS = altText.indexOf('<br>');
        if (idxS > -1) {
          result.push({
            text: altText.slice(0, idxS),
            id: text[i].id,
            type: text[i].type
          })
          result.push({
            text: '',
            id: 'break',
            type: 'break'
          })
          //console.log("result", result);
          altText = altText.slice(idxS + ('<br>').length);
        }
        else {
          //console.log('no more found');
          result.push({
            text: altText,
            id: text[i].id,
            type: text[i].type
          })
          keep = false;
        }
      }
    }
    return result;
  }
  private extractEntity2(text: Array<{ text: string, id: string, type: string }>) {
    let result: Array<{ text: string, id: string, type: string }> = []
    for (let i = 0; i < text.length; i++) {
      let keep = true;
      let altText = text[i].text;
      let newText: string = '';
      while (keep) {
        let idxS = altText.indexOf('<entity>');
        let idxE = altText.indexOf('</entity>');
        //console.log("start:",idxS,'; end:',idxE);
        if ((idxS > -1) && (idxE > -1) && (idxS < idxE)) {
          let text1 = altText.slice(0, idxS);
          let _addid = JSON.parse(JSON.stringify(addid));
          let text2 = altText.slice(idxS + ('<entity>').length, idxE)
          let tmp = _addid['entities'][text2];
          if (tmp !== undefined) {
            text2 = tmp;
          }
          altText = altText.slice(idxE + ('</entity>').length);
          //console.log(text1 + text2 + text3)
          newText = newText + text1 + text2;
          //console.log("new text:",newText);
          //console.log("alt Text:", altText);
        }
        else {
          newText = newText + altText;
          keep = false;
        }
      }
      result.push({
        text: newText,
        id: text[i].id,
        type: text[i].type
      })
    }
    return result;
  }
  /*
  private extractCode(text: string) {
    let result: Array<{ text: string, id: string, type: string }> = []
    let idxS = text.indexOf('<code>');
    let idxE = text.indexOf('</code>');
    //console.log("start:",idxS,"; end:", idxE,'; text:',text)
    if ((idxS > -1) && (idxE > -1) && (idxS < idxE)) {
      result.push({
        text: text.slice(0, idxS),
        id: 'text',
        type: ''
      })
      result.push({
        text: text.slice(idxS + ('<code>').length, idxE),
        id: 'code',
        type: ''
      })
      if ((idxE + ('</code>').length) < text.length) {
        return {
          text: text.slice(idxE + ('</code>').length),
          result: result,
          end: false
        }
      }
      else {
        //console.log('End of text', result);
        return {
          text: '',
          result: result,
          end: true,
        }
      }


    }
    return { text: '', result: result, end: false };
  }
  */
  /*
  private extractLink(text: string) {
    let result: Array<{ text: string, id: string, type: string }> = []
    let idxS = text.indexOf('<link>');
    let idxE = text.indexOf('</link>');
    let idxST = text.indexOf('<t>');
    let idxET = text.indexOf('</t>');
    //console.log("start:",idxS,'; end:',idxE);
    if ((idxS > -1) && (idxE > -1) && (idxS < idxE) && (idxST > -1) && (idxET > -1) && (idxST < idxET)) {
      result.push({
        text: text.slice(0, idxS),
        id: 'text',
        type: ''
      })
      result.push({
        text: text.slice(idxET + ('</t>').length, idxE),
        id: 'link',
        type: text.slice(idxST + ('<t>').length, idxET)
      })
      if ((idxE + ('</link>').length) < text.length) {
        return {
          text: text.slice(idxE + ('</link>').length),
          result: result,
          end: false
        }
      }
      else {
        return {
          text: '',
          result: result,
          end: true,
        }
      }
    }
    else if ((idxS > -1) && (idxE > -1) && (idxS < idxE)) {
      result.push({
        text: text.slice(0, idxS),
        id: 'text',
        type: ''
      })
      result.push({
        text: text.slice(idxS + ('<link>').length, idxE),
        id: 'link',
        type: ''
      })
      if ((idxE + ('</link>').length) < text.length) {
        return {
          text: text.slice(idxE + ('</link>').length),
          result: result,
          end: false
        }
      }
      else {
        return {
          text: '',
          result: result,
          end: true,
        }
      }
    }
    /*
    if ((idxS > -1) && (idxE > -1) && (idxS < idxE) && (idxST > -1) && (idxET > -1) && (idxST < idxET)) {
      result.push({
        text: text.slice(0, idxS),
        id: 'text'
      })
      result.push({
        text: text.slice(idxS + ('<link>').length, idxE),
        id: 'link',
      })
      if ((idxE + ('</link>').length) < text.length) {
        return {
          text: text.slice(idxE + ('</link>').length),
          result: result,
          end: false
        }
      }
      else {
        return {
          text: '',
          result: result,
          end: true,
        }
      }
    }
    
    return { text: '', result: result, end: false };
  }
  */
  /*
  private extractEntity(text: string) {
    let idxS = text.indexOf('<entity>');
    let idxE = text.indexOf('</entity>');
    //console.log("start:",idxS,'; end:',idxE);
    if ((idxS > -1) && (idxE > -1) && (idxS < idxE)) {
      let text1 = text.slice(0, idxS);
      let _addid = JSON.parse(JSON.stringify(addid));
      let text2 = text.slice(idxS + ('<entity>').length, idxE)
      let tmp = _addid['entities'][text2];
      if (tmp !== undefined) {
        text2 = tmp;
      }
      let text3 = text.slice(idxE + ('</entity>').length);
      //console.log(text1 + text2 + text3)
      return text1 + text2 + text3;
    }
    return '';
  }
  */
  private useFunction(f: Function, line: Line, x: number | undefined = undefined): number {
    if (line.params.length === 1) {
      if (x === undefined) {
        return f(line.params[0].value);
      }
      else {
        return f(x, line.params[0].value);
      }
    }
    else if (line.params.length === 2) {
      if (x === undefined) {
        return f(line.params[0].value, line.params[1].value);
      }
      else {
        return f(x, line.params[0].value, line.params[1].value);
      }
    }
    else if (line.params.length === 3) {
      if (x === undefined) {
        return f(line.params[0].value, line.params[1].value, line.params[2].value);
      }
      else {
        return f(x, line.params[0].value, line.params[1].value, line.params[2].value);
      }
    }
    else if (line.params.length === 4) {
      if (x === undefined) {
        return f(line.params[0].value, line.params[1].value,
          line.params[2].value, line.params[3].value);
      }
      else {
        return f(x, line.params[0].value, line.params[1].value
          , line.params[2].value, line.params[3].value);
      }
    }
    else if (line.params.length === 5) {
      if (x === undefined) {
        return f(line.params[0].value, line.params[1].value, line.params[2].value,
          line.params[3].value, line.params[4].value);
      }
      else {
        return f(x, line.params[0].value, line.params[1].value, line.params[2].value,
          line.params[3].value, line.params[4].value);
      }
    }
    else if (line.params.length === 2) {
      if (x === undefined) {
        return f(line.params[0].value, line.params[1].value);
      }
      else {
        return f(x, line.params[0].value, line.params[1].value);
      }
    }
    return NaN;
  }

  public checkConfig(tocheck: string, type: string = 'distributions'): boolean {
    let checklist: Array<string> = this._config[type];
    if (checklist !== undefined) {
      for (let i = 0; i < checklist.length; i++) {
        if (tocheck === checklist[i]) {
          return true;
        }
      }
    }
    return false;
  }
  public checkEquation(dist: string, func: string) {
    let distData = this._addid['equations'][dist];
    if (distData !== undefined) {
      let funcData = distData[func];
      if (funcData !== undefined) {
        return false;
      }
    }
    return true;
  }
  public getMenuLabels() {
    let distTypes = this.getDistributionTypes();
    let labels: Array<any> = [];
    for (let i = 0; i < distTypes.length; i++) {
      let typeLabels: Array<any> = [];
      for (let dist of Object.keys(this._dists)) {
        if (dist === 'default') { continue; }
        if (this.checkConfig(dist, 'distributions')) { continue; }
        if (distTypes[i] === this._props[dist]['info']['type']) {
          typeLabels.push({
            name: dist,
            title: this.getTitle(dist),
            url: '/distribution/' + dist.toString(),
            icon: 'stats-chart'
          })
        }
      }
      labels.push({
        name: distTypes[i],
        title: distTypes[i].charAt(0).toUpperCase() + distTypes[i].slice(1),
        labels: typeLabels
      })
    }
    return labels;
  }
  public getTitle(dist: string): string {
    let title = this._props[dist]['info']['name'];
    if (title !== undefined) {
      return title;
    }
    return 'Title';
  }
  public getFunctionLabels(dist: string, first: boolean = false): Array<any> {
    if (first && this._props[dist]['functions']['pdf']) {
      //console.log(dist,this._props[dist]['functions']['pdf'].description);

      return [{
        name: 'pdf',
        title: this._props[dist]['functions']['pdf']['name'],
        dist: dist,
        description: this.analyseText(dist, 'pdf', 'functions'),
        distLink: this._addid['links']['distributions'][dist],
        funcLink: this._addid['links']['funcprop']['pdf'],
      }]
    }
    if (first && this._props[dist]['functions']['pmf']) {
      return [{
        name: 'pmf',
        title: this._props[dist]['functions']['pmf']['name'],
        dist: dist,
        description: this.analyseText(dist, 'pmf', 'functions'),
        distLink: this._addid['links']['distributions'][dist],
        funcLink: this._addid['links']['funcprop']['pmf'],
      }]
    }
    let functions = this._dists[dist];
    let labels: Array<any> = []
    for (let funcLabel of Object.keys(functions)) {
      if (funcLabel === 'default') { continue; }
      let func = this._props[dist]['functions'][funcLabel]
      if ((func !== undefined) && (func.name)) {
        //console.log(func, func.description)
        if (func.description !== undefined) {
          labels.push({
            name: funcLabel,
            title: func.name,
            dist: dist,
            description: this.analyseText(dist, funcLabel, 'functions'),
            distLink: this._addid['links']['distributions'][dist],
            funcLink: this._addid['links']['funcprop'][funcLabel],
          });
        }
        else {
          labels.push({
            name: funcLabel,
            title: func.name,
            dist: dist,
            description: '',
            distLink: '',
            funcLink: ''
          });
        }

      }
    }

    return labels;
  }
  public getPropertyLabels(dist: string, first: boolean = false): Array<any> {
    if (first) { return []; }
    let properties = this._dists[dist];
    let labels: Array<any> = []
    console.log(properties)
    for (let funcLabel of Object.keys(properties)) {
      if (funcLabel === 'default') { continue; }
      let func = this._props[dist]['properties'][funcLabel]
      if ((func !== undefined) && (func.name)) {
        labels.push({
          name: funcLabel,
          title: func.name,
          dist: dist,
          description: this.analyseText(dist, funcLabel, 'properties'),
          distLink: this._addid['links']['distributions'][dist],
          funcLink: this._addid['links']['funcprop'][funcLabel],
        });
      }
    }

    return labels;
  }
  /*
  public getOverviewLabels(): Array<any> {
    let labels: Array<any> = []
    for (let dist of Object.keys(this._dists)) {
      if (dist === 'default') { continue; }
      if (this.checkConfig(dist, 'distributions')) { continue; }
      let distTmp = this._props[dist];
      if (distTmp !== undefined) {
        let label = distTmp['info']['name'];
        if (label !== undefined) {
          labels.push({
            name: dist,
            title: label,
            url: '/distribution/' + dist
          })
        }
      }
    }
    return labels;
  }
  */
/*
  public getLines(dist: string, func: string): Array<Line> {
    let lines = this._data[dist][func]['lines']
    let result: Array<Line> = []
    if ((lines !== undefined) && lines.length) {
      for (let i = 0; i < lines.length; i++) {
        if ((lines[i]._id >= 0) && lines[i]._params) {
          let params: Array<{ name: string, entity: string, step: number, value: number }> = []
          for (let j = 0; j < lines[i]._params.length; j++) {
            params.push({
              name: lines[i]._params[j]._name as string,
              entity: lines[i]._params[j]._entity as string,
              value: lines[i]._params[j]._value as number,
              step: lines[i]._params[j]._step as number,
            })
          }
          result.push(new Line(lines[i]._id, params))
        }
      }
    }
    return result;
  }
  */
  public getLines2(dist: string, func: string): Array<Line> {
    if ((this._data[dist] !== undefined) && (this._data[dist][func] !== undefined) && (this._data[dist][func].lines)) {
      return this._data[dist][func].lines;
    }
    let lines: Array<Line> = [];
    let init = this._props[dist]['info']['init_val'];
    let param = this._props[dist]['info']['param'];
    if ((init !== undefined) && (param !== undefined)) {
      for (let i = 0; i < init.length; i++) {
        let prms: Array<{ name: string, entity: string, step: number, value: number }> = [];
        for (let j = 0; j < param.length; j++) {
          prms.push({
            name: param[j].name,
            entity: param[j].entity,
            step: param[j].step,
            value: init[i][j]
          })
        }
        lines.push(new Line(i, prms));
      }
      //console.log(this._data);
      if (this._data[dist] !== undefined) {
        this._data[dist][func] = {
          lines: lines,
          chart: undefined
        }
      }
      else {
        let tmpObj = JSON.parse(JSON.stringify({}));
        tmpObj[func] = { lines: lines, chart: undefined };
        this._data[dist] = tmpObj;
      }
    }
    return lines;
  }
  /*
  public getLines3(dist: string, func: string, callback: VoidFunction = () => { }): Array<Line> {
    if ((this._data[dist] !== undefined) && (this._data[dist][func] !== undefined) && (this._data[dist][func].lines)) {
      return this._data[dist][func].lines;
    }
    let lines: Array<Line> = [];
    let init = this._props[dist]['info']['init_val'];
    let param = this._props[dist]['info']['param'];
    if ((init !== undefined) && (param !== undefined)) {
      for (let i = 0; i < init.length; i++) {
        let prms: Array<{ name: string, entity: string, step: number, value: number }> = [];
        for (let j = 0; j < param.length; j++) {
          prms.push({
            name: param[j].name,
            entity: param[j].entity,
            step: param[j].step,
            value: init[i][j]
          })
        }
        lines.push(new Line(i, prms));
      }
      //console.log(this._data);
      if (this._data[dist] !== undefined) {
        this._data[dist][func] = {
          lines: lines,
          chart: undefined
        }
      }
      else {
        let tmpObj = JSON.parse(JSON.stringify({}));
        tmpObj[func] = { lines: lines, chart: undefined };
        this._data[dist] = tmpObj;
      }
      //this.getChartData3(dist, func, callback);
    }
    return lines;
  }
  */
  public getLinesProp(dist: string) {
    let init = this._props[dist]['info']['init_val'];
    let param = this._props[dist]['info']['param'];
    if ((init !== undefined) && (param !== undefined) && (init.length >= 1)) {
      let prms: Array<{ name: string, entity: string, step: number, value: number }> = [];
      for (let i = 0; i < param.length; i++) {
        prms.push({
          name: param[i].name,
          entity: param[i].entity,
          step: param[i].step,
          value: init[0][i]
        })
      }
      let line = new Line(0, prms);
      return [line];
    }
    return [];
  }
  public calcLine(dist: string, prop: string, line: Line): number {
    let f = this._dists[dist][prop];
    if (f !== undefined) {
      return this.useFunction(f, line, undefined);
    }
    return NaN;
  }
  /*
  public getChartData(dist: string, func: string): {
    type: string,
    labels: Array<number>,
    range: Array<number>,
    datasets: Array<any>,
    options: any,
    plugins: Array<any>,
    legend: boolean,
  } {
    let cData = this._data[dist][func]['chart'];
    let chartType = this._props[dist]['functions'][func]

    if ((cData !== undefined) && (chartType !== undefined) && chartType.type) {
      return {
        type: chartType.type,
        labels: cData.chartLabels,
        range: cData.chartRange,
        datasets: cData.chartDatasets,
        options: cData.chartOptions,
        plugins: cData.chartPlugins,
        legend: cData.chartLegend,
      }
      /*
      chartData.type = chartType;
      console.log(dist, '.', func, '.cData.chartLabels = ', cData.chartLabels)
      chartData.labels = cData['chartLabels'];
      chartData.datasets = cData.chartDatasets;
      chartData.legend = cData.chartLegend;
      chartData.options = cData.chartOptions;
      chartData.plugins = cData.chartPlugins;
      chartData.labels = cData.chartLegend;
      
    }

    return {
      type: 'line',
      labels: [],
      range: [],
      datasets: [],
      options: {},
      plugins: [],
      legend: false,
    };
  }
  */
  public getChartData2(dist: string, func: string): {
    type: string,
    labels: Array<number>,
    range: Array<number>,
    datasets: Array<any>,
    options: any,
    plugins: Array<any>,
    legend: boolean,
    width: number
  } {
    let dataTmp = this._data[dist][func];
    if ((dataTmp !== undefined) && (dataTmp.chart !== undefined)) {
      //console.log(dist, func);
      return dataTmp.chart
    }
    let f = this._dists[dist][func];
    let range = this._props[dist]['functions'][func]['range'];
    let type = this._props[dist]['functions'][func]['type'];
    //console.log('Function:', f);
    //console.log('Range:', range);
    //console.log('Type:', type);
    if ((f !== undefined) && (range !== undefined) && (type !== undefined)) {
      let labels = this.createChartLabels(range, type);
      let datasets = this.createChartDatasets(f, this.getLines2(dist, func), labels, type);
      let options = this.createChartOptions(type, range, dist, func);
      let chartTmp = {
        type: type,
        labels: labels,
        datasets: datasets,
        options: options,
        range: range,
        plugins: [],
        legend: true,
        width: 0
      }
      if (this.mobile) {
        chartTmp.width = this.platform.width() - 40;
      }
      this._data[dist][func].chart = chartTmp;
      return chartTmp
    }

    return {
      type: 'line',
      labels: [],
      range: [],
      datasets: [],
      options: {},
      plugins: [],
      legend: false,
      width: 0
    };
  }
  /*
  public getChartData3(dist: string, func: string): {
    type: string,
    labels: Array<number>,
    range: Array<number>,
    datasets: Array<any>,
    options: any,
    plugins: Array<any>,
    legend: boolean,
  } {
    let dataTmp = this._data[dist][func];
    if ((dataTmp !== undefined) && (dataTmp.chart !== undefined)) {
      //console.log(dist, func);
      return dataTmp.chart
    }
    let f = this._dists[dist][func];
    let range = this._props[dist]['functions'][func]['range'];
    let type = this._props[dist]['functions'][func]['type'];
    //console.log('Function:', f);
    //console.log('Range:', range);
    //console.log('Type:', type);
    if ((f !== undefined) && (range !== undefined) && (type !== undefined)) {
      let labels = this.createChartLabels(range, type);
      let datasets = this.createChartDatasets3(f, [this.getLines2(dist, func)[0]], labels, type);
      if ((dist === 'normal') || (dist === 'rayleigh') || (dist === 'truncatedNormal') || (dist === 'hypergeometric')) {
        datasets = this.createChartDatasets3(f, [this.getLines2(dist, func)[1]], labels, type);
      }
      if (dist === 'arcsine') {
        datasets[0].data[500] = Infinity;
        datasets[0].data[599] = Infinity;
      }
      if (dist === 'kumaraswamy') {
        datasets[0].data[0] = Infinity;
        datasets[0].data[999] = Infinity;
      }
      let options = this.createChartOptions3(type, range);
      let chartTmp = {
        type: type,
        labels: labels,
        datasets: datasets,
        options: options,
        range: range,
        plugins: [],
        legend: false
      }
      this._data[dist][func].chart = chartTmp;
      console.log(chartTmp);

      return chartTmp
    }

    return {
      type: 'line',
      labels: [],
      range: [],
      datasets: [],
      options: {},
      plugins: [],
      legend: false,
    };
  }
  */
  private createChartLabels(range: Array<number>, type: string) {
    let labels: Array<number> = [];
    if (type === 'line') {
      labels = linespace(range[0], range[1], MAX_NUM);
    }
    else if (type === 'bar') {
      for (let i = range[0]; i <= range[1]; i++) {
        labels.push(i);
      }
    }
    return labels;
  }
  private createChartDatasets(f: Function, lines: Array<Line>, labels: Array<number>, type: string, stepped: boolean = false) {
    if (type === 'line') {
      let datasets: ChartDataset<'line'>[] = [];
      lines.forEach((_, i) => {
        let result: Array<number> = [];
        labels.forEach((_, j) => {
          result.push(this.useFunction(f, lines[i], labels[j]));
        })
        if (stepped) {
          datasets.push({
            data: result,
            label: 'Line ' + (lines[i].id + 1).toString(),
            pointRadius: 0,
            fill: false,
            backgroundColor: lines[i].backgroundColor,
            borderColor: lines[i].borderColor,
            stepped: true
          })
        }
        else {
          datasets.push({
            data: result,
            label: 'Line ' + (lines[i].id + 1).toString(),
            pointRadius: 0,
            fill: false,
            backgroundColor: lines[i].backgroundColor,
            borderColor: lines[i].borderColor,
            cubicInterpolationMode: 'monotone'
          })
        }
      })
      return datasets
    }
    if (type === 'bar') {
      let datasets: ChartDataset<'bar'>[] = [];
      lines.forEach((_, i) => {
        let result: Array<number> = [];
        labels.forEach((_, j) => {
          result.push(this.useFunction(f, lines[i], labels[j]));
        })
        datasets.push({
          data: result,
          label: 'Line ' + (lines[i].id + 1).toString(),
          borderColor: lines[i].borderColor,
          backgroundColor: lines[i].backgroundColor
        })
      })
      return datasets;
    }
    return [];
  }
  /*
  private createChartDatasets3(f: Function, lines: Array<Line>, labels: Array<number>, type: string, stepped: boolean = false) {
    if (type === 'line') {
      let datasets: ChartDataset<'line'>[] = [];
      lines.forEach((_, i) => {
        let result: Array<number> = [];
        labels.forEach((_, j) => {
          result.push(this.useFunction(f, lines[i], labels[j]));
        })
        if (stepped) {
          datasets.push({
            data: result,
            label: 'Line ' + (lines[i].id + 1).toString(),
            pointRadius: 0,
            borderWidth: 10,
            fill: false,
            backgroundColor: getBackgroundColor(0),
            borderColor: getBorderColor(0),
            stepped: true
          })
        }
        else {
          datasets.push({
            data: result,
            label: 'Line ' + (lines[i].id + 1).toString(),
            pointRadius: 0,
            borderWidth: 10,
            fill: false,
            backgroundColor: getBackgroundColor(0),
            borderColor: getBorderColor(0),
            cubicInterpolationMode: 'monotone'
          })
        }
      })
      return datasets
    }
    if (type === 'bar') {
      let datasets: ChartDataset<'bar'>[] = [];
      lines.forEach((_, i) => {
        let result: Array<number> = [];
        labels.forEach((_, j) => {
          result.push(this.useFunction(f, lines[i], labels[j]));
        })
        datasets.push({
          data: result,
          label: 'Line ' + (lines[i].id + 1).toString(),
          borderColor: getBorderColor(0),
          backgroundColor: getBorderColor(0)
        })
      }) 
      return datasets;
    }
    return [];
  }
  */
  private createChartOptions(type: string, range: Array<number>, dist:string, func:string) {
    if (type === 'line') {
      let options: ChartOptions<'line'> = { responsive: true };
      if (this.mobile) {
        options.responsive = false;
      }
      if(this._addid['axis'][dist] && this._addid['axis'][dist][func]){
        let titles:Array<string> = this._addid['axis'][dist][func];
        //console.log(titles)
        if(titles.length === 2){
          options.scales = {
            x: {
              type: 'linear',
              min: range[0],
              max: range[1],
              title : {
                text:titles[0],
                display:true,
                font: {
                  size:15
                }
              }
            },
            y: {
              type: 'linear',
              title:{
                text:titles[1],
                display:true,
                font: {
                  size:15
                }
              }
            }
          }
          
        }
        else {
          options.scales = {
            x: {
              type: 'linear',
              min: range[0],
              max: range[1]
            },
            y: {
              type: 'linear'
            }
          }
        }
      }
      else {
        options.scales = {
          x: {
            type: 'linear',
            min: range[0],
            max: range[1]
          },
          y: {
            type: 'linear'
          }
        }
      }
      
      return options;
    }
    else if (type === 'bar') {
      let options: ChartOptions<'bar'> = { responsive: true };
      if (this.mobile) {
        options.responsive = false;
      }
      options.scales = {
        x: {
          type: 'linear',
          min: range[0],
          max: range[1]
        },
        y: {
          type: 'linear'
        }
      }
      return options;
    }
    return undefined;
  }
  /*
  private createChartOptions3(type: string, range: Array<number>) {
    if (type === 'line') {
      let options: ChartOptions<'line'> = { responsive: true };
      options.scales = {
        x: {
          display: false,
          grid: {
            display: false,
          }
        },
        y: {
          grid: {
            display: false,
          },
          display: false
        }
      }
      return options;
    }
    else if (type === 'bar') {
      let options: ChartOptions<'bar'> = { responsive: true };
      options.scales = {
        x: {
          display: false,
          grid: {
            display: false,
          }
        },
        y: {
          grid: {
            display: false,
          },
          display: false
        }
      }
      return options;
    }
    return undefined;
  }
  */
  /*
  public getOverviewData(distTypes: Array<any>) {
    //console.log('Lables',distTypes);

    let chartData: Array<Array<any>> = []
    for (let i = 0; i < distTypes.length; i++) {
      let labels = distTypes[i].labels;
      let dataArrTmp: Array<any> = [];
      for (let j = 0; j < labels.length; j++) {
        //console.log(distTypes[i]['name'], labels[j].name);
        let dataTmp: any = undefined;
        if (distTypes[i].name === 'continuous') {
          dataTmp = this.readChartData(labels[j].name, 'pdf');
        }
        else if (distTypes[i].name === 'discrete') {
          dataTmp = this.readChartData(labels[j].name, 'pmf');
        }
        if (dataTmp !== undefined) {
          dataTmp.datasets = [dataTmp.datasets[0]];
          dataTmp.legend = false;
          dataTmp.options.scales = {
            x: {
              display: false,
              grid: {
                display: false,
              }
            },
            y: {
              grid: {
                display: true,
              },
              display: true
            }
          }
          dataArrTmp.push(dataTmp);
        }
      }
      chartData.push(dataArrTmp);
    }
    return chartData;
  }
  */
  private getShort(func: string) {
    let short = this._addid['shorts'][func];
    if (short !== undefined) {
      return short;
    }
    return '';
  }
  public getFuncsProps(dist: string): Array<any> {
    let lables: Array<any> = []
    for (let func of Object.keys(this._dists[dist])) {
      if (func === 'default') { continue; }
      if (func.toString().charAt(0) !== dist.charAt(0).toUpperCase()) {
        let funcLabel = this._props[dist]['functions'][func];
        //console.log(funcLabel)
        if (funcLabel === undefined) {
          //console.log('trying properties')
          funcLabel = this._props[dist]['properties'][func];
        }
        //console.log(func);
        //console.log(funcLabel);

        if ((funcLabel !== undefined) && funcLabel.name) {
          let short = this.getShort(func);
          if (short === '') {
            lables.push({
              title: funcLabel.name,
              short: funcLabel.name,
              name: func
            })
          }
          else {
            lables.push({
              title: funcLabel.name,
              short: short,
              name: func
            })
          }
        }
      }
    }
    return lables;
  }
  public getFuncLabels(dist: string, list: any) {
    let functions = this.getFunctionLabels(dist);
    let result: Array<any> = []
    if (list && list.length) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < functions.length; j++) {
          if (functions[j].name === list[i]) {
            result.push(functions[j]);
          }
        }
      }
    }
    return result;
  }
  public getPropLabels(dist: string, list: any) {
    let properties = this.getPropertyLabels(dist);
    let result: Array<any> = []
    if (list && list.length) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < properties.length; j++) {
          if (properties[j].name === list[i]) {
            result.push(properties[j]);
          }
        }
      }
    }
    return result;
  }
/*
  public getFuncLabels2(dist: string, list: any) {
    let functions = this.getFunctionLabels(dist);
    let result: Array<any> = []
    if (list && list.length) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < functions.length; j++) {
          if (functions[j].prm.name === list[i]) {
            result.push(functions[j]);
          }
        }
      }
    }
    return result;
  }
*/
  /*
  public getPropLabels2(dist: string, list: any) {
    let properties = this.getPropertyLabels(dist);
    let result: Array<any> = []
    if (list && list.length) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < properties.length; j++) {
          if (properties[j].prm.name === list[i]) {
            result.push(properties[j]);
          }
        }
      }
    }
    return result;
  }
*/

  public onAddLine(dist: string, func: string) {
    let lines: Array<Line> = this._data[dist][func]['lines'];
    let init = this._props[dist]['info']['init_val'];
    let param = this._props[dist]['info']['param'];
    if ((init !== undefined) && (param !== undefined)) {
      let prms: Array<{ name: string, entity: string, step: number, value: number }> = [];
      for (let j = 0; j < param.length; j++) {
        prms.push({
          name: param[j].name,
          entity: param[j].entity,
          step: param[j].step,
          value: init[0][j]
        })
      }
      lines.push(new Line(lines.length, prms));
      //console.log(this._data);
      let chart = this._data[dist][func]['chart'];
      chart.datasets = [...chart.datasets, ...this.createChartDatasets(this._dists[dist][func], [lines[lines.length - 1]], chart.labels, chart.type, this._props[dist]['functions'][func]['stepped'])];
      this._data[dist][func] = {
        lines: lines,
        chart: chart
      }
    }
    return lines;
  }
  public onRangeChange(dist: string, func: string, range: Array<number>) {
    let funcData: {
      lines: Array<Line>, chart: {
        type: string,
        labels: Array<number>,
        range: Array<number>,
        datasets: Array<any>,
        options: any,
        plugins: Array<any>,
        legend: boolean,
      }
    } = this._data[dist][func];
    let f = this._dists[dist][func];
    if ((funcData !== undefined) && (range.length === 2) && (f !== undefined)) {
      funcData.chart.range = range;
      funcData.chart.labels = this.createChartLabels(range, funcData.chart.type);
      funcData.chart.datasets = this.createChartDatasets(f, funcData.lines, funcData.chart.labels, funcData.chart.type);
      funcData.chart.options = this.createChartOptions(funcData.chart.type, range, dist,func);
      this._data[dist][func] = funcData;
    }
  }
  public onDeleteLine(dist: string, func: string, idx: number) {
    let funcData: {
      lines: Array<Line>, chart: {
        type: string,
        labels: Array<number>,
        range: Array<number>,
        datasets: Array<any>,
        options: any,
        plugins: Array<any>,
        legend: boolean,
      }
    } = this._data[dist][func];
    if ((funcData !== undefined)) {
      //console.log('Filtering item');
      funcData.lines = funcData.lines.filter((_, i) => i !== idx);
      funcData.chart.datasets = funcData.chart.datasets.filter((_, i) => i !== idx);
      if (idx < funcData.lines.length) {
        funcData.lines.forEach((_, i) => {
          funcData.lines[i].id = i;
        })
        funcData.chart.datasets.forEach((_, i) => {
          funcData.chart.datasets[i].label = 'Line ' + (i + 1).toString();
          funcData.chart.datasets[i].borderColor = funcData.lines[i].borderColor;
          funcData.chart.datasets[i].backgroundColor = funcData.lines[i].backgroundColor;
        })
      }
      this._data[dist][func] = funcData;
    }
  }
  public onLineChange(dist: string, func: string, idx: number, line: Line) {
    let funcData: {
      lines: Array<Line>, chart: {
        type: string,
        labels: Array<number>,
        range: Array<number>,
        datasets: Array<any>,
        options: any,
        plugins: Array<any>,
        legend: boolean,
      }
    } = this._data[dist][func];
    let f = this._dists[dist][func];
    if ((funcData !== undefined) && (f !== undefined)) {
      funcData.lines[idx] = line;
      funcData.chart.datasets[idx] = this.createChartDatasets(f, [line], funcData.chart.labels, funcData.chart.type)[0];
      this._data[dist][func] = funcData;
    }
  }
}

export class LineParam {
  private _name: string = "param";
  private _entity: string = "";
  private _value: number = NaN;
  private _step: number = 1;
  /*
  constructor(prm: any) {
    if (prm.name !== undefined) { this._name = prm.name; }
    if (prm.entity !== undefined) { this._entity = prm.entity; }
    if ((prm.value !== undefined) /*&& (prm.value !== null)*) { this._value = prm.value; }
    if (prm.step !== undefined) { this._step = prm.step; }
  }
  */
  constructor(name: string, value: number, step: number = 0.2, entity: string = '') {
    this._name = name;
    this._step = step;
    this._value = value;
    if (entity === '') {
      let _addid = JSON.parse(JSON.stringify(addid));
      let tmp = _addid['entities'][name];
      if (tmp !== undefined) {
        this._entity = tmp;
      }
    }
    else {
      this._entity = entity
    }
  }

  public get name(): string { return this._name; }
  public get entity(): string { return this._entity; }
  public get value(): number { return this._value; }
  public get step(): number { return this._step; }

  public set name(name: string) { this._name = name; }
  public set entity(entity: string) { this._entity = entity; }
  public set value(value: number) { this._value = value; }
  public set step(step: number) { this._step = step; }
}
export class Line {
  private _id: number = NaN;
  private _params: LineParam[] = [];
  private _backgroundColor: any = 'white';
  private _borderColor: any = 'white';
  /*
    constructor(prm: any = undefined) {
      if (prm) {
        if (prm.id >= 0) {
          this._id = prm.id;
          this.setColor();
        }
  
        if (prm.values && prm.prm && prm.prm.length && (prm.prm.length > 0)) {
          for (let i = 0; i < prm.prm.length; i++) {
            prm.prm[i].value = prm.values[i];
            this._params.push(new LineParam(prm.prm[i]))
          }
        }
        else if (prm.prm && prm.prm.length && (prm.prm.length > 0)) {
          for (let i = 0; i < prm.prm.length; i++) {
            /*if(prm.values && (prm.values.length === prm.prm.length)){
              prm.prm[i].value = prm.values[i]
            } 
            this._params.push(new LineParam(prm.prm[i]));
  
          }
          if (prm.range && prm.range.length && (prm.range.length === 2)) {
            this.setValues(prm.range);
          }
          else {
            this.setValues();
          }
        }
      }
    }
    */
  /*
    constructor(prm: {
    id: number | undefined,
    linePrms: Array<any> | undefined,
    values: Array<number> | undefined,
    _id: number | undefined,
    _params: Array<{ _name: string, _entity: string, _value: number, _step: number }> | undefined
  } | undefined = undefined) {
    if (prm !== undefined) {
      if (prm.id && prm.linePrms && prm.values) {
        this._id = prm.id;
        if (prm.linePrms.length <= prm.values.length) {
          for (let i = 0; i < prm.linePrms.length; i++) {
            let tmp = prm.linePrms[i];
            tmp.value = prm.values[i];
            this._params.push(new LineParam(tmp));
          }
          this.setColor();
        }

      }
      else if (prm._id && prm._params) {
        this._id = prm._id;
        this._params = prm._params
      }

    }
  }
  */
  constructor(id: number, prms: Array<{ name: string, entity: string, value: number, step: number }>) {
    if ((id >= 0) && prms && prms.length) {
      this._id = id;
      for (let i = 0; i < prms.length; i++) {
        this._params.push(new LineParam(prms[i].name, prms[i].value, prms[i].step, prms[i].entity));
      }
      this.setColor();
    }
  }

  public get backgroundColor(): any { return this._backgroundColor; }
  public get borderColor(): any { return this._borderColor; }
  public set backgroundColor(bgkcolor: any) { this._backgroundColor = bgkcolor; }
  public set borderColor(borderColor: any) { this._borderColor = borderColor; }

  public get id(): number { return this._id; }
  public set id(id: number) { this._id = id; this.setColor(); }
  public get size(): number { return this._params.length; }
  public get params(): LineParam[] { return this._params; }
  //public set params(prm: LineParam[]) { this._params = prm; }
  public setParam(idx: number, prm: number) {
    if ((idx >= 0) && (idx < this._params.length)) {
      this._params[idx].value = prm;
    }
  }
  public setValues(range: number[] = [0, 5]) {
    for (let i = 0; i < this._params.length; i++) {
      while ((Number.isNaN(this._params[i].value)) || (this._params[i].value == 0)) {
        this._params[i].value = Math.floor((Math.random() * (range[1] - range[0])) + range[0]);
      }
    }
  }
  private setColor() {
    this._backgroundColor = getBackgroundColor(this._id);
    this._borderColor = getBorderColor(this._id);
  }
}

const BORDER_COLORS = [
  'rgb(54, 162, 235)',
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)' // grey
];
// Border colors with 50% transparency
const BACKGROUND_COLORS = /* #__PURE__ */ BORDER_COLORS.map((color) => color.replace('rgb(', 'rgba(').replace(')', ', 0.5)'));
export function getBorderColor(i: number) {
  return BORDER_COLORS[i % BORDER_COLORS.length];
}
export function getBackgroundColor(i: number) {
  return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
}