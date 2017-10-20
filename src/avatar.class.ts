import { Bodies, World, Body } from 'matter-js';

interface IAvatarParam {

    ctx:CanvasRenderingContext2D;
    position: { x:number, y:number }

}


export const Avatar = function( param:IAvatarParam ) {

    let ctx:CanvasRenderingContext2D = param.ctx;
    let position:IAvatarParam['position'] = param.position;
    let circleR = 50;
    let positionIsDirty:boolean = true;
    let force:IAvatarParam['position'] = {
        x: 0,
        y: 0
    }
    let speedForceBase = 1;
    let world;
    let body;

    const init = () => {
        body = Bodies.circle(position.x, position.y, circleR, { render: { fillStyle: '#000000' } });
        World.add( world, [body] );
    }

    const draw = (ctx:CanvasRenderingContext2D, position:IAvatarParam['position']) => {

        //Body.setPosition(body, position);
        positionIsDirty = false;
    }

    const setPowerToPosition = (powerPosition:IAvatarParam['position']) => {

        let sizeWidth = ctx.canvas.clientWidth;
        let sizeHeight = ctx.canvas.clientHeight;
        let newX = position.x + powerPosition.x*speedForceBase;
        let newY = position.y + powerPosition.y*speedForceBase;

        let newPosition = {
            x:  newX > sizeWidth-circleR ?
                    sizeWidth-circleR :
                newX > circleR ?
                    newX :
                    circleR,
            y:  newY > sizeHeight-circleR ?
                    sizeHeight-circleR :
                newY > circleR ?
                    newY :
                    circleR
        }

        position = newPosition;
        positionIsDirty = true;

    }

    return {
        init:()=>init(),
        setPowerToPosition: (pos) => setPowerToPosition(pos),
        getPosition: () => position,
        draw: () => draw(ctx, position),
        setWorld: (w)=>{ world = w; console.log(world); },
        isPositionDirty: positionIsDirty
    }

}
