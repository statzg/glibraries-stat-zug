/* stat_zg_general.js (version 0.3 (2017.11.28)*/

function loadbasics() {
	var stylesheets = ["/behoerden/baudirektion/statistikfachstelle/bibliotheken/css/statistik.css/download",
	"/behoerden/baudirektion/statistikfachstelle/bibliotheken/css/datatables.css/download"]
	var $head = $("head");
	for (var i = 0; i < stylesheets.length; i++) {
		$head.append("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + stylesheets[i] + "\">");
	}
	var basics = ["/behoerden/baudirektion/statistikfachstelle/bibliotheken/javascript/d3.js/download",
	"/behoerden/baudirektion/statistikfachstelle/bibliotheken/javascript/crossfilter.js/download",
	"/behoerden/baudirektion/statistikfachstelle/bibliotheken/javascript/dc.js/download",
	"/behoerden/baudirektion/statistikfachstelle/bibliotheken/javascript/d3-tip.js/download",
	"/behoerden/baudirektion/statistikfachstelle/bibliotheken/javascript/filesaver.js/download",
	"/behoerden/baudirektion/statistikfachstelle/bibliotheken/javascript/datatables.js/download"];
	var $head = $("head");
	for (var i = 0; i < basics.length; i++) {
		$head.append("<script src=\"" + basics[i] + "\"></scr" + "ipt>");
	}
}

loadbasics();

if (typeof Charts == 'undefined') { Charts = {} };
if (typeof Atts == 'undefined') { Atts = {} };

//Farben definieren
//generiert mit http://gka.github.io/palettes/#diverging|c0=007AC4,00A763,FFDD5E|c1=FFDD5E,FF8A26,FF403A|steps=19|bez0=1|bez1=1|coL0=1|coL1=1
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

function createcontainers(number) {
	if ( $( "#default" + number + " > div.title" ).length === 0) {
		$("#default" + number).prepend( "<div id='title' class='title'></div>" );
	}
	if ( $( "#default" + number + " > div.subtitle" ).length === 0) {
		$("#default" + number + " > div.title").after( "<div id='subtitle' class='subtitle'></div>" );
	}
	if ( $( "#default" + number + " > div.chart" ).length === 0) {
		$("#default" + number + " > div.subtitle").after( "<div id='chart"+number+"' class='subtitle'></div>" );
	}
	if ( $( "#default" + number + " > div.description" ).length === 0) {
		$("#default" + number + " > div.chart" + number +"").after( "<div id='description' class='description'></div>" );
	}
	if ( $( "#default" + number + " > div.subtitle" ).length === 0) {
		$("#default" + number + " > div.description").after( "<div id='description' class='description'></div>" );
	}
}

function treatmetadata(number, data) {
	
	Atts[number].meta = data.filter(function(el) {
		return el["Meta"] == 1
	});

	Atts[number].data = data.filter(function(el) {
		return el["Meta"] == "NA" | el["Meta"] == undefined
	});

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
}


function wrap (text, width) {
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
}

function copyStylesInline(destinationNode, sourceNode) {
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
}

/*function triggerDownload (imgURI, fileName) {
  var evt = new MouseEvent("click", {
    view: window,
    bubbles: false,
    cancelable: true
  });
  var a = document.createElement("a");
  a.setAttribute("download", fileName);
  a.setAttribute("href", imgURI);
  a.setAttribute("target", '_blank');
  a.dispatchEvent(evt);
}*/

function downloadSvg(svg, fileName, width, height) {
  var copy = svg.cloneNode(true);
  copyStylesInline(copy, svg);
  var canvas = document.createElement("canvas");
  var scale = 8
  canvas.width = width*scale;
  canvas.height = height*scale;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width*scale, height*scale);
  var data = (new XMLSerializer()).serializeToString(copy);
  //console.log(data);
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
}

function addDownloadButton(number) {
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
		
	d3.select('#'+Atts[number].maincontainer+" dl dt a")
		.append("img")
		.attr('id', 'downloadtools')
		.attr('alt', '>')
		.attr('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><path d="M452.5,285c15,0,27,12,27,27v147c0,15-12,27-27,27h-418c-15,0-28-12-28-27V312c0-15,13-27,28-27   s27,12,27,27v119h364V312C425.5,297,437.5,285,452.5,285z"/><path d="M224.5,346l-110-110c-11-11-11-27,0-38s27-11,38,0l64,63V27c0-15,12-27,27-27s27,12,27,27v234l63-63   c11-11,28-11,39,0s11,27,0,38l-110,110c-5,5-12,8-19,8S229.5,351,224.5,346z"/></svg>')
		//.attr('src', 'behoerden/baudirektion/statistikfachstelle/bibliotheken/grafiken/download.png/download')
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
	
	$("#dropdown-button"+number).focusin(function(){
		$('#actionMenu'+number).show(0);
	});
	
	$("#dropdown-button"+number).parent().focusout(function(){
		setTimeout(function () { // needed because nothing has focus during 'focusout'
			$('#actionMenu'+number).hide(0);
		}, 250);
	});
}

function addDownloadButtonPng(number) {
	
	d3.select('#'+Atts[number].maincontainer+" dl dd ul")
		.append("li")
		.attr('id', 'download-png');
		
	d3.select('#'+Atts[number].maincontainer+" dl dd ul li")
		.append("a")
		.attr('href', 'javascript:;')
		.on('click', function(){
			var width=$("#"+Atts[number].maincontainer+" svg").width()
			var height=$("#"+Atts[number].maincontainer+" svg").height()
			var svg=d3.select("#"+Atts[number].maincontainer+" svg")
			var svgString = svg.node();
			downloadSvg(svgString, "Grafik.png", width, height);
		})
		.text('Als Grafik speichern');
}

function addDataTablesButton(number, columns) {

	d3.select('#'+Atts[number].maincontainer+" dl dd ul")
		.append("li")
		.attr('id', 'download-png');
		
	d3.select('#'+Atts[number].maincontainer+" dl dd ul li")
		.append("a")
		.attr('href', 'javascript:;')
		.on('click', function(){
			if ($(this).text()=="Daten anzeigen/herunterladen"){
				tabulate(columns, number);
				$(this).text("Daten verbergen");
			} else {
				d3.selectAll('#datatablecontainer'+number).remove();
				$(this).text("Daten anzeigen/herunterladen");
			}
		})
		.text('Daten anzeigen/herunterladen');
}

function tabulate(columns, number) {
	
	var titel=$('title').text();
	if (Atts[number].title[0].Content != "") {
		titel=Atts[number].title[0].Content
	};
		
	
	$(document).ready(function(){
		setTimeout(function () {
			$('#datatable'+number).DataTable({
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
				"buttons": ['csv', 
					{
						extend: 'excel', 
						footer: true,
						title: titel,
						messageTop: Atts[number].subtitle[0].Content, 
						messageBottom: "Quelle: " + Atts[number].source[0].Content}],
				"colReorder": true,
			});
		}, 200);
	});

	//Löschen, falls Tabelle schon existiert.
	d3.selectAll('#datatablecontainer'+number).remove();
	
	var container = d3.select("#"+Atts[number].maincontainer).append('div')
		.attr('id', 'datatablecontainer'+number)

	if (Atts[number].title[0].Content != "") {
		container.append('div')
			.attr('class', 'title')
			.html("Datentabelle: " + Atts[number].title[0].Content);
	} else {
		container.append('div')
			.attr('class', 'title')
			.html("Datentabelle");
	}

	if (Atts[number].subtitle[0].Content != "") {
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
		.text(function (column) { return column; });

	// create a row for each object in the data
	var rows = tbody.selectAll('tr')
	  .data(Atts[number].data)
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
		.text(function (d) { return d.value; });

	if (Atts[number].description[0].Content != "") {
		container.append('div')
			.attr('class', 'description')
			.html(Atts[number].description[0].Content);
	}

	if (Atts[number].source[0].Content != "") {
		container.append('div')
			.attr('class', 'source')
			.html("Quelle: " + Atts[number].source[0].Content);
	}

	//create hidden footer for export
	if (Atts[number].description[0].Content != "") {
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