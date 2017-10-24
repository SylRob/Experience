
export const Device = function(window:any) {

    const maxData = {
        x: 1,// -1 & +1
        y: 1// -1 & +1
    }

    let data = {
        x: 0,
        y: 0
    }

    let deviceType:string;

    let newForceCB:Function = null;

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
                    //up
                    setNewData( data.x, +Number(data.y - 0.1).toFixed(1) );
                break;
                case 40:
                    //down
                    setNewData( data.x, +Number(data.y + 0.1).toFixed(1) );
                break;
                case 37:
                    //left
                    setNewData( +Number(data.x - 0.1).toFixed(1), data.y );
                break;
                case 39:
                    //right
                    setNewData( +Number(data.x + 0.1).toFixed(1), data.y );
                break;
            }
        });

    }

    const setNewData = ( x, y ) => {

        const newDataX = x;
        const newDataY = y;

        newDataX <= maxData.x && newDataX >= maxData.x*-1 ?
            data.x = newDataX : 0;
        newDataY <= maxData.y && newDataY >= maxData.y*-1 ?
            data.y = newDataY : 0;

        document.getElementById('log3').innerHTML = "<ul><li>x : " + data.x + "</li><li>y : " + data.y + "</li></ul>";

        if(newForceCB) newForceCB(data);
    }


    function process( event ) {

        const gamma = Number(event.gamma/15).toFixed(1);
        const beta = Number(event.beta/15).toFixed(1);

        setNewData( gamma, beta );

        document.getElementById("log").innerHTML = "<ul>\
            <li>Alpha : " + event.alpha + "</li>\
            <li>Beta : " + event.beta + "</li>\
            <li>Gamma : " + event.gamma + "</li>\
            <li>Diff : " + gamma + ", " + beta + "</li>\
        </ul>";
    }

    function process2( event ) {

        let x = event.accelerationIncludingGravity.x;
        let y = event.accelerationIncludingGravity.y;
        let z = event.accelerationIncludingGravity.z;
        document.getElementById("log2").innerHTML = "<ul><li>X : " + x + "</li><li>Y : " + y + "</li><li>Z : " + z + "</li></ul>";
    }

    return {
        init: (type:'gyro' | 'keyboard') => init(type),
        newPositionEvent: (cb:Function) => newForceCB = cb,
        isTouch: ()=> deviceType === 'gyro'
    }

}
