import * as application from "tns-core-modules/application";
import * as utils from "tns-core-modules/utils/utils";
import { device } from "tns-core-modules/platform";


export class TestAndroidService
{
   extendBackgroundService() {
        //register the service
        if (application.android) {
            var that = this;
                (<any>android.app.Service).extend("com.nativescript.TestAndroidService.BackgroundService", {
                    onStartCommand: function (intent, flags, startId) {
                        this.super.onStartCommand(intent, flags, startId);
    
                        return android.app.Service.START_STICKY;
                    },
                    onCreate: function () {
                        console.log("on Create service");
                        that.myPeriodicFunction();
                        if (device.sdkVersion >= "26") {

                            let NOTIFICATION_CHANNEL_ID = "org.nativescript.TestAndroidService";
                            let channelName = "Ongoing Test notification";
                            const chan = new (<any>android.app).NotificationChannel(NOTIFICATION_CHANNEL_ID, channelName, (<any>android.app).NotificationManager.IMPORTANCE_NONE);
                            chan.setLightColor(android.graphics.Color.BLUE);
                            chan.setLockscreenVisibility((<any>android.app).Notification.VISIBILITY_PRIVATE);
        
                            let context = utils.ad.getApplicationContext();
        
                                //const manager = ((<any>android.app).NotificationManager) (<any>android.app).context.getSystemService(context.NOTIFICATION_SERVICE);
                            var manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
                            manager.createNotificationChannel(chan);
                            
                            const notificationBuilder = new android.support.v4.app.NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID);
                            const notification = notificationBuilder.setOngoing(true)
                                    //.setSmallIcon(android.R.drawable.icon_1)
                                    .setContentTitle("App is running in background A")
                                    .setPriority((<any>android.app).NotificationManager.IMPORTANCE_MIN)
                                    .setCategory((<any>android.app).Notification.CATEGORY_SERVICE)
                                    .build();
        
                            this.startForeground(2, notification);}
                        else {
                            this.startForeground(1, new android.app.Notification());
                        }
                    },
                    onBind: function (intent) {
                        console.log("on Bind Services");
                    },
                    onUnbind: function (intent) {
                        console.log('UnBind Service');
                    },
                    onDestroy: function () {
                        console.log('service onDestroy');
    
                    }
                });
        }
   }

   id;

   myPeriodicFunction(){
    this.id = setInterval(() => {
        console.log("Executed Every Second");
        var date = new Date();
        var seconds = date.getSeconds();
        this.sendMessage(seconds);

    }, 1000);
   }
   
   sendMessage(message) {
        console.log("message supposed to be sent from Service via broadcast " + message);
        let intent = new android.content.Intent("customservice");
        var broadcastManager = android.support.v4.content.LocalBroadcastManager.getInstance(utils.ad.getApplicationContext());
        broadcastManager.sendBroadcast(intent);
    }
}