

/*


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


// $(window).on('resize', function() {
// 	setEqualProblemFormulationTextHeight();

// 	rotateCheck();
// });


// $(document).ready(function() {
// 	// rotateCheck();
// 	// returnUrlPerameters();
// 	// getUrlSpecifiedQuiz();
// 	// $('#DataInput').show(); // The hide / show scheme of #DataInput removes the "visual loading" of the first call to step_1_template() in the HTML-file. 
// 	// // IMPORTANT NOTES:
// 	// // ================
// 	// // lableDraggabels();			// Label all the draggables... This has been moved inside step_1_template(), so that step_1_template() can be called from the HTML-file.
// 	// // step_1_template(0, 0, 1);	// KEYPROBLEM: "Fjendebilleder" This has been moved to the HTML file, so that each exercies has its own HTML file
// 	// // step_1_template(1, 0, 1);	// KEYPROBLEM: "Samfundsskabt ulighed" This has been moved to the HTML file, so that each exercies has its own HTML file
// 	// console.log('READY - jsonData: ' + JSON.stringify(jsonData, null, 4));
// 	// setEqualProblemFormulationTextHeight();
// 	// organizeCardPile('#cardPile',5, 10);
// 	// enable_audio();
// 	// window.dropZoneObj = null;


// 	$( ".card" ).draggable({
// 		revert: function(valid) {
// 		// ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
// 		// SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
//         if(valid) {
//             console.log("Dropped in a valid location");
//             correct_sound();
//         }
//         else {
//          console.log("Dropped in a invalid location");
//          	error_sound();
//         }
//         return !valid;
//     },
// 		start: function(event, ui) {
// 			console.log('card - START');
// 			window.topPos = $(this).css('top');
// 		},
// 		stop: function(event, ui) {
// 			console.log('card - STOP');

// 			if (dropZoneObj !== null){ // If student answer is correct...
// 				var dropId = $(dropZoneObj).prop('id');
// 				console.log('card - dropId: ' + dropId);

// 				$(dropZoneObj).append(SimpleClone($(this)).addClass("Clone"));  // Append the cloned card to dropzone
// 				$(this).remove();												// Remove the original card
// 				organizeCardPile('#'+dropId, 5, 0);
				
// 				// if (dropId == 'wasteBin') {
// 				// 	$('.glyphicons-bin').css({'opacity':'0'});
// 				// 	$( '.glyphicons-bin' ).animate({ opacity: 1}, 1000);
// 				// 	$( '#'+dropId+' .card' ).last().animate({ opacity: 0.40}, 1000);
// 				// } 

// 				dropZoneObj = null;  // Reset dropZoneObj...

// 				// console.log('card - CORRECT ');
// 				// correct_sound();                        
// 			} 
// 			else {  // If student answer is wrong...

// 				console.log('card - ERROR ');
// 				// error_sound();				// <------ Does not work on mobile devices - see the solution ATO found above. 
// 				$(this).css({'top': topPos});   // This is done to make Internet Explore 11 understand that it needs på place the card back to its original position.
// 			}

// 			if ($('#cardPile .card').length == 0) {
// 				console.log('step_2_template - INIT');
// 				step_2_template();
// 			}

// 		},
// 		drag: function(event, ui) {
// 			console.log('card - DRAG');
// 		}
// 	});
// 	$( "#dropZone_0" ).droppable({
// 		accept: ".problem_0",

// 		drop: function(event, ui) {
// 			console.log('card - DROP - problem_0');
// 			window.dropZoneObj = $(this);
// 		} 
// 	});
// 	$( "#dropZone_1" ).droppable({
// 		accept: ".problem_1",
// 		drop: function(event, ui) {
// 			console.log('card - DROP - problem_1');
// 			window.dropZoneObj = $(this);
// 		}  
// 	});
// 	$( "#wasteBin" ).droppable({
// 		accept: ".wasteBin",
// 		drop: function(event, ui) {
// 			console.log('card - DROP - wasteBin');
// 			window.dropZoneObj = $(this);
// 		}  
// 	});
// });


*/


//#########################################################################################################################
// 										NY KODE TIL SAMFUNDSFAG
//#########################################################################################################################


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
		// $(element).css({"position": "absolute", "top": String(margin+pcPosition.top)+'px', "left": String(margin+10)+'px', "z-index": index, "margin-top": marginTop+'%'});
		$(element).css({"position": "absolute", "top": String(margin+0)+'px', "left": String(margin+10)+'px', "z-index": index});
		
	}); 
}


// This function sets a id in each card which is used to id the card
function setCardId() {
	console.log('\nsetCardId - CALLED');
	var cardId = 0;
	for (var n in jsonData.category) {
		for (var k in jsonData.category[n].question) {
			jsonData.category[n].question[k].cardId = cardId;
			++cardId;
		}
	}
	console.log('setCardId - jsonData: ' + JSON.stringify(jsonData, null, 4));
}


function makeCardPile(categoryNum, randomize){

	var JD = jsonData.category[categoryNum];
	var questionObj = JD.question;

	console.log('questionObj 1: ' + JSON.stringify(questionObj, null, 4));

	questionObj = (randomize)? ShuffelArray(questionObj) : questionObj;  // This randomizes the questionObj array

	console.log('questionObj 2: ' + JSON.stringify(questionObj, null, 4));
	// console.log('questionObj 2: ' + JSON.stringify(subQuestions));

	var HTML = '';
	for (var n in questionObj) {
		// HTML += '<div id="card_'+n+'" class="card">'+draggableCardTypes(questionObj[n])+'</div>';
		// HTML += '<div id="card_'+n+'" class="card '+dropzoneAcceptance(questionObj[n])+'">'+draggableCardTypes(questionObj[n])+'</div>'; // COMMENTED OUT 30/11-2017
		HTML += '<div id="card_'+questionObj[n].cardId+'" class="card '+dropzoneAcceptance(questionObj[n])+'">'+draggableCardTypes(questionObj[n])+'</div>';    // ADDED 30/11-2017
		// if (n == 3) break;
	}
	return HTML;
}


function dropzoneAcceptance(qObj) {
	var HTML = '';
	// for (var n in qObj.correctDropzoneNum) {
	for (var i = 0; i < qObj.correctDropzoneNum.length; i++) {
		HTML += jsonData.dropzone[qObj.correctDropzoneNum[i]].attr.id + ((i+1 < qObj.correctDropzoneNum.length)? ' ': '' );
	}
	console.log('dropzoneAcceptance - HTML: ' + HTML);

	return HTML;
}


function setDropzoneEvents() {
	console.log('\nsetDropzoneEvents - CALLED');

	// for (var n in jsonData.dropzone) {
	for (var n = 1; n < jsonData.dropzone.length; n++) {
		console.log('setDropzoneEvents - n: ' + n);
		if (jsonData.dropzone[n].num == parseInt(n)){
			console.log('setDropzoneEvents - A0 - "."+jsonData.dropzone[n].attr.id: ' + "."+jsonData.dropzone[n].attr.id);
			$( "#"+jsonData.dropzone[n].attr.id ).droppable({
				accept: ("."+jsonData.dropzone[n].attr.id),
				drop: function(event, ui) {
					console.log('card - DROP - '+$(this).attr('id'));
					window.dropZoneObj = $(this);
					eObj.isCurrentDraggableDropped = true;
				},
				over: function( event, ui ) {
					console.log()
					window.dropZoneObj_over = $(this);
				}
			});
		} else {
			alert('"num" i jsonData.dropzone skal passe med den nul-indexeret position - dvs. "num": 0 på den første plads, "num": 1 på den anden plads osv.');
		}
	}
}


function draggableCardTypes(cObj) {
	console.log('\ndraggableCardTypes - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    switch (cObj.type) {
        case 'text':
            console.log('draggableCardTypes - A0');
            HTML += makeTextCard(cObj.text);
            break;
        case 'img':
            console.log('draggableCardTypes - A1');
            HTML += makeImgCard(cObj.img);
            break;
        case 'card':
            console.log('draggableCardTypes - A2');
            HTML += makeCard(cObj.card);
            break;
        default:
            console.log('draggableCardTypes - A3');
            // alert('ERROR');
    }

    return HTML;
}


function makeTextCard(cObj) {
    console.log('\nmakeTextCard - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    HTML += '<div ' + ((cObj.hasOwnProperty('attr')) ? generateAttrStr(cObj.attr) : '') + '>';
    HTML += 	(cObj.hasOwnProperty('text'))? cObj.text : '';
    HTML += '</div>';

    return HTML;
}


function makeImgCard(cObj) {
    console.log('\nmakeCard - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    HTML += '<div ' + ((cObj.hasOwnProperty('attr')) ? generateAttrStr(cObj.attr) : '') + '>';
    HTML += 	'<div class="imgContainer">';
    HTML += 		(cObj.hasOwnProperty('imgSrc') ? '<img class="img-responsive" src="' + cObj.imgSrc + '">' : '');
    HTML += 	'</div>';
    HTML += '</div>';

    return HTML;
}


function makeCard(cObj) {
    console.log('\nmakeCard - CALLED - cObj: ' + JSON.stringify(cObj));

    var HTML = '';
    HTML += '<div ' + ((cObj.hasOwnProperty('attr')) ? generateAttrStr(cObj.attr) : '') + '>';
    HTML += 	'<div class="imgContainer">';
    HTML += 		(cObj.hasOwnProperty('imgSrc') ? '<img class="img-responsive" src="' + cObj.imgSrc + '">' : '');
    HTML += 	'</div>';
    HTML += 	'<div class="objText">';
    HTML += 		((cObj.hasOwnProperty('header')) ? '<h4>' + cObj.header + '</h4>' : '');
    HTML += 		((cObj.hasOwnProperty('text')) ? '<p>' + cObj.text + '</p>' : '');
    HTML += 		((cObj.hasOwnProperty('btnText')) ? '<span class="btn_ghost btn_ghost_noStyle btn btn-primary">' + cObj.btnText + '</span>' : '');
    HTML += 		'<div class="Clear"></div>';
    HTML += 	'</div>';
    HTML += '</div>';

    return HTML;
}


function generateAttrStr(attrObj) {
    console.log('\ngenerateAttrStr - CALLED - attrObj: ' + JSON.stringify(attrObj));

    var HTML = '';
    var keyArr = Object.keys(attrObj);
    for (var n in keyArr) {
        if (typeof(attrObj[keyArr[n]]) !== 'undefined') {
            HTML += keyArr[n] + '="' + attrObj[keyArr[n]] + '" ';
        }
    }

    HTML = HTML.trim();
    console.log('generateAttrStr - HTML: _' + HTML + '_');

    return HTML;
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



function template() {

	var HTML = '';
	HTML += '<h1>'+jsonData.heading+'</h1>';
	HTML += (jsonData.hasOwnProperty('instruction') && (jsonData.instruction!==''))? instruction(jsonData.instruction) : '';
	HTML += (jsonData.hasOwnProperty('explanation') && (jsonData.explanation!==''))? explanation(jsonData.explanation) : '';
	HTML += '<div class="Clear"></div>';
	HTML += '<div id="cardContainer">';
	HTML += '</div>';

	// HTML += '<div id="dropzoneContainer">';
	// 	HTML += '<div class="cardzone">&nbsp;</div>';
	// 	for (var n in jsonData.dropzone) {
	// 		HTML += '<div id="'+jsonData.dropzone[n].id+'" class="dropzone">&nbsp;</div>';
	// 	}
	// HTML += '</div>';

	// jsonData.dropzone.unshift('<div class="cardzone">&nbsp;</div>');  // (#_1_#. See (#_2_#) below...

	var numOfEnlementsInRow = 2;
	// var numOfEnlementsInRow = 3;

	HTML += '<div id="dropzoneContainer">';
	console.log("template - jsonData.dropzone.length: "+jsonData.dropzone.length);
	
	var numOfRows = Math.ceil(jsonData.dropzone.length/numOfEnlementsInRow);
	var modulus = jsonData.dropzone.length%numOfEnlementsInRow;
	console.log("template - numOfRows: " + numOfRows + ", modulus: " + modulus);

	for (var n = 0; n < numOfRows; n++) {
		console.log("template - n : "+n);
		HTML += '<div class="dropzoneRow '+n+'">';
		// for (var k = n*numOfEnlementsInRow; k < n*numOfEnlementsInRow + numOfEnlementsInRow; k++) {
		for (var k = n*numOfEnlementsInRow; k < n*numOfEnlementsInRow + ((n+1 < numOfRows)? numOfEnlementsInRow : ((modulus == 0)? numOfEnlementsInRow : modulus)); k++) {
			console.log("template - k : "+k);
			if (k == 0) {
				// HTML += '<div id="cardPileWrap"><div '+generateAttrStr(jsonData.dropzone[k].attr)+'>'+makeCardPile(0, false)+' &nbsp; </div></div>';
				HTML += '<div id="cardPileWrap"><div '+generateAttrStr(jsonData.dropzone[k].attr)+'>'+makeCardPile(0, false)+' &nbsp; </div></div>';
			} else {
				HTML += '<div class="dropzoneWrap">';
				HTML += 	'<h4 class="dropzoneHeading">'+jsonData.dropzone[k].heading+'</h4>';
				// HTML += 	'<div '+generateAttrStr(jsonData.dropzone[k].attr)+'>&nbsp;</div>';
				HTML += 	'<div '+generateAttrStr(jsonData.dropzone[k].attr)+'> <span class="centerText">'+((jsonData.dropzone[k].hasOwnProperty('defaultText') && jsonData.dropzone[k].defaultText!='')? jsonData.dropzone[k].defaultText : '')+'</span></div>';
				HTML += '</div>';
			}
		}
		HTML += '</div>';
	}
	HTML += '</div>';


	console.log('template - HTML: ' + HTML);
	return HTML;
}


// PRECEDENS REGL: "induviduel feedback" > "generel feedback"
function giveFeedback(cardId, feedbackType) {
	console.log('\ngiveFeedback - CALLED - cardId: ' + cardId);

	var feedbackText = '';
	for (var n in jsonData.category) {
		for (var k in jsonData.category[n].question) {
			var TqObj = jsonData.category[n].question[k];
			if (cardId == TqObj.cardId) {
				if (TqObj.hasOwnProperty('feedback')) {
					if ((feedbackType == 'posetive') && (TqObj.feedback.hasOwnProperty('posetive'))) {
						feedbackText = TqObj.feedback.posetive;
					} else {

					}
					if ((feedbackType == 'negative') && (TqObj.feedback.hasOwnProperty('negative'))) {
						feedbackText = TqObj.feedback.negative;
					} 
				} 
			}
		}
	}
	console.log('setCardId - jsonData: ' + JSON.stringify(jsonData, null, 4));

}


function isDropZoneUnderDraggable(dropZoneArr, draggableId){

	// The following code calculates the midpoint of a draggable entity:
	// =================================================================
	var draggable_width = $('#'+draggableId).width();
	draggable_width += parseInt($('#'+draggableId).css('padding-left').replace('px', '')) + parseInt($('#'+draggableId).css('padding-right').replace('px', ''));
	// draggable_width += parseInt($('#'+draggableId).css('margin-left').replace('px', '')) + parseInt($('#'+draggableId).css('margin-right').replace('px', ''));  // <--- Margin commeted out since it is not visible, and therefore "oftsets" the calculated center towards the bottom!

	var draggable_height = $('#'+draggableId).height();
	draggable_height += parseInt($('#'+draggableId).css('padding-top').replace('px', '')) + parseInt($('#'+draggableId).css('padding-bottom').replace('px', ''));
	// draggable_height += parseInt($('#'+draggableId).css('margin-top').replace('px', '')) + parseInt($('#'+draggableId).css('margin-bottom').replace('px', ''));  // <--- Margin commeted out since it is not visible, and therefore "oftsets" the calculated center towards the bottom!
	console.log('isDropZoneUnderDraggable - draggable_width: ' + draggable_width + ', draggable_height: ' + draggable_height);

	console.log('isDropZoneUnderDraggable - draggableOffset: ' + JSON.stringify(eObj.draggableOffset));  // <----- NOTE: eObj.draggableOffset is set in the "drag" event below.
	var draggable_center_left = eObj.draggableOffset.left + draggable_width/2;   // <----- NOTE: eObj.draggableOffset is set in the "drag" event below.
	var draggable_center_top = eObj.draggableOffset.top + draggable_height/2;    // <----- NOTE: eObj.draggableOffset is set in the "drag" event below.
	console.log('isDropZoneUnderDraggable - draggable_center_left: ' + draggable_center_left + ', draggable_center_top: ' + draggable_center_top + ', text: ' + $('#'+draggableId).text());
	

	// The following code determines wether the dropped entity is inside or outside a dropzone:
	// ========================================================================================
	for (var n in dropZoneArr){
		var dropzone_pos = $(dropZoneArr[n]).offset();
		var dropzone_width = $(dropZoneArr[n]).width();
		var dropzone_height = $(dropZoneArr[n]).height();
		
		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - upperLeftCorner - left: ' + dropzone_pos.left + ', top: ' + dropzone_pos.top );
		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - lowerRightCorner - left: ' + String(dropzone_pos.left + dropzone_width) + ', top: ' +String(dropzone_pos.top + dropzone_height) );

		if ((dropzone_pos.left <= draggable_center_left) && (draggable_center_left <= dropzone_pos.left + dropzone_width) && 
			(dropzone_pos.top <= draggable_center_top) && (draggable_center_top <= dropzone_pos.top + dropzone_height)) {

			return {insideDropzone: true, dropZone: dropZoneArr[n], dropped: eObj.isCurrentDraggableDropped};
		} 
	}

	return {insideDropzone: false, dropZone: null, dropped: eObj.isCurrentDraggableDropped};
}


$(document).ready(function() {
	window.dropZoneObj = null;
	window.dropZoneObj_over = null;
	window.eObj = {
		// insideDropzone:  true/false  			// Tells if the draggable is inside at the time of the drop.
		// dropZone: id 							// The id of the dropzone.
		// isCurrentDraggableDropped: true/false 	// Tells if the draggable was dropped. 
	};
	setCardId();
	$('#interface').html(template());
	organizeCardPile('#cardPile',5, 10);
	setDropzoneEvents();
	enable_audio();

	$( ".card" ).draggable({
		revert: function(valid) {

			var id = $(this).attr('id');
			console.log('card - REVERT - id: ' + id);

			// var id = parseInt($(this).prop('id'));   // <------- MARK (#3a#) - IMPORTANT: This is beter than (#3b#)
			//console.log('setEventHandlers - revert - id: ' + id);

			var dropZoneArr = [];
			for (var n in jsonData.dropzone) {
				if (parseInt(n)!=0) {
					dropZoneArr.push(jsonData.dropzone[n].attr.id);
				}
			}
			console.log('card - REVERT - dropZoneArr: ' + dropZoneArr);

            var dropObj = isDropZoneUnderDraggable(dropZoneArr, id);
            console.log('card - REVERT - dropObj: ' + JSON.stringify(dropObj));

			// console.log('card - dropZoneObj_over: ' + JSON.stringify(dropZoneObj_over));

			// ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
			// SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
	        if(valid) {
	            console.log("Dropped in a valid location");
	            // correct_sound();
	        }
	        else {
	         console.log("Dropped in a invalid location");
	         	// error_sound();
	        }
	        return !valid;
	    },
		start: function(event, ui) {
			console.log('card - START');
			window.topPos = $(this).css('top');

			eObj.isCurrentDraggableDropped = false;
            eObj.idOfCurrentDraggable = $(this).prop('id');
		},
		stop: function(event, ui) {
			console.log('card - STOP');

			// console.log('card - dropZoneObj: ' + JSON.stringify(dropZoneObj));

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

				alert('RUN TEMPLATE 2');
				// step_2_template();
			}

		},
		drag: function(event, ui) {
			console.log('card - DRAG');

			var id = $(this).prop('id');
            var pos = $(this).position();
            var off = $(this).offset();
            console.log('entity - DRAG - id: ' + id + ', pos: ' + JSON.stringify(pos) + ', offset: ' + JSON.stringify(off));

            eObj.draggableOffset = off;

            eObj.draggablePos_end = $(this).offset();
		}
	});

});



