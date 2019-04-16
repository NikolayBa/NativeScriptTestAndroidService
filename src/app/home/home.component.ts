import { Component, OnInit } from "@angular/core";
import * as app from "tns-core-modules/application";
import { device } from "tns-core-modules/platform";
import * as utils from "tns-core-modules/utils/utils";
declare var com: any;

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    data;

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.startBackGroundService();
        this.registerBroadCastReceiver();
    }

    startBackGroundService(){
        if (app.android) {
            let context = utils.ad.getApplicationContext();
            if (device.sdkVersion >= "26") {            
                let intent = new android.content.Intent(context, com.nativescript.TestAndroidService.BackgroundServiceclass);
                context.startForegroundService(intent);
            } else {
                let intent = new android.content.Intent(context, com.nativescript.TestAndroidService.BackgroundService.class);
                context.startService(intent);

            }
        }
    }

    registerBroadCastReceiver(){

        const cb = (<any>android.content.BroadcastReceiver).extend({
            onReceive: (context, data) => {
                console.log("test-message receieved");
              }
            }
        );

        var _onReceivedCallback = new cb();
        var broadcastManager = android.support.v4.content.LocalBroadcastManager.getInstance(utils.ad.getApplicationContext());
        broadcastManager.registerReceiver(_onReceivedCallback,  new android.content.IntentFilter("test-message"))

        console.log("Registration Completed");
    }
}
