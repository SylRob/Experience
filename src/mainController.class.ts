import { Avatar } from './avatar.class';


export const MainController = function( canv:CanvasRenderingContext2D, window:any, device ) {

    const ctx:CanvasRenderingContext2D = canv;
    const avatar = Avatar({
        ctx:ctx,
        position: { x:50, y:50 }
    });

    function init(){
        events();
        window.requestAnimationFrame(draw);
    }
    //auto load
    init();

    function events() {
    }



    function draw() {

        avatar.isPositionDirty ? avatar.draw() : '';
        window.requestAnimationFrame(draw);
    }

}
