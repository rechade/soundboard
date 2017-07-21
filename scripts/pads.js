var pads = {
	NUM_PADS : 64,
	NUM_ROWS : 8,
	NUM_COLS : 8,
	whitePaint : "#FDFEFE",
	rootPaint : "#3498DB",
	blackPaint : "#B2BABB",
	hitPaint : "#DAF7A6",
    padPaints : [],
    padHeight : 0,
    padWidth : 0,
    padRects : [],
	drawPad : function (ctx, colour, x, y, width, height) {
		ctx.beginPath();
		ctx.fillStyle=colour;
		ctx.fillRect(x,y,width,height);
		ctx.stroke();
        ctx.beginPath();
        
        ctx.lineWidth="1";
        ctx.strokeStyle="black";
        ctx.rect(x+1,y+1,width-2,height-2);
		ctx.stroke();
    },

    drawPads : function (ctx) {
        var x = 0;
        var y = 0;
        var i=0;
        for (var row=7; row>=0; row--) {
            x=0;
            for (var col=0; col<pads.NUM_COLS; col++){
                //var rect = [x,y,pads.padWidth,pads.padHeight];
                //padRects.push(rect);
                pads.drawPad(ctx,pads.padPaints[i],x,y,pads.padWidth, pads.padHeight);
                // next column                
                x+= pads.padWidth;                
                i++;
            }
            // next row
            y+=pads.padHeight;            
        }                
    },

	allocatePadPaints : function() {
		var i=0;
        var padPaintArrayIndex=0;
        var lastRowStartedAt=0;
        while (padPaintArrayIndex < pads.NUM_PADS) {
            i = i%12;
            if (i==0) {
                pads.padPaints.push(pads.rootPaint);
				padPaintArrayIndex++;
            } else if (scales.scaleArray[i]) {
                pads.padPaints.push(pads.whitePaint);
				padPaintArrayIndex++;
            } else if (!scales.inKey) {
                pads.padPaints.push(pads.blackPaint);
				padPaintArrayIndex++;
            }
            // we always move to next semitone in the scale
            i++;
            // did we just pass the end of a row
            if ((padPaintArrayIndex%pads.NUM_COLS)==0) {
                i = lastRowStartedAt + scales.semitonesToNextRow(lastRowStartedAt);
                i = i%12;
                // if we're in key and the jump to the next row would land on a non key note,
                // skip to next key note
                while (scales.inKey & !scales.scaleArray[i]) {
                    i++;
                    i = i%12;
                }
                // save square 1 info for next jump
                lastRowStartedAt = i;
            }
        }
	},
};