import { Bodies, Body } from 'matter-js';

interface IAvatarParam {

    ctx:CanvasRenderingContext2D;
    position: { x:number, y:number }

}


export const Avatar = function( param:IAvatarParam ) {

    const dafaultCategory = 0x0002;
    const ctx:CanvasRenderingContext2D = param.ctx;

    let position:IAvatarParam['position'] = param.position,
        circleR = 20,
        color:string = '#FFFFFF',
        positionIsDirty:boolean = true,
        force:IAvatarParam['position'] = {
            x: 0,
            y: 0
        },
        speedForceBase = 1,
        world,
        body;

    const init = ( colorPar = '#FFFFFF' ) => {
        body = Bodies.circle(position.x + (circleR*2), position.y + (circleR/2), circleR, { render: { fillStyle: colorPar || color }, collisionFilter: { category: dafaultCategory } });
    }

    const setSize = ( size:number ) => {

        circleR = size/2;
    }

    const setPosition = ( pos:{ x:number, y:number } ) => {
        position = pos;
        Body.setPosition( body, position );
    }

    const getPosition = () =>  body.position;

    return {
        init:()=>init(),
        getAvatarRadius:() => circleR,
        getBody:() => body,
        setSize:(s) => setSize(s),
        setPosition: ( pos )=>setPosition( pos ),
        getPosition: ()=>JSON.parse(JSON.stringify(getPosition())),
        getSize: ()=>circleR,
        getColor: ()=>color
    }

}
