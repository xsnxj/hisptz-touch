import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";
import {Synchronization} from "../../providers/synchronization";
import {AppPermission} from "../../providers/app-permission";
import {LoginPage} from "../login/login";
import {NetworkAvailability} from "../../providers/network-availability";

/*
  Generated class for the Launcher page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-launcher',
  templateUrl: 'launcher.html'
})
export class LauncherPage implements OnInit{

  public logoUrl : string = "";

  constructor(public navCtrl: NavController,
              public AppPermission : AppPermission,
              public synchronization:Synchronization,
              public NetworkAvailability : NetworkAvailability,
              public user : User) {}

  ngOnInit() {
    this.logoUrl = 'assets/img/app-logo.png';
    this.AppPermission.checkAndRequestAppPermission();
    this.NetworkAvailability.setNetworkStatusDetection();
    this.user.getCurrentUser().then((user : any)=>{
      if(user && user.isLogin){
        this.synchronization.startSynchronization().then(()=>{
        });
        this.navCtrl.setRoot(TabsPage);
      }else{
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }





}
