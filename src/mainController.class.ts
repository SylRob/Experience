import { Avatar } from './avatar.class';
import { Scene } from './scene.class';


export const MainController = function( canv:CanvasRenderingContext2D, window:any, device ) {

    const ctx:CanvasRenderingContext2D = canv;
    const avatar = Avatar({
        ctx:ctx,
        position: { x:50, y:50 }
    });
    const scene = Scene();

    function init() {
        events();
        scene.init( ctx );
        avatar.setWorld( scene.getWorld() );
        avatar.init();
        window.requestAnimationFrame(draw);
    }
    //auto load
    init();

    function events() {
        device.newPositionEvent( (data)=>avatar.setPowerToPosition( data ) );
    }

    function draw() {

        avatar.draw();
        window.requestAnimationFrame(draw);
    }

}
