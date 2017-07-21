var ScaleType = {
	  MAJ: 1,
	  MIN: 2,
	  DOR: 3,
	  FOUR_THREE: 4,
	  THREE_FOUR: 5,
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
	upInFourths : false,
	inKey : true,
	scaleArray : [],
	notes : [],
	
	allocatePadNotes : function() {
		var i=0;
        var notesIndex=0;
        var lastRowStartedAt=0;
        var note;		
        if ((scales.scaleType!==ScaleType.FOUR_THREE)&&(scales.scaleType!==ScaleType.THREE_FOUR)){
            note=scales.rootNote;
        }else{
            note=scales.rootNote-8;
        }

        var savedNote=note;
        while (notesIndex < pads.NUM_PADS) {
            i = i%12;
            // only add a note and increment if the scale and layout specify it
            if (scales.scaleArray[i]) {
				scales.notes.push(note);
				notesIndex++;
            } else if (!scales.inKey) {
				scales.notes.push(note);
				notesIndex++;
            }
            // always cycle to the next semitone in scaleArray and increment the midi note
            switch(scales.scaleType){
                case ScaleType.FOUR_THREE:
                    note+=4;
                    i++;
                    break;
                case ScaleType.THREE_FOUR:
                    note+=3;
                    i++;
                    break;
                default:
                    note++;
                    i++;
                    break;
            }
            // have we passed the end of a row
			//i = lastRowStartedAt + semitonesToNextRow(lastRowStartedAt);
			//note = savedNote + semitonesToNextRow(lastRowStartedAt);
			i = i%12;
			// if we're in key and the jump to the next row would land on a non key note,
			// skip to next key note
			while (scales.inKey & !scales.scaleArray[i]) {
				i++;
				note++;
				i = i%12;
			}
			// save square 1 info for next jump
			lastRowStartedAt = i;
			savedNote = note;
        }     
	}, 
	semitonesToNextRow : function(startPoint) {
        var sentinel = 0;
        var toneCounter = 0;
        if (scales.upInFourths) {
            sentinel = 3;
        } else {
            sentinel = 2;
        }
        var i=startPoint+1;
        i=i%12;
        var semitoneCounter = 0;
        while (toneCounter<sentinel){
            if (scales.scaleArray[i]) {
                toneCounter++;
            }
            semitoneCounter++;
            i++;
            i=i%12;
        }
        if (scales.inKey){
            return semitoneCounter;
        } else {
            if (scales.upInFourths) {
                return 4;
            } else {
                return 3;
            }
        }
    },
	changeRoot : function(newRootNote) {
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