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
        goToFullScreen();

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

        ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange", "resize"].forEach(
            eventName => document.addEventListener(eventName, resize, false)
        );
    }

    function resize() {
    }


    function draw() {

        window.requestAnimationFrame(draw);
    }

    function goToFullScreen() {
        const button = document.createElement('button');

        button.innerHTML = 'Full screen';
        button.style.cssText = 'position:fixed;\
        bottom:10px;\
        right:10px;\
        border: 4px solid #DDDDDD;\
        background-color: #FFFFFF;\
        z-index: 60;\
        font-family: Verdana;\
        padding: 5px;\
        font-size: 12px;';

        document.body.appendChild( button );

        button.addEventListener('touchstart', fullScreen);
        button.addEventListener('click', fullScreen);
    }

    function fullScreen() {
        var canvas = <any>document.getElementById(canv.canvas.getAttribute('id'));
        if(canvas.requestFullScreen)
            canvas.requestFullScreen();
        else if(canvas.webkitRequestFullScreen)
            canvas.webkitRequestFullScreen();
        else if(canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
    }

}
