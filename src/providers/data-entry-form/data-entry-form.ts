import { Injectable } from '@angular/core';
import {DataSetsProvider} from "../data-sets/data-sets";
import {DataElementsProvider} from "../data-elements/data-elements";
import {IndicatorsProvider} from "../indicators/indicators";
import {SectionsProvider} from "../sections/sections";
import {count} from "rxjs/operator/count";
import {reject} from "q";
/*
  Generated class for the DataEntryFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataEntryFormProvider {

  constructor(private dataSetProvider : DataSetsProvider,
              private indicatorProvider : IndicatorsProvider,
              private sectionProvider : SectionsProvider,
              private dataElementProvider : DataElementsProvider) {
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  loadingDataSetInformation(dataSetId,currentUser){
    return new Promise((resolve, reject)=> {
      this.dataSetProvider.getDataSetById(dataSetId,currentUser).then((dataSet : any)=>{
        this.dataSetProvider.getDataSetSectionsIds(dataSetId,currentUser).then(sectionIds =>{
          this.dataSetProvider.getDataSetIndicatorIds(dataSetId,currentUser).then(indicatorIds =>{
            resolve({
              dataSet : dataSet,sectionIds : sectionIds,indicatorIds : indicatorIds
            });
          },error=>{reject(error)});
        },error=>{ reject(error)});
      },error=>{reject(error)});
    });
  }

  /**
   *
   * @param indicatorIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getEntryFormIndicators(indicatorIds,currentUser){
    return this.indicatorProvider.getIndicatorsByIds(indicatorIds,currentUser);
  }

  /**
   *
   * @param sectionIds
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getEntryForm(sectionIds,dataSetId,currentUser){
    return new Promise((resolve, reject)=> {
      if(sectionIds && sectionIds.length > 0){
        console.log("has sections");
        this.getSectionEntryForm(sectionIds,currentUser).then(( entryForm : any)=>{
          resolve(entryForm);
        },error=>{reject(error)});
      }else{
        this.getDefaultEntryForm(dataSetId,currentUser).then(( entryForm : any)=>{
          resolve(entryForm);
        },error=>{reject(error)});
      }
    });
  }

  /**
   *
   * @param sectionIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getSectionEntryForm(sectionIds,currentUser){
    return new Promise((resolve, reject)=> {
      this.sectionProvider.getSectionByIds(sectionIds,currentUser).then((sections : any)=>{
        let count = 0;
        sections.forEach((section : any)=>{
          this.dataElementProvider.getDataElementsByIds(section.dataElementIds,currentUser).then((dataElements:any)=>{
            section["dataElements"] = dataElements;
            count ++;
            if(count == sections.length){
              sections = this.getSortedSections(sections);
              resolve(sections);
            }
          },error=>{reject(error)});
        });
      },error=>{reject(error)});
    });
  }

  getSortedSections(sections){
    sections = sections.sort((a,b)=>{
      return parseInt(a.sortOrder) - parseInt(b.sortOrder);
    });
    return sections;
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDefaultEntryForm(dataSetId,currentUser){
    return new Promise((resolve, reject)=> {
      this.dataSetProvider.getDataSetDataElementIds(dataSetId,currentUser).then((dataElementIds: any)=>{
        this.dataElementProvider.getDataElementsByIds(dataElementIds,currentUser).then((dataElements:any)=>{
          resolve(dataElements);
        },error=>{reject(error)});
      },error=>{reject(error)});
    });
  }





}
