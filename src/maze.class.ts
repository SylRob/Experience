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
                openedWall: '',
                firstListed: false
            })
            filterTbl.push(i);


            if( i % col == col - 1 ) toRow++;
        }
    }


    const generateMaze = ( filteredTbl:Array<number> ) => {

        const tblInd = 0,
        //const tblInd = Math.floor(Math.random() * filteredTbl.length),
              tblVal = tbl[filteredTbl[tblInd]],
              cardinalRand = filterCardinalArr( tblVal );

        mutateCells( tblVal.serial, tblVal.mutateId, cardinalRand );

        filteredTbl.splice( tblInd, 1 );

        if( filteredTbl.length == 0 ){ console.log( tbl ); return getWall(walls); }
        else return generateMaze( filteredTbl );
    }// generateMaze

    function getWall( arr:Array<Bodies> ) {
        tbl.map( (line) => {
            let pos = line.wallBody;

            if( line.serial == 1 ) console.log( 'wall num 1', line.wallCard );

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
        let serial = line.serial;
        let wallCard = new Array();
        let allowCard;
        let res;

        // first line
        if( (serial - 1) < col || tbl[serial - col].openedWall == 's' ) wallCard.push('n');
        //last line
        else if( serial > (tbl.length - 1) - col || tbl[serial + col].openedWall == 'n' ) wallCard.push('s');

        //any line first case
        if( serial == 0 || serial % col === 0 || tbl[serial - 1].openedWall.openedWall == 'e' ) wallCard.push('w');
        //any line last case
        else if( (serial+2) % col === 0 || tbl[serial + 1].openedWall == 'w'  ) wallCard.push('e');

        console.log( 'filterCardinalArr before filter', serial, wallCard );

        allowCard =
            [ 'n', 's', 'w',  'e' ].filter( (card) => {
                if( serial == 1 ) console.log( card, line.firstListed, line.wallCard.indexOf(card) == -1, wallCard.indexOf(card) != -1, line.wallCard );
                //already filtered once and not in the list already OR in the scene wall list -> then false
                if( (line.firstListed && line.wallCard.indexOf(card) == -1) || wallCard.indexOf(card) != -1  ) return false;
                else return true;
            });

        line.wallCard = allowCard;

        if( allowCard.length > 0 ) {
            //remove one randomly
            var rand = Math.floor(Math.random() * allowCard.length);

            res = allowCard[rand];
            line.wallCard.splice( line.wallCard.indexOf(allowCard[rand]), 1 );
        } else res = '';


        console.log(
            'filterCardinalArr after filter',
            line.firstListed,
            line.wallCard,
            wallCard,
            res
        );

        line.firstListedline = true;
        line.openedWall = res;

        return res;
    }

    function mutateCells( serial, mutateId, cardinal ) {
        let toMutate:number,
            nextSerial:number,
            oposite:string;

        console.log( 'mutate cells', cardinal, serial, mutateId, col );

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
                console.log( nextSerial, tbl );
                toMutate = tbl[nextSerial].mutateId;
                oposite = 'n';
            break;
            case 'e':
                nextSerial = serial + 1;
                toMutate = tbl[nextSerial].mutateId;
                oposite = 'w';
            break;
        }

        tbl.map((obj)=>{
            if( obj.mutateId == toMutate ) obj.mutateId = mutateId;
            //if( obj.serial == nextSerial && obj.wallCard.indexOf(oposite) != -1 ) { obj.wallCard.splice( obj.wallCard.indexOf(oposite), 1 ); }
            if( obj.serial == nextSerial && obj.wallCard.indexOf(oposite) != -1 ) {
                obj.wallCard.slice( obj.wallCard.indexOf(oposite), 1 );
                obj.firstListed = true;
                console.log('FOUNNDED', tbl);
            }
            //if( obj.serial == 0 || obj.serial == col || serial == 1  ) { console.log(serial, obj.wallCard, nextSerial, 'tttrrrragettett', oposite ) }

        });

    }

    return {
        init: (r, w, h)=>init(r, w, h),
        generateMaze: ()=>generateMaze(filterTbl)
    }

}
