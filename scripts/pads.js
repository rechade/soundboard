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
        var row=0;
        var col=0;
        var canvasHeight=pads.padHeight * pads.NUM_ROWS;
        y = canvasHeight - pads.padHeight;                  
        for (row=0; row<pads.NUM_ROWS; row++) {                  
            for (col=0; col<pads.NUM_COLS; col++){
                x=col*pads.padWidth;                
                pads.drawPad(ctx,pads.padPaints[i],x,y,pads.padWidth, pads.padHeight);
                // next column                                
                i++;
            }
            // next row
            y-=pads.padHeight;            
        }                
    },	
};