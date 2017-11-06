import { Bodies, Events, Composite } from 'matter-js';
import { Avatar } from './avatar.class';
import { Scene } from './scene.class';
import { Maze } from './maze.class';
import { LevelAnimation } from './levelAnimation.class';


export const MainController = function( canv:CanvasRenderingContext2D, window:any, device ) {

    const ctx:CanvasRenderingContext2D = canv,
          avatar = Avatar({
              ctx:ctx,
              position: { x:0, y:0 }
          }),
          levelAnimation = LevelAnimation(ctx),
          maze = Maze(),
          scene = Scene(),
          stages = [
              7,
              12,
              24
          ];

    let caseSize: { w:number, h:number },
        lastElem:Bodies,
        actualStage = 0,
        gameOver;

    function init( gameOverFn ) {
        scene.init( ctx );

        gameOver = gameOverFn;
        resStart();
        events();
        //window.requestAnimationFrame(draw);
    }

    function events() {
        device.newPositionEvent( (data)=> scene.setGravity( data ) );

        ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange", "resize"].forEach(
            eventName => document.addEventListener(eventName, resize, false)
        );

        Events.on(scene.getEngine(), "collisionStart", collisionHandeler)
    }

    async function resStart() {

        scene.destroy();

        maze.init( ctx.canvas.width, ctx.canvas.height, stages[actualStage] );

        caseSize = maze.getCaseSize();

        setFinishElement();

        avatar.setSize( caseSize.w < caseSize.h ? caseSize.w - 10 : caseSize.h - 10 );
        avatar.init();
        avatar.setPosition( { x: caseSize.w/2, y: caseSize.h/2 } )

        let walls = await maze.generateMaze();

        scene.addAvatar( avatar.getBody(), avatar.getPosition() );

        scene.addToWorld( walls );

    }

    function setFinishElement() {

        const cases = maze.getMazeCases(),
              lastCase = cases[ cases.length - 1 ];

        lastElem = Composite.create();
        Composite.add(lastElem, [
            Bodies.rectangle(
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
            ),
            Bodies.rectangle(
                (caseSize.w * lastCase.wallBody.col) + (caseSize.w/2),
                (caseSize.h * lastCase.wallBody.row) + (caseSize.h/2),
                caseSize.w/5,
                caseSize.h/5,
                {
                    isSensor: true,
                    isStatic: true,
                    render: { fillStyle: '#000000' },
                    label: 'Sensor Block'
                }
            )
        ]);

        scene.addToWorld( lastElem );
    }

    function resize(event:Event) {
        //resStart();
    }

    function collisionHandeler(data) {
        let lastBlockSensor = Composite.allBodies(lastElem)[1];
        data.pairs.map(( pair )=>{
            if( pair.bodyA == lastBlockSensor || pair.bodyB == lastBlockSensor ) endOfStage();
        });
    }

    function draw() {

        window.requestAnimationFrame(draw);
    }

    const endOfStage = async () => {
        if( actualStage + 1 != stages.length ) {
            actualStage += 1;
            scene.pause();
            await levelAnimation.endOfStageAnimation(avatar.getPosition(), avatar.getSize(), avatar.getColor(), 'Stage ' + (actualStage+1));
            scene.resetGravity();
            resStart();
            await levelAnimation.newStageAnimation(avatar.getPosition(), avatar.getSize(), avatar.getColor());
            scene.resume()
        } else {
            scene.pause();
            await levelAnimation.endOfStageAnimation(avatar.getPosition(), avatar.getSize(), avatar.getColor(), 'GAME OVER');
            gameOver();
        }

    }

    const reset = () => {
        scene.destroy();
    }

    return {
        reset: reset,
        init: (fn)=>init(fn)
    }

}
