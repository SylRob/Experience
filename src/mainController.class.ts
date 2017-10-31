import { Bodies } from 'matter-js';
import { Avatar } from './avatar.class';
import { Scene } from './scene.class';
import { Maze } from './maze.class';


export const MainController = function( canv:CanvasRenderingContext2D, window:any, device ) {

    const ctx:CanvasRenderingContext2D = canv,
          avatar = Avatar({
              ctx:ctx,
              position: { x:0, y:0 }
          }),
          maze = Maze(),
          scene = Scene();

    let col = 14,
        caseSize: { w:number, h:number };

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

        caseSize = maze.getCaseSize();

        avatar.setSize( caseSize.w < caseSize.h ? caseSize.w - 10 : caseSize.h - 10 );
        avatar.init();


        scene.addAvatar( avatar.getBody() );
        let walls = await maze.generateMaze();
        scene.addToWorld( walls );

        setFinishElement();
    }

    function setFinishElement() {

        const cases = maze.getMazeCases(),
              lastCase = cases[ cases.length - 1 ];

        var finishElem = Bodies.rectangle(
            (caseSize.w * lastCase.wallBody.col) + (caseSize.w/2),
            (caseSize.h * lastCase.wallBody.row) + (caseSize.h/2),
            caseSize.w - 10,
            caseSize.h - 10,
            { render: { fillStyle: '#FF0000' } }
        );

        scene.addToWorld( finishElem );
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
