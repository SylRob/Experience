import { MainController } from './mainController.class';
import { Device } from './device.class';
import { SplashScreen } from './splashScreen.class';

(function(window) {

    const device = Device(window);
    const splashScreen = SplashScreen(document.body);
    const canvasElem:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('mycanvas');

    function resize() {
        canvasElem.width = window.innerWidth;
        canvasElem.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    splashScreen.detectDevice()
    .then((value)=> {
        console.log('return value ' + value);
        splashScreen.toFade();

        const type =
        value == 'touch' ?
            'gyro' :
        value == 'click' ?
            'keyboard' :
            null;

        device.init( type );
        MainController( canvasElem.getContext("2d"), window, device );
    });

})(window)
