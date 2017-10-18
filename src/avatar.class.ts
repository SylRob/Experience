interface IAvatarParam {

    ctx:CanvasRenderingContext2D;
    position: { x:number, y:number };

}


export const Avatar = function( param:IAvatarParam ) {

    let ctx:CanvasRenderingContext2D = param.ctx;
    let position:IAvatarParam['position'] = param.position;
    let circleR = 50;
    let positionIsDirty:boolean = true;

    const draw = (ctx:CanvasRenderingContext2D, position:IAvatarParam['position']) => {
        ctx.beginPath();
        ctx.arc(position.x,position.y,circleR,0,2*Math.PI);
        ctx.fillStyle="#FF0000";
        ctx.fill();
        positionIsDirty = false;
    }

    const setPosition = (pos:IAvatarParam['position'], positionObj:IAvatarParam['position']) => {
        positionObj = pos;
        positionIsDirty = positionObj.x != pos.x || positionObj.y != pos.y ? true : false;
    }

    return {
        setPosition: (pos) => setPosition(pos, position),
        getPosition: () => position,
        draw: () => draw(ctx, position),
        isPositionDirty: positionIsDirty
    }

}
