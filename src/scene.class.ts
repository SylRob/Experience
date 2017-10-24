import { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, World, Bodies } from 'matter-js';


export const Scene = function() {
    let ctx:CanvasRenderingContext2D;

    const engine = Engine.create(),
          world = engine.world;
    let   avatar:Bodies,
          gravity = world.gravity;

    const init = ( canv:CanvasRenderingContext2D ) => {

        // create engine
        ctx = canv;

        const render = Render.create({
            canvas: ctx.canvas,
            engine: engine,
            options: {
                showAngleIndicator: true,
                background: '#000000',
                wireframes: false
            }
        }),
        // create runner
        runner = Runner.create();

        Render.run(render);
        Runner.run(runner, engine);
        addWalls();
    }

    const addWalls = () => {
        World.add(world, [
            Bodies.rectangle(ctx.canvas.width/2, 0, ctx.canvas.width, 5, { isStatic: true, render:{ fillStyle: '#FFFFFF' } }),
            Bodies.rectangle(ctx.canvas.width, ctx.canvas.height/2, 5, ctx.canvas.height, { isStatic: true, render:{ fillStyle: '#FFFFFF' } }),
            Bodies.rectangle(ctx.canvas.width/2, ctx.canvas.height, ctx.canvas.width, 5, { isStatic: true, render:{ fillStyle: '#FFFFFF' } }),
            Bodies.rectangle(0, ctx.canvas.height/2, 5, ctx.canvas.height, { isStatic: true, render:{ fillStyle: '#FFFFFF' } })
        ]);
    }

    const addAvatar = (avatar:Bodies) => {
        avatar = avatar;
        World.add(world, [avatar]);
    }

    const addToWorld = ( bodies:Array<Bodies> ) => {
        console.log('addToWorld', bodies);
        World.add(world, bodies);
    }

    const setGravity = ( data:{x:number, y:number}, world, gravity ) => {
        gravity.x = data.x;
        gravity.y = data.y;
    }

    return {
        init: (ctx) => init(ctx),
        getWorld: () => world,
        setGravity: (data:{x:number, y:number})=>setGravity(data, world, gravity),
        addToWorld: (b)=>addToWorld(b),
        addAvatar: (a)=>addAvatar(a)
    }


}
