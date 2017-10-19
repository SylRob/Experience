interface IAvatarParam {

    ctx:CanvasRenderingContext2D;
    position: { x:number, y:number };

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

    const draw = (ctx:CanvasRenderingContext2D, position:IAvatarParam['position']) => {
        ctx.clearRect(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);
        ctx.beginPath();
        console.log( 'drawing', position.x,position.y );
        ctx.arc(position.x,position.y,circleR,0,2*Math.PI);
        ctx.fillStyle="#FF0000";
        ctx.fill();
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
                    newX : circleR,
            y:  newY > sizeHeight-circleR ?
                    sizeHeight-circleR :
                newY > circleR ?
                    newY : circleR
        }

        position = newPosition;
        positionIsDirty = true;

        console.log( 'setPowerToPosition' );
    }

    return {
        setPowerToPosition: (pos) => setPowerToPosition(pos),
        getPosition: () => position,
        draw: () => draw(ctx, position),
        isPositionDirty: positionIsDirty
    }

}
