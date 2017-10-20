import { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, World, Bodies } from 'matter-js';

export const Scene = function() {
    let ctx:CanvasRenderingContext2D;

    const engine = Engine.create(),
          world = engine.world;

    const init = ( canv:CanvasRenderingContext2D ) => {

        // create engine
        ctx = canv;

        const render = Render.create({
            canvas: ctx.canvas,
            engine: engine,
            options: {
                showAngleIndicator: true
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
            Bodies.rectangle(ctx.canvas.width/2, 5, ctx.canvas.width, 10, { isStatic: true, render:{ fillStyle: 'red' } }),
            Bodies.rectangle(ctx.canvas.width - 10, ctx.canvas.height/2, 10, ctx.canvas.height, { isStatic: true }),
            Bodies.rectangle(ctx.canvas.width/2, ctx.canvas.height-10, ctx.canvas.width, 10, { isStatic: true }),
            Bodies.rectangle(0, ctx.canvas.height/2, 10, ctx.canvas.height, { isStatic: true })
        ]);

    }

    return {
        init: (ctx)=>init(ctx),
        getWorld: ()=>world
    }


}
