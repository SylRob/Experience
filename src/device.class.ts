
export const Device = function(window:any) {

    const maxData = {
        x: 10,// -10 & +10
        y: 10// -10 & +10
    }

    let oldGyroData = {
        x: 0,
        y: 0,
        z: 0
    }

    let data = {
        x: 0,
        y: 0
    }

    let deviceType:string;

    const init = (type: 'gyro' | 'keyboard') => {
        deviceType = type;

        switch(type) {
            case 'gyro':
                setGyro();
            break;
            case 'keyboard':
                setKeyboard();
            break;
            default:
                throw new Error( 'unrecognized Device !' );
        }
    }

    const setGyro = () => {

        if(window.DeviceOrientationEvent) window.addEventListener("deviceorientation", process, false);
        else document.getElementById("error").innerHTML += 'ne supporte pas le device orientation';

        if(window.DeviceMotionEvent) window.addEventListener("devicemotion", process2, false);
        else document.getElementById("error").innerHTML += '<br />ne supporte pas le device motion';
    }

    const setKeyboard = () => {

        document.addEventListener('keydown', (e)=>{
            e = e || window.event;

            switch( e.keyCode ) {
                case 38:
                    setNewData( 0, 1 );
                break;
                case 40:
                    setNewData( 0, -1 );
                break;
                case 37:
                    setNewData( -1, 0 );
                break;
                case 39:
                    setNewData( 1, 0 );
                break;
            }
        });

    }

    const setNewData = ( x, y ) => {

        const newDataX = data.x + x;
        const newDataY = data.y + y;

        newDataX <= maxData.x && newDataX >= maxData.x*-1 ?
            data.x = newDataX : null;
        newDataY <= maxData.y && newDataY >= maxData.y*-1 ?
            data.y = newDataY : null;

        document.getElementById('log3').innerHTML = "<ul><li>x : " + data.x + "</li><li>y : " + data.y + "</li></ul>";
    }


    function process( event ) {

        //left
        var newDataX =
        oldGyroData.x - Math.round(event.gamma) > 0 && Math.abs(oldGyroData.x) - Math.abs(Math.round(event.gamma)) > 10 ?
            1 :
        oldGyroData.x - Math.round(event.gamma) && Math.abs(oldGyroData.x) - Math.abs(Math.round(event.gamma)) > 10 ?
            -1 : 0;

        //top
        var newDataY =
        oldGyroData.y - Math.round(event.beta) > 0 && Math.abs(oldGyroData.y) - Math.abs(Math.round(event.beta)) > 10 ?
            1 :
        oldGyroData.y - Math.round(event.beta) < 0 && Math.abs(oldGyroData.y) - Math.abs(Math.round(event.beta)) > 10 ?
            -1 : 0;

        oldGyroData.x = Math.round(event.gamma);
        oldGyroData.y = Math.round(event.beta);

        setNewData( newDataX, newDataY );

        document.getElementById("log").innerHTML = "<ul><li>Alpha : " + event.alpha + "</li><li>Beta : " + event.beta + "</li><li>Gamma : " + event.gamma + "</li></ul>";
    }

    function process2( event ) {

        var x = event.accelerationIncludingGravity.x;
        var y = event.accelerationIncludingGravity.y;
        var z = event.accelerationIncludingGravity.z;
        document.getElementById("log2").innerHTML = "<ul><li>X : " + x + "</li><li>Y : " + y + "</li><li>Z : " + z + "</li></ul>";
    }

    return {
        init: (type:'gyro' | 'keyboard') => init(type)
    }

}
