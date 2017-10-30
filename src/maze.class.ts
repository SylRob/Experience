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

        console.log( 'col/row', col, row, fullRad );
        let toRow = 0;
        for (let i = 0; i < (col*row)-1; i++) {

            tbl.push({
                serial: i,
                mutateId: i,
                wallBody: { col: (i % col), row: toRow },
                wallCard:  [],
                generated: false
            })
            filterTbl.push(i);


            if( i % col == col - 1 ) toRow++;
        }
    }


    const generateMaze = ( filteredTbl:Array<number> ) => {

        //const tblInd = 0,
        const tblInd = Math.floor(Math.random() * filteredTbl.length),
              tblVal = tbl[filteredTbl[tblInd]],
              cardinalRand = filterCardinalArr( tblVal );

        mutateCells( tblVal.serial, tblVal.mutateId, cardinalRand );

        filteredTbl.splice( tblInd, 1 );

        if( filteredTbl.length == 0 ){
            console.log( tbl );
            return getWall(walls);
        }
        else return generateMaze( filteredTbl );
    }// generateMaze

    function getWall( arr:Array<Bodies> ) {
        tbl.map( (line) => {
            let pos = line.wallBody;

            if( line.wallCard.indexOf('n') != -1 )
                arr.push( Bodies.rectangle( (pos.col*fullRad) + (fullRad/2), (pos.row*fullRad) - 1, fullRad, 2, { isStatic: true, render:{ fillStyle: '#FFFFFF' } }) );
            if( line.wallCard.indexOf('w') != -1 )
                arr.push( Bodies.rectangle( (pos.col*fullRad) - 1, (pos.row*fullRad) + (fullRad/2), 2, fullRad, { isStatic: true, render:{ fillStyle: '#FFFFFF' } }) );
            if( line.wallCard.indexOf('s') != -1 )
                arr.push( Bodies.rectangle( (pos.col*fullRad) + (fullRad/2), ((pos.row+1)*fullRad) - 1, fullRad, 2, { isStatic: true, render:{ fillStyle: '#FF0000' } }) );
            if( line.wallCard.indexOf('e') != -1 )
                arr.push( Bodies.rectangle( ((pos.col+1)*fullRad) - 1, (pos.row*fullRad) + (fullRad/2), 2, fullRad, { isStatic: true, render:{ fillStyle: '#00FFFF' } }) );

        })

        return arr;
    }// getWall

    function filterCardinalArr( line ) {
        let serial = line.serial,
            allowCard = new Array(),
            otherLine,
            res;

        ['n', 'w', 's', 'e'].map((card)=>{
            switch(card) {
                case 'n':
                    otherLine = tbl[ serial - col ];
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('n');
                break;
                case 'w':
                    otherLine = serial % col !== 0 ? tbl[ serial - 1 ]: false;
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('w');
                break;
                case 's':
                    otherLine = tbl[ serial + col ];
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('s');
                break;
                case 'e':
                    otherLine = (serial + 1) % col !== 0 || serial == 0 ? tbl[ serial + 1 ]: false;
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('e');
                break;
            }
        });

        line.generated = true;

        let rand = Math.floor(Math.random() * allowCard.length);
        res = allowCard[rand];

        allowCard.splice( rand, 1 );

        line.wallCard = allowCard;

        console.log( 'new filter arr', serial, tbl[serial] );

        return res;
    }

    function mutateCells( serial, mutateId, cardinal ) {
        let toMutate:number,
            nextSerial:number,
            oposite:string;

        switch(cardinal) {
            case 'n':
                nextSerial = serial - col;
                toMutate = tbl[nextSerial].mutateId;
                oposite = 's';
            break;
            case 'w':
                nextSerial = serial - 1;
                toMutate = tbl[nextSerial].mutateId;
                oposite = 'e';
            break;
            case 's':
                nextSerial = serial + col;
                toMutate = tbl[nextSerial].mutateId;
                oposite = 'n';
            break;
            case 'e':
                nextSerial = serial + 1;
                toMutate = tbl[nextSerial].mutateId;
                oposite = 'w';
            break;
        }

        console.log( 'mutate cells', cardinal, serial, mutateId, toMutate, nextSerial );
        var founded = false;
        tbl = tbl.map((obj)=>{
            if( obj.mutateId == toMutate ) obj.mutateId = mutateId;
            if( obj.serial == nextSerial && obj.wallCard.indexOf(oposite) != -1 ) {
                obj.wallCard.splice( obj.wallCard.indexOf(oposite), 1 );
                founded = true;
                console.log( 'fouuunnndede', obj.wallCard );
            }

            return obj;

        });

        if( founded ) console.log( 'final Arr', tbl[nextSerial] );

    }

    return {
        init: (r, w, h)=>init(r, w, h),
        generateMaze: ()=>generateMaze(filterTbl)
    }

}
