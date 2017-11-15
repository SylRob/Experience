import { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, World, Bodies, Body } from 'matter-js';


export const Scene = function() {

    let   ctx:CanvasRenderingContext2D,
          engine:Engine,
          world:World,
          avatar:Bodies,
          isListenning:boolean,
          gravity,
          render,
          runner;

    const defaultColisionId = 0x0002;

    const init = ( canv:CanvasRenderingContext2D ) => {

        // create engine
        ctx = canv;
        isListenning = true;

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
            Bodies.rectangle(ctx.canvas.width/2, 0, ctx.canvas.width, 5, { isStatic: true, render:{ fillStyle: '#FFFFFF', collisionFilter: { mask: defaultColisionId } } }),
            Bodies.rectangle(ctx.canvas.width, ctx.canvas.height/2, 5, ctx.canvas.height, { isStatic: true, render:{ fillStyle: '#FFFFFF', collisionFilter: { mask: defaultColisionId } } }),
            Bodies.rectangle(ctx.canvas.width/2, ctx.canvas.height, ctx.canvas.width, 5, { isStatic: true, render:{ fillStyle: '#FFFFFF', collisionFilter: { mask: defaultColisionId } } }),
            Bodies.rectangle(0, ctx.canvas.height/2, 5, ctx.canvas.height, { isStatic: true, render:{ fillStyle: '#FFFFFF', collisionFilter: { mask: defaultColisionId } } })
        ]);
    }

    const addAvatar = (avatar:Bodies, position: { x:number, y:number }) => {
        avatar = avatar;
        avatar.render.collisionFilter = { category: defaultColisionId };
        World.add(world, [avatar]);
        Body.setPosition(avatar, position );
    }

    const addToWorld = ( bodies:Array<Bodies> ) => {
        World.add(world, bodies);
    }

    const setGravity = ( data:{x:number, y:number}, world, gravity ) => {
        if( !isListenning ) return false;
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
        isListenning = false;
        Render.stop( render );
    }

    const resume = () => {
        isListenning = true;
        Render.run( render );
    }

    const resetGravity = () => {
        gravity.x = 0;
        gravity.y = 0;
    }

    return {
        init: (ctx) => init(ctx),
        getWorld: () => world,
        getEngine: () => engine,
        setGravity: (data:{x:number, y:number})=>setGravity(data, world, gravity),
        addToWorld: (b)=>addToWorld(b),
        addAvatar: (a, p)=>addAvatar(a, p),
        resetGravity: resetGravity,
        destroy: destroy,
        pause: pause,
        resume: resume,
        getDefaultCollisionId: defaultColisionId
    }


}
