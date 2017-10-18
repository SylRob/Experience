interface Window {
    DeviceOrientationEvent: any,
    DeviceMotionEvent:any,
    addEventListener:any,
    requestAnimationFrame:any
}

export const Device = function(window:Window) {

    if(window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", process, false);
    } else {
      document.body.innerHTML = 'ne supporte pas le device orientation';
    }

    if(window.DeviceMotionEvent) {
        console.log();
        window.addEventListener("devicemotion", process2, false);
    } else {
        document.body.innerHTML = 'ne supporte pas le device motion';
    }

    function process( event ) {
        var alpha = event.alpha;
        var beta = event.beta;
        var gamma = event.gamma;
        document.getElementById("log").innerHTML = "<ul><li>Alpha : " + alpha + "</li><li>Beta : " + beta + "</li><li>Gamma : " + gamma + "</li></ul>";
    }

    function process2( event ) {
        var x = event.accelerationIncludingGravity.x;
        var y = event.accelerationIncludingGravity.y;
        var z = event.accelerationIncludingGravity.z;
        document.getElementById("log").innerHTML = "<ul><li>X : " + x + "</li><li>Y : " + y + "</li><li>Z : " + z + "</li></ul>";
    }

}
