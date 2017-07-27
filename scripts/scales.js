var ScaleType = {
	  MAJ: 1,
	  MIN: 2,
	  DOR: 3,
	  FOURTHS: 4,
	  THIRDS: 5,
};

var LayoutType = {
	UP_IN_FOURTHS: 1,
	UP_IN_THIRDS: 2,
	SEQUENTIAL: 3,
};

var RootNote = {
	C: 0,
	C_SHARP: 1,
	D: 2,
	D_SHARP: 3,
	E: 4,
	F: 5,
	F_SHARP: 6,
	G: 7,
	G_SHARP:8,
	A: 9,
	A_SHARP: 10,
	B: 11,	
};

var scales = {
	rootNote : RootNote.C,  
	scaleType : ScaleType.MAJ,
	layoutType : LayoutType.UP_IN_THIRDS,
	inKey : true,
	scaleArray : [],
	notes : [],
	notePushed : false,
	endOfRow : false,
	allocatePadNotes : function() {
		
		var i=0;
        var notesIndex=0;
		var note;	
		
        //if ((scales.scaleType!==ScaleType.FOURTHS)&&(scales.scaleType!==ScaleType.THIRDS)){
        //    note=scales.rootNote;
        //}else{
        //   note=scales.rootNote-8;
        //}
		
		note=scales.rootNote;	
		// start on root note, scaleIndex is 0, nothing pushed, note 0/64
        while (notesIndex < pads.NUM_PADS) {
			//alert(notesIndex);
			if (scales.endOfRow){
				scales.notePushed=true;			
			} else {
				scales.notePushed=false;			
			}
            i = i%12;
            // only add a note if the scale and layout specify it
            if (scales.scaleArray[i]) {
				scales.notes.push(note);
				scales.notePushed = true;
				//alert(scales.notePushed);
				if(i==0){
					// it's the root note, add appropriate paint
					pads.padPaints.push(pads.rootPaint);
					//alert("rootPaint");
				} else {
					// it's in the scale, add white paint
					pads.padPaints.push(pads.whitePaint);
					//alert("whitePaint");
				}
			} else if (!scales.inKey) {
				// it's not in the scale, but we're showing black notes, add black paint
				scales.notes.push(note);
				scales.notePushed = true;
				pads.padPaints.push(pads.blackPaint);
			};
			

			// RECORD CURRENT NOTE AND SCALEINDEX FOR USE AT START OF NEXT ROW
			// - AT APPROPRIATE POSITION OF CURRENT ROW ACCORDING TO LAYOUT ETC
			if (scales.notePushed){
				//alert("Note Pushed - note:"+note+" i:"+ i+ " notesIndex:"+notesIndex);
				// UP_IN_FOURTHS layout
				if (scales.layoutType==LayoutType.UP_IN_FOURTHS){	
					if (scales.inKey){					
						// inKey, use note from 4th pad
						if (notesIndex%pads.NUM_COLS==3){	
							nextRowStartScaleIndex = i;
							nextRowStartScaleNote = note;
						}
					} else {
						// 6th pad-note of previous row
						if (notesIndex%pads.NUM_COLS==5){								
							nextRowStartScaleIndex = i;
							nextRowStartScaleNote = note;
						}
					}
				}

				// UP_IN_THIRDS layout
				if (scales.layoutType==LayoutType.UP_IN_THIRDS){						
					if (scales.inKey){
						// inKey, use note from 3rd pad
						if (notesIndex%pads.NUM_COLS==2){								
							nextRowStartScaleIndex = i;
							nextRowStartScaleNote = note;
						}
					} else {
						// 5th pad-note of previous row
						if (notesIndex%pads.NUM_COLS==4){								
							nextRowStartScaleIndex = i;
							nextRowStartScaleNote = note;
						}
					}
				}

				// SEQUENTIAL layout
				if (scales.layoutType==LayoutType.SEQUENTIAL){						
					if (scales.inKey){
						// inKey, use note from 1st pad plus an octave
						if (notesIndex%pads.NUM_COLS==0){								
							nextRowStartScaleIndex = i;
							nextRowStartScaleNote = note+12;
						}
					} else {
						// next in sequence
						if (notesIndex%pads.NUM_COLS==5){								
							nextRowStartScaleIndex = (i+1)%12;
							nextRowStartScaleNote = note+1;
						}
					}
				}
					
				// TODO: migamo mode ()						
				
				// are we at the end of a row?		
				if ((notesIndex%pads.NUM_COLS)==(pads.NUM_COLS-1)){
					//alert(notesIndex);
					// you just filled last pad (usually 7) of the row				
					// use the nextRowStartScaleNote and nextRowStartScaleIndex	to 
					// set values for start of next row
					i = nextRowStartScaleIndex;
					note = nextRowStartScaleNote;
					scales.endOfRow	= true;
				}	else {
					scales.endOfRow	= false;
				}
			} // endif notePushed			
			
			if (!scales.endOfRow){
				// cycle to the next semitone in scaleArray and increment the midi note
				switch(scales.scaleType){
					case ScaleType.FOURTHS:
						note+=4;
						i++;
						break;
					case ScaleType.THIRDS:
						note+=3;
						i++;
						break;
					default:						
						note++;
						i++;
						break;
				}
			}

			// now all the processing and necessary stuff has been recorded / used, 
			// we can update notesIndex if the generated note was part of the layout
			if (scales.notePushed){				
				notesIndex++;
				//alert (notesIndex);
			}
		}
	}, 
	
	changeRootNote : function(newRootNote) {
		// TODO input checking
		scales.rootNote = newRootNote;
	},
	
	changeScale : function(newScale) {
		scales.scaleType = newScale;
		switch (newScale) {
			case ScaleType.MAJ:
				scales.scaleArray = [true, false, true, false, true, true, false, true, false, true, false, true];
				break;
			case ScaleType.MIN:
				scales.scaleArray = [true, false, true, true, false, true, false, true, true, false, true, false];
				break;
			case ScaleType.DOR: 
				scales.scaleArray = [true, false, true, true, false, true, false, true, false, true, true, false];
				break;
			default: 
				scales.scaleArray = [true, false, true, false, true, true, false, true, false, true, false, true];
				scales.scaleType = ScaleType.MAJ;
				break;
		}
	},	
};