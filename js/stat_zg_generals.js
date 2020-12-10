/* stat_zg_generals.js (version 0.3 (2017.11.28)*/

require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		"libs": "libraries/",
		"urijs":"libraries/URI",
		"waitme":"libraries/waitme",
		"crossfilter": "libraries/crossfilter",
		"d3": "libraries/d3",
		"dc": "libraries/dc",
		"exceljs": "libraries/exceljs",
		"iframeresizer": "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.10/iframeResizer",
		"iframeresizer-contentwindow": "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.11/iframeResizer.contentWindow"
    },
    shim:{
		'crossfilter':{
			exports:'crossfilter'
		} 
    }
});

define(['urijs/URI','waitme/waitMe.min','d3','crossfilter','dc','libs/d3-tip','libs/FileSaver','exceljs','stat_zg_excelexportsimple','iframeresizer-contentwindow'], function (URI,waitMe,d3,crossfilter,dc,d3tip,FileSaver,ExcelJS,stat_zg_excelexportsimple,iFrameResizercontentWindow) {

	var stylesheets = ["/behoerden/gesundheitsdirektion/statistikfachstelle/daten/css/statistik.css",
	"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/libraries/waitme/waitMe.css"
	//"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/css/datatables.css"
	]
	var $head = $("head");
	for (var i = 0; i < stylesheets.length; i++) {
		$head.append("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + stylesheets[i] + "\">");
	}
		
	if (typeof Charts == 'undefined') { Charts = {} };
	if (typeof Atts == 'undefined') { Atts = {} };

	if (typeof Datasheets == 'undefined') { Datasheets = {} };
	if (typeof uri == 'undefined') { uri= new URI(window.location.href)};
	isolatecircle=0;

//Farben definieren
//generiert mit https://gka.github.io/palettes/#/19|d|007ac4,00a763,ffdd5e|ffdd5e,ff8a26,ff403a|1|1
colorscheme={
	1:{ //Bipolare Skala
		1:['#007ac4'],
		2:['#007ac4','#ff403a'],
		3:['#007ac4','#ffdd5e','#ff403a'],
		4:['#007ac4','#afc369','#ffb245','#ff403a'],
		5:['#007ac4','#8bb574','#ffdd5e','#ff9b3c','#ff403a'],
		6:['#007ac4','#76aa7c','#cece63','#ffc44e','#ff8e39','#ff403a'],
		7:['#007ac4','#68a484','#afc369','#ffdd5e','#ffb245','#ff8337','#ff403a'],
		8:['#007ac4','#5f9f89','#9abb6e','#dbd361','#ffcc53','#ffa640','#ff7b37','#ff403a'],
		9:['#007ac4','#579a8e','#8bb574','#c2ca65','#ffdd5e','#ffbe4b','#ff9b3c','#ff7536','#ff403a'],
		10:['#007ac4','#529892','#7eaf78','#afc369','#e4d560','#ffcf55','#ffb245','#ff933a','#ff7136','#ff403a'],
		11:['#007ac4','#4c9596','#76aa7c','#a0bd6d','#cece63','#ffdd5e','#ffc44e','#ffaa41','#ff8e39','#ff6d36','#ff403a'],
		12:['#007ac4','#499399','#6ea680','#94b970','#bcc866','#e8d760','#ffd156','#ffbb49','#ffa23f','#ff8738','#ff6936','#ff403a'],
		13:['#007ac4','#45919c','#68a484','#8bb574','#afc369','#d5d162','#ffdd5e','#ffc851','#ffb245','#ff9b3c','#ff8337','#ff6636','#ff403a'],
		14:['#007ac4','#438f9d','#62a187','#82b177','#a3bf6c','#c7cc64','#ebd75f','#ffd458','#ffc04c','#ffac42','#ff973b','#ff7f37','#ff6436','#ff403a'],
		15:['#007ac4','#3f8ea0','#5f9f89','#7cae7a','#9abb6e','#bac766','#dbd361','#ffdd5e','#ffcc53','#ffb948','#ffa640','#ff913a','#ff7b37','#ff6137','#ff403a'],
		16:['#007ac4','#3d8ca2','#5b9c8c','#76aa7c','#92b771','#afc369','#cece63','#efd95f','#ffd558','#ffc44e','#ffb245','#ffa03e','#ff8e39','#ff7836','#ff5f37','#ff403a'],
		17:['#007ac4','#3b8ca4','#579a8e','#70a87f','#8bb574','#a5c06b','#c2ca65','#e1d460','#ffdd5e','#ffcd54','#ffbe4b','#ffac43','#ff9b3c','#ff8938','#ff7536','#ff5d37','#ff403a'],
		18:['#007ac4','#398ba5','#549991','#6ca681','#84b276','#9dbd6d','#b7c767','#d4d162','#f0d95f','#ffd659','#ffc750','#ffb748','#ffa841','#ff973b','#ff8638','#ff7236','#ff5d37','#ff403a'],
		19:['#007ac4','#3789a7','#529892','#68a484','#7eaf78','#96ba70','#afc369','#c8cd64','#e4d560','#ffdd5e','#ffcf55','#ffc24d','#ffb245','#ffa43f','#ff933a','#ff8337','#ff7136','#ff5b37','#ff403a'],
		20:['#007ac4','#3789a7','#509693','#64a286','#7aad7a','#8fb772','#a7c06b','#bfc965','#d7d262','#f2da5f','#ffd65a','#ffca51','#ffbc4a','#ffae43','#ffa03e','#ff913a','#ff8037','#ff6f36','#ff5937','#ff403a']
		},
	2:{ //Sequenzielle Skala
		1:['#007ac4'],
		2:['#007ac4','#ffdd5e'],
		3:['#007ac4','#8bb574','#ffdd5e'],
		4:['#007ac4','#68a484','#afc369','#ffdd5e'],
		5:['#007ac4','#579a8e','#8bb574','#c2ca65','#ffdd5e'],
		6:['#007ac4','#4c9596','#76aa7c','#a0bd6d','#cece63','#ffdd5e'],
		7:['#007ac4','#45919c','#68a484','#8bb574','#afc369','#d5d162','#ffdd5e'],
		8:['#007ac4','#3f8ea0','#5f9f89','#7cae7a','#9abb6e','#bac766','#dbd361','#ffdd5e'],
		9:['#007ac4','#3b8ca4','#579a8e','#70a87f','#8bb574','#a5c06b','#c2ca65','#e1d460','#ffdd5e'],
		10:['#007ac4','#3789a7','#529892','#68a484','#7eaf78','#96ba70','#afc369','#c8cd64','#e4d560','#ffdd5e'],
		11:['#007ac4','#3589a9','#4c9596','#62a087','#76aa7c','#8bb574','#a0bd6d','#b7c767','#cece63','#e6d660','#ffdd5e'],
		12:['#007ac4','#3388aa','#499399','#5d9d8a','#6ea680','#81b077','#94b970','#a7c16b','#bcc866','#d1d062','#e8d760','#ffdd5e'],
		13:['#007ac4','#3186ac','#45919c','#579a8e','#68a484','#7aac7b','#8bb574','#9dbc6e','#afc369','#c2ca65','#d5d162','#ebd75f','#ffdd5e'],
		14:['#007ac4','#2e86ae','#438f9d','#549891','#62a187','#72a97e','#82b177','#92b871','#a3bf6c','#b4c568','#c7cc64','#d9d261','#ebd75f','#ffdd5e'],
		15:['#007ac4','#2c85b0','#3f8ea0','#509693','#5f9f89','#6ea680','#7cae7a','#8bb574','#9abb6e','#aac26a','#bac766','#cbcd63','#dbd361','#eed85f','#ffdd5e'],
		16:['#007ac4','#2a84b1','#3d8ca2','#4c9596','#5b9c8c','#68a484','#76aa7c','#84b276','#92b771','#a0bd6d','#afc369','#bec966','#cece63','#ded361','#efd95f','#ffdd5e'],
		17:['#007ac4','#2a83b1','#3b8ca4','#4a9397','#579a8e','#64a186','#70a87f','#7eae79','#8bb574','#99ba6f','#a5c06b','#b4c668','#c2ca65','#d1d062','#e1d460','#efd95f','#ffdd5e',],
		18:['#007ac4','#2783b3','#398ba5','#489299','#549991','#60a088','#6ca681','#78ac7b','#84b276','#91b771','#9dbd6d','#aac16a','#b7c767','#c5cc64','#d4d162','#e1d560','#f0d95f','#ffdd5e'],
		19:['#007ac4','#2783b3','#3789a7','#45919c','#529892','#5d9d8a','#68a484','#74a97d','#7eaf78','#8bb574','#96ba70','#a2be6c','#afc369','#bcc866','#c8cd64','#d5d162','#e4d560','#f1d95f','#ffdd5e'],
		20:['#007ac4','#2682b4','#3789a7','#43909d','#509693','#5b9c8c','#64a286','#70a87f','#7aad7a','#84b276','#8fb772','#9bbc6e','#a7c06b','#b2c568','#bfc965','#cbce63','#d7d262','#e4d660','#f2da5f','#ffdd5e']
		}
}

CDfarben=['#007AC4', '#FFDD5E', '#FF8A26', '#FF403A', '#502795', '#00A763', '#B0DA8E', '#D2CAC2', '#FECDDC', '#A7C0E0', '#80A9BD', '#F0BD85', '#B7B87B' ]

cantondic={'ZH':'Zürich', 'BE':'Bern', 'LU':'Luzern', 'UR':'Uri', 'SZ':'Schwyz', 'OW':'Obwalden', 'NW':'Nidwalden', 'GL':'Glarus', 'ZG':'Zug', 'FR':'Freiburg', 'SO':'Solothurn', 'BS':'Basel-Stadt', 'BL':'Basel-Landschaft',
'SH':'Schaffhausen', 'AR':'Appenzell Ausserrhoden', 'AI':'Appenzell Innerrhoden', 'SG':'St. Gallen', 'GR':'Graubünden', 'AG':'Aargau', 'TG':'Thurgau', 'TI':'Tessin', 'VD':'Waadt', 'VS':'Wallis', 'NE':'Neuenburg',
'GE':'Genf', 'JU':'Jura', 'CH': 'Schweiz'}

germanFormatters = d3.locale({
  "decimal": ".",
  "thousands": "'",
  "grouping": [3],
  "currency": ["CHF", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
});

d3.time.format = germanFormatters.timeFormat;

$( document ).ready(function() {
	setTimeout(function () {
		if (typeof uri.search(true)["isolate"] != "undefined" & isolatecircle==0) {
			isolateChart(uri.search(true)["isolate"]);
			isolatecircle=isolatecircle+1
		}
	}, 500);
});

function isolateChart(number) {
	$( document ).ready(function() {
		$('body > :not(#' + Atts[number].maincontainer+')').hide();
		$('#' + Atts[number].maincontainer ).parent().width(650).css('margin-left','20px');
		$('#' + Atts[number].maincontainer ).parent().appendTo('body');
		setTimeout(function () {
			$('#dropdowncontainer' + number ).remove();
		}, 300);
		$('body').css('background-color','transparent');
		//$('#d3-tip' + number ).remove();
	});
}

$( document ).ready(function() {
	setTimeout(function () {
		if (typeof uri.search(true)["embed"] != "undefined" & isolatecircle==0) {
			embedChart(uri.search(true)["embed"]);
			isolatecircle=isolatecircle+1
		}
	}, 500);
});

function embedChart(number) {
	$( document ).ready(function() {
		$('body > :not(#' + Atts[number].maincontainer+')').hide();
		$('#' + Atts[number].maincontainer ).parent().css('margin-left','0px');
		$('#' + Atts[number].maincontainer ).parent().appendTo('body');
		$('#d3-tip' + number ).show();
		/*setTimeout(function () {
			$('#dropdowncontainer' + number ).remove();
		}, 300);*/
		$('body').css('background-color','transparent');
		$(window).trigger('resize');
		//$('#d3-tip' + number ).remove();
	});
}

return {
	createcontainers: function (number) {
	//function createcontainers(number) {
		if ( $( "#default" + number + " > div.title" ).length === 0) {
			$("#default" + number).prepend( "<div id='title' class='title'></div>" );
		}
		if ( $( "#default" + number + " > div.subtitle" ).length === 0) {
			$("#default" + number + " > div.title").after( "<div id='subtitle' class='subtitle'></div>" );
		}
		if ( $( "#default" + number + " > div#chart" + number ).length === 0) {
			$("#default" + number + " > div.subtitle").after( "<div id='chart"+number+"'></div>" );
		}
		if ( $( "#default" + number + " > div.description" ).length === 0) {
			$("#default" + number + " > div#chart" + number +"").after( "<div id='description' class='description'></div>" );
		}
		if ( $( "#default" + number + " > div.source" ).length === 0) {
			$("#default" + number + " > div.description").after( "<div id='source' class='source'></div>" );
		}
	},

	treatmetadata: function(number, data, vertical, horizontal, values, datatypevertical) {
	
		Atts[number].meta = data.filter(function(el) {
			return el["Meta"] == 1
		});

		Atts[number].data = data.filter(function(el) {
			return el["Meta"] == "NA" | el["Meta"] == undefined
		});
		
		Atts[number].exportdata = Atts[number].data;
		
		//console.log(Atts[number].exportdata);

		Atts[number].title = Atts[number].meta.filter(function( el ) { return el.Type == "title";});
		if (Atts[number].title.length == 1) {
			$("#"+Atts[number].maincontainer+" #title").html(Atts[number].title[0].Content);
		}

		Atts[number].subtitle = Atts[number].meta.filter(function( el ) { return el.Type == "subtitle";});
		if (Atts[number].subtitle.length == 1) {
			$("#"+Atts[number].maincontainer+" #subtitle").html(Atts[number].subtitle[0].Content);
		}

		Atts[number].description = Atts[number].meta.filter(function( el ) { return el.Type == "description";});
		if (Atts[number].description.length == 1) {
			$("#"+Atts[number].maincontainer+" #description").html(Atts[number].description[0].Content);
		}

		Atts[number].source = Atts[number].meta.filter(function( el ) { return el.Type == "source";});
		if (Atts[number].source.length == 1) {
			$("#"+Atts[number].maincontainer+" #source").html("Quelle: "+Atts[number].source[0].Content);
		}
		
		Atts[number].typerow = Atts[number].meta.filter(function( el ) { return el.Type == "datatypes";});
		if (Atts[number].typerow.length == 1) {
			Atts[number].datatypes = (Atts[number].typerow[0].Content).split(/,\s?/);
		}
		//long to wide for threedimensional charts
		if(horizontal!=undefined & vertical!=undefined & values!=undefined ) {
			Atts[number].wide = d3.nest()
				.key(function(d) { return d[vertical] }) // sort by key
				.rollup(function(d) { 
					return d.reduce(function(prev, curr) {
						prev[vertical] = curr[vertical];
						prev[curr[horizontal]] = curr[values];
						return prev;
					}, {});
				})
				.entries(Atts[number].data) // tell it what data to process
				.map(function(d) { // pull out only the values
					return d.values;
				});
			
			verticalIndex=Object.keys(Atts[number].data[0]).indexOf(vertical)
			valuesIndex=Object.keys(Atts[number].data[0]).indexOf(values)
			
			Atts[number].datatypeswide = [Atts[number].datatypes[verticalIndex]]
			//Ersatz mit effektivem Spaltentyp, wenn vertikale Spalte generiert ist (Datum).
			if (Atts[number].datatypeswide[0]===undefined) Atts[number].datatypeswide=[Atts[number].datatypes[Object.keys(Atts[number].data[0]).indexOf(datatypevertical)]]
			for(i=1;i<Object.keys(Atts[number].wide[0]).length;i++) {
				if(Object.keys(Atts[number].wide[0])[i]!="Minus") {
					Atts[number].datatypeswide.push(Atts[number].datatypes[valuesIndex])
				}
			}
		}
		//console.log(Atts[number].wide);
	},

	wrap: function(text, width) {
		text.each(function() {
			var breakChars = ['&'],
			  text = d3.select(this),
			  textContent = text.text(),
			  spanContent;
			
			breakChars.forEach(function(char) {
			  // Add a space after each break char for the function to use to determine line breaks
			  textContent = textContent.replace(char, char + ' ');
			});

			var words = textContent.split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.2, // ems
				x = text.attr('x'),
				y = text.attr('y'),
				dy = parseFloat(text.attr('dy') || 0),
				tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(' '));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					spanContent = line.join(' ');
					breakChars.forEach(function(char) {
						// Remove spaces trailing breakChars that were added above
						spanContent = spanContent.replace(char + ' ', char);
					});
					tspan.text(spanContent);
					line = [word];
					tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
				}
			}
		});
	},

	copyStylesInline: function(destinationNode, sourceNode) {
		var containerElements = ["svg","g"];
		for (var cd = 0; cd < destinationNode.childNodes.length; cd++) {
			var child = destinationNode.childNodes[cd];
			if (containerElements.indexOf(child.tagName) != -1) {
				copyStylesInline(child, sourceNode.childNodes[cd]);
				continue;
			}
			var style = sourceNode.childNodes[cd].currentStyle || window.getComputedStyle(sourceNode.childNodes[cd]);
			if (style == "undefined" || style == null) continue;
			for (var st = 0; st < style.length; st++){
				if (!((style[st]=="height" | style[st]=="width") & style.getPropertyValue(style[st])== "auto")) {
					child.style.setProperty(style[st], style.getPropertyValue(style[st]));
				}
			}
		}
	},

	downloadSvg: function(svg, fileName, width, height) {
		var copy = svg.cloneNode(true);
		copyStylesInline(copy, svg);
		var canvas = document.createElement("canvas");
		var scale = 8
		canvas.width = width*scale;
		canvas.height = height*scale;
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, width*scale, height*scale);
		var data = (new XMLSerializer()).serializeToString(copy);
		var DOMURL = window.URL || window.webkitURL || window;
		var img = new Image();
		var svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
		var url = DOMURL.createObjectURL(svgBlob);
		img.onload = function () {
			ctx.drawImage(img, 0, 0, width*scale, height*scale);
			DOMURL.revokeObjectURL(url);
			if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob)
			{
				try {var blob = canvas.msToBlob();         
				navigator.msSaveOrOpenBlob(blob, fileName);}
				catch(err) {alert("Der Grafik-Export funktioniert in Internet Explorer durch Rechtsklick -> Bild speichern unter");} 
			} 
			else {
				//Original-Download-Funktion
				//var imgURI = canvas
				//    .toDataURL("image/png")
				//    .replace("image/png", "image/octet-stream");
				//triggerDownload(imgURI, fileName);
				canvas.toBlob( function(blob) {
					var filesize = Math.round( blob.length/1024 ) + ' KB';
					saveAs( blob, 'grafik.png' );
				});
			}
			//document.removeChild(canvas);
		};
		img.src = url;
	},

	addDownloadButton: function(number) {
	d3.select("#"+Atts[number].maincontainer+" dl").remove();
	
	// Set-up the export button
	d3.select('#'+Atts[number].maincontainer)
		.insert("dl", '#'+Atts[number].chartcontainer)
		.attr('class', 'dropdown-container actionMenu deactivated')
		.attr('id', 'dropdowncontainer'+number);
		//.attr('style', 'z-index:1000000000;');

	d3.select('#'+Atts[number].maincontainer+" dl")
		.append("dt")
		.attr('class', 'dropdown-button');	

	d3.select('#'+Atts[number].maincontainer+" dl dt")
		.append("a")
		.attr('id', 'dropdown-button'+number)
		.attr('href', 'javascript:;');
	
	var IE = (navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1) ? true : false;
	if ( IE ){ var bildquelle="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/download.png" } 
	else { var bildquelle='data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><path d="M452.5,285c15,0,27,12,27,27v147c0,15-12,27-27,27h-418c-15,0-28-12-28-27V312c0-15,13-27,28-27   s27,12,27,27v119h364V312C425.5,297,437.5,285,452.5,285z"/><path d="M224.5,346l-110-110c-11-11-11-27,0-38s27-11,38,0l64,63V27c0-15,12-27,27-27s27,12,27,27v234l63-63   c11-11,28-11,39,0s11,27,0,38l-110,110c-5,5-12,8-19,8S229.5,351,224.5,346z"/></svg>' } 
	
	d3.select('#'+Atts[number].maincontainer+" dl dt a")
		.append("img")
		.attr('id', 'downloadtools')
		.attr('alt', '>')
		.attr('src', bildquelle)
		.attr('width', '20')
		.attr('height', '20');
		
	d3.select('#'+Atts[number].maincontainer+" dl dt")
		.append("div")
		.attr('class', 'visualClear')
		.text(' ');
		
	d3.select('#'+Atts[number].maincontainer+" dl")
		.append("dd")
		.attr('class', 'actionMenuContent')
		.attr('id', 'actionMenu'+number)
		.attr('style', 'right:0; position:absolute;');	
		
	d3.select('#'+Atts[number].maincontainer+" dl dd")
		.append("ul");
	
	$("#dropdowncontainer"+number).on( "click", function(){
		$('#actionMenu'+number).toggle(0);
	});
	
/*	$("#dropdown-button"+number).click(function(){
		$('#actionMenu'+number).show(0);
	});*/
	
	$("#dropdowncontainer"+number).focusout(function(){
		setTimeout(function () { // needed because nothing has focus during 'focusout'
			$('#actionMenu'+number).hide(0);
		}, 250);
	});
	
/*	$("#dropdown-button"+number).parent().focusout(function(){
		setTimeout(function () { // needed because nothing has focus during 'focusout'
			$('#actionMenu'+number).hide(0);
		}, 250);
	});*/
	
},

	addDownloadButtonPngLegacy: function(number, patience) {
	
	var patience = (typeof patience == 'undefined') ? false : patience;
	
	d3.select('#'+Atts[number].maincontainer+" dl dd ul")
		.append("li")
		.attr('id', 'download-png-legacy');
		
	d3.select('#'+Atts[number].maincontainer+" dl dd ul li#download-png-legacy")
		.append("a")
		.attr('href', 'javascript:;')
		.on('click', function(){
			var IE = (navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1) ? true : false;
			if ( IE ){alert("Ihr Browser unterstützt diese Funktion nicht, Sie können die Grafik mit Rechtsklick -> 'Bild speichern unter' abspeichern."); } 
			else {			
				if (patience==true) {
					alert("Haben Sie etwas Geduld, die Produktion der Grafik dauer eine Weile.");
				}
				var width=$("#"+Atts[number].maincontainer+" svg").width()
				var height=$("#"+Atts[number].maincontainer+" svg").height()
				var svg=d3.select("#"+Atts[number].maincontainer+" svg")
				var svgString = svg.node();
				downloadSvg(svgString, "Grafik.png", width, height);
				
			}
		})
		.text('Als Grafik speichern');
		
},

	addDownloadButtonPng: function(number, patience) {
	
	var patience = (typeof patience == 'undefined') ? false : patience;
	
	ConversionDelay=3;
	if (patience==true){
		ConversionDelay=5;
	}
	
	function downloadPNG(urlToSend) {
		urlToCall='https://www.resmarti.ch/convertapi/converturltopng.php?link='+encodeURIComponent(urlToSend)+'&height='+Atts[number].Imageheight+'&delay='+ConversionDelay
		var req = new XMLHttpRequest();
		req.open("GET", urlToCall, true);
		req.responseType = "blob";
		req.onloadstart = function (event) {
			$('#'+Atts[number].maincontainer).waitMe({
				effect : 'bounce',
				text : '',
				bg : "rgba(255,255,255,0.7)",
				color : "#000",
				maxSize : '',
				waitTime : -1,
				textPos : 'vertical',
				fontSize : '',
				source : '',
				onClose : function() {}
			});
		};
		req.onloadend = function (event) {
			$('#'+Atts[number].maincontainer).waitMe("hide");
		};
		req.onabort = function (event) {
			$('#'+Atts[number].maincontainer).waitMe("hide");
		};
		req.onerror = function (event) {
			$('#'+Atts[number].maincontainer).waitMe("hide");
		};
		req.onload = function (event) {
			console.log("END");
			var blob = req.response;
			var fileName = "Grafik.png"
			var link=document.createElement('a');
			link.href=window.URL.createObjectURL(blob);
			link.download=fileName;
			link.click();
		};
		req.send();
	}
	
	d3.select('#'+Atts[number].maincontainer+" dl dd ul")
		.append("li")
		.attr('id', 'download-png');
		

	downloadurl=uri.path().replace('/web','')+'?isolate='+number
	
	d3.select('#'+Atts[number].maincontainer+" dl dd ul li#download-png")
		.append("a")
		.attr('href', 'javascript:;')
		.attr('rel', 'nofollow')
		.on('click', function(){
			uri.addSearch('isolate',number);
			downloadurl=uri.path().replace('/web','')+uri.search();
			$('#URL'+number).val(downloadurl);
			downloadPNG(downloadurl);
			uri.removeSearch('isolate');
			return false;	
		})
		.text('Als Grafik speichern');
		
	$( document ).ready(function() {
		setTimeout(function () {
			Atts[number].Imageheight=Math.round(document.getElementById(Atts[number].maincontainer).parentNode.getBoundingClientRect().height)+10;
			if ($('#' + Atts[number].maincontainer ).parent().children('h2').length){
				Atts[number].Imageheight=Atts[number].Imageheight+30;
			}
		}, 1000);
	});
		
},

	addDownloadButtonSourceData: function(number) {
	
	d3.select('#'+Atts[number].maincontainer+" dl dd ul")
		.append("li")
		.attr('id', 'download-source');
		
	d3.select('#'+Atts[number].maincontainer+" dl dd ul li#download-source")
		.append("a")
		.attr('href', Atts[number].csv_path)
		.text('Rohdaten der Grafik');
},

	addDownloadButtonPrintView: function(number) {
	
	d3.select('#'+Atts[number].maincontainer+" dl dd ul")
		.append("li")
		.attr('id', 'download-print');
		
	d3.select('#'+Atts[number].maincontainer+" dl dd ul li#download-print")
		.append("a")
		.attr('href', 'javascript:;')
		.on('click', function(){
			isolateChart(number);
		})
		.text('Druckansicht der Grafik');
},

	formater: function(type, value) {
	if (type=="string" || type=="year") {
		return value
	} 
	else if (type=="integer") {
		return germanFormatters.numberFormat(",f")(parseInt(value))
	}
	else if (type=="float") {
		return germanFormatters.numberFormat(",.1f")(parseFloat(value))
	}
	else if (type=="float2") {
		return germanFormatters.numberFormat(",.2f")(parseFloat(value))
	}
	else if (type=="float6") {
		return germanFormatters.numberFormat(",.6f")(parseFloat(value))
	}
	else if (type=="float2variable") {
		if (parseFloat(value) % 1) {var wert=germanFormatters.numberFormat(",.2f")(parseFloat(value))}
		else {wert=germanFormatters.numberFormat(",")(parseFloat(value))}
		return wert
	}
	else if (type=="percentage") {
		return d3.format('.1%')(value)
	}
	else if (type=="datemonthyear") {
		return d3.time.format("%B %Y")(new Date(value))
	}
	else if (type=="dateyear") {
		return d3.time.format("%Y")(new Date(value))
	}
	else if (type=="miochf") {
		return "" + germanFormatters.numberFormat(",f")(parseInt(value)) + " Mio Franken";
	}
	else if (type=="floatha") {
		//return "" + germanFormatters.numberFormat(",.1f")(parseFloat(value)) + " ha";
		return d3.format('.8f')(value) 
	}
}, 

//Function to add ExcelJS export button
	addDataTablesButton: function(number, columns, wide) {
		if (wide==undefined) {wide=false}
		d3.select('#'+Atts[number].maincontainer+" dl dd ul")
			.append("li")
			.attr('id', 'download-tables');		
		d3.select('#'+Atts[number].maincontainer+" dl dd ul li#download-tables")
			.append("a")
			.attr('href', 'javascript:;')
			.on('click', function(){
				stat_zg_excelexportsimple.createXLSXsimple (number, columns, wide)
			})
			.text('Daten herunterladen');
	},

//function to add DataTablesButton to Graphics
	addDataTablesButtonOriginal: function(number, columns) {

	d3.select('#'+Atts[number].maincontainer+" dl dd ul")
		.append("li")
		.attr('id', 'download-tables');
	
	d3.select('#'+Atts[number].maincontainer+" dl dd ul li#download-tables")
		.append("a")
		.attr('href', 'javascript:;')
		.on('click', function(){
			if ($(this).text()=="Daten anzeigen/herunterladen"){
				tabulate(number, columns);
				$(this).text("Daten verbergen");
			} else {
				d3.selectAll('#datatablecontainer'+number).remove();
				$(this).text("Daten anzeigen/herunterladen");
			}
		})
		.text('Daten anzeigen/herunterladen');
},

	tabulate: function(number, columns) {
	
	if (typeof Atts[number].datatypes=="undefined") {
		Atts[number].datatypes=[]
		for (var i = 0; i < columns.length; i++) {
		Atts[number].datatypes.push("string");
		}
	}
	
	var titel=$('#'+Atts[number].maincontainer+' #title').text();
	if (typeof Atts[number].title != 'undefined' && Atts[number].title[0].Content != "") {
		titel=Atts[number].title[0].Content
	};
	var subtitle="";
	if (typeof Atts[number].subtitle != 'undefined' && Atts[number].subtitle[0].Content != "") {
		subtitle=Atts[number].subtitle[0].Content
	};
	var source="";
	if (typeof Atts[number].source != 'undefined' && Atts[number].source[0].Content != "") {
		source="Quelle: " + Atts[number].source[0].Content
	};
		
	function generateFormating(column, typ) {
		this.render={
							"_": function ( data, type, row ) {
								return data;
							},
							"display": function ( data, type, row ) {
								return formater(typ, data);
							},
							"export": function ( data, type, row ) {
								return data;
							}
						}
		this.targets=column
	}
	
	var columnsfomats=[]
	
	for (var i = 0; i < columns.length; i++) {
		var columnformat=new generateFormating(i, Atts[number].datatypes[i])
		columnsfomats.push(columnformat);
	}
	
	$(document).ready(function(){
		setTimeout(function () {
			$('#datatable'+number).DataTable(
				{
				"info":true,
				"language": {
					"decimal":        ".",
					"emptyTable":     "Keine Daten in dieser Tabelle",
					"info":           "Zeige _START_ bis _END_ von _TOTAL_ Zeilen",
					"infoEmpty":      "Zeige 0 bis 0 von 0 Zeilen",
					"infoFiltered":   "(gefiltert von insgesamt _MAX_ Zeilen)",
					"infoPostFix":    "",
					"thousands":      "'",
					"lengthMenu":     "Zeige _MENU_ Zeilen",
					"loadingRecords": "Lädt...",
					"processing":     "Verarbeitet...",
					"search":         "Suche:",
					"zeroRecords":    "Keine Zeilen gefunden",
					"paginate": {
						"first":      "Erste",
						"last":       "Letzte",
						"next":       "Nächste",
						"previous":   "Vorherige"
					},
					"aria": {
						"sortAscending":  ": aktivieren um Spalte aufsteigend zu sortieren",
						"sortDescending": ": aktivieren um Spalte absteigend zu sortieren"
					}
				},
				'dom': 'Blfrtip',
				//'buttons': ['csv', 'excel'],
				"fnDrawCallback": function() {
					if (Math.ceil((this.fnSettings().fnRecordsDisplay()) / this.fnSettings()._iDisplayLength) > 1) {
						$('#datatable'+number+'_paginate.dataTables_paginate').css("display", "block"); 
					} else {
						$('#datatable'+number+'_paginate.dataTables_paginate').css("display", "none");
					}
					if (this.fnSettings().fnRecordsDisplay() > 10) {
						$('#datatable'+number+'_length.dataTables_length').css("display", "block");
					} else {
						$('#datatable'+number+'_length.dataTables_length').css("display", "none");
					}
					},
				"stateSave": true,
				/*"lengthMenu": [
					[ 10, 25, 50, -1 ],
					[ '10 rows', '25 rows', '50 rows', 'Show all' ]
				],
				"buttons": ['pageLength', 'csv', 'excel'],*/
				"buttons": [{
						extend: 'csv', 
						filename: titel,
						exportOptions: { orthogonal: 'export' }},
				//'csv', 
					{
						extend: 'excel', 
						footer: true,
						title: titel,
						messageTop: subtitle, 
						messageBottom: source,
						exportOptions: { orthogonal: 'export' }}
						],
				"colReorder": true,
				"columnDefs": columnsfomats
			});
		}, 200);
	});

	//Löschen, falls Tabelle schon existiert.
	d3.selectAll('#datatablecontainer'+number).remove();
	
	var container = d3.select("#"+Atts[number].maincontainer).append('div')
		.attr('id', 'datatablecontainer'+number)

	if (typeof Atts[number].title != 'undefined' && Atts[number].title[0].Content != "") {
		container.append('div')
			.attr('class', 'title')
			.html("Datentabelle: " + Atts[number].title[0].Content);
	} else {
		container.append('div')
			.attr('class', 'title')
			.html("Datentabelle");
	}

	if (typeof Atts[number].subtitle != 'undefined' && Atts[number].subtitle[0].Content != "") {
		container.append('div')
			.attr('class', 'subtitle')
			.html(Atts[number].subtitle[0].Content);
	}	

	var table = d3.select('#datatablecontainer'+number).append('table')
	var thead = table.append('thead')
	var	tbody = table.append('tbody')
	var tfoot = table.append('tfoot');

	table.attr('class', 'listing compact')
		.attr('id', 'datatable'+number);

	// append the header row
	thead.append('tr')
	  .selectAll('th')
	  .data(columns).enter()
	  .append('th')
		.html(function (column) { return column; });

	// create a row for each object in the data
	var rows = tbody.selectAll('tr')
	  .data(Atts[number].exportdata)
	  .enter()
	  .append('tr');

	// create a cell in each row for each column
	var cells = rows.selectAll('td')
	  .data(function (row) {
		return columns.map(function (column) {
		  return {column: column, value: row[column]};
		});
	  })
	  .enter()
	  .append('td')
		.text(function (d) { return d.value; })
	  .attr('style', function (d, i) {if (Atts[number].datatypes[i] == "string" || Atts[number].datatypes[i] == "year") {var alignment='text-align: left;'} else {var alignment='text-align: right;'}; return alignment; });

	if (typeof Atts[number].description != 'undefined' && Atts[number].description[0].Content != "") {
		container.append('div')
			.attr('class', 'description')
			.html(Atts[number].description[0].Content);
	}

	if (typeof Atts[number].source != 'undefined' && Atts[number].source[0].Content != "") {
		container.append('div')
			.attr('class', 'source')
			.html("Quelle: " + Atts[number].source[0].Content);
	}

	//create hidden footer for export
	if (typeof Atts[number].description != 'undefined' && Atts[number].description[0].Content != "") {
	tfoot.append('tr')
		.attr('style', 'display:none')
		.append('td')
		.attr('style', 'display:none')
		.html(Atts[number].description[0].Content);
	//add empty cell for each additional column
	var i=columns.length;
	while (i>1) {
		tfoot.selectAll('tr').append('td')
			.attr('style', 'display:none')
			.text("");
		i--;
		}
	}
			
  //return table;

}

}

});