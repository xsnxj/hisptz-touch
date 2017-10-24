import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TrackedEntityAttributeValuesProvider} from "../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";

/**
 * Generated class for the TrackedEntityDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracked-entity-dashboard',
  templateUrl: 'tracked-entity-dashboard.html',
})
export class TrackedEntityDashboardPage implements OnInit{

  currentOrgUnit : any;
  currentProgram : any;
  currentUser : any;

  trackedEntityInstance : any;
  enrollment : any;

  programStages : Array<any>;
  programTrackedEntityAttributes : Array<any>;
  dataObject : any = {};
  trackedEntityAttributeValuesObject : any = {};

  isLoading : boolean;
  loadingMessage : string;

  dashboardWidgets : Array<any>;
  isDashboardWidgetOpen : any;


  constructor(private navCtrl: NavController,private eventCaptureFormProvider : EventCaptureFormProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private trackedEntityAttributeValuesProvider : TrackedEntityAttributeValuesProvider,
              private navParams: NavParams) {
  }

  ngOnInit(){
    this.isDashboardWidgetOpen = {};
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    let trackedEntityInstancesId = this.navParams.get("trackedEntityInstancesId");
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.currentOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
    this.dashboardWidgets = this.getDashboardWidgets();
    this.userProvider.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.loadTrackedEntityInstanceData(trackedEntityInstancesId);
    }).catch((error)=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  loadTrackedEntityInstanceData(trackedEntityInstanceId){
    this.loadingMessage = "Loading tracked entity";
    this.trackerCaptureProvider.getTrackedEntityInstance(trackedEntityInstanceId,this.currentUser).then((response : any)=>{
      this.trackedEntityInstance = response;
      if(response && response.attributes){
        response.attributes.forEach((attributeObject : any)=>{
          this.trackedEntityAttributeValuesObject[attributeObject.attribute] = attributeObject.value;
          let id = attributeObject.attribute + "-trackedEntityAttribute";
          this.dataObject[id] = {"id" : id,"value" : attributeObject.value};
        });
      }
      this.loadingProgramStages(this.currentProgram.id,this.currentUser);
    }).catch(error=>{})
  }

  loadingProgramStages(programId,currentUser){
    this.loadingMessage = "Loading program stages " + this.currentProgram.name;
    this.eventCaptureFormProvider.getProgramStages(programId,currentUser).then((programStages : any)=>{
      this.programStages = programStages;
      if(programStages && programStages.length > 0){
        let counter = 1;
        programStages.forEach((programStage : any)=>{
          this.dashboardWidgets.push({id : programStage.id,name : programStage.name,iconName: counter});
          counter ++;
        })
      }
      if(this.dashboardWidgets.length > 0){
        this.changeDashboardWidget(this.dashboardWidgets[0]);
      }
      this.loadTrackedEntityRegistration(programId,currentUser);
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load program stages " + this.currentProgram.name);
    });
  }

  loadTrackedEntityRegistration(programId,currentUser){
    this.loadingMessage = "Loading registration fields " + this.currentProgram.name;
    this.isLoading = true;
    this.trackerCaptureProvider.getTrackedEntityRegistration(programId,currentUser).then((programTrackedEntityAttributes : any)=>{
      this.programTrackedEntityAttributes = programTrackedEntityAttributes;
      this.isLoading = false;
    }).catch(error=>{
      this.isLoading = false;
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification("Fail to load registration fields for " + this.currentProgram.name);
    });
  }

  //@todo change of color codes on updates
  updateData(updateDataValue){
    let id = updateDataValue.id.split("-")[0];
    this.trackedEntityAttributeValuesObject[id] = updateDataValue.value;
    this.dataObject[updateDataValue.id] = updateDataValue;
    let trackedEntityAttributeValues = [];
    Object.keys(this.trackedEntityAttributeValuesObject).forEach(key=>{
      trackedEntityAttributeValues.push({
        value : this.trackedEntityAttributeValuesObject[key],attribute : key
      })
    });
    this.trackedEntityAttributeValuesProvider.savingTrackedEntityAttributeValues(this.trackedEntityInstance.id,trackedEntityAttributeValues,this.currentUser).then(()=>{
      //this.appProvider.setNormalNotification("Saved successfully");
    }).catch(error=>{
      //this.appProvider.setNormalNotification("Fail to save a value");
      console.log(JSON.stringify(error));
    });
  }

  //@todo hide key board
  changeDashboardWidget(widget){
    if(widget && widget.id){
      if(!this.isDashboardWidgetOpen[widget.id]){
        Object.keys(this.isDashboardWidgetOpen).forEach(id=>{
          this.isDashboardWidgetOpen[id] = false;
        });
      }
      this.isDashboardWidgetOpen[widget.id] = true;
    }
  }

  getDashboardWidgets(){
    return [
      {id : 'enrollment',name : 'Enrollment',icon: 'assets/tracker/profile.png'}
    ];
  }



}
