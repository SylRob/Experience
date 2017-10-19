
export const Device = function(window:any) {

    const maxData = {
        x: 10,// -10 & +10
        y: 10// -10 & +10
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
                    setNewData( 0, data.x + 1 );
                break;
                case 40:
                    setNewData( 0, data.x - 1 );
                break;
                case 37:
                    setNewData( data.x - 1, 0 );
                break;
                case 39:
                    setNewData( data.x + 1, 0 );
                break;
            }
        });

    }

    const setNewData = ( x, y ) => {

        const newDataX = x;
        const newDataY = y;

        newDataX <= maxData.x && newDataX >= maxData.x*-1 ?
            data.x = newDataX : null;
        newDataY <= maxData.y && newDataY >= maxData.y*-1 ?
            data.y = newDataY : null;

        document.getElementById('log3').innerHTML = "<ul><li>x : " + data.x + "</li><li>y : " + data.y + "</li></ul>";
    }


    function process( event ) {

        const gamma = Math.round(event.gamma/5);
        const beta = Math.round(event.beta/5);

        setNewData( gamma, beta );

        document.getElementById("log").innerHTML = "<ul>\
            <li>Alpha : " + event.alpha + "</li>\
            <li>Beta : " + event.beta + "</li>\
            <li>Gamma : " + event.gamma + "</li>\
            <li>Diff : " + gamma + ", " + beta + "</li>\
        </ul>";
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
