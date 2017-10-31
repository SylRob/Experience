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
    let col = 14;

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

        maze.init( ctx.canvas.width, ctx.canvas.height, col );

        let squareSize = maze.getSquareSize();

        console.log( 'resStart', squareSize.w < squareSize.h ? squareSize.w - 10 : squareSize.h - 10, squareSize );
        avatar.setSize( squareSize.w < squareSize.h ? squareSize.w - 10 : squareSize.h - 10 );
        avatar.init();


        scene.addAvatar( avatar.getBody() );
        let walls = await maze.generateMaze();
        scene.addToWorld( walls );

        setGoal();
    }

    function setGoal() {

        const cases = maze.getMazeCases(),
              lastCase = cases[ cases.length - 1 ];

    }

    function resize(event:Event) {
        //resStart();
    }


    function draw() {

        window.requestAnimationFrame(draw);
    }

    const reset = () => {
        scene.destroy();
    }

    return {
        reset
    }

}
