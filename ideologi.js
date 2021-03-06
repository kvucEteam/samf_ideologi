
//#########################################################################################################################
// 										NY KODE TIL SAMFUNDSFAG
//#########################################################################################################################

// MANGLER:
// 	- counter
// 	- visning af tekst
//  - Check kategorierne på cards at de er de rigtige!

// Tæller. Der skaber et reflektionspres? (3/30 spørgsmål) Tælle "fejl"? Første gang rigtigt? Graduerede point. Forsøg: 30 rigtige på 30 forsøg. 30 rigtige på 50 forsøg. 



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
		
		// $(element).css({"position": "absolute", "top": String(margin+0)+'px', "left": String(margin+10)+'px', "z-index": index});  	// COMMENTED OUT 04-12-2017
		// $(element).css({"position": "absolute", "top": String(margin+5)+'px', "left": String(margin+25)+'px', "z-index": index});		// ADDED 04-12-2017
		$(element).css({"position": "absolute", "top": String(margin+0)+'px', "left": String(margin+0)+'px', "z-index": index});		// ADDED 21-12-2017
		
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


// function makeCardPile(categoryNum, randomize){   // COMMENTED OUT d. 04-12-2017
function makeCardPile(){  							// ADDED d. 04-12-2017


	// var JD = jsonData.category[categoryNum];		// COMMENTED OUT d. 04-12-2017
	// var questionObj = JD.question;		 		// COMMENTED OUT d. 04-12-2017

	console.log('makeCardPile - jsonData.useQuestionsFromCategory: ' + jsonData.useQuestionsFromCategory);		// ADDED d. 04-12-2017
	var questionArr = [];   																					// ADDED d. 04-12-2017
	for (var n in jsonData.useQuestionsFromCategory) {
		questionArr = questionArr.concat(jsonData.category[jsonData.useQuestionsFromCategory[n]].question);
	}
	console.log('makeCardPile - questionArr: ' + JSON.stringify(questionArr, null, 4));							// ADDED d. 04-12-2017

	var questionObj = questionArr;																				// ADDED d. 04-12-2017


	console.log('makeCardPile - questionObj 1: ' + JSON.stringify(questionObj, null, 4));

	// questionObj = (randomize)? ShuffelArray(questionObj) : questionObj;  // This randomizes the questionObj array 				// COMMENTED OUT d. 04-12-2017
	questionObj = (jsonData.randomizeCards)? ShuffelArray(questionObj) : questionObj;  // This randomizes the questionObj array 	// ADDED d. 04-12-2017

	window.numOfQuestions = questionObj.length;

	console.log('makeCardPile - questionObj 2: ' + JSON.stringify(questionObj, null, 4));
	// console.log('questionObj 2: ' + JSON.stringify(subQuestions));

	var HTML = '';
	for (var n in questionObj) {
		// HTML += '<div id="card_'+n+'" class="card">'+draggableCardTypes(questionObj[n])+'</div>';
		// HTML += '<div id="card_'+n+'" class="card '+dropzoneAcceptance(questionObj[n])+'">'+draggableCardTypes(questionObj[n])+'</div>'; // COMMENTED OUT 30/11-2017
		HTML += '<div id="card_'+questionObj[n].cardId+'" class="card '+dropzoneAcceptance(questionObj[n])+'">'+showAnswer(questionObj[n])+draggableCardTypes(questionObj[n])+'</div>';    // ADDED 30/11-2017
		// if (n == 3) break;
	}
	return HTML;
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

// ((showAnswer_bool)? '<span class="answer">'++'</span>' : '')
function showAnswer(qObj) {
	var HTML = '';
	if (showAnswer_bool) {
		HTML += '<span class="answer"> ('; 
			for (var n in qObj.correctDropzoneNum) {
				HTML += jsonData.dropzone[qObj.correctDropzoneNum[n]].heading + ((parseInt(n)+1 < qObj.correctDropzoneNum.length)? ', ' : ')');
			}
		HTML += '</span>';
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
					console.log('droppable - over - ui.position.top: ' + ui.position.top + ', ui.position.left: ' + ui.position.left);
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
        'height': '83%', // <---- NEW
        'width': '80%',    // <---- NEW
        'top': '10%',
        'left': '10%'
    }); // This is necessary for cloning inside the droppable to work properly!!!
    // Clone = Clone.removeAttr("id").removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging"); // This just cleans the attributes so the DOM-element looks nicer.
    Clone = Clone.removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging"); // This just cleans the attributes so the DOM-element looks nicer.
    // Clone = Clone.addClass("Clone");
    return Clone;
}



function template() {

	var HTML = '';
	HTML += '<h1>'+jsonData.heading+'</h1>';
	// HTML += (jsonData.hasOwnProperty('instruction') && (jsonData.instruction!==''))? instruction(jsonData.instruction) : '';
	HTML += (jsonData.hasOwnProperty('instruction') && (jsonData.instruction!==''))? instruction_noLines(jsonData.instruction) : '';
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
				// HTML += '<div id="cardPileWrap"><div '+generateAttrStr(jsonData.dropzone[k].attr)+'>'+makeCardPile(0, false)+' &nbsp; </div></div>';  // COMMENTED OUT d. 04-12-2017
				HTML += '<div id="cardPileWrap"><div '+generateAttrStr(jsonData.dropzone[k].attr)+'>'+makeCardPile()+' &nbsp; </div></div>'; 	 // ADDED d. 04-12-2017
			} else {
				HTML += '<div class="dropzoneWrap">';
				HTML += 	'<h3'+((jsonData.dropzone[k].hasOwnProperty('headingId'))? ' id="'+jsonData.dropzone[k].headingId+'"' : '' )+' class="dropzoneHeading"><span class="labelColor">'+jsonData.dropzone[k].heading+'</span><span class="cardColor"></span></h3>';
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

function template2() {

	var windowHeight = $(window).height();				
	var dropzoneWrapHeight = $('.dropzoneWrap').height();	
	var dropzonePercentHeight = (dropzoneWrapHeight/windowHeight)*100;
	console.log('template2 - windowHeight: ' + windowHeight + ', dropzoneWrapHeight: ' + dropzoneWrapHeight + ', dropzonePercentHeight: ' + dropzonePercentHeight);

	$('#cardPile').append('<div id="microhint_target"> &nbsp; </div>');
	// microhint($('#microhint_target'), '<div class="microhint_label_success">Flot</div> Du kan nu læse sætningerne i deres oprindelige sammenhæng.', false, '#000');  
	// microhint($('#microhint_target'), '<div class="microhint_label_success">Flot</div> Du kan nu læse sætnigerne i deres oprindelige sammenhæng. Eller prøve opgaven én gang til.', false, '#000');
	$('.microhint').hide().fadeIn(600);

	$(".dropzone" ).each(function( index, element ) { 
	    $(element).fadeOut(600, function(){

	    	var btnText = jsonData.dropzone[index+1].view2_btnText;
	    	var btnRef = jsonData.dropzone[index+1].view2_btnRef;
	    	console.log('template2 - index: ' + index + ', btnText: ' + btnText);
	    	// $(element).after('<span class="centerBtn btn btn-info" data-btnRef="'+btnRef+'">'+btnText+'</span>');
	    	$(element).after('<div class="centerBtnText">Vil du læse de ideologiske sætninger i den sammenhæng, hvorfra de er taget?</div> <span class="centerBtn btn btn-primary" data-btnRef="'+btnRef+'">'+btnText+'</span>');
	    	$('.centerBtn').fadeIn(600);
	    	$(this).remove();

	    	// $('.dropzoneWrap').css({'height': dropzonePercentHeight+'%'});  // Procent virker ikke
	    	$('.dropzoneWrap').height(dropzoneWrapHeight);  // 
	    });
	});

	$('#cardPileWrap').html('<div class="dropzone dropzone_template2"><span id="tryAgain" class="btn btn-primary">Prøv igen</span></div>');
	microhint($('#tryAgain'), '<div class="microhint_label_success">Flot</div> Du kan nu læse sætningerne i deres oprindelige sammenhæng. Eller prøve opgaven én gang til.', false, '#000');

	window.ajustDropzoneHeight = true;;
}

// The content of this function is only active when the function "template2()""
function ajustDropzoneHeight_template2() {
	console.log('ajustDropzoneHeight_template2 - CALLED');

	if ((typeof(ajustDropzoneHeight)!=='undefined') && (typeof(runOnce)==='undefined')) {
		window.runOnce = true;
		window.dropzoneWrapHeight = $('.dropzoneWrap').height();
		window.dropzoneWrapWidth = $('.dropzoneWrap').width();
		window.dropzoneWrapRatio = dropzoneWrapHeight/dropzoneWrapWidth;
	}

	if (typeof(dropzoneWrapHeight)!=='undefined') {
		var TdropzoneWrapHeight = dropzoneWrapRatio*$('.dropzoneWrap').width();
		console.log('ajustDropzoneHeight_template2 - TdropzoneWrapHeight: ' + TdropzoneWrapHeight);
		$('.dropzoneWrap').height(TdropzoneWrapHeight);
	}
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

// This function is from "fys_symbol/symbol.js"
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
		// var dropzone_height = $(dropZoneArr[n]).height();     // COMMENTED OUT 04-12-2017 - For some strange reason, this does not work ...?
		var dropzone_height = parseInt($(dropZoneArr[n]).css( "height" ).replace('px', '')); // ADDED 04-12-2017 - This works...

		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - dropzone_width: ' + dropzone_width + ', dropzone_height: ' + dropzone_height );
		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - upperLeftCorner - left: ' + dropzone_pos.left + ', top: ' + dropzone_pos.top );
		console.log('isDropZoneUnderDraggable - '+dropZoneArr[n]+' - lowerRightCorner - left: ' + String(dropzone_pos.left + dropzone_width) + ', top: ' +String(dropzone_pos.top + dropzone_height) );

		if ((dropzone_pos.left <= draggable_center_left) && (draggable_center_left <= dropzone_pos.left + dropzone_width) && 
			(dropzone_pos.top <= draggable_center_top) && (draggable_center_top <= dropzone_pos.top + dropzone_height)) {

			return {insideDropzone: true, dropZone: dropZoneArr[n], dropped: eObj.isCurrentDraggableDropped};
		} 
	}

	return {insideDropzone: false, dropZone: null, dropped: eObj.isCurrentDraggableDropped};
}

function make_scoreCounter() {
	return '<div class="score_container_wrap"><div class="score_container"><span class="scoreText">Korrekte svar: </span><span class="QuestionCounter QuestionTask"><span class="success">0</span> ud af '+numOfQuestions+'</span> <span class="scoreText"> Forsøg: </span><span class="ErrorCount QuestionTask attempt">0</span></div><div class="Clear"></div></div>';
}


function update_scoreCounter(dObj) {
	
	console.log('update_scoreCounter - dObj 1: ' + JSON.stringify(dObj));
	if ((dObj.dropped)){
		console.log('update_scoreCounter - A0');
		++eObj.success;
		++eObj.attempt;
	}
	if ((dObj.insideDropzone) && (!dObj.dropped)) {
		console.log('update_scoreCounter - A1');
		++eObj.attempt;
	}
	console.log('update_scoreCounter - dObj 2: ' + JSON.stringify(dObj));

	$('.success').html(eObj.success);
	$('.attempt').html(eObj.attempt);
}


// HTML += 		'<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />';
// 	HTML += 		'<style type="text/css">';
// 	HTML += 			'body {font-family: OpenSans,Helvetica,Arial,sans-serif;}';


function wordTemplate(injectedHtml) {
	var HTML = '';
	HTML += '<!DOCTYPE html>';
	HTML += '<html>';
	HTML += 	'<head>';
	HTML += 	'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';  // Fixes issue with danish characters on Internet Explore 
	// HTML += 		'<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />';  // Dette virker ikke!
	HTML += 		'<style type="text/css">';
	HTML += 			'body {font-family: "Times New Roman", Times, serif;}';
	HTML += 			'p {font-size: 16px; margin-bottom: 5px}';
	HTML += 			'.textColor_social { background-color: #eabebe;}';
	HTML += 			'.textColor_konservativ {background-color: #afd1bc;}';
	HTML += 			'.textColor_liberal {background-color: #96b4cc;}';
	HTML += 			'.boldText {font-weight: 700;}';
	// HTML += 			'p {margin-bottom: 10px;}';
	HTML += 			'h2 {margin-bottom: 20px;}';
	HTML += 			'a {color: #05a0a8; font-weight: 400;}';
	HTML += 		'</style>';
	HTML += 	'</head>';
	HTML += 	'<body>';
	HTML += 	injectedHtml;
	HTML += 	'</body>';
	HTML += '</html>';
	// document.write(HTML);
	return HTML;
}

// ADDED 16/3-2018 - HTML-to-Word-conversion by PHP
// The btn #submit by input type="submit" has a diffrent CSS-style... therefore another btn .download is used and click on the #submit btn.
function download() {  
	var HTML = '';
	HTML += '<form action="htmlToWord.php" method="post">';
    HTML += 	'<input type="hidden" name="fileName" id="hiddenField" value="Debat" />';
    HTML += 	'<input id="html" type="hidden" name="html" id="hiddenField" />';
    HTML += 	'<input id="submit" type="submit" class="btn btn-info" value="Konverter" onclick="clearInterval(downloadTimer);">';  // <---- NOTE: The "downloadTimer" is cleared here!
    HTML += '</form>';
    // $('#interface').append(HTML);

    return HTML;
}

// ADDED 16/3-2018 - HTML-to-Word-conversion by PHP
// If this is not present, some browseres starts to download an empty htmlToWord.php file instead of the intended .docx file.
$( document ).on('click', '#submit', function(){  
    console.log('#submit - CLICKED - submit');
    $('#html').val(wordTemplate($('#politicalText').html()));
});

// ADDED 16/3-2018 - HTML-to-Word-conversion by PHP
// Some browsers need two clicks on the ".download" btn before the download starts. Therefore a timer is set to loop untill the variable "downloadTimer" is cleared.
// $( document ).on('click', '.download', function(){   
$( document ).on('click', '.download', function(){    
	console.log('.download - CLICKED - submit');
    window.Tcount = 0;
	window.downloadTimer = setInterval(function(){  // <---- NOTE: The "downloadTimer" is cleared inline in the input-tag "#submit"
		$('#submit').trigger('click');
		++Tcount;
		console.log('download - CLICKED - Tcount: ' + Tcount);
	}, 200);
});


// $(document).on('click touchend', ".centerBtn", function(event) {
// 	var btnRef = $(this).attr('data-btnRef');
// 	console.log('\ncenterBtn - CLICK - btnRef: ' + btnRef);
// 	$('.microhint').remove();
// 	// UserMsgBox("body", '<div id="userMsgBox_text"></div>');       // Steen ønsker at klik på userMsgBox ikke lukker userMsgBox'en.
// 	UserMsgBox_xclick("body", '<div id="userMsgBox_text"></div>');
// 	$('.MsgBox_bgr').hide().fadeIn(600);
// 	var HTML = $(btnRef).html();
// 	console.log('centerBtn - CLICK - HTML: ' + HTML);
// 	$('#userMsgBox_text').html($(btnRef).html());
// });

$(document).on('click touchend', ".centerBtn", function(event) {
	var btnRef = $(this).attr('data-btnRef');
	console.log('\ncenterBtn - CLICK - btnRef: ' + btnRef);
	$('.microhint').remove();
	// UserMsgBox("body", '<div id="userMsgBox_text"></div>');       // Steen ønsker at klik på userMsgBox ikke lukker userMsgBox'en.
	UserMsgBox_xclick("body", '<div id="userMsgBox_text"><div id="politicalText"></div><div class="download btn btn-primary">Download som Word</div>'+download()+'</div>');
	$('.MsgBox_bgr').hide().fadeIn(600);
	var HTML = $(btnRef).html();
	console.log('centerBtn - CLICK - HTML: ' + HTML);
	$('#politicalText').html($(btnRef).html());
});



$(document).on('click touchend', "#tryAgain", function(event) {
	location.reload();
});


function returnLastStudentSession() {
	window.osc = Object.create(objectStorageClass);
	osc.init('studentSession');
	osc.exist('jsonData');

	// var TjsonData = osc.load('jsonData');
	var TjsonData = osc.load('jsonData_samf_ideologi');
	console.log('returnLastStudentSession - TjsonData: ' + JSON.stringify(TjsonData));
	
	if ((TjsonData !== null) && (typeof(TjsonData) !== 'undefined')){
		console.log('returnLastStudentSession - getTimeStamp: ' + osc.getTimeStamp());
	// if (TjsonData !== null){
		var HTML = '';
		HTML += '<h4>OBS</h4> Du har lavet denne øvelse før og indtastet data allerede.';
		HTML += '<div> <span id="objectStorageClass_yes" class="objectStorageClass btn btn-info">Jeg vil fortsætte, hvor jeg slap</span> <span id="objectStorageClass_no" class="objectStorageClass btn btn-info">Jeg vil starte forfra</span> </div>';
		UserMsgBox("body", HTML);

		$('.CloseClass').remove(); // <---- removes the "X" in the UserMsgBox.
		$('.container-fluid').hide();  // Hide all program-content.

	    $('#UserMsgBox').unbind('click');
	    $('.MsgBox_bgr').unbind('click');

	    $( document ).on('click', "#objectStorageClass_yes", function(event){
	        console.log("objectStorageClass.init - objectStorageClass_yes - CLICK" );
	        $(".MsgBox_bgr").fadeOut(200, function() {
	            $(this).remove();
	            $('.container-fluid').fadeIn('slow');  // Fade in all program-content.
	        });
	       
	        // jsonData = TjsonData;
	        initQuiz();
	        setTimeout(function(){ 
	        	template2();
	        	$('.success').text(jsonData.category[0].question.length);
	        	$('.attempt').text(jsonData.category[0].question.length);
	        }, 200);
			
	    });

	    $( document ).on('click', "#objectStorageClass_no", function(event){
	    	// osc.stopAutoSave('test1');
	        console.log("objectStorageClass.init - objectStorageClass_no - CLICK" );
	        osc.delete(osc.localStorageObjName);
	        $(".MsgBox_bgr").fadeOut(200, function() {
	            $(this).remove();
	            $('.container-fluid').fadeIn('slow');  // Fade in all program-content.
	        });

	        initQuiz();
	    });
	} else {
		initQuiz();
	}
}


// IE 11 (edge) på windows 7 på KVUC havde problemer med anvendelse global regex med variabel search/replace i august 2017. 
// Derfor er denne funktion lavet uden global regex med variabel search/replace. 
function globalReplace(str, strSearch, strReplace) {
    console.log('wiki - globalReplace - str 1: ' + str);
    var pos = str.indexOf(strSearch);
    while (pos !== -1) {
        str = str.substring(0, pos) + strReplace + str.substring(pos+strSearch.length);
        pos = str.indexOf(strSearch, pos+strReplace.length);
    }
    console.log('wiki - globalReplace - str 2: ' + str);
}
var testStr = 'abcdefg_abcdefg_abcdefg';
globalReplace(testStr, 'abc', '123');



function initQuiz() {

	window.showAnswer_bool = false;		// if "true" the answers will be shown in each card.
	window.dropZoneObj = null;
	window.dropZoneObj_over = null;
	window.eObj = {
		success: 0, 
		attempt: 0 
	};
	setCardId();
	$('#interface').html(template());
	organizeCardPile('#cardPile',5, 10);
	setDropzoneEvents();
	enable_audio();

	$('#interface').append(make_scoreCounter());

	$( ".card" ).draggable({
		revert: function(valid) {

			var id = $(this).attr('id');
			console.log('card - REVERT - id: ' + id);

			// var id = parseInt($(this).prop('id'));   // <------- MARK (#3a#) - IMPORTANT: This is beter than (#3b#)
			//console.log('setEventHandlers - revert - id: ' + id);

			var dropZoneArr = [];
			for (var n in jsonData.dropzone) {
				if (parseInt(n)!=0) {
					dropZoneArr.push('#'+jsonData.dropzone[n].attr.id);
				}
			}
			console.log('card - REVERT - dropZoneArr: ' + JSON.stringify(dropZoneArr));

            var dropObj = isDropZoneUnderDraggable(dropZoneArr, id);
            console.log('card - REVERT - dropObj: ' + JSON.stringify(dropObj));

            update_scoreCounter(dropObj);

			// console.log('card - dropZoneObj_over: ' + JSON.stringify(dropZoneObj_over));

			// ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
			// SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
	        if(valid) {
	            console.log("Dropped in a valid location");
	            correct_sound();

	            // {insideDropzone: false, dropZone: null, dropped: eObj.isCurrentDraggableDropped};
	            // $('#'+id).css({'background-color': '#F00'});
	            var parent = $('#'+id).closest('.dropzoneHeading').prop('id'); //  css('background-color');
	            // var Tid = $('.dropzoneHeading', parent).prop('id');
	            console.log('card - REVERT - parent: ' + parent);
	            // $('#'+id).css();


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
				organizeCardPile('#'+dropId, 3, 0);
				
				// if (dropId == 'wasteBin') {
				// 	$('.glyphicons-bin').css({'opacity':'0'});
				// 	$( '.glyphicons-bin' ).animate({ opacity: 1}, 1000);
				// 	$( '#'+dropId+' .card' ).last().animate({ opacity: 0.40}, 1000);
				// } 

				var id = $(this).attr('id');
				var tag = dropZoneObj.prev();
				// var bgColor = $('span', tag).css('background-color');
				var bgColor = $('.cardColor', tag).css('background-color');
	            console.log('card - REVERT - bgColor: ' + bgColor);
	            $('#'+id).animate({'background-color': bgColor}, 500); 


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

				// alert('RUN TEMPLATE 2');
				setTimeout(function() {
					osc.save('jsonData_samf_ideologi', true);
					template2();
				}, 1000);
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

	// template2();


	$('#interface').after('<div id="log"></div>');

}



$(window).resize(function() {
	ajustDropzoneHeight_template2();
});


$(document).ready(function() {

	returnLastStudentSession();

	
	// window.showAnswer_bool = false;		// if "true" the answers will be shown in each card.
	// window.dropZoneObj = null;
	// window.dropZoneObj_over = null;
	// window.eObj = {
	// 	success: 0, 
	// 	attempt: 0 
	// };
	// setCardId();
	// $('#interface').html(template());
	// organizeCardPile('#cardPile',5, 10);
	// setDropzoneEvents();
	// enable_audio();

	// $('#interface').append(make_scoreCounter());

	// initQuiz();


	// $( ".card" ).draggable({
	// 	revert: function(valid) {

	// 		var id = $(this).attr('id');
	// 		console.log('card - REVERT - id: ' + id);

	// 		// var id = parseInt($(this).prop('id'));   // <------- MARK (#3a#) - IMPORTANT: This is beter than (#3b#)
	// 		//console.log('setEventHandlers - revert - id: ' + id);

	// 		var dropZoneArr = [];
	// 		for (var n in jsonData.dropzone) {
	// 			if (parseInt(n)!=0) {
	// 				dropZoneArr.push('#'+jsonData.dropzone[n].attr.id);
	// 			}
	// 		}
	// 		console.log('card - REVERT - dropZoneArr: ' + JSON.stringify(dropZoneArr));

 //            var dropObj = isDropZoneUnderDraggable(dropZoneArr, id);
 //            console.log('card - REVERT - dropObj: ' + JSON.stringify(dropObj));

 //            update_scoreCounter(dropObj);

	// 		// console.log('card - dropZoneObj_over: ' + JSON.stringify(dropZoneObj_over));

	// 		// ATO found the following if-else construct, that solves the error-sound issue. It is a good (but undocumented) way of triggering "events" on drop / not-drop.
	// 		// SEE:   http://jamesallardice.com/run-a-callback-function-when-a-jquery-ui-draggable-widget-reverts/
	//         if(valid) {
	//             console.log("Dropped in a valid location");
	//             correct_sound();

	//             // {insideDropzone: false, dropZone: null, dropped: eObj.isCurrentDraggableDropped};
	//             // $('#'+id).css({'background-color': '#F00'});
	//             var parent = $('#'+id).closest('.dropzoneHeading').prop('id'); //  css('background-color');
	//             // var Tid = $('.dropzoneHeading', parent).prop('id');
	//             console.log('card - REVERT - parent: ' + parent);
	//             // $('#'+id).css();


	//         }
	//         else {
	//          console.log("Dropped in a invalid location");
	//          	error_sound();
	//         }
	//         return !valid;
	//     },
	// 	start: function(event, ui) {
	// 		console.log('card - START');
	// 		window.topPos = $(this).css('top');

	// 		eObj.isCurrentDraggableDropped = false;
 //            eObj.idOfCurrentDraggable = $(this).prop('id');
	// 	},
	// 	stop: function(event, ui) {
	// 		console.log('card - STOP');

	// 		// console.log('card - dropZoneObj: ' + JSON.stringify(dropZoneObj));

	// 		if (dropZoneObj !== null){ // If student answer is correct...
	// 			var dropId = $(dropZoneObj).prop('id');
	// 			console.log('card - dropId: ' + dropId);

	// 			$(dropZoneObj).append(SimpleClone($(this)).addClass("Clone"));  // Append the cloned card to dropzone
	// 			$(this).remove();												// Remove the original card
	// 			organizeCardPile('#'+dropId, 3, 0);
				
	// 			// if (dropId == 'wasteBin') {
	// 			// 	$('.glyphicons-bin').css({'opacity':'0'});
	// 			// 	$( '.glyphicons-bin' ).animate({ opacity: 1}, 1000);
	// 			// 	$( '#'+dropId+' .card' ).last().animate({ opacity: 0.40}, 1000);
	// 			// } 

	// 			var id = $(this).attr('id');
	// 			var tag = dropZoneObj.prev();
	// 			// var bgColor = $('span', tag).css('background-color');
	// 			var bgColor = $('.cardColor', tag).css('background-color');
	//             console.log('card - REVERT - bgColor: ' + bgColor);
	//             $('#'+id).animate({'background-color': bgColor}, 500); 


	// 			dropZoneObj = null;  // Reset dropZoneObj...

	// 			// console.log('card - CORRECT ');
	// 			// correct_sound(); 


	// 		} 
	// 		else {  // If student answer is wrong...

	// 			console.log('card - ERROR ');
	// 			// error_sound();				// <------ Does not work on mobile devices - see the solution ATO found above. 
	// 			$(this).css({'top': topPos});   // This is done to make Internet Explore 11 understand that it needs på place the card back to its original position.
	// 		}

	// 		if ($('#cardPile .card').length == 0) {
	// 			console.log('step_2_template - INIT');

	// 			// alert('RUN TEMPLATE 2');
	// 			setTimeout(function() {
	// 				osc.save('jsonData_samf_ideologi', true);
	// 				template2();
	// 			}, 1000);
	// 		}

	// 	},
	// 	drag: function(event, ui) {
	// 		console.log('card - DRAG');

	// 		var id = $(this).prop('id');
 //            var pos = $(this).position();
 //            var off = $(this).offset();
 //            console.log('entity - DRAG - id: ' + id + ', pos: ' + JSON.stringify(pos) + ', offset: ' + JSON.stringify(off));

 //            eObj.draggableOffset = off;

 //            eObj.draggablePos_end = $(this).offset();
	// 	}
	// });

	// // template2();


	// $('#interface').after('<div id="log"></div>');

});



