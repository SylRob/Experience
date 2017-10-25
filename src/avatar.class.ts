import { Bodies } from 'matter-js';

interface IAvatarParam {

    ctx:CanvasRenderingContext2D;
    position: { x:number, y:number }

}


export const Avatar = function( param:IAvatarParam ) {

    const ctx:CanvasRenderingContext2D = param.ctx;

    let position:IAvatarParam['position'] = param.position,
        circleR = 10,
        positionIsDirty:boolean = true,
        force:IAvatarParam['position'] = {
            x: 0,
            y: 0
        },
        speedForceBase = 1,
        world,
        body;

    const init = () => {
        body = Bodies.circle(position.x + (circleR/2), position.y + (circleR/2), circleR, { render: { fillStyle: '#FFFFFF' } });
    }

    return {
        init:()=>init(),
        getAvatarRadius: () => circleR,
        getBody: () => body
    }

}
