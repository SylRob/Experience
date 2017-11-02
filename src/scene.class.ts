import { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, World, Bodies } from 'matter-js';


export const Scene = function() {

    let   ctx:CanvasRenderingContext2D,
          engine:Engine,
          world:World,
          avatar:Bodies,
          gravity,
          render,
          runner;

    const init = ( canv:CanvasRenderingContext2D ) => {

        // create engine
        ctx = canv;

        engine = Engine.create();
        world = engine.world;
        gravity = world.gravity;

        render = Render.create({
            canvas: ctx.canvas,
            engine: engine,
            options: {
                showAngleIndicator: true,
                background: '#000000',
                wireframes: false,
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
        // create runner
        runner = Runner.create();

        Render.run(render);
        Runner.run(runner, engine);

        gravity.x = 0;
        gravity.y = 0;

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
        World.add(world, bodies);
    }

    const setGravity = ( data:{x:number, y:number}, world, gravity ) => {
        gravity.x = data.x;
        gravity.y = data.y;
    }

    const destroy = () => {
        if( engine ) {

            engine.world.bodies.map((body)=>{
                World.remove(engine.world, body);
            })
            World.clear(engine.world);
            Engine.clear(engine);
        }
    }

    const pause = () => {
        Render.stop( render );
    }

    const resume = () => {
        Render.run( render );
    }

    return {
        init: (ctx) => init(ctx),
        getWorld: () => world,
        getEngine: () => engine,
        setGravity: (data:{x:number, y:number})=>setGravity(data, world, gravity),
        addToWorld: (b)=>addToWorld(b),
        addAvatar: (a)=>addAvatar(a),
        destroy: destroy,
        pause: pause,
        resume: resume
    }


}
