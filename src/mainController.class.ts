import { Avatar } from './avatar.class';
import { Device } from './device.class';



export const MainController = function( canvas:HTMLCanvasElement, window:any ) {

    const canvasElem:HTMLCanvasElement = canvas;
    const ctx:CanvasRenderingContext2D = canvasElem.getContext("2d");
    const avatar = Avatar({
        ctx:ctx,
        position: { x:50, y:50 }
    });
    const device = Device(window);

    function init(){
        resize();
        events();
        window.requestAnimationFrame(draw);
    }
    //auto load
    init();

    function events() {
        window.addEventListener('resize', resize);
    }

    function resize() {
        canvasElem.width = window.innerWidth;
        canvasElem.height = window.innerHeight;
    }

    function draw() {

        avatar.isPositionDirty ? avatar.draw() : '';
        window.requestAnimationFrame(draw);
    }

}
