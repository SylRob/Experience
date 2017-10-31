import { TweenLite } from 'gsap';

interface HTMLCanvasElement {
    exitFullscreen: any;
    mozCancelFullScreen: any;
    webkitExitFullscreen: any;
    requestFullScreen: any;
    mozRequestFullScreen: any;
    webkitRequestFullScreen: any;
}

export const SplashScreen = function(paren:HTMLElement, canvas:HTMLCanvasElement) {

    const canvasElem:HTMLCanvasElement = canvas,
          parent = paren,
          elemClassName:string = 'splashScreen';

    let deviceType:string = null,
        detectorListener:Array<any> = [],
        mainWrapper:HTMLElement;

    const addElem = (elem:HTMLElement, elemClassName:string):HTMLElement => {
        mainWrapper = document.createElement('div');
        mainWrapper.style.cssText = 'position:fixed;\
        top:0;\
        left:0;\
        width: 100vw;\
        height: 100vh;\
        background-color:#8f45b5;\
        display: flex;\
        justify-content: center;\
        flex-direction: column;\
        text-align: center;\
        color: #FFFFFF;\
        z-index: 50;\
        font-family: Verdana;\
        font-size: 40px;';

        mainWrapper.setAttribute('class', elemClassName);

        elem.appendChild(mainWrapper);

        return elem;
    }

    function deviceChoice() {

        const clickOrTap = document.createElement('div');
        clickOrTap.setAttribute('class', 'clickOrTap');

        const txt = document.createTextNode('click or touch the screen');

        clickOrTap.appendChild(txt);
        mainWrapper.appendChild(clickOrTap);
    }

    const handleClickTouchEvent = (elem:HTMLElement) => {
        return new Promise(function(resolve, reject) {

            //store the eventlistener callback
            detectorListener.push({
                name: 'touchstart',
                func: ()=>resolve('touch')
            })
            detectorListener.push({
                name: 'mousedown',
                func: ()=>resolve('click')
            })

            //and now loop through them to init the eventlistener
            detectorListener.map( (listener)=> {
                elem.addEventListener(
                    listener.name,
                    listener.func
                )
            })

        })
    }

    const setDevice = ( type:string ) => {
        deviceType = type;
    }

    const toFade = ( elem:HTMLElement ) => {

        TweenLite.to(elem, 0.2, { autoAlpha: 0 });

        detectorListener.map( (listener)=> {
            elem.removeEventListener(
                listener.name,
                listener.func
            )
        })
    }

    async function detectDevice(paren:HTMLElement = parent, elemClassNam:string = elemClassName) {
        const elem = addElem(paren, elemClassNam);
        deviceChoice();

        let value = await handleClickTouchEvent(elem);

        setDevice( <string>value );
        toFade( <HTMLElement>elem.querySelector('.clickOrTap') );
        await fullscreenChoice();

        return value;
    }

    async function goToFullScreen() {


    }

    function fullscreenChoice() {

        return new Promise( (resolve, reject) => {

            const elem = document.createElement('div');

            elem.innerHTML = `
                <h2>Go to fullscreen ?</h2>
                <p><a href="#" class="noFS">NO</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="doFS">YES</a></p>
            `;
            elem.style.cssText = 'position:absolute;\
            top:50%;\
            left:50%;\
            z-index: 2;\
            color: #FFFFFF;\
            font-family: Verdana;\
            text-align: center;\
            -webkit-transform: translate( -50%, -50% );\
            transform: translate( -50%, -50% );\
            line-height: 4em;\
            font-size: 20px;';

            mainWrapper.appendChild( elem );

            elem.querySelector('.doFS').addEventListener('touchstart', ()=>{fullScreenAction(true); resolve()});
            elem.querySelector('.doFS').addEventListener('click', ()=>{fullScreenAction(true); resolve()});

            elem.querySelector('.noFS').addEventListener('touchstart', ()=>{fullScreenAction(false); resolve()});
            elem.querySelector('.noFS').addEventListener('click', ()=>{fullScreenAction(false); resolve()});

        });

    }

    function fullScreen() {
        if(canvasElem.requestFullScreen)
            canvasElem.requestFullScreen();
        else if(canvas.webkitRequestFullScreen)
            canvasElem.webkitRequestFullScreen();
        else if(canvasElem.mozRequestFullScreen)
            canvasElem.mozRequestFullScreen();
    }

    function fullScreenAction( fs:boolean ) {
        if( fs ) fullScreen();
        toFade(mainWrapper);
    }

    return {
        detectDevice: detectDevice
    }
}
