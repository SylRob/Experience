import {ObjectType} from './objectType.interface';


export const Scene = function() {

    let   ctx:CanvasRenderingContext2D,
          avatar,
          isListenning:boolean,
          gravity = { x: 0, y: 0 },
          cbFunc,
          isPaused = false,
          objectList:Array<ObjectType> = [],
          listenerList:Array<Function> = [];
    const wallColor = '#FFFFFF';

    const init = ( canv:CanvasRenderingContext2D ) => {

        // create engine
        ctx = canv;
        isListenning = true;

        gravity.x = 0;
        gravity.y = 0;

        addWalls();

        loop( listenerList );
    }

    const addWalls = () => {
        objectList.push(
            { label: 'wall', size:{ w:ctx.canvas.width,h:2 }, position:{ x:0,y:0 }, isColidable:true, color: wallColor },
            { label: 'wall', size:{ w:2,h:ctx.canvas.height }, position:{ x:ctx.canvas.width - 2,y:0 }, isColidable:true, color: wallColor },
            { label: 'wall', size:{ w:ctx.canvas.width,h:2 }, position:{ x:0,y:ctx.canvas.height - 2 }, isColidable:true, color: wallColor },
            { label: 'wall', size:{ w:2,h:ctx.canvas.height }, position:{ x:0,y:0 }, isColidable:true, color: wallColor },
        );
    }

    const setAvatar = function( avObj ) {
        avatar = avObj;
    }

    const addToWorld = ( bodies:Array<ObjectType> | ObjectType ) => {
        const formatedB = Array.isArray(bodies) ? bodies : [bodies];
        objectList.push( ...formatedB );

        drawWalls();
    }

    const setGravity = ( data:{x:number, y:number} ) => {
        if( !isListenning ) return false;
        gravity.x = data.x;
        gravity.y = data.y;
    }

    const destroy = () => {
        isPaused = true;
        objectList = [];
        drawWalls();
    }

    const pause = () => {
        isPaused = true;
        isListenning = false;
    }

    const resume = () => {
        isListenning = true;
        isPaused = false;
        loop( listenerList );
    }

    const resetGravity = () => {
        gravity.x = 0;
        gravity.y = 0;
    }

    function collisionFilter( rect1Pos:{ x:number, y:number }, rect1Size:{ w:number, h:number }, avatarPos:{ x:number, y:number }, avatarSize:{ w:number, h:number } ) {

        if (rect1Pos.x < avatarPos.x + avatarSize.w &&
           rect1Pos.x + rect1Size.w > avatarPos.x - avatarSize.w &&
           rect1Pos.y < avatarPos.y + avatarSize.h &&
           rect1Size.h + rect1Pos.y > avatarPos.y - avatarSize.h) {
            return true;
        }

        return false;
    }

    function collisionFilterSecond( rect1Pos:{ x:number, y:number }, rect1Size:{ w:number, h:number }, avatarPos:{ x:number, y:number }, oldPos:{ x:number, y:number }, avatarRad:number ) {
        var distX = Math.abs(avatarPos.x - rect1Pos.x - rect1Size.w / 2);
        var distY = Math.abs(avatarPos.y - rect1Pos.y - rect1Size.h / 2);

        if (distX > (rect1Size.w / 2 + avatarRad)) {
            return avatarPos;
        }
        if (distY > (rect1Size.h / 2 + avatarRad)) {
            return avatarPos;
        }

        if (distX <= (rect1Size.w / 2)) {
            return oldPos;
        }
        if (distY <= (rect1Size.h / 2)) {
            return oldPos;
        }

        var dx = distX - rect1Size.w / 2;
        var dy = distY - rect1Size.h / 2;
        return (dx * dx + dy * dy <= (avatarRad * avatarRad)) ? avatarPos : oldPos;

    }

    function loop( cbFunc:Array<Function> ) {
        let timeStampStart = 0;
        let isAnimating = true;
        return new Promise( (resolve, reject) => {
            function step(timeStamp:number) {
                if( timeStampStart === 0 ){ timeStampStart = timeStamp; }

                beforeRender();
                render();
                cbFunc.map( animFunc => animFunc())

                if( !isPaused ) { return window.requestAnimationFrame(step) || window.webkitRequestAnimationFrame(step); }
                else {
                    timeStampStart = 0;
                    resolve();
                }
            }

            window.requestAnimationFrame(step);
        })
    }

    function drawWalls() {
        addWalls();

        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.restore();

        objectList.map(function(obj) {

            drawOneWalls(obj);

        })
    }

    function drawOneWalls(obj:ObjectType) {
        ctx.save();
        ctx.fillStyle = obj.color ? obj.color : wallColor;
        ctx.rect( obj.position.x, obj.position.y, obj.size.w, obj.size.h );
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#00FFFF';
    }

    function beforeRender() {

    }

    function render() {

        //avatar position
        const oldPos = avatar.getPosition();
        const avatarSize = avatar.getSize();
        let newPos = {
            x: oldPos.x + gravity.x,
            y: oldPos.y + gravity.y
        }

        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(oldPos.x - avatarSize, oldPos.y - avatarSize,avatarSize*2,avatarSize*2);
        ctx.restore();

        //add walls and check for collision with the avatar
        //if yes
        objectList.some(function(obj, index, array) {

            if( obj.isColidable && collisionFilter(obj.position, obj.size, newPos, { w:avatarSize, h:avatarSize }) ) {
                console.log('colliding !');
                newPos =  collisionFilterSecond( obj.position, obj.size, newPos, oldPos, avatarSize );
                drawOneWalls(obj);
                return true;
            } else { return false; }

        });
        //set the new pos and draw the avatar
        avatar.setPosition( newPos );
        ctx.save();
        avatar.draw();
        ctx.restore();

    }

    return {
        init: (ctx) => init(ctx),
        setGravity:(d)=>setGravity(d),
        setAvatar:(fn)=>setAvatar(fn),
        addToWorld: (b)=>addToWorld(b),
        addFrameListener:(f)=>listenerList.push(f),
        resetGravity: resetGravity,
        destroy: destroy,
        pause: pause,
        resume: resume,
    }


}
