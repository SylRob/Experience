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
          scene = Scene(),
          maze = Maze(),
          stages = [
              7,
              12,
              24
          ];

    let caseSize: { w:number, h:number },
        lastElem,
        actualStage = 0,
        gameOver;

    function init( gameOverFn ) {

        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        scene.init( ctx );

        gameOver = gameOverFn;
        scene.setAvatar( avatar );

        resStart();
        events();

        scene.resume();
    }

    function events() {
        device.newPositionEvent( (data)=> scene.setGravity( data ) );

        ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange", "resize"].forEach(
            eventName => window.addEventListener(eventName, resize, false)
        );
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
        console.log( walls.length );
        scene.addToWorld( walls );

    }

    function setFinishElement() {

        const cases = maze.getMazeCases(),
              lastCase = cases[ cases.length - 1 ];

        lastElem = {
                label: 'Goal Block',
                position: {
                    x: (caseSize.w * lastCase.wallBody.col) + 5,
                    y: (caseSize.h * lastCase.wallBody.row) + 5,
                },
                size: {
                    w: caseSize.w - 10,
                    h: caseSize.h - 10,
                },
                isColidable: true
            };

        scene.addToWorld( lastElem );
    }

    function resize() {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        resStart();
        scene.resume();
    }

    const endOfStage = async () => {
        if( actualStage + 1 != stages.length ) {
            actualStage += 1;
            scene.pause();
            await levelAnimation.endOfStageAnimation(avatar.getPosition(), avatar.getSize(), avatar.getColor(), 'Stage ' + (actualStage+1));
            scene.resetGravity();
            resStart();
            scene.resume();
            await levelAnimation.newStageAnimation(avatar.getPosition(), avatar.getSize(), avatar.getColor());

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
