import { MainController } from './mainController.class';
import { Device } from './device.class';
import { SplashScreen } from './splashScreen.class';

interface HTMLCanvasElement {
    exitFullscreen: any;
    mozCancelFullScreen: any;
    webkitExitFullscreen: any;
    requestFullScreen: any;
    mozRequestFullScreen: any;
    webkitRequestFullScreen: any;
}

(function(window) {

    const device = Device(window);
    const canvasElem:any = <any>document.getElementById('mycanvas');
    const splashScreen = SplashScreen(document.body, canvasElem);

    splashScreen.detectDevice()
    .then(( deviceType )=>{
        let formatedDeviceType:'gyro'|'keyboard' = deviceType == 'click' ? 'keyboard' :
                                    deviceType == 'touch' ? 'gyro' : 'keyboard';
        device.init( formatedDeviceType );
        const main = MainController( canvasElem.getContext("2d"), window, device );
        main.init( levelOverFn );
    });

    function levelOverFn() {
        alert('finished');
    }


})(window)
