import { Bodies } from 'matter-js';

export const Maze = ( colisionFilterId ) => {

    const defaultColisionCategory = colisionFilterId;

    let   mazeW:number,
          mazeH:number,
          col:number,
          row:number,
          caseSize:{w:number, h:number},
          tbl = new Array(),
          filterTbl = new Array(),
          walls:Array<Bodies> = new Array();

    function setCaseSize( w, h, colMax ) {
        mazeW = w;
        mazeH = h;

        if( mazeW > mazeH ){
            col = colMax,
            row = Math.round(mazeH/(w/col)),
            caseSize = caseSize || { w:0, h:0 },
            caseSize.w = w / col,
            caseSize.h = h / row;
        } else {
            row = colMax,
            col = Math.round(mazeW/(h/row)),
            caseSize = caseSize || { w:0, h:0 },
            caseSize.w = w / col,
            caseSize.h = h / row;
        }

    }

    const init = (w:number, h:number, colMax) => {

        setCaseSize( w, h, colMax );
        walls = new Array();

        let toRow = 0;
        tbl = new Array();

        for (let i = 0; i < (col*row); i++) {

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


    const generateMaze = ( filteredTbl:Array<number> ):Promise<any> => {

        return new Promise( (resolve, reject) => {
            //const tblInd = 0,
            const tblInd = Math.floor(Math.random() * filteredTbl.length),
                  tblVal = tbl[filteredTbl[tblInd]],
                  cardinalRand = filterCardinalArr( tblVal );

            mutateCells( tblVal.serial, tblVal.mutateId, cardinalRand );

            filteredTbl.splice( tblInd, 1 );

            if( filteredTbl.length == 0 ) {

                if( finalLoops() ) { walls = getWall(walls); }

                return resolve();
            }
            else{ return generateMaze( filteredTbl ); }
        });//end of promise
    }// generateMaze

    function getWall( arr:Array<Bodies> ) {

        tbl.map( (line) => {
            let pos = line.wallBody;

            if( line.wallCard.indexOf('n') != -1 ) {
                arr.push( Bodies.rectangle( (pos.col*caseSize.w) + (caseSize.w/2), (pos.row*caseSize.h) - 1, caseSize.w, 2, {
                    isStatic: true, render:{ fillStyle: '#00FFFF', collisionFilter: { mask: defaultColisionCategory } } }) );
            }
            if( line.wallCard.indexOf('w') != -1 ) {
                arr.push( Bodies.rectangle( (pos.col*caseSize.w) - 1, (pos.row*caseSize.h) + (caseSize.h/2), 2, caseSize.h, {
                    isStatic: true, render:{ fillStyle: '#00FFFF', collisionFilter: { mask: defaultColisionCategory } } }) );
            }
            if( line.wallCard.indexOf('s') != -1 ) {
                arr.push( Bodies.rectangle( (pos.col*caseSize.w) + (caseSize.w/2), ((pos.row+1)*caseSize.h) - 1, caseSize.w, 2, {
                     isStatic: true, render:{ fillStyle: '#00FFFF', collisionFilter: { mask: defaultColisionCategory } }
                 }) );
            }
            if( line.wallCard.indexOf('e') != -1 ) {
                arr.push( Bodies.rectangle( ((pos.col+1)*caseSize.w) - 1, (pos.row*caseSize.h) + (caseSize.h/2), 2, caseSize.h, {
                    isStatic: true, render:{ fillStyle: '#00FFFF', collisionFilter: { mask: defaultColisionCategory } } }) );
            }

        });

        return arr;
    }// getWall

    function filterCardinalArr( line ) {
        let serial = line.serial,
            allowCard = new Array(),
            walls = new Array(),
            otherLine,
            res;

        ['n', 'w', 's', 'e'].map((card) => {
            switch(card) {
                case 'n':
                    otherLine = tbl[ serial - col ] ? tbl[ serial - col ] : null;
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('n');
                    else if( !otherLine ) walls.push('n');
                break;
                case 'w':
                    otherLine = serial % col !== 0 ? tbl[ serial - 1 ] : null;
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('w');
                    else if( !otherLine ) walls.push('w');
                break;
                case 's':
                    otherLine = tbl[ serial + col ] ? tbl[ serial + col ] : null;
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('s');
                    else if( !otherLine ) walls.push('s');
                break;
                case 'e':
                    otherLine = (serial + 1) % col !== 0 || serial == 0 ? tbl[ serial + 1 ] : null;
                    if( otherLine && ( otherLine.mutateId != line.mutateId || !otherLine.generated ) ) allowCard.push('e');
                    else if( !otherLine ) walls.push('e');
                break;
            }
        });

        line.generated = true;

        let rand = Math.floor(Math.random() * allowCard.length);
        res = allowCard[rand];

        allowCard.splice( rand, 1 );

        line.wallCard = allowCard;

        //add walls if any
        if( walls.length > 0 ) line.wallCard.push(...walls);
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

        tbl = tbl.map((obj)=>{
            if( obj.mutateId == toMutate ) { obj.mutateId = mutateId; }
            if( obj.serial == nextSerial && obj.wallCard.indexOf(oposite) != -1 ) {
                obj.wallCard.splice( obj.wallCard.indexOf(oposite), 1 );
            }

            return obj;

        });

    }

    function finalLoops() {
        let isUnique = false,
            arr = new Array(),
            initModif = -1,
            targetedSerial = -1;

        tbl.map(( line )=> {

            if( initModif == -1 ) initModif = line.mutateId;
            else if( initModif != line.mutateId && targetedSerial == -1 ) {
                targetedSerial = line.serial;
                arr.push( line.serial );
            } else if( targetedSerial == line.mutateId ) {
                arr.push( line.serial );
            }

        })

        if( arr.length > 0 ){ generateMaze( arr ); }
        else { return true;}

    }

    return {
        init: (w, h, coll)=>init(w, h, coll),
        generateMaze: ()=> { generateMaze(filterTbl); return walls; },
        getMazeCases: ()=>tbl,
        getCaseSize: ()=>caseSize
    }

}
