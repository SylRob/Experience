
export const LevelAnimation = (ctxParam:CanvasRenderingContext2D) => {

    const ctx:CanvasRenderingContext2D = ctxParam;
    const animationTiming = 2000;
    let isAnimating = false;
    let timeStampStart:number = 0;
    let position:{ x:number, y:number }
    let size:number;
    let color:string;
    let text:string;


    const endOfStageAnimation = (positionParam:{ x:number, y:number }, sizeParam, colorParam, textParam) => {
        return new Promise( async ( resolve, reject ) => {
            size = sizeParam;
            position = positionParam;
            color = colorParam;
            text = textParam;
            isAnimating = true;
            await loop();
            
            return resolve();
        })
    }

    const newStageAnimation = (positionParam:{ x:number, y:number }, sizeParam, colorParam) => {
        return new Promise( async (resolve, reject) => {
            position = positionParam;
            size = sizeParam;
            color = colorParam;
            isAnimating = true;
            await loop(true);

            return resolve();
        })
    }

    function loop(reversed = false) {

        return new Promise( (resolve, reject) => {
            function step(timeStamp:number) {
                if( timeStampStart === 0 ){ timeStampStart = timeStamp; }

                const perc = (timeStamp - timeStampStart)/animationTiming;
                updateCirc( perc, reversed );

                if( perc >= 1 ) { isAnimating = false; timeStampStart = 0; }

                if( isAnimating ) { return window.requestAnimationFrame(step) || window.webkitRequestAnimationFrame(step); }
                else { resolve(); }
            }

            window.requestAnimationFrame(step);
        })
    }

    function updateCirc( perc:number, reversed:boolean ) {
        let newSize;

        const percentage = reversed ? 1 - perc : perc;


        if( percentage / .3 > .8 || reversed ) {
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        }


        //cercle Animation
        let diag = Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2));
        if( percentage / .3 <= 1 ) {
            newSize = (percentage / .3) * (diag - size);

            if( reversed ) newSize = newSize < size ? size : newSize;

            ctx.clearRect(position.x,position.y,newSize,newSize);
        } else {
            newSize = reversed ? diag : size;
        }

        ctx.save();

        if( reversed ) { ctx.beginPath(); }
        ctx.fillStyle = color;
        ctx.arc(position.x,position.y,newSize,0,2*Math.PI);
        ctx.fill();
        ctx.restore();

        if( percentage / .3 > .8 ) {
            let opa = (percentage - (1 / 3)) / .3;
            ctx.font = "30px Verdana";
            ctx.fillStyle = `rgba( 0, 0, 0, ${opa} )`;
            ctx.textAlign = "center";
            ctx.fillText(text, ctx.canvas.width/2, ctx.canvas.height/2);
        }

    }

    return {
        endOfStageAnimation: (p,s,c,t)=>new Promise(async (resolve,reject)=> { await endOfStageAnimation(p,s,c,t); resolve()}),
        newStageAnimation: (p,s,c)=>new Promise(async (resolve,reject)=> {await newStageAnimation(p,s,c); resolve()})
    }
}
