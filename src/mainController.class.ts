import { Avatar } from './avatar.class';
import { Scene } from './scene.class';
import { Maze } from './maze.class';


export const MainController = function( canv:CanvasRenderingContext2D, window:any, device ) {

    const ctx:CanvasRenderingContext2D = canv,
          avatar = Avatar({
              ctx:ctx,
              position: { x:0, y:0 }
          }),
          maze = Maze();

    let size = {
        w: 0,
        h: 0
    }
    const scene = Scene();

    function init() {
        events();
        resStart();
        //window.requestAnimationFrame(draw);
    }
    //auto load
    init();

    function events() {
        device.newPositionEvent( (data)=> scene.setGravity( data ) );

        ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange", "resize"].forEach(
            eventName => document.addEventListener(eventName, resize, false)
        );
    }

    async function resStart() {

        scene.destroy();
        scene.init( ctx );
        avatar.init();
        maze.init( avatar.getAvatarRadius(), ctx.canvas.width, ctx.canvas.height );


        scene.addAvatar( avatar.getBody() );
        let walls = await maze.generateMaze();
        scene.addToWorld( walls );
    }

    function resize(event:Event) {
        //resStart();
    }


    function draw() {

        window.requestAnimationFrame(draw);
    }

}
