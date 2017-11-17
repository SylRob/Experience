interface IAvatarParam {

    ctx:CanvasRenderingContext2D;
    position: { x:number, y:number }

}


export const Avatar = function( param:IAvatarParam ) {

    const ctx:CanvasRenderingContext2D = param.ctx;

    let position:IAvatarParam['position'] = param.position,
        circleR = 20,
        color:string = '#FFFFFF',
        force:IAvatarParam['position'] = {
            x: 0,
            y: 0
        },
        speedForceBase = 1;

    const init = ( colorPar = '#FFFFFF' ) => {
        color = colorPar;
    }

    const setSize = ( size:number ) => {
        circleR = size/2;
    }

    const setPosition = ( pos:{ x:number, y:number } ) => {
        position = pos;
    }

    const getPosition = () =>  position;

    const draw = function() {
        ctx.beginPath();
        ctx.arc(position.x,position.y,circleR,0,2*Math.PI);
        ctx.fillStyle=color;
        ctx.fill();
    }

    return {
        init:()=>init(),
        draw:draw,
        getAvatarRadius:() => circleR,
        setSize:(s) => setSize(s),
        setPosition: ( pos )=>setPosition( pos ),
        getPosition: ()=>JSON.parse(JSON.stringify(getPosition())),
        getSize: ()=>circleR,
        getColor: ()=>color
    }

}
