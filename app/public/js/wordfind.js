'use strict';
var wf = {
    'config' : {
        '$words' : $('#words li .word'),
        '$board' : $('#board'),
        '$cells' : $('#board td'),
        '$document' : $(document),
        'words' : [],
        'picks' : []
    },
    
    'init' : function () {
        wf.$board = wf.config.$board;
        wf.$cells = wf.config.$cells;
        wf.$words = wf.config.$words;
        wf.$document = wf.config.$document;
        wf.words = wf.config.words;
        wf.collectWords(wf.$words.children);
        wf.picks = wf.config.picks;
        wf.prepareBoard();
    },
    
    'collectWords' : function () {
        wf.$words.each(
            function () {
                var word = {
                    'string' : $(this).text(),
                    'element' : $(this)
                };
                wf.words.push(word);
            }
        );
    },
    
    'prepareBoard' : function () {
        wf.$board.bind('mousedown', wf.downHandler);
        wf.$board.bind('mouseup', wf.upHandler);
    },

    
    //
    // Event Handlers
    //
    
    'downHandler' : function (e) {
        wf.$document.bind('mouseup', wf.upHandler);
        
        var cell = e.target,
            $cell = $(cell);
        $cell.addClass('pick');
        wf.picks.push($cell);
        wf.$board.bind('mouseover', {origin: cell}, wf.hoverHandler);
        wf.$document.bind('mousemove', wf.disableMouseMoveForIE);
        return false;
    },
    
    'upHandler' : function (e) {
        wf.$document.unbind('mouseup');
        wf.$board.unbind('mouseover');
        wf.$document.unbind('mousemove');
        wf.checkPicks(wf.picks);
    },
    
    'hoverHandler' : function (e) {
        if (e.target.tagName === 'TD') {  
            var hoverCell = wf.parsify(e.target),
            origin = wf.parsify(e.data.origin),
            dir = wf.getDirection(origin, hoverCell);
            
            if (dir > 0) {
                wf.updatePicks(origin, hoverCell, dir);
            }
        }
    },
    
    'disableMouseMoveForIE' : function (e) {
        return false;
    },
    
    
    //
    // Word Selection
    //
    
    'updatePicks' : function (origin, hoverCell, dir) {
        var row = parseInt(hoverCell.row, 10),
            col = parseInt(hoverCell.col, 10),
            oRow = parseInt(origin.row, 10),
            oCol = parseInt(origin.col, 10),
            $cell,
            i;
        
        for (i = wf.picks.length - 1; i > -1; i--) {
            wf.picks[i].removeClass('pick');
        }
        
        wf.picks.length = 0;
        
        switch (dir) {
        case 1:
            for (row, col; row <= oRow && col <= oCol; row++, col++) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        case 2:
            for (row; row <= oRow; row++) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        case 3:
            for (row, col; row <= oRow && col >= oCol; row++, col--) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        case 4:
            for (col; col <= oCol; col++) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        case 5:
            for (col; col >= oCol; col--) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        case 6:
            for (row, col; row >= oRow && col <= oCol; row--, col++) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        case 7:
            for (row; row >= oRow; row--) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        case 8:
            for (row, col; row >= oRow && col >= oCol; row--, col--) {
                $cell = $('#cell_' + row + '_' + col);
                $cell.addClass('pick');
                wf.picks.push($cell);
            }
            break;
        }
    },
    
    'getDirection' : function (origin, hoverCell) {
        var dir = 0;
        if (origin.row === hoverCell.row) {
            (origin.col - hoverCell.col < 0) ? dir = 5 : dir = 4;
        }
        else if (origin.col === hoverCell.col) {
            (origin.row - hoverCell.row < 0) ? dir = 7 : dir = 2;
        }
        else if (Math.abs(origin.row - hoverCell.row) ===  Math.abs(origin.col - hoverCell.col)) {
            if (origin.row - hoverCell.row > 0 && origin.col - hoverCell.col > 0) {
                dir = 1;
            }
            else if (origin.row - hoverCell.row > 0 && origin.col - hoverCell.col < 0) {
                dir = 3;
            }
            else if (origin.row - hoverCell.row < 0 && origin.col - hoverCell.col > 0) {
                dir = 6;
            }
            else if (origin.row - hoverCell.row < 0 && origin.col - hoverCell.col < 0) {
                dir = 8;
            }
        }
        return dir;
    },
    
    'isLegalDirection' : function (origin, hoverCell) {
        if (origin.row === hoverCell.row || origin.col === hoverCell.col) {
            return true;
        } else if (Math.abs((origin.row - hoverCell.row)) === Math.abs((origin.col - hoverCell.col))) {
            return true;
        } else {
            return false;
        }
    },
    
    
    //
    // Word matching
    //
    
    'checkPicks' : function (picks) {
        var match = wf.checkForMatch(picks),
            i;
        if (match) {
            wf.updateColor(picks);    
            $(match.element).addClass('foundWord');
        } else {
            for (i = picks.length - 1; i > -1; i--) {
                wf.picks[i].removeClass('pick');
            }
        }
    },
    
    'updateColor' : function (picks) {
        var $pick,
            numWords,
            i;
        
        for (i = picks.length - 1; i > - 1; i--) {
            $pick = picks[i];
            $pick.removeClass('pick');
            
            numWords = parseInt($pick.data('numWords'), 10);
            if (isNaN(numWords)) {
                $pick.addClass('word1');
                $pick.data('numWords', 1);
            } else {
                $pick.removeClass('word' + numWords);
                $pick.data('numWords', numWords + 1);
                $pick.addClass('word' + (numWords + 1));
            }
        }
    },
     
    'checkForMatch' : function (picks) {
        var word = [],
            i, ii, j, jj;
        for (i = 0, ii = picks.length; i < ii; i++) {
            word.push(picks[i].text());
        }
        
        for (j = 0, jj = wf.words.length; j < jj; j++) {
            if (word.join("") === wf.words[j].string.toUpperCase() ||
                    word.reverse().join("") === wf.words[j].string.toUpperCase()) {
                return wf.words[j];
            }
        }
        return false;
    },
    
    
    //
    // Row and column parsing
    //
    
    'parsify' : function (letterCell) {
        var letter = letterCell;
        letter.row = wf.parseRow(letterCell);
        letter.col = wf.parseCol(letterCell);
        return letter;
    },
    
    'parseRow' : function (cell) {
        var parseRow = /cell_(\d+)/,
            row = parseRow.exec(cell.id);
        return row[1];
    },
    
    'parseCol' : function (cell) {
        var parseCol = /\d+$/,
            col = parseCol.exec(cell.id);
        return col[0];
    }

};

wf.init();
