var pads = {
	NUM_PADS : 64,
	NUM_ROWS : 8,
	NUM_COLS : 8,
	whitePaint : "#FDFEFE",
	rootPaint : "#3498DB",
	blackPaint : "#B2BABB",
	hitPaint : "#DAF7A6",
    padPaints : [],
    gustoPaints : ["#5DADE2","#EC407A","#FFEB3B","#4A148C","#F57C00","#1E88E5","#E91E63","#00FF66","#BA68C8","#FBC02D","#0000CC","#FF5722"],    
    padHeight : 0,
    padWidth : 0,
    padsX : 0,
    padsY : 0,
    padRects : [],
    padsRect : null,
    reRender : function() {
        //alert("reRender()");
        pads.drawPads(ctx);
		inKeyCheckbox = document.getElementById('inKeyCheckbox');
		inKeyCheckbox.checked = scales.inKey;  
    },
    resizePads : function() {
        //alert("resizePads()");
        pads.padWidth = Math.floor(document.getElementById('padsCell').offsetWidth / pads.NUM_COLS);
        pads.padHeight = Math.floor(document.getElementById('padsCell').offsetHeight / pads.NUM_ROWS);					
        ctx.canvas.width = pads.padWidth * pads.NUM_COLS;
        ctx.canvas.height = pads.padHeight * pads.NUM_ROWS;
        //alert ("padPaints: " + pads.padPaints);
        pads.drawPads(ctx);			
        pads.padsRect = document.getElementById('padsCell').getBoundingClientRect();
        pads.padsX = pads.padsRect.left;
        pads.padsY = pads.padsRect.top;
    },
	drawPad : function (ctx, colour, x, y, width, height) {
		ctx.beginPath();
		ctx.fillStyle=colour;
		ctx.fillRect(x,y,width,height);
		ctx.stroke();
        ctx.beginPath();
        
        ctx.lineWidth="1";
        ctx.strokeStyle="black";
        ctx.rect(x,y,width,height);
		ctx.stroke();
    },
    drawPads : function (ctx) {
        //alert("drawPads()");
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