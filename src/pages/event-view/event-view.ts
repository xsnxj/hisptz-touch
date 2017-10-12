import { Component,OnInit } from '@angular/core';
import {NavController, ToastController, NavParams, IonicPage, FabContainer, AlertController} from 'ionic-angular';
import {EventsProvider} from "../../providers/events/events";
import {ProgramsProvider} from "../../providers/programs/programs";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {DataElementsProvider} from "../../providers/data-elements/data-elements";



/*
 Generated class for the EventView page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-event-view',
  templateUrl: 'event-view.html',

})
export class EventView implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public params : any;

  currentProgram : any;
  currentOrgUnit : any;
  public event : any;
  public dataElementMapper : any;

  constructor(public NavParams:NavParams,public eventProvider :EventsProvider,public Program : ProgramsProvider, public eventsProvider:EventsProvider,
              public orgUnitProvider:OrganisationUnitsProvider, public toastCtrl: ToastController,public user : UserProvider,public appProvider:AppProvider,
              public programsProvider: ProgramsProvider, public navCtrl: NavController, public dataElementProvider:DataElementsProvider,
              public alertCtrl:AlertController){


  }

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.currentProgram = this.programsProvider.lastSelectedProgram;
      this.currentOrgUnit = this.orgUnitProvider.lastSelectedOrgUnit;
      this.params = this.NavParams.get("params");
      this.loadProgramMetadata();
    });


  }

  ionViewDidEnter(){
    if(this.params && this.params.programId){
      this.loadProgramMetadata();
    }
  }

  /**
   *
   * @param programId
     */
  loadProgramMetadata(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading program metadata");
    this.loadProgramStageDataElements();
  }

  /**
   *
   * @param programStageDataElementsIds
     */
  loadProgramStageDataElements(){
   let dataElementIds = [];
    this.dataElementMapper = {};
    this.programsProvider.getProgramsStages(this.currentProgram.id,this.currentUser).then((programsStages:any)=>{


      programsStages.forEach((programsStage:any)=> {
        programsStage.programStageDataElements.forEach((programStageDataElement) => {


          dataElementIds.push(programStageDataElement.dataElement.id);


          this.dataElementProvider.getDataElementsByName(programStageDataElement.dataElement.id, this.currentUser).then((dataElementInfo:any)=>{
            dataElementInfo.forEach((element:any)=>{
              this.dataElementMapper[element.id] = element;
            })

          })


        })

      });

    });

    this.loadingEvent(this.params.event);
  }

  /**
   *
   * @param programId
   * @param orgUnitId
   * @param eventId
   */
  loadingEvent(eventId){
    this.setLoadingMessages("Loading event");
    let eventTableId = this.currentProgram.id+"-"+this.currentOrgUnit.id+"-"+eventId;
    this.eventProvider.loadingEventByIdFromStorage(eventId,this.currentUser).then((event:any)=>{

      this.event = event;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.appProvider.setTopNotification("Fail to load event with id : " + eventId);
    });
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  gotToEditEvent(event, fab:FabContainer){
    fab.close();
    let params = {
      orgUnitId : this.params.orgUnitId,
      orgUnitName : this.params.orgUnitName,
      programId : this.params.programId,
      programName : this.params.programName,
      selectedDataDimension : this.params.selectedDataDimension,
      event : event.event
    };

    alert("edit Event param :"+JSON.stringify(params))
    this.navCtrl.push('EventCaptureForm',{params:params});
  }



  confirmEventDelete(event, fab){
    let alertCtrl = this.alertCtrl.create({
      title: "Confirm Event Delete",
      message:"Are you sure you want to delete selected event from storage ?",
      buttons:[{
        text: 'Cancel',
        role:'cancel',
        handler:()=>{
          this.fabCloser(fab);
        }

      },{
        text: 'Delete',
        handler: ()=>{
          this.eventViewedDelete(event, fab);
    }
      }]
    });
    alertCtrl.present();

  }

  eventViewedDelete(event, fab:FabContainer){
    fab.close();
    //this.loadingMessages = "Clear all data on " + event.eventProgram;
    let eventId = [];
    eventId.push(event.event);

    if(eventId.length > 0){
      this.eventsProvider.deleteEventsByIds(eventId,this.currentUser).then(()=>{

        this.navCtrl.pop();
      },error=>{});
    }
  }

  fabCloser(fab:FabContainer){
    fab.close();
  }



}
