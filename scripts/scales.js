var ScaleType = {
	MAJ: 0,
	MIN: 1,
	DOR: 2,
	MIX: 3,
	LYD: 4,
	PHR: 5,
	LOC: 6,
	DIM: 7,
	WHOLE_HALF: 8,
	WHOLE: 9,
	MINOR_BLUES: 10,
	MINOR_PENT: 11,
	MAJOR_PENT: 12,
	HARMONIC_MIN: 13,
	MELODIC_MIN: 14,
	SUPER_LOC: 15,    
	FOURTHS: 16,
	THIRDS: 17
};

var LayoutType = {
	UP_IN_FOURTHS: 0,
	UP_IN_THIRDS: 1,
	SEQUENTIAL: 2
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
	B: 11
};

var scales = {
	rootNote : RootNote.C,
	scaleType : ScaleType.MIN,
	layoutType : LayoutType.UP_IN_THIRDS,
	inKey : true,
	scaleArray : [],
	notes : [],
	notePushed : false,
	endOfRow : false,
	octave : 4,
	allocatePadNotes : function() {
		//alert("allocatePadNotes()");
		if  ((scales.scaleType==ScaleType.FOURTHS) || (scales.scaleType==ScaleType.THIRDS)) {
			scales.allocateGustoPadNotes();
		} else {		
			scales.allocateNormalPadNotes();
		}
	},
	allocateGustoPadNotes : function () {
		var scaleIndex;
        var notesIndex=0;
		var note;
		var nextRowStartScaleIndex;
		var nextRowStartScaleNote;
		scaleIndex = 0;
		notesIndex=0;
		note = parseInt(scales.rootNote);
		note += parseInt(12*scales.octave);
		scales.notes = [];
		pads.padPaints = [];
		
		// start on root note, scaleIndex is 0, nothing pushed, note 0/64
        while (notesIndex < pads.NUM_PADS) {
			//alert(notesIndex);
            scaleIndex = scaleIndex%12;
			scales.notes.push(note);
			scales.notePushed = true;
			pads.padPaints.push(pads.gustoPaints[scaleIndex]);
			
			// RECORD CURRENT NOTE AND SCALEINDEX FOR USE AT START OF NEXT ROW
			// - AT APPROPRIATE POSITION OF CURRENT ROW ACCORDING TO LAYOUT ETC
			if (notesIndex%pads.NUM_COLS==0){	
				if (scales.layoutType==LayoutType.UP_IN_THIRDS) {
					nextRowStartScaleIndex = scaleIndex+3;
					nextRowStartScaleNote = note+3;
				} else if (scales.layoutType==LayoutType.UP_IN_FOURTHS) {
					nextRowStartScaleIndex = scaleIndex+4;
					nextRowStartScaleNote = note+4;
				} 
			} 
			// are we at the end of a row?		
			if ((notesIndex%pads.NUM_COLS)==(pads.NUM_COLS-1)){
				//alert(notesIndex);
				// you just filled last pad (usually 7) of the row				
				// use the nextRowStartScaleNote and nextRowStartScaleIndex	to 
				// set values for start of next row
				scaleIndex = nextRowStartScaleIndex;
				note = nextRowStartScaleNote;
				scales.endOfRow	= true;
			} else {
				scales.endOfRow	= false;
				if (scales.scaleType==ScaleType.THIRDS){
					scaleIndex+=3;
					note+=3;				
				} else {
					scaleIndex+=4;
					note+=4;
				}
			}
			// now all the processing and necessary stuff has been recorded / used, 
			// we can update notesIndex if the generated note was part of the layout		
			notesIndex++;
		}		
	},
	allocateNormalPadNotes : function() {
		//alert("allocateNormalPadNotes()");
		var scaleIndex;
        var notesIndex=0;
		var note;
		var nextRowStartScaleIndex;
		var nextRowStartScaleNote;
		scaleIndex = 0;
		notesIndex=0;

		note=parseInt(scales.rootNote);
		note+= parseInt(12*scales.octave);		
		scales.notes = [];
		pads.padPaints = [];	
		scales.endOfRow = false;	
		
		// start on root note, scaleIndex is 0, nothing pushed, note 0/64
        while (notesIndex < pads.NUM_PADS) {
			//alert(notesIndex);
			if (scales.endOfRow){
				scales.notePushed=true;
			} else {
				scales.notePushed=false;
			}
            scaleIndex = scaleIndex%12;
            // only add a note if the scale and layout specify it
            if (scales.scaleArray[scaleIndex]) {
				scales.notes.push(note);
				scales.notePushed = true;
				//alert(note);
				if(scaleIndex==0){
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
							nextRowStartScaleIndex = scaleIndex;
							nextRowStartScaleNote = note;
						}
					} else {
						// 6th pad-note of previous row
						if (notesIndex%pads.NUM_COLS==5){								
							nextRowStartScaleIndex = scaleIndex;
							nextRowStartScaleNote = note;
						}
					}					
				}

				// UP_IN_THIRDS layout
				if (scales.layoutType==LayoutType.UP_IN_THIRDS){										
					if (scales.inKey){
						// inKey, use note from 3rd pad
						if (notesIndex%pads.NUM_COLS==2){								
							nextRowStartScaleIndex = scaleIndex;
							nextRowStartScaleNote = note;
						}
					} else {
						// 5th pad-note of previous row
						if (notesIndex%pads.NUM_COLS==4){								
							nextRowStartScaleIndex = scaleIndex;
							nextRowStartScaleNote = note;
						}
					}					
				}

				// SEQUENTIAL layout
				if (scales.layoutType==LayoutType.SEQUENTIAL){						
					if (scales.inKey){
						// inKey, use note from 1st pad plus an octave
						if (notesIndex%pads.NUM_COLS==0){								
							nextRowStartScaleIndex = scaleIndex;
							nextRowStartScaleNote = note+12;
						}
					} else {
						// next in sequence						
						nextRowStartScaleIndex = scaleIndex+1;
						nextRowStartScaleNote = note+1;
					}
				}							
				
				// are we at the end of a row?		
				if ((notesIndex%pads.NUM_COLS)==(pads.NUM_COLS-1)){
					//alert(notesIndex);
					// you just filled last pad (usually 7) of the row				
					// use the nextRowStartScaleNote and nextRowStartScaleIndex	to 
					// set values for start of next row
					scaleIndex = nextRowStartScaleIndex;
					note = nextRowStartScaleNote;
					scales.endOfRow	= true;
				} else {
					scales.endOfRow	= false;
				}
			} // endif notePushed			
			
			if (!scales.endOfRow){
				// cycle to the next semitone in scaleArray and increment the midi note				
				note++;
				scaleIndex++;				
			}

			// now all the processing and necessary stuff has been recorded / used, 
			// we can update notesIndex if the generated note was part of the layout
			if (scales.notePushed){				
				notesIndex++;				
			}
		}
	},		
	changeRootNote : function(newRootNote) {
		//alert("scales.changeRootNote()");
		// TODO input checking
		scales.rootNote = newRootNote;
		//alert("rootNote="+scales.rootNote);
	},
	changeLayout : function(newLayout) {
		//alert("changeLayout("+newLayout+")");
		// TODO input checking
		scales.layoutType = newLayout;
        scales.allocatePadNotes();
		pads.reRender();
		//alert("rootNote="+scales.rootNote);
	},
	changeScale : function(newScale) {
		//alert("changeScale("+newScale+")");
		scales.scaleType = parseInt(newScale);
		//alert(scales.scaleType);
		switch (scales.scaleType) {
			case ScaleType.MAJ:
				//alert("MAJ");
				scales.scaleArray = [true, false, true, false, true, true, false, true, false, true, false, true];
				break;
			case ScaleType.MIN:
				scales.scaleArray = [true, false, true, true, false, true, false, true, true, false, true, false];
				break;
			case ScaleType.DOR: 
				scales.scaleArray = [true, false, true, true, false, true, false, true, false, true, true, false];
				break;				
            case ScaleType.MIX:
                scales.scaleArray = [true, false, true, false, true, true, false, true, false, true, true, false];
                break;
            case ScaleType.LYD:
                scales.scaleArray = [true, false, true, false, true, false, true, true, false, true, false, true];
                break;
            case ScaleType.PHR:
                scales.scaleArray = [true, true, false, true, false, true, false, true, true, false, true, false];
                break;
            case ScaleType.LOC:
                scales.scaleArray = [true, true, false, true, false, true, true, false, true, false, true, false];
                break;
            case ScaleType.DIM:
                scales.scaleArray = [true, true, false, true, true, false, true, true, false, true, true, false];
                break;
            case ScaleType.WHOLE_HALF:
                scales.scaleArray = [true, false, true, true, false, true, true, false, true, true, false, true];
                break;
            case ScaleType.WHOLE:
                scales.scaleArray = [true, false, true, false, true, false, true, false, true, false, true, false];
                break;
            case ScaleType.MINOR_BLUES:
                scales.scaleArray = [true, false, false, true, false, true, true, true, false, false, true, false];
                break;
            case ScaleType.MINOR_PENT:
                scales.scaleArray = [true, false, false, true, false, true, false, true, false, false, true, false];
				break;			
            case ScaleType.MAJOR_PENT:
                scales.scaleArray = [true, false, true, false, true, false, false, true, false, true, false, false];
                break;
            case ScaleType.HARMONIC_MIN:
                scales.scaleArray = [true, false, true, true, false, true, false, true, true, false, false, true];
                break;
            case ScaleType.MELODIC_MIN:
                scales.scaleArray = [true, false, true, true, false, true, false, true, false, true, false, true];
                break;
            case ScaleType.SUPER_LOC:
                scales.scaleArray = [true, true, false, true, true, false, true, false, true, false, true, false];
                break;
            case ScaleType.FOURTHS:
				scales.scaleArray = [true,false,false,false,true,false,false,false,true,false,false,false];			
				scales.inKey = false;
                break;
            case ScaleType.THIRDS:
				scales.scaleArray = [true,false,false,true,false,false,true,false,false,true,false,false];
				scales.inKey = false;
                break;	
			default: 
				scales.scaleArray = [true, false, true, false, true, true, false, true, false, true, false, true];	
				break;
		}
				alert (scales.scaleArray);		
	},	
};
