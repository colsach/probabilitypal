import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';
import { FolderPage } from './folder.page';

import { NgChartsModule } from 'ng2-charts';
import { ScrollingModule } from '@angular/cdk/scrolling'

import { ChartComponent } from "../components/chart/chart.component";
import { LineComponent } from '../components/line/line.component';
import { LineListComponent } from '../components/line-list/line-list.component';
import { FunctionComponent } from '../components/function/function.component';
import { OverviewComponent } from '../components/overview/overview.component';
import { PropertyComponent } from '../components/property/property.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    NgChartsModule,
    ScrollingModule
  ],
  declarations: [FolderPage,
    LineComponent,
    LineListComponent,
    ChartComponent,
    OverviewComponent,
    FunctionComponent,
    PropertyComponent,
  ]
})
export class FolderPageModule { }
