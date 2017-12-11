import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportParameterSelectionPage } from './report-parameter-selection';
import {SharedModule} from "../../components/shared.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    ReportParameterSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportParameterSelectionPage),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class ReportParameterSelectionPageModule {}
