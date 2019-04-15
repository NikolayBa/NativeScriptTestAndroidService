import { Component, OnInit } from "@angular/core";
import * as app from "tns-core-modules/application/application";
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
        var that = this;
        console.log("Registration Completed");
        
        app.android.registerBroadcastReceiver("customservice",
            (androidContext, intent) => {
                console.log("________________________________________________Data Received");
                that.data = intent.getIntExtra("message",-1/*default value*/);
                console.log("Data + " + that.data);
        });
        
    }
}
