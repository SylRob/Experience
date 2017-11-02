import { Bodies, Events } from 'matter-js';
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
          scene = Scene(),
          stages = [
              7,
              12,
              16,
              24
          ];

    let caseSize: { w:number, h:number },
        lastElem:Bodies,
        actualStage = 0;

    function init() {
        scene.init( ctx );

        resStart();
        events();
        //window.requestAnimationFrame(draw);
    }
    //auto load
    init();

    function events() {
        device.newPositionEvent( (data)=> scene.setGravity( data ) );

        ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange", "resize"].forEach(
            eventName => document.addEventListener(eventName, resize, false)
        );

        Events.on(scene.getEngine(), "collisionStart", collisionHandeler)
    }

    async function resStart() {

        scene.destroy();

        console.log( 'resStart', actualStage, stages[actualStage] );
        maze.init( ctx.canvas.width, ctx.canvas.height, stages[actualStage] );

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

        lastElem = Bodies.rectangle(
            (caseSize.w * lastCase.wallBody.col) + (caseSize.w/2),
            (caseSize.h * lastCase.wallBody.row) + (caseSize.h/2),
            caseSize.w - 10,
            caseSize.h - 10,
            {
                isSensor: true,
                isStatic: true,
                render: { fillStyle: '#FF0000' },
                label: 'Goal Block'
            }
        );

        scene.addToWorld( lastElem );
    }

    function resize(event:Event) {
        //resStart();
    }

    function collisionHandeler(data) {
        data.pairs.map(( pair )=>{
            if( pair.bodyA == lastElem || pair.bodyB == lastElem ) endOfStage();
        });
    }

    function draw() {

        window.requestAnimationFrame(draw);
    }

    const endOfStage = () => {

        actualStage = actualStage == stages.length - 1 ?
            0 :
            actualStage+1;
        resStart();
    }

    const reset = () => {
        scene.destroy();
    }

    return {
        reset: reset
    }

}
