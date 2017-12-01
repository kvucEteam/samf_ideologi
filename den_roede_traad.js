

// IMPORTANT NOTES:
// ================
// Since the call to the function "step_1_template(kpNo, pfNo1, pfNo2)" is made in the HTML-file, the call to:
//
//		step_1_template(kpNo, pfNo1, pfNo2)
//
// - will just call the specified quiz, where:
//
// 		kpNo = "keyproblem number"  (zero-indexed, eg. 0 is the first keyproblem)
// 		pfNo1 = "problemformulation number 1"  (zero-indexed, eg. 0 is the first problemformulation)
// 		pfNo2 = "problemformulation number 2"  (zero-indexed, eg. 0 is the first problemformulation)
//
// The quiz (any of the HTML-files) can be controlled / overrided by the following URL-commands:
//
// 		den_roede_traad.html?n=0&p0=0&p1=1 - will call keyproblem 0 (eg. n=0), problemformulation 0 and 1 (eg. p0=0 and p1=1) of keyproblem 0.
// 		den_roede_traad.html?n=0 - will call keyproblem 0 and two random problemformulations of keyproblem 0
// 		den_roede_traad.html?q=random - will make a random quiz by a call to a random keyproblem X and two random problemformulations of keyproblem X
function step_1_template(kpNo, pfNo1, pfNo2) {

	$('#DataInput').hide(); // The hide / show scheme of #DataInput removes the "visual loading" of the first call to step_1_template() in the HTML-file. 

	lableDraggabels();

	var JD = jsonData.keyProblems[kpNo];
	var stepNo = 1;
	var HTML = '';
	HTML += '<h1>'+jsonData.steps[stepNo-1].header+': '+jsonData.keyProblems[kpNo].keyProblem+'</h1>';
	HTML += '<div class="row">';
	HTML += 	'<div id="instructionWrap">'+ instruction(jsonData.steps[stepNo-1].instruction)+'</div>';
	HTML += 	(jsonData.steps[stepNo-1].hasOwnProperty('explanation'))?'<div id="explanationWrap">'+ explanation(jsonData.steps[stepNo-1].explanation)+'</div>' : '';
	HTML += '</div>';
	HTML += '<div id="step_1_template">';	
	HTML += 	'<div id="cardAndWasteWrap" class="col-xs-12 col-md-4">';
	HTML += 		'<div id="cardPile" class="col-xs-6 col-md-12">';
	HTML += 				'<b>UNDERSPØRGSMÅL</b>';
	HTML += 			getCardPile(kpNo, pfNo1, pfNo2);
	HTML += 		'</div>';
	HTML += 		'<div class="col-xs-6 col-md-12">';
	HTML += 			'<div class="wasteBinHeading">';
	HTML += 				'<b>PASSER IKKE IND</b>';
	HTML += 			'</div>';
	HTML += 			'<div id="wasteBin">';
	HTML += 				'<span class="glyphicons glyphicons-bin">&nbsp; </span>';
	HTML += 			'</div>';
	HTML += 		'</div>';
	HTML += 	'</div>';
	HTML += 	'<div class="hidden-md hidden-lg spacer">&nbsp;</div>';
	HTML += 	'<div class="col-xs-12 col-md-8">';

	HTML += 		'<div id="problem_0" class="problem col-xs-6 col-md-6">';
	HTML += 			'<div class="problemFormulationText">';
	HTML += 				'<b>PROBLEMFORMULERING 1:</b> '+JD.problemformulations[pfNo1].problemformulation;
	HTML += 			'</div>';
	HTML += 			'<div id="dropZone_0" class="dropZone">';
	HTML += 			'</div>';
	HTML += 		'</div>';
	HTML += 		'<div id="problem_1" class="problem col-xs-6 col-md-6">';
	HTML += 			'<div class="problemFormulationText">';
	HTML += 				'<b>PROBLEMFORMULERING 2:</b> '+JD.problemformulations[pfNo2].problemformulation;
	HTML += 			'</div>';
	HTML += 			'<div id="dropZone_1" class="dropZone">';
	HTML += 			'</div>';
	HTML += 		'</div>';

	HTML += 	'</div>';
	HTML += '</div>';
	$('#DataInput').html(HTML);

}


function setEqualProblemFormulationTextHeight(){
	var maxHeight = 0;
	$('.problemFormulationText' ).each(function( index, element ) {
		var height = $(element).height();
		if (maxHeight < height) maxHeight = height;
	});
	$('.problemFormulationText' ).each(function( index, element ) {
		$(element).height(maxHeight);
	});
}


function lableDraggabels(){
	for (var n in jsonData.keyProblems) {
		for (var m in jsonData.keyProblems[n].problemformulations) {
			for (var t in jsonData.keyProblems[n].problemformulations[m].subQuestions) {
				jsonData.keyProblems[n].problemformulations[m].dropClassContainer = 'problem_'+m;
				if (jsonData.keyProblems[n].problemformulations[m].subQuestions[t].correct) {
					jsonData.keyProblems[n].problemformulations[m].subQuestions[t].dropClass = 'problem_'+m;
				} else {
					jsonData.keyProblems[n].problemformulations[m].subQuestions[t].dropClass = 'wasteBin';
				}
			}
		}
	}
	console.log('lableDraggabels - jsonData: ' + JSON.stringify(jsonData));
}


function ShuffelArray(ItemArray){
    var NumOfItems = ItemArray.length;
    var NewArray = ItemArray.slice();  // Copy the array...
    var Item2; var TempItem1; var TempItem2;
    for (var Item1 = 0; Item1 < NumOfItems; Item1++) {
        Item2 = Math.floor( Math.random() * NumOfItems);
        TempItem1 = NewArray[Item1];
        TempItem2 = NewArray[Item2];
        NewArray[Item2] = TempItem1;
        NewArray[Item1] = TempItem2;
    }
    return NewArray;
}



function getCardPile(kpNo, pfNo1, pfNo2){
	var JD = jsonData.keyProblems[kpNo];
	var subQuestions = JD.problemformulations[pfNo1].subQuestions.concat(JD.problemformulations[pfNo2].subQuestions);

	console.log('subQuestions 1: ' + JSON.stringify(subQuestions, null, 4));
	// console.log('subQuestions 1: ' + JSON.stringify(subQuestions));

	subQuestions = ShuffelArray(subQuestions);  // This randomizes the subQuestions

	// console.log('subQuestions 2: ' + JSON.stringify(subQuestions, null, 4));
	// console.log('subQuestions 2: ' + JSON.stringify(subQuestions));

	var HTML = '';
	for (var n in subQuestions) {
		HTML += '<div id="card_'+((subQuestions[n].hasOwnProperty('order'))?subQuestions[n].order:'')+'" class="card '+subQuestions[n].dropClass+'">'+subQuestions[n].subQuestion+'</div>';
		// if (n == 3) break;
	}
	return HTML;
}


function organizeCardPile(parentContainer, hideAboveNo, marginTop) {  // <------- "marginTop" is currently not in use....
	var margin = 30;
	console.log('organizeCardPile - parentContainer: ' + parentContainer);
	$( parentContainer+" .card" ).each(function( index, element ) {
		margin -= (index <= hideAboveNo)? 5 : 0;
		index += (parentContainer.indexOf('cardPile') !== -1)? $( parentContainer+" .card" ).length : 0 ;  // This makes sure that the z-index of the #cardPile is alway higher than th dropzones.
		
		// $(element).css({"position": "absolute", "top": String(margin)+'px', "left": String(margin)+'px', "z-index": index, "margin-top": marginTop+'%'});
		var pcOffset = $(parentContainer).offset();
		var pcPosition = $(parentContainer).position();
		console.log('organizeCardPile - pcOffset: ' + JSON.stringify(pcOffset));
		console.log('organizeCardPile - pcPosition: ' + JSON.stringify(pcPosition));
		$(element).css({"position": "absolute", "top": String(margin+pcPosition.top)+'px', "left": String(margin+10)+'px', "z-index": index, "margin-top": marginTop+'%'});
		
	}); 
}

// IMPORTANT: Class "draggable" (and NOT clases: "ui-draggable", "ui-draggable-handle" and "ui-draggable-dragging") makes all the problems of cloning from ouside and into a droppable.
function SimpleClone(TargetSelector) {
    var Clone = $(TargetSelector).clone().removeClass("draggable").css({
        'position': 'absolute',
        'top': 'auto',
        'left': 'auto',
        'height': 'auto', // <---- NEW
        'width': '80%'    // <---- NEW
    }); // This is necessary for cloning inside the droppable to work properly!!!
    // Clone = Clone.removeAttr("id").removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging"); // This just cleans the attributes so the DOM-element looks nicer.
    Clone = Clone.removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging"); // This just cleans the attributes so the DOM-element looks nicer.
    // Clone = Clone.addClass("Clone");
    return Clone;
}



function step_2_template() {

	var stepNo = 2;

	$('.footerCopywrite a').hide();  // Hide the copywrite text , so that it's not visible on top of the sortable_text_containers during the animation.

	// $('.problem .card').css({"position": "relative", "top": 'auto', "left": 'auto', "z-index": 0},1000);   // VIRKER  OK - men er visuelt ikke appelerende...

	$('.instructionText').hide(); 														// Hide the old instruction text
	$('.instructionText').text(jsonData.steps[stepNo-1].instruction).fadeIn('slow');	// Insert a new instruction text

	$('.dropZone' ).each(function( index1, element1 ) {
		console.log('step_2_template - each dropZone: ' + $(element1).prop('id'));
		var height = 0; var pt = 0; var pb = 0;
		$('.card', element1 ).each(function( index2, element2 ) {
			console.log('step_2_template - each id: ' + $(element2).prop('class'));
			pt += parseInt($(element2).css('padding-top').replace('px',''));
			pb += parseInt($(element2).css('padding-bottom').replace('px',''));
			console.log('step_2_template - pt: ' + pt + ' pb: ' + pb);
			height += $(element2).height(); // + pt + pb;
			console.log('step_2_template - height: ' + height);
			$(element2).switchClass( "card", "sortable_text_container", 400, "easeInOutQuad" );
			$(element2).animate({top: String(height+pt+pb)+'px', left: '30px'}, 500, function(){  // When the animation is complete, do...
				$(element2).css({position: 'relative', top: 'auto', left: 'auto'});
				// $(element2).switchClass( "card", "sortable_text_container", 1000, "easeInOutQuad" );  // Switch class from card-style to sortable style - SEE:  http://api.jqueryui.com/switchclass/
				$(element2).attr('style','');  // Remove leftover styling from the animate function

				// $(element2).attr('id', 'sortable_'+index2);

				$('.footerCopywrite a').show(); // Show the footer again
			});
		});
		$( element1 ).switchClass( "dropZone", "sortableZone", 200 );  // SEE:  http://api.jqueryui.com/switchclass/
	});

	// $( ".card" ).draggable( "disable" );

	// makeSortable('.sortableZone'); // <---- Class selector does not work - it has to be more specific
	makeSortable('#dropZone_0');
	makeSortable('#dropZone_1');

	$('#cardAndWasteWrap').html('<span class="checkAns_step2 btn btn-lg btn-primary"> TJEK </span>');
	$('.checkAns_step2').hide();
	$('.checkAns_step2').fadeIn('slow');


}

function makeSortable(targetContainer) {
	// Sort function are placed here due to readiness issues of the DOM:
	$( targetContainer ).sortable({
		axis: 'y',
		sortAnimateDuration: 500,
	    sortAnimate: true,
	    distance: 25,
	    containment: ".problem",
	    update: function(event, ui) {
	    	console.log('makeSortable - UPDATE');
	    	// updateSortableOrderArray(2);
	    },
	    start: function(event, ui) {
	    	console.log('makeSortable - START');
	        console.log('makeSortable - ui.item.index: ' + ui.item.index());
	        ui.item.css({'left':'35px'});  // IMPORTANT HACK: Without this hack the sortable_text_containers will move to the left by 35 px when sorting starts.
	    },
	    stop: function(event, ui) {
	        console.log('makeSortable - STOP');
	    }
	});
}


$( document ).on('click', ".checkAns_step2", function(event){

	var allCorrect = true;
	$('.sortableZone' ).each(function( index1, element1 ) {
		var height = 0; var pt = 0; var pb = 0;
		$('.sortable_text_container', element1 ).each(function( index2, element2 ) {
			console.log('checkAns_step2 - each - sortableZone: '+ index1 +', sortable_text_container: ' + index2 + ' - id: ' + $(element2).prop('id'));
			var cardId = parseInt($(element2).prop('id').replace('card_',''));
			if (cardId != index2) {
				allCorrect = false;
			};
		});
	});

	var HTML = '';
	if (allCorrect){

		$('#cardAndWasteWrap').html('<b>DU ER FÆRDIG MED ØVELSEN</b><p>'+jsonData.generalEndFeedback+'</p><span id="tryAgain" class="btn btn-lg btn-primary"> PRØV IGEN? </span>');

		HTML += '<h3>Underspørgsmålene står<span class="label label-success">I RIGTIG RÆKKEFØLGE</span> </h3>';
		HTML += '<p>Du har set den røde tråd i problemformuleringens underspørgsmål og er nu færdig med øvelsen.</p>';
	} else {
		HTML += '<h3>Underspørgsmålene står<span class="label label-danger">IKKE I RIGTIG RÆKKEFØLGE</span> </h3>';
		HTML += '<p>Prøv igen. Læs teksterne og tænk over den røde tråd - både hvad angår taksonomi og den logiske rækkefølge, som du vil undersøge problemet i.</p>';
	}
	UserMsgBox("body", HTML);
});


$( document ).on('click', "#tryAgain", function(event){
	window.location.reload();
});



function returnUrlPerameters(){
	window.UlrVarObj = {}; 
    var UrlVarStr = window.location.search.substring(1);
    console.log("returnUrlPerameters - UrlVarStr: " + UrlVarStr);
    var UrlVarPairArray = decodeURIComponent(UrlVarStr).split("&");  // decodeURIComponent handles %26" for the char "&" AND "%3D" for the char "=".
    console.log("returnUrlPerameters - UrlVarPairArray: " + UrlVarPairArray);
    for (var i in UrlVarPairArray){
        var UrlVarSubPairArray = UrlVarPairArray[i].split("=");  // & = %3D
        if (UrlVarSubPairArray.length == 2){
            UlrVarObj[UrlVarSubPairArray[0]] = UrlVarSubPairArray[1];
        }
    }
    console.log("returnUrlPerameters - UlrVarObj: " + JSON.stringify( UlrVarObj ));
    return UlrVarObj;
}

function getUrlSpecifiedQuiz(){
	var urlObjKeyLength = Object.keys(UlrVarObj).length;
	console.log("getUrlSpecifiedQuiz - urlObjKeyLength: " + urlObjKeyLength);
	if (urlObjKeyLength > 0){
		console.log("getUrlSpecifiedQuiz - USER SPECIFIED QUIZ: TRUE");
		var uo = UlrVarObj;
		if ((uo.hasOwnProperty('n')) && (uo.hasOwnProperty('p0')) && (uo.hasOwnProperty('p1'))){ // IMPORTANT p0 < P1 = 0 < 1, OTHERWISE IT WILL NOT WORK!
			console.log("getUrlSpecifiedQuiz - n: " + uo.n + ', p0: '+ uo.p0 +', p1: '+ uo.p1);
			if (uo.p1 < uo.p0){
				var Tp1 = uo.p1;
				uo.p1 = uo.p0;
				uo.p0 = Tp1;
			}
			
			step_1_template(uo.n, uo.p0, uo.p1);
		}
		if ((uo.hasOwnProperty('n')) && (urlObjKeyLength == 1)){
			console.log("getUrlSpecifiedQuiz - n: " + uo.n);

			var JD = jsonData.keyProblems[uo.n];
			JD.problemformulations = ShuffelArray(JD.problemformulations);  // This shuffels the problemformulations randomly...
			console.log('getUrlSpecifiedQuiz - JD.problemformulations: ' + JSON.stringify(JD.problemformulations, null, 4));

			step_1_template(uo.n, 0, 1); // "p0 = 0" AND "p1 = 1" will be two random problemformulations because of the ShuffelArray above...
		}
		if ((uo.hasOwnProperty('q')) && (uo.q == 'random') && (urlObjKeyLength == 1)){
			console.log("getUrlSpecifiedQuiz - q: " + uo.q);

			var JKlength = jsonData.keyProblems.length-1;
			console.log('getUrlSpecifiedQuiz - JKlength: ' + JKlength);

			var JKindex = returnRandArray(0, JKlength)[0];
			console.log('getUrlSpecifiedQuiz - JKindex: ' + JKindex);

			var JD = jsonData.keyProblems[JKindex];
			JD.problemformulations = ShuffelArray(JD.problemformulations);  // This shuffels the problemformulations randomly...
			console.log('getUrlSpecifiedQuiz - JD.problemformulations: ' + JSON.stringify(JD.problemformulations, null, 4));

			step_1_template(JKindex, 0, 1); // "p0 = 0" AND "p1 = 1" will be two random problemformulations because of the ShuffelArray above...
		}
	} else {
		console.log("getUrlSpecifiedQuiz - USER SPECIFIED QUIZ: FALSE");
	}
}


function returnRandArray(min, max){
	var arr = [];
	for (var i = min; i <= max; i++) {
		arr.push(i);
	};
	arr = ShuffelArray(arr);
	return arr;
}
console.log('returnRandArray(0,8): ' + JSON.stringify(returnRandArray(0, 8)));
console.log('returnRandArray(10,20): ' + JSON.stringify(returnRandArray(10, 20)));


$(window).on('resize', function() {
	setEqualProblemFormulationTextHeight();

	rotateCheck();
});


$(document).ready(function() {
	rotateCheck();

	returnUrlPerameters();

	getUrlSpecifiedQuiz();

	$('#DataInput').show(); // The hide / show scheme of #DataInput removes the "visual loading" of the first call to step_1_template() in the HTML-file. 

	// IMPORTANT NOTES:
	// ================
	// lableDraggabels();			// Label all the draggables... This has been moved inside step_1_template(), so that step_1_template() can be called from the HTML-file.
	// step_1_template(0, 0, 1);	// KEYPROBLEM: "Fjendebilleder" This has been moved to the HTML file, so that each exercies has its own HTML file
	// step_1_template(1, 0, 1);	// KEYPROBLEM: "Samfundsskabt ulighed" This has been moved to the HTML file, so that each exercies has its own HTML file

	console.log('READY - jsonData: ' + JSON.stringify(jsonData, null, 4));

	setEqualProblemFormulationTextHeight();

	organizeCardPile('#cardPile',5, 10);

	enable_audio();

	window.dropZoneObj = null;

	


	$( ".card" ).draggable({
		revert: function(valid) {
		// ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
		// SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
        if(valid) {
            console.log("Dropped in a valid location");
            correct_sound();
        }
        else {
         console.log("Dropped in a invalid location");
         	error_sound();
        }
        return !valid;
    },
		start: function(event, ui) {
			console.log('card - START');
			window.topPos = $(this).css('top');
		},
		stop: function(event, ui) {
			console.log('card - STOP');

			if (dropZoneObj !== null){ // If student answer is correct...
				var dropId = $(dropZoneObj).prop('id');
				console.log('card - dropId: ' + dropId);

				$(dropZoneObj).append(SimpleClone($(this)).addClass("Clone"));  // Append the cloned card to dropzone
				$(this).remove();												// Remove the original card
				organizeCardPile('#'+dropId, 5, 0);
				
				// if (dropId == 'wasteBin') {
				// 	$('.glyphicons-bin').css({'opacity':'0'});
				// 	$( '.glyphicons-bin' ).animate({ opacity: 1}, 1000);
				// 	$( '#'+dropId+' .card' ).last().animate({ opacity: 0.40}, 1000);
				// } 

				dropZoneObj = null;  // Reset dropZoneObj...

				// console.log('card - CORRECT ');
				// correct_sound();                        
			} 
			else {  // If student answer is wrong...

				console.log('card - ERROR ');
				// error_sound();				// <------ Does not work on mobile devices - see the solution ATO found above. 
				$(this).css({'top': topPos});   // This is done to make Internet Explore 11 understand that it needs på place the card back to its original position.
			}

			if ($('#cardPile .card').length == 0) {
				console.log('step_2_template - INIT');
				step_2_template();
			}

		},
		drag: function(event, ui) {
			console.log('card - DRAG');
		}
	});
	var dropZoneId = "#dropZone_0";
	var acceptId = ".problem_0";
	// $( "#dropZone_0" ).droppable({ 
	$( dropZoneId ).droppable({
		// accept: ".problem_0",
		accept: acceptId,

		drop: function(event, ui) {
			console.log('card - DROP - problem_0');
			window.dropZoneObj = $(this);
		} 
	});
	dropZoneId = "#dropZone_1";
	acceptId = ".problem_1";
	// $( "#dropZone_1" ).droppable({
	$( dropZoneId ).droppable({
		// accept: ".problem_1",
		accept: acceptId,
		drop: function(event, ui) {
			console.log('card - DROP - problem_1');
			window.dropZoneObj = $(this);
		}  
	});
	dropZoneId = "#dropZone_2";
	acceptId = ".wasteBin";
	// $( "#wasteBin" ).droppable({
	$( dropZoneId ).droppable({
		// accept: ".wasteBin",
		accept: acceptId,
		drop: function(event, ui) {
			console.log('card - DROP - wasteBin');
			window.dropZoneObj = $(this);
		}  
	});
});