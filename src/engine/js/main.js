

var PIECES =  { EMPTY : 0, wP : 1, wN : 2, wB : 3,wR : 4, wQ : 5, wK : 6, 
              bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12  };
              
var BRD_SQ_NUM = 120;

var FILES =  { FILE_A:0, FILE_B:1, FILE_C:2, FILE_D:3, 
	FILE_E:4, FILE_F:5, FILE_G:6, FILE_H:7, FILE_NONE:8 };
	
var RANKS =  { RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3, 
	RANK_5:4, RANK_6:5, RANK_7:6, RANK_8:7, RANK_NONE:8 };
	
var COLOURS = { WHITE:0, BLACK:1, BOTH:2 };

var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8 };

var SQUARES = {
  A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
  A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, 
  NO_SQ:99, OFFBOARD:100
};

var BOOL = { FALSE:0, TRUE:1 };

var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 64;
var INFINITE = 30000;
var MATE = 29000;
var PVENTRIES = 10000;

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var PceChar = ".PNBRQKpnbrqk";
var SideChar = "wb-";
var RankChar = "12345678";
var FileChar = "abcdefgh";

function FR2SQ(f,r) {
 	return ( (21 + (f) ) + ( (r) * 10 ) );
}

var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
	COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];
	
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var KnDir = [ -8, -19,	-21, -12, 8, 19, 21, 12 ];
var RkDir = [ -1, -10,	1, 10 ];
var BiDir = [ -9, -11, 11, 9 ];
var KiDir = [ -1, -10,	1, 10, -9, -11, 11, 9 ];

var DirNum = [ 0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8 ];
var PceDir = [ 0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir ];
var LoopNonSlidePce = [ PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0 ];
var LoopNonSlideIndex = [ 0, 3 ];
var LoopSlidePce = [ PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0 ];
var LoopSlideIndex = [ 0, 4];

var PieceKeys = new Array(14 * 120);
var SideKey;
var CastleKeys = new Array(16);

var Sq120ToSq64 = new Array(BRD_SQ_NUM);
var Sq64ToSq120 = new Array(64);

function RAND_32() {

	return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
		 | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);

}

var Mirror64 = [
56	,	57	,	58	,	59	,	60	,	61	,	62	,	63	,
48	,	49	,	50	,	51	,	52	,	53	,	54	,	55	,
40	,	41	,	42	,	43	,	44	,	45	,	46	,	47	,
32	,	33	,	34	,	35	,	36	,	37	,	38	,	39	,
24	,	25	,	26	,	27	,	28	,	29	,	30	,	31	,
16	,	17	,	18	,	19	,	20	,	21	,	22	,	23	,
8	,	9	,	10	,	11	,	12	,	13	,	14	,	15	,
0	,	1	,	2	,	3	,	4	,	5	,	6	,	7
];

function SQ64(sq120) { 
	return Sq120ToSq64[(sq120)];
}

function SQ120(sq64) {
	return Sq64ToSq120[(sq64)];
}

function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

function MIRROR64(sq) {
	return Mirror64[sq];
}

var Kings = [PIECES.wK, PIECES.bK];
var CastlePerm = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15
];

/*	
0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF
0001 0000 0000 0000 0000 0000 0000 -> Castle 0x1000000
*/


function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m) { return ( (m >> 7) & 0x7F); }
function CAPTURED(m) { return ( (m >> 14) & 0xF); }
function PROMOTED(m) { return ( (m >> 20) & 0xF); }

var MFLAGEP = 0x40000;
var MFLAGPS = 0x80000;
var MFLAGCA = 0x1000000;

var MFLAGCAP = 0x7C000;
var MFLAGPROM = 0xF00000;

var NOMOVE = 0;

function SQOFFBOARD(sq) {
	if(FilesBrd[sq]==SQUARES.OFFBOARD) return BOOL.TRUE;
	return BOOL.FALSE;	
}

function HASH_PCE(pce, sq) {
	GameBoard.posKey ^= PieceKeys[(pce * 120) + sq];
}

function HASH_CA() { GameBoard.posKey ^= CastleKeys[GameBoard.castlePerm]; }
function HASH_SIDE() { GameBoard.posKey ^= SideKey; }
function HASH_EP() { GameBoard.posKey ^= PieceKeys[GameBoard.enPas]; }

var PawnTable = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];


var KnightTable = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
];

var BishopTable = [
0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var RookTable = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
];

var BishopPair = 40;


setTimeout(() => {
	
	init();
	console.log("Main Init Called");	
	ParseFen(START_FEN);
	PrintBoard();
}, 100);

function InitFilesRanksBrd() {
	
	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		FilesBrd[index] = SQUARES.OFFBOARD;
		RanksBrd[index] = SQUARES.OFFBOARD;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			FilesBrd[sq] = file;
			RanksBrd[sq] = rank;
		}
	}
}

function InitHashKeys() {
    var index = 0;
	
	for(index = 0; index < 14 * 120; ++index) {				
		PieceKeys[index] = RAND_32();
	}
	
	SideKey = RAND_32();
	
	for(index = 0; index < 16; ++index) {
		CastleKeys[index] = RAND_32();
	}
}

function InitSq120To64() {

	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	var sq64 = 0;

	for(index = 0; index < BRD_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;
	}
	
	for(index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}

}

function InitBoardVars() {

	var index = 0;
	for(index = 0; index < MAXGAMEMOVES; ++index) {
		GameBoard.history.push( {
			move : NOMOVE,
			castlePerm : 0,
			enPas : 0,
			fiftyMove : 0,
			posKey : 0
		});
	}	
	
	for(index = 0; index < PVENTRIES; ++index) {
		GameBoard.PvTable.push({
			move : NOMOVE,
			posKey : 0
		});
	}
}

function init() {
	console.log("init() called");
	InitFilesRanksBrd();
	InitHashKeys();
	InitSq120To64();
	InitBoardVars();
	InitMvvLva() ;
}


function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0;
GameBoard.history = [];
GameBoard.ply = 0;
GameBoard.enPas = 0;
GameBoard.castlePerm = 0;
GameBoard.material = new Array(2); // WHITE,BLACK material of pieces
GameBoard.pceNum = new Array(13); // indexed by Pce
GameBoard.pList = new Array(14 * 10);
GameBoard.posKey = 0;
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPTH);
GameBoard.PvTable = [];
GameBoard.PvArray = new Array(MAXDEPTH);
GameBoard.searchHistory = new Array( 14 * BRD_SQ_NUM);
GameBoard.searchKillers = new Array(3 * MAXDEPTH);



function CheckBoard() {   
 
	var t_pceNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var t_material = [ 0, 0];
	var sq64, t_piece, t_pce_num, sq120, colour, pcount;
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for(t_pce_num = 0; t_pce_num < GameBoard.pceNum[t_piece]; ++t_pce_num) {
			sq120 = GameBoard.pList[PCEINDEX(t_piece,t_pce_num)];
			if(GameBoard.pieces[sq120] != t_piece) {
				console.log('Error Pce Lists');
				return BOOL.FALSE;
			}
		}	
	}
	
	for(sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		t_piece = GameBoard.pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		if(t_pceNum[t_piece] != GameBoard.pceNum[t_piece]) {
				console.log('Error t_pceNum');
				return BOOL.FALSE;
			}	
	}
	
	if(t_material[COLOURS.WHITE] != GameBoard.material[COLOURS.WHITE] ||
			 t_material[COLOURS.BLACK] != GameBoard.material[COLOURS.BLACK]) {
				console.log('Error t_material');
				return BOOL.FALSE;
	}	
	
	if(GameBoard.side!=COLOURS.WHITE && GameBoard.side!=COLOURS.BLACK) {
				console.log('Error GameBoard.side');
				return BOOL.FALSE;
	}
	
	if(GeneratePosKey()!=GameBoard.posKey) {
				console.log('Error GameBoard.posKey');
				return BOOL.FALSE;
	}	
	return BOOL.TRUE;
}

function PrintBoard() {
	
	var sq,file,rank,piece;

	console.log("\nGame Board:\n");
	for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line =(RankChar[rank] + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file,rank);
			piece = GameBoard.pieces[sq];
			line += (" " + PceChar[piece] + " ");
		}
		console.log(line);
	}
	
	console.log("");
	var line = "   ";
	for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
		line += (' ' + FileChar[file] + ' ');	
	}
	
	console.log(line);
	console.log("side:" + SideChar[GameBoard.side] );
	console.log("enPas:" + GameBoard.enPas);
	line = "";	
	
	if(GameBoard.castlePerm & CASTLEBIT.WKCA) line += 'K';
	if(GameBoard.castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if(GameBoard.castlePerm & CASTLEBIT.BKCA) line += 'k';
	if(GameBoard.castlePerm & CASTLEBIT.BQCA) line += 'q';
	console.log("castle:" + line);
	console.log("key:" + GameBoard.posKey.toString(16));
}

function GeneratePosKey() {

	var sq = 0;
	var finalKey = 0;
	var piece = PIECES.EMPTY;

	for(sq = 0; sq < BRD_SQ_NUM; ++sq) {
		piece = GameBoard.pieces[sq];
		if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {			
			finalKey ^= PieceKeys[(piece * 120) + sq];
		}		
	}

	if(GameBoard.side == COLOURS.WHITE) {
		finalKey ^= SideKey;
	}
	
	if(GameBoard.enPas != SQUARES.NO_SQ) {		
		finalKey ^= PieceKeys[GameBoard.enPas];
	}
	
	finalKey ^= CastleKeys[GameBoard.castlePerm];
	
	return finalKey;

}

function PrintPieceLists() {

	var piece, pceNum;
	
	for(piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
		for(pceNum = 0; pceNum < GameBoard.pceNum[piece]; ++pceNum) {
			console.log('Piece ' + PceChar[piece] + ' on ' + PrSq( GameBoard.pList[PCEINDEX(piece,pceNum)] ));
		}
	}

}

function UpdateListsMaterial() {	
	
	var piece,sq,index,colour;
	
	for(index = 0; index < 14 * 120; ++index) {
		GameBoard.pList[index] = PIECES.EMPTY;
	}
	
	for(index = 0; index < 2; ++index) {		
		GameBoard.material[index] = 0;		
	}	
	
	for(index = 0; index < 13; ++index) {
		GameBoard.pceNum[index] = 0;
	}
	
	for(index = 0; index < 64; ++index) {
		sq = SQ120(index);
		piece = GameBoard.pieces[sq];
		if(piece != PIECES.EMPTY) {
			
			colour = PieceCol[piece];		
			
			GameBoard.material[colour] += PieceVal[piece];
			
			GameBoard.pList[PCEINDEX(piece,GameBoard.pceNum[piece])] = sq;
			GameBoard.pceNum[piece]++;			
		}
	}
	
}

function ResetBoard() {
	
	var index = 0;
	
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		GameBoard.pieces[index] = SQUARES.OFFBOARD;
	}
	
	for(index = 0; index < 64; ++index) {
		GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
	}
	
	GameBoard.side = COLOURS.BOTH;
	GameBoard.enPas = SQUARES.NO_SQ;
	GameBoard.fiftyMove = 0;	
	GameBoard.ply = 0;
	GameBoard.hisPly = 0;	
	GameBoard.castlePerm = 0;	
	GameBoard.posKey = 0;
	GameBoard.moveListStart[GameBoard.ply] = 0;
	
}

//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

function ParseFen(fen) {

	ResetBoard();
	
	var rank = RANKS.RANK_8;
    var file = FILES.FILE_A;
    var piece = 0;
    var count = 0;
    var i = 0;  
	var sq120 = 0;
	var fenCnt = 0; // fen[fenCnt]
	
	while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
	    count = 1;
		switch (fen[fenCnt]) {
			case 'p': piece = PIECES.bP; break;
            case 'r': piece = PIECES.bR; break;
            case 'n': piece = PIECES.bN; break;
            case 'b': piece = PIECES.bB; break;
            case 'k': piece = PIECES.bK; break;
            case 'q': piece = PIECES.bQ; break;
            case 'P': piece = PIECES.wP; break;
            case 'R': piece = PIECES.wR; break;
            case 'N': piece = PIECES.wN; break;
            case 'B': piece = PIECES.wB; break;
            case 'K': piece = PIECES.wK; break;
            case 'Q': piece = PIECES.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIECES.EMPTY;
                count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;
            
            case '/':
            case ' ':
                rank--;
                file = FILES.FILE_A;
                fenCnt++;
                continue;  
            default:
                console.log("FEN error");
                return;

		}
		
		for (i = 0; i < count; i++) {	
			sq120 = FR2SQ(file,rank);            
            GameBoard.pieces[sq120] = piece;
			file++;
        }
		fenCnt++;
	} // while loop end
	
	//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	GameBoard.side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
	fenCnt += 2;
	
	for (i = 0; i < 4; i++) {
        if (fen[fenCnt] == ' ') {
            break;
        }		
		switch(fen[fenCnt]) {
			case 'K': GameBoard.castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': GameBoard.castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': GameBoard.castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': GameBoard.castlePerm |= CASTLEBIT.BQCA; break;
			default:	     break;
        }
		fenCnt++;
	}
	fenCnt++;	
	
	if (fen[fenCnt] != '-') {        
		file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);	
		GameBoard.enPas = FR2SQ(file,rank);		
    }
	
	GameBoard.posKey = GeneratePosKey();	
	UpdateListsMaterial();
}

function PrintSqAttacked() {
	
	var sq,file,rank,piece;

	console.log("\nAttacked:\n");
	
	for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line =((rank+1) + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file,rank);
			if(SqAttacked(sq, GameBoard.side^1) == BOOL.TRUE) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
	
	console.log("");
	
}

function SqAttacked(sq, side) {
	var pce;
	var t_sq;
	var index;
	
	if(side == COLOURS.WHITE) {
		if(GameBoard.pieces[sq - 11] == PIECES.wP || GameBoard.pieces[sq - 9] == PIECES.wP) {
			return BOOL.TRUE;
		}
	} else {
		if(GameBoard.pieces[sq + 11] == PIECES.bP || GameBoard.pieces[sq + 9] == PIECES.bP) {
			return BOOL.TRUE;
		}	
	}
	
	for(index = 0; index < 8; index++) {
		pce = GameBoard.pieces[sq + KnDir[index]];
		if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKnight[pce] == BOOL.TRUE) {
			return BOOL.TRUE;
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = RkDir[index];
		t_sq = sq + dir;
		pce = GameBoard.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceRookQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = GameBoard.pieces[t_sq];
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = BiDir[index];
		t_sq = sq + dir;
		pce = GameBoard.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(PieceBishopQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = GameBoard.pieces[t_sq];
		}
	}
	
	for(index = 0; index < 8; index++) {
		pce = GameBoard.pieces[sq + KiDir[index]];
		if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKing[pce] == BOOL.TRUE) {
			return BOOL.TRUE;
		}
	}
	
	return BOOL.FALSE;
	

}

function EvalPosition() {
	
	var score = GameBoard.material[COLOURS.WHITE] - GameBoard.material[COLOURS.BLACK];
	
	var pce;
	var sq;
	var pceNum;
	
	pce = PIECES.wP;
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += PawnTable[SQ64(sq)];
	}
	
	pce = PIECES.bP;
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= PawnTable[MIRROR64(SQ64(sq))];
	}
	
	pce = PIECES.wN;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += KnightTable[SQ64(sq)];
	}	

	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
	}			
	
	pce = PIECES.wB;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += BishopTable[SQ64(sq)];
	}	

	pce = PIECES.bB;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= BishopTable[MIRROR64(SQ64(sq))];
	}
	
	pce = PIECES.wR;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];
	}	

	pce = PIECES.bR;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
	}
	
	pce = PIECES.wQ;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];
	}	

	pce = PIECES.bQ;	
	for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
		sq = GameBoard.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
	}	
	
	if(GameBoard.pceNum[PIECES.wB] >= 2) {
		score += BishopPair;
	}
	
	if(GameBoard.pceNum[PIECES.bB] >= 2) {
		score -= BishopPair;
	}
	
	if(GameBoard.side == COLOURS.WHITE) {
		return score;
	} else {
		return -score;
	}

}

function PrSq(sq) {
	return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]]);
}

function PrMove(move) {	
	var MvStr;
	
	var ff = FilesBrd[FROMSQ(move)];
	var rf = RanksBrd[FROMSQ(move)];
	var ft = FilesBrd[TOSQ(move)];
	var rt = RanksBrd[TOSQ(move)];
	
	MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];
	var promoted = PROMOTED(move);

	if(promoted != PIECES.EMPTY) {
		var pchar = 'q';
		if(PieceKnight[promoted] == BOOL.TRUE) {
			pchar = 'n';
		} else if(PieceRookQueen[promoted] == BOOL.TRUE && PieceBishopQueen[promoted] == BOOL.FALSE)  {
			pchar = 'r';
		} else if(PieceRookQueen[promoted] == BOOL.FALSE && PieceBishopQueen[promoted] == BOOL.TRUE)   {
			pchar = 'b';
		}
		MvStr += pchar;
	}
	return MvStr;
}

function PrMove2(move) {	
	var MvStr;
	
	var ff = FilesBrd[FROMSQ(move)];
	var rf = RanksBrd[FROMSQ(move)];
	var ft = FilesBrd[TOSQ(move)];
	var rt = RanksBrd[TOSQ(move)];
	
	MvStr = FileChar[ff] + RankChar[rf] + ' ' + FileChar[ft] + RankChar[rt];
	var promoted = PROMOTED(move);

	if(promoted != PIECES.EMPTY) {
		var pchar = 'q';
		if(PieceKnight[promoted] == BOOL.TRUE) {
			pchar = 'n';
		} else if(PieceRookQueen[promoted] == BOOL.TRUE && PieceBishopQueen[promoted] == BOOL.FALSE)  {
			pchar = 'r';
		} else if(PieceRookQueen[promoted] == BOOL.FALSE && PieceBishopQueen[promoted] == BOOL.TRUE)   {
			pchar = 'b';
		}
		MvStr += pchar;
	}
	return MvStr;
}

function PrintMoveList() {

	var index;
	var move;
	var num = 1;
	console.log('MoveList:');

	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply+1]; ++index) {
		move = GameBoard.moveList[index];
		console.log('IMove:' + num + ':(' + index + '):' + PrMove(move) + ' Score:' +  GameBoard.moveScores[index]);
		num++;
	}
	console.log('End MoveList');
}
function ClearPiece(sq) {

	var pce = GameBoard.pieces[sq];
	var col = PieceCol[pce];
	var index;
	var t_pceNum = -1;
	
	HASH_PCE(pce, sq);
	
	GameBoard.pieces[sq] = PIECES.EMPTY;
	GameBoard.material[col] -= PieceVal[pce];
	
	for(index = 0; index < GameBoard.pceNum[pce]; ++index) {
		if(GameBoard.pList[PCEINDEX(pce,index)] == sq) {
			t_pceNum = index;
			break;
		}
	}
	
	GameBoard.pceNum[pce]--;
	GameBoard.pList[PCEINDEX(pce, t_pceNum)] = GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])];	

}

function AddPiece(sq, pce) {

	var col = PieceCol[pce];
	
	HASH_PCE(pce, sq);
	
	GameBoard.pieces[sq] = pce;
	GameBoard.material[col] += PieceVal[pce];
	GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq;
	GameBoard.pceNum[pce]++;

}

function MovePiece(from, to) {
	
	var index = 0;
	var pce = GameBoard.pieces[from];
	
	HASH_PCE(pce, from);
	GameBoard.pieces[from] = PIECES.EMPTY;
	
	HASH_PCE(pce,to);
	GameBoard.pieces[to] = pce;
	
	for(index = 0; index < GameBoard.pceNum[pce]; ++index) {
		if(GameBoard.pList[PCEINDEX(pce,index)] == from) {
			GameBoard.pList[PCEINDEX(pce,index)] = to;
			break;
		}
	}
	
}

function MakeMove(move) {
	
	var from = FROMSQ(move);
    var to = TOSQ(move);
    var side = GameBoard.side;	

	GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;

	if( (move & MFLAGEP) != 0) {
		if(side == COLOURS.WHITE) {
			ClearPiece(to-10);
		} else {
			ClearPiece(to+10);
		}
	} else if( (move & MFLAGCA) != 0) {
		switch(to) {
			case SQUARES.C1:
                MovePiece(SQUARES.A1, SQUARES.D1);
			break;
            case SQUARES.C8:
                MovePiece(SQUARES.A8, SQUARES.D8);
			break;
            case SQUARES.G1:
                MovePiece(SQUARES.H1, SQUARES.F1);
			break;
            case SQUARES.G8:
                MovePiece(SQUARES.H8, SQUARES.F8);
			break;
            default: break;
		}
	}
	
	if(GameBoard.enPas != SQUARES.NO_SQ) HASH_EP();
	HASH_CA();
	
	GameBoard.history[GameBoard.hisPly].move = move;
    GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
    GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
    GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;
    
    GameBoard.castlePerm &= CastlePerm[from];
    GameBoard.castlePerm &= CastlePerm[to];
    GameBoard.enPas = SQUARES.NO_SQ;
    
    HASH_CA();
    
    var captured = CAPTURED(move);
    GameBoard.fiftyMove++;
    
    if(captured != PIECES.EMPTY) {
        ClearPiece(to);
        GameBoard.fiftyMove = 0;
    }
    
    GameBoard.hisPly++;
	GameBoard.ply++;
	
	if(PiecePawn[GameBoard.pieces[from]] == BOOL.TRUE) {
        GameBoard.fiftyMove = 0;
        if( (move & MFLAGPS) != 0) {
            if(side==COLOURS.WHITE) {
                GameBoard.enPas=from+10;
            } else {
                GameBoard.enPas=from-10;
            }
            HASH_EP();
        }
    }
    
    MovePiece(from, to);
    
    var prPce = PROMOTED(move);
    if(prPce != PIECES.EMPTY)   {       
        ClearPiece(to);
        AddPiece(to, prPce);
    }
    
    GameBoard.side ^= 1;
    HASH_SIDE();
    
    if(SqAttacked(GameBoard.pList[PCEINDEX(Kings[side],0)], GameBoard.side))  {
         TakeMove();
    	return BOOL.FALSE;
    }
    
    return BOOL.TRUE;
}

function TakeMove() {
	
	GameBoard.hisPly--;
    GameBoard.ply--;
    
    var move = GameBoard.history[GameBoard.hisPly].move;
	var from = FROMSQ(move);
    var to = TOSQ(move);
    
    if(GameBoard.enPas != SQUARES.NO_SQ) HASH_EP();
    HASH_CA();
    
    GameBoard.castlePerm = GameBoard.history[GameBoard.hisPly].castlePerm;
    GameBoard.fiftyMove = GameBoard.history[GameBoard.hisPly].fiftyMove;
    GameBoard.enPas = GameBoard.history[GameBoard.hisPly].enPas;
    
    if(GameBoard.enPas != SQUARES.NO_SQ) HASH_EP();
    HASH_CA();
    
    GameBoard.side ^= 1;
    HASH_SIDE();
    
    if( (MFLAGEP & move) != 0) {
        if(GameBoard.side == COLOURS.WHITE) {
            AddPiece(to-10, PIECES.bP);
        } else {
            AddPiece(to+10, PIECES.wP);
        }
    } else if( (MFLAGCA & move) != 0) {
        switch(to) {
        	case SQUARES.C1: MovePiece(SQUARES.D1, SQUARES.A1); break;
            case SQUARES.C8: MovePiece(SQUARES.D8, SQUARES.A8); break;
            case SQUARES.G1: MovePiece(SQUARES.F1, SQUARES.H1); break;
            case SQUARES.G8: MovePiece(SQUARES.F8, SQUARES.H8); break;
            default: break;
        }
    }
    
    MovePiece(to, from);
    
    var captured = CAPTURED(move);
    if(captured != PIECES.EMPTY) {      
        AddPiece(to, captured);
    }
    
    if(PROMOTED(move) != PIECES.EMPTY)   {        
        ClearPiece(from);
        AddPiece(from, (PieceCol[PROMOTED(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP));
    }
    
}
var MvvLvaValue = [ 0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600 ];
var MvvLvaScores = new Array(14 * 14);

function InitMvvLva() {
	var Attacker;
	var Victim;
	
	for(Attacker = PIECES.wP; Attacker <= PIECES.bK; ++Attacker) {
		for(Victim = PIECES.wP; Victim <= PIECES.bK; ++Victim) {
			MvvLvaScores[Victim * 14 + Attacker] = MvvLvaValue[Victim] + 6 - (MvvLvaValue[Attacker]/100);
		}
	}

}

function MoveExists(move) {
	
	GenerateMoves();
    
	var index;
	var moveFound = NOMOVE;
	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		moveFound = GameBoard.moveList[index];	
		if(MakeMove(moveFound) == BOOL.FALSE) {
			continue;
		}				
		TakeMove();
		if(move == moveFound) {
			return BOOL.TRUE;
		}
	}
	return BOOL.FALSE;
}

function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move) {
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++] =  
		MvvLvaScores[CAPTURED(move) * 14 + GameBoard.pieces[FROMSQ(move)]] + 1000000;	
}

function AddQuietMove(move) {
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] =  0;
	
	if(move == GameBoard.searchKillers[GameBoard.ply]) {
		GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 900000;
	} else if(move == GameBoard.searchKillers[GameBoard.ply + MAXDEPTH]) {
		GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 800000;
	} else {
		GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]] = 
			GameBoard.searchHistory[GameBoard.pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move)];
	}
	
	GameBoard.moveListStart[GameBoard.ply+1]++
}

function AddEnPassantMove(move) {
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 105 + 1000000;
}

function AddWhitePawnCaptureMove(from, to, cap) {
	if(RanksBrd[from]==RANKS.RANK_7) {
		AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));	
	}
}

function AddBlackPawnCaptureMove(from, to, cap) {
	if(RanksBrd[from]==RANKS.RANK_2) {
		AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));	
	}
}

function AddWhitePawnQuietMove(from, to) {
	if(RanksBrd[from]==RANKS.RANK_7) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wQ,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wR,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wB,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wN,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function AddBlackPawnQuietMove(from, to) {
	if(RanksBrd[from]==RANKS.RANK_2) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bQ,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bR,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bB,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bN,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function GenerateMoves() {
	GameBoard.moveListStart[GameBoard.ply+1] = GameBoard.moveListStart[GameBoard.ply];
	
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq;
	var dir;
	
	if(GameBoard.side == COLOURS.WHITE) {
		pceType = PIECES.wP;
		
		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];			
			if(GameBoard.pieces[sq + 10] == PIECES.EMPTY) {
				AddWhitePawnQuietMove(sq, sq+10);
				if(RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq + 20] == PIECES.EMPTY) {
					AddQuietMove( MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS ));
				}
			}
			
			if(SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq+9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq+9]);
			}
			
			if(SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq+11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq+11]);
			}			
			
			if(GameBoard.enPas != SQUARES.NO_SQ) {
				if(sq + 9 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq+9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
				
				if(sq + 11 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq+11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
			}			
			
		}
		
		if(GameBoard.castlePerm & CASTLEBIT.WKCA) {			
			if(GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}
		
		if(GameBoard.castlePerm & CASTLEBIT.WQCA) {
			if(GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}		

	} else {
		pceType = PIECES.bP;
		
		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
			if(GameBoard.pieces[sq - 10] == PIECES.EMPTY) {
				AddBlackPawnQuietMove(sq, sq-10);		
				if(RanksBrd[sq] == RANKS.RANK_7 && GameBoard.pieces[sq - 20] == PIECES.EMPTY) {
					AddQuietMove( MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS ));
				}
			}
			
			if(SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq-9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq-9]);
			}
			
			if(SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq-11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq-11]);
			}			
			
			if(GameBoard.enPas != SQUARES.NO_SQ) {
				if(sq - 9 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq-9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
				
				if(sq - 11 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq-11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
			}
		}
		if(GameBoard.castlePerm & CASTLEBIT.BKCA) {	
			if(GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.F8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}
		
		if(GameBoard.castlePerm & CASTLEBIT.BQCA) {
			if(GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.D8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}	
	}	
	
	pceIndex = LoopNonSlideIndex[GameBoard.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	while (pce != 0) {
		for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				if(SQOFFBOARD(t_sq) == BOOL.TRUE) {
					continue;
				}
				
				if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
					if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
						AddCaptureMove( MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0 ));
					}
				} else {
					AddQuietMove( MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
				}
			}			
		}	
		pce = LoopNonSlidePce[pceIndex++];
	}
	
	pceIndex = LoopSlideIndex[GameBoard.side];
	pce = LoopSlidePce[pceIndex++];
	
	while(pce != 0) {		
		for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				while( SQOFFBOARD(t_sq) == BOOL.FALSE ) {	
				
					if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
						if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
							AddCaptureMove( MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0 ));
						}
						break;
					}
					AddQuietMove( MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
					t_sq += dir;
				}
			}			
		}	
		pce = LoopSlidePce[pceIndex++];
	}
}

function GenerateCaptures() {
	GameBoard.moveListStart[GameBoard.ply+1] = GameBoard.moveListStart[GameBoard.ply];
	
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq;
	var dir;
	
	if(GameBoard.side == COLOURS.WHITE) {
		pceType = PIECES.wP;
		
		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];				
			
			if(SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq+9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq+9]);
			}
			
			if(SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq+11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq+11]);
			}			
			
			if(GameBoard.enPas != SQUARES.NO_SQ) {
				if(sq + 9 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq+9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
				
				if(sq + 11 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq+11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
			}			
			
		}			

	} else {
		pceType = PIECES.bP;
		
		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];			
			
			if(SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq-9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq-9]);
			}
			
			if(SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq-11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq-11]);
			}			
			
			if(GameBoard.enPas != SQUARES.NO_SQ) {
				if(sq - 9 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq-9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
				
				if(sq - 11 == GameBoard.enPas) {
					AddEnPassantMove( MOVE(sq, sq-11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
			}
		}			
	}	
	
	pceIndex = LoopNonSlideIndex[GameBoard.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	while (pce != 0) {
		for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				if(SQOFFBOARD(t_sq) == BOOL.TRUE) {
					continue;
				}
				
				if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
					if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
						AddCaptureMove( MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0 ));
					}
				}
			}			
		}	
		pce = LoopNonSlidePce[pceIndex++];
	}
	
	pceIndex = LoopSlideIndex[GameBoard.side];
	pce = LoopSlidePce[pceIndex++];
	
	while(pce != 0) {		
		for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				while( SQOFFBOARD(t_sq) == BOOL.FALSE ) {	
				
					if(GameBoard.pieces[t_sq] != PIECES.EMPTY) {
						if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
							AddCaptureMove( MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0 ));
						}
						break;
					}
					t_sq += dir;
				}
			}			
		}	
		pce = LoopSlidePce[pceIndex++];
	}
}
var perft_leafNodes;

function Perft(depth) { 	

	if(depth == 0) {
        perft_leafNodes++;
        return;
    }	
    
    GenerateMoves();
    
	var index;
	var move;
	
	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		move = GameBoard.moveList[index];	
		if(MakeMove(move) == BOOL.FALSE) {
			continue;
		}		
		Perft(depth-1);
		TakeMove();
	}
    
    return;
}

function PerftTest(depth) {    

	PrintBoard();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;

	var index;
	var move;
	var moveNum = 0;
	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		move = GameBoard.moveList[index];	
		if(MakeMove(move) == BOOL.FALSE) {
			continue;
		}	
		moveNum++;	
        var cumnodes = perft_leafNodes;
		Perft(depth-1);
		TakeMove();
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");      

    return;

}
function GetPvLine(depth) {
	
	var move = ProbePvTable();
	var count = 0;
	
	while(move != NOMOVE && count < depth) {
	
		if( MoveExists(move) == BOOL.TRUE) {
			MakeMove(move);
			GameBoard.PvArray[count++] = move;			
		} else {
			break;
		}		
		move = ProbePvTable();	
	}
	
	while(GameBoard.ply > 0) {
		TakeMove();
	}
	
	return count;
	
}

function ProbePvTable() {
	var index = GameBoard.posKey % PVENTRIES;
	
	if(GameBoard.PvTable[index].posKey == GameBoard.posKey) {
		return GameBoard.PvTable[index].move;
	}
	
	return NOMOVE;
}

function StorePvMove(move) {
	var index = GameBoard.posKey % PVENTRIES;
	GameBoard.PvTable[index].posKey = GameBoard.posKey;
	GameBoard.PvTable[index].move = move;
}
var SearchController = {};

SearchController.nodes;
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

function PickNextMove(MoveNum) {

	var index = 0;
	var bestScore = -1;
	var bestNum = MoveNum;
	
	for(index = MoveNum; index < GameBoard.moveListStart[GameBoard.ply+1]; ++index) {
		if(GameBoard.moveScores[index] > bestScore) {
			bestScore = GameBoard.moveScores[index];
			bestNum = index;			
		}
	} 
	
	if(bestNum != MoveNum) {
		var temp = 0;
		temp = GameBoard.moveScores[MoveNum];
		GameBoard.moveScores[MoveNum] = GameBoard.moveScores[bestNum];
		GameBoard.moveScores[bestNum] = temp;
		
		temp = GameBoard.moveList[MoveNum];
		GameBoard.moveList[MoveNum] = GameBoard.moveList[bestNum];
		GameBoard.moveList[bestNum] = temp;
	}

}

function ClearPvTable() {
	
	for(index = 0; index < PVENTRIES; index++) {
			GameBoard.PvTable[index].move = NOMOVE;
			GameBoard.PvTable[index].posKey = 0;		
	}
}

function CheckUp() {
	if (( performance.now() - SearchController.start ) > SearchController.time) {
		SearchController.stop == BOOL.TRUE;
	}
}

function IsRepetition() {
	var index = 0;
	
	for(index = GameBoard.hisPly - GameBoard.fiftyMove; index < GameBoard.hisPly - 1; ++index) {
		if(GameBoard.posKey == GameBoard.history[index].posKey) {
			return BOOL.TRUE;
		}
	}
	
	return BOOL.FALSE;
}

function Quiescence(alpha, beta) {

	if ((SearchController.nodes & 2047) == 0) {
		CheckUp();
	}
	
	SearchController.nodes++;
	
	if( (IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
		return 0;
	}
	
	if(GameBoard.ply > MAXDEPTH -1) {
		return EvalPosition();
	}	
	
	var Score = EvalPosition();
	
	if(Score >= beta) {
		return beta;
	}
	
	if(Score > alpha) {
		alpha = Score;
	}
	
	GenerateCaptures();
	
	var MoveNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var BestMove = NOMOVE;
	var Move = NOMOVE;	
	
	for(MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
	
		PickNextMove(MoveNum);
		
		Move = GameBoard.moveList[MoveNum];	

		if(MakeMove(Move) == BOOL.FALSE) {
			continue;
		}		
		Legal++;
		Score = -Quiescence( -beta, -alpha);
		
		TakeMove();
		
		if(SearchController.stop == BOOL.TRUE) {
			return 0;
		}
		
		if(Score > alpha) {
			if(Score >= beta) {
				if(Legal == 1) {
					SearchController.fhf++;
				}
				SearchController.fh++;	
				return beta;
			}
			alpha = Score;
			BestMove = Move;
		}		
	}
	
	if(alpha != OldAlpha) {
		StorePvMove(BestMove);
	}
	
	return alpha;

}

function AlphaBeta(alpha, beta, depth) {

	
	if(depth <= 0) {
		return Quiescence(alpha, beta);
	}
	
	if ((SearchController.nodes & 2047) == 0) {
		CheckUp();
	}
	
	SearchController.nodes++;
	
	if( (IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
		return 0;
	}
	
	if(GameBoard.ply > MAXDEPTH -1) {
		return EvalPosition();
	}	
	
	var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side],0)], GameBoard.side^1);
	if(InCheck == BOOL.TRUE)  {
		depth++;
	}	
	
	var Score = -INFINITE;
	
	GenerateMoves();
	
	var MoveNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var BestMove = NOMOVE;
	var Move = NOMOVE;	
	
	var PvMove = ProbePvTable();
	if(PvMove != NOMOVE) {
		for(MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
			if(GameBoard.moveList[MoveNum] == PvMove) {
				GameBoard.moveScores[MoveNum] = 2000000;
				break;
			}
		}
	}
	
	for(MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
	
		PickNextMove(MoveNum);	
		
		Move = GameBoard.moveList[MoveNum];	
		
		if(MakeMove(Move) == BOOL.FALSE) {
			continue;
		}		
		Legal++;
		Score = -AlphaBeta( -beta, -alpha, depth-1);
		
		TakeMove();
		
		if(SearchController.stop == BOOL.TRUE) {
			return 0;
		}
		
		if(Score > alpha) {
			if(Score >= beta) {
				if(Legal == 1) {
					SearchController.fhf++;
				}
				SearchController.fh++;		
				if((Move & MFLAGCAP) == 0) {
					GameBoard.searchKillers[MAXDEPTH + GameBoard.ply] = 
						GameBoard.searchKillers[GameBoard.ply];
					GameBoard.searchKillers[GameBoard.ply] = Move;
				}					
				return beta;
			}
			if((Move & MFLAGCAP) == 0) {
				GameBoard.searchHistory[GameBoard.pieces[FROMSQ(Move)] * BRD_SQ_NUM + TOSQ(Move)]
						 += depth * depth;
			}
			alpha = Score;
			BestMove = Move;				
		}		
	}	
	
	if(Legal == 0) {
		if(InCheck == BOOL.TRUE) {
			return -MATE + GameBoard.ply;
		} else {
			return 0;
		}
	}	
	
	if(alpha != OldAlpha) {
		StorePvMove(BestMove);
	}
	
	return alpha;
}

function ClearForSearch() {

	var index = 0;
	var index2 = 0;
	
	for(index = 0; index < 14 * BRD_SQ_NUM; ++index) {				
		GameBoard.searchHistory[index] = 0;	
	}
	
	for(index = 0; index < 3 * MAXDEPTH; ++index) {
		GameBoard.searchKillers[index] = 0;
	}	
	
	ClearPvTable();
	GameBoard.ply = 0;
	SearchController.nodes = 0;
	SearchController.fh = 0;
	SearchController.fhf = 0;
	SearchController.start = performance.now();
	SearchController.stop = BOOL.FALSE;
}

function SearchPosition() {

	var bestMove = NOMOVE;
	var bestScore = -INFINITE;
	var currentDepth = 0;
	var line;
	var PvNum;
	var c;
	ClearForSearch();
	
	for( currentDepth = 1; currentDepth <= /*SearchController.depth*/ 6; ++currentDepth) {	
	
		bestScore = AlphaBeta(-INFINITE, INFINITE, currentDepth);
					
		if(SearchController.stop == BOOL.TRUE) {
			break;
		}
		
		bestMove = ProbePvTable();
		line = 'D:' + currentDepth + ' Best:' + PrMove(bestMove) + ' Score:' + bestScore + 
				' nodes:' + SearchController.nodes;
				
		PvNum = GetPvLine(currentDepth);
		line += ' Pv:';
		for( c = 0; c < PvNum; ++c) {
			line += ' ' + PrMove(GameBoard.PvArray[c]);
		}
		if(currentDepth!=1) {
			line += (" Ordering:" + ((SearchController.fhf/SearchController.fh)*100).toFixed(2) + "%");
		}
		console.log(line);		
	}	
	
	SearchController.best = bestMove;
	SearchController.thinking = BOOL.FALSE;
	
	postMessage({cmd: 'AImove', arg: PrMove2(bestMove)})

	console.log( PrMove2(bestMove))
}

var onmessage = function(message) {
    cmd = message.data.cmd
	arg = message.data.arg || ''
    eval(cmd + '("' + arg + '")')
}