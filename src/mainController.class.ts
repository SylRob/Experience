import { Avatar } from './avatar.class';
import { Scene } from './scene.class';
import { Maze } from './maze.class';


export const MainController = function( canv:CanvasRenderingContext2D, window:any, device ) {

    const ctx:CanvasRenderingContext2D = canv,
          avatar = Avatar({
              ctx:ctx,
              position: { x:25, y:25 }
          }),
          maze = Maze();

    let size = {
        w: 0,
        h: 0
    }
    const scene = Scene();

    function init() {
        events();

        scene.init( ctx );
        avatar.init();
        maze.init( avatar.getAvatarRadius(), ctx.canvas.width, ctx.canvas.height );


        scene.addAvatar( avatar.getBody() );
        scene.addToWorld( maze.generateMaze() );
        //window.requestAnimationFrame(draw);
    }
    //auto load
    init();

    function events() {
        device.newPositionEvent( (data)=> scene.setGravity( data ) );

        try {
            ctx.canvas.webkitRequestFullScreen();
        }
        catch(err) {
        }

        try {
            ctx.canvas.requestFullscreen();
        }
        catch(err) {
        }
        ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange", "resize"].forEach(
            eventName => document.addEventListener(eventName, resize, false)
        );
    }

    function resize() {
    }


    function draw() {

        window.requestAnimationFrame(draw);
    }

}
