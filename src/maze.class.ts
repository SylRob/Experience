import { Bodies } from 'matter-js';

export const Maze = () => {

    let   mazeW:number,
          mazeH:number,
          col:number,
          row:number,
          fullRad:number,
          tbl = new Array(),
          filterTbl = new Array(),
          walls:Array<Bodies> = new Array();

    const init = (r:number, w:number, h:number) => {

        mazeW = w;
        mazeH = h;
        fullRad = (r*2) + 10;
        col = Math.floor(mazeW/fullRad),
        row = Math.floor(mazeH/fullRad);
        walls = new Array();

        let toRow = 0;
        for (let i = 0; i < (col*row)-1; i++) {
            tbl.push({
                serial: i,
                mutateId: i,
                wallBody: { col: (i % col), row: toRow }
            })
            filterTbl.push(i);

            if( i % col == col - 1 ) toRow++;
        }
    }


    const generateMaze = ( filteredTbl:Array<number> ) => {

        const tblInd = 0,
        //const tblInd = Math.floor(Math.random() * filteredTbl.length),
              tblVal = tbl[filteredTbl[tblInd]],
              cardinal = getCardinalArr( tblVal.serial ),
              cardRand = cardinal[Math.floor(Math.random() * cardinal.length)];

        walls.push( getWall( cardRand, tblVal.wallBody ) );

        let nextSerial = mutateCells( tblVal.serial, cardRand );

        filteredTbl.splice( tblInd, 1 );
        filteredTbl.indexOf( nextSerial ) != -1 ? filteredTbl.splice( filteredTbl.indexOf( nextSerial ), 1 ) : null;

        if( filteredTbl.length == 0 ) { return walls;}
        else return generateMaze( filteredTbl );
    }// generateMaze

    function getWall( cardinal:string, pos ) {
        let res;
        switch( cardinal ) {
            case 'n':
                res = Bodies.rectangle( (pos.col*fullRad) - (fullRad/2), (pos.row*fullRad) - 1, fullRad, 2, { isStatic: true, render:{ fillStyle: '#FFFFFF' } });
            break;
            case 'w':
                res = Bodies.rectangle( (pos.col*fullRad) - 1, (pos.row*fullRad) - (fullRad/2), 2, fullRad, { isStatic: true, render:{ fillStyle: '#FFFFFF' } });
            break;
            case 's':
                res = Bodies.rectangle( (pos.col*fullRad) - (fullRad/2), ((pos.row+1)*fullRad) - 1, fullRad, 2, { isStatic: true, render:{ fillStyle: '#FF0000' } });
            break;
            case 'e':
                res = Bodies.rectangle( ((pos.col+1)*fullRad) - 1, (pos.row*fullRad) - (fullRad/2), 2, fullRad, { isStatic: true, render:{ fillStyle: '#FFFFFF' } });
            break;
            default:
                res = null;
        }

        return res;
    }// getWall

    function getCardinalArr( serial:number ) {
        let res = null;

        //first case
        if( serial == 0 ) res = [ 's', 'e' ];

        // first line last case
        else if( serial == col - 1 ) {
            res = [ 's', 'w' ];
        }

        //last line first case
        else if( serial == tbl.length - (col - 1) ) {
            res = [ 'n', 'e' ];
        }

        // last line last case
        else if( serial == tbl.length - 1 ) {
            res = [ 'n', 'w' ];
        }

        //last line
        else if( serial > (tbl.length - 1) - col ) {
            res = [ 'n', 'w',  'e' ];
        }

        //first line
        else if(serial > 0 && serial < col){
            res = [ 's', 'w',  'e' ];
        }

        //any line first case
        else if( (serial - 1) % 1 === 0 ) res = [ 's', 'w',  'e' ];

        //any line last case
        else if( serial % 1 === 0 ) res = [ 's', 'w',  'e' ];

        //the rest
        else res = [ 'n', 's', 'w',  'e' ];

        return res;
    }

    function mutateCells( serial, cardinal ) {
        let toMutate:number,
            nextSerial:number;


        switch(cardinal) {
            case 'n':
                nextSerial = serial - col;
                toMutate = tbl[nextSerial].mutateId;
            break;
            case 'w':
                nextSerial = serial - 1;
                toMutate = tbl[serial - 1].mutateId;
            break;
            case 's':
                nextSerial = serial + col;
                toMutate = tbl[serial + col].mutateId;
            break;
            case 'e':
                nextSerial = serial + 1;
                toMutate = tbl[serial + 1].mutateId;
            break;
        }

        let toTrue = 0;
        tbl.map((obj)=>{
            toTrue = obj.mutateId == toMutate ? toTrue + 1 : toTrue;
            obj.mutateId = obj.mutateId == toMutate ? serial : obj.mutateId;
        });

        return nextSerial;
        //console.log( tbl, toMutate, serial, toTrue );
        //console.log('--------');
    }

    return {
        init: (r, w, h)=>init(r, w, h),
        generateMaze: ()=>generateMaze(filterTbl)
    }

}
