import { TweenLite } from 'gsap';

export const SplashScreen = function(parent:HTMLElement) {

    let deviceType:string = null;
    let detectorListener:Array<any> = [];

    const elemClassName:string = 'splashScreen';

    const addElem = (elem:HTMLElement, elemClassName:string):HTMLElement => {
        const div = document.createElement('div');
        const txt = document.createTextNode('click or touch to start');
        div.appendChild( txt );

        div.style.cssText = 'position:fixed;\
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

        div.setAttribute('class', elemClassName);

        elem.appendChild(div);

        return elem;
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

    const toFade = ( elemClassName:string ) => {
        var elem = document.querySelector(`.${elemClassName}`);

        TweenLite.to(elem, 0.2, { autoAlpha: 0 });

        detectorListener.map( (listener)=> {
            elem.removeEventListener(
                listener.name,
                listener.func
            )
        })
    }

    async function detectDevice(parent:HTMLElement, elemClassName:string) {
        const elem = addElem(parent, elemClassName);
        var value = await handleClickTouchEvent(elem);
        return value;
    }

    return {
        detectDevice: ()=>detectDevice(parent, elemClassName),
        toFade: ()=>toFade(elemClassName)
    }
}
