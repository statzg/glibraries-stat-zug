/* stat_zg_semipie.js (version 0.3 (2017.11.28)*/

function getLegendWidth(number) {
	var legendLength = d3.select("#chart"+number+" g.dc-legend").node().childElementCount;
	var legendWidthArray = [];
	for (i=0; i < legendLength-1; i++) {
		var j=i+1;
		var item = "#chart"+number+" g.dc-legend-item:nth-of-type("+j+")";
		legendWidthArray[i]=d3.select(item).node().getBBox().width;
	};
	legendMaxWidth = Math.max.apply(null, legendWidthArray);
}

function loadSemiPie(args) {
var number = (typeof args.number == 'undefined') ? 1 : args.number;
var csv_path = (typeof args.csv_path == 'undefined') ? "error" : args.csv_path;
var dimension = (typeof args.dimension == 'undefined') ? "" : args.dimension;
var group = (typeof args.group == 'undefined') ? "" : args.group;
var characteristics = (typeof args.characteristics == 'undefined') ? [] : args.characteristics;
//var stack = (typeof args.stack == 'undefined') ? "" : args.stack
//var characteristicsStack = (typeof args.characteristicsStack == 'undefined') ? [] : args.characteristicsStack;
var scale = (typeof args.scale == 'undefined') ? 1 : args.scale;
//var relative = (typeof args.relative == 'undefined') ? false : args.relative;
var showTotal = (typeof args.showTotal == 'undefined') ? true : args.showTotal;
var showAnteil = (typeof args.showAnteil == 'undefined') ? true : args.showAnteil;
//var showArea = (typeof args.showArea== 'undefined') ? true : args.showArea;
//var asDate = (typeof args.asDate == 'undefined') ? true : args.asDate;
//var dateUnit = (typeof args.dateUnit == 'undefined') ? "month" : args.dateUnit;
var order = (typeof args.order == 'undefined') ? "alpha" : args.order;
var last = (typeof args.last == 'undefined') ? "" : args.last;
var partei = (typeof args.partei == 'undefined') ? false : args.partei;
//var highlight = (typeof args.highlight == 'undefined') ? {} : args.highlight;

//Attributeobjekt initialisieren
Atts[number]={};

Atts[number].maincontainer="default"+number
Atts[number].chartcontainer="chart"+number

//Container erstellen, falls diese noch nicht existieren (den Hauptcontainer braucht es unweigerlich)
createcontainers(number);

//Breite des Containers ermitteln
var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
totalHeight = 300;

//Charttyp dem Container zuweisen
Charts[number] = dc.pieChart("#"+Atts[number].chartcontainer);

//Daten einlesen
var daten = d3.csv(csv_path, function (error, data) {
	
var dataValues = d3.values(data)[0];
if (dimension == undefined | dimension=="") {dimension = Object.keys(dataValues)[0];};
if (group == undefined | group=="") {group = Object.keys(dataValues)[1];};
	
	data.forEach(function(d) {
		d[group] = +d[group];
	});

treatmetadata(number, data);

Atts[number].dataplustotal = data.filter(function(el) {
	return el["Meta"] == "NA" | el["Meta"] == undefined
});

total=0;
for (k = 0; k < Atts[number].data.length; k++) {
	total=total+Atts[number].data[k][group]
};

ZTotal={}
ZTotal[dimension] = "ZTotal";
ZTotal[group] = total;
ZTotal["Meta"] = "NA";
ZTotal["Type"] = "NA";
ZTotal["Content"] = "NA";

Atts[number].dataplustotal.push(ZTotal)

//Daten an Crossfilter übergeben
Atts[number].dataset = crossfilter(Atts[number].dataplustotal),
	Atts[number].maindimension = Atts[number].dataset.dimension(function (d) {
		return d[dimension];
    }),
    Atts[number].maingroup = Atts[number].maindimension.group().reduceSum(function (d) {
        return d[group];
    });
	
function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
//Ausprägungen in Array abfüllen, wenn nicht manuell definiert (für Farbzuweisung)
if (typeof characteristics === 'undefined' || characteristics.length==0) {
	characteristics = [];
	if (order=="desc"){
	Atts[number].maingroup.all().sort(function(a,b) {return (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0);} ).forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
	else if (order=="asc"){
	Atts[number].maingroup.all().sort(function(a,b) {return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);} ).forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
	else {
		Atts[number].maingroup.all().forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
}

if (last!=="") {
	characteristics.splice(characteristics.indexOf(last),1)
	characteristics.splice(characteristics.length,0,last)
}

characteristics.splice(characteristics.indexOf("ZTotal"),1)
characteristics.splice(characteristics.length,0,"ZTotal")

var characteristicsLength= characteristics.length;

if (partei==true) {
	parteien=["Parteilos","ALG", "SP", "CSP", "GLP", "CVP", "FDP", "SVP"]
	var farben=['#ff6d36','#76aa7c','#ff403a','#ffdd5e','#a0bd6d','#ff8e39','#007ac4','#4c9596']
	colorScale = d3.scale.ordinal()
				.domain(parteien)
				.range(farben);
}
else {
	var farben=colorscheme[scale][characteristicsLength]
	colorScale = d3.scale.ordinal()
				.domain(characteristics)
				.range(colorscheme[scale][characteristicsLength]);
}
				
Charts[number].width(totalWidth)
	.cx(totalWidth/2)
    .cy((totalHeight)-30)
	.height(totalHeight)
    .slicesCap(15)
    .dimension(Atts[number].maindimension)
    .group(Atts[number].maingroup)
	.controlsUseVisibility(true)
	.externalRadiusPadding(-(totalHeight/2)+30)
	.emptyTitle("Keine Daten vorhanden")
	.innerRadius(40)
	.colors(colorScale)
	.transitionDuration(1500)
	.title(function(d) {
		return ""; 
	})
	.ordering(function(d) { return characteristics.indexOf(d.key); })
	;

/*if (order="desc") {
Charts[number].asc.*/
	
Charts[number].filter = function() {};

Atts[number].counter=0;

//Legende iniziieren	
Charts[number].legend(dc.legend().x(10).y(10).itemHeight(13).gap(10)
	.horizontal(false));
	
//Wenn Chart geladen
Charts[number].on('renderlet', function(chart){
	//Labels mit Prozentzahlen ersetzen
	chart.selectAll('text.pie-slice').text( function(d) {
		if (dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) > 2) {
			return d.value;
		};
	});
	chart.selectAll('text.pie-slice')
        .attr('transform', function(d) {
            var translate = d3.select(this).attr('transform');
            return translate + ' rotate(90)';
        });
	getLegendWidth(number);
	pieWidth = d3.select("#"+Atts[number].chartcontainer+" g:nth-child(1)").node().getBBox().width;	
	if (Atts[number].counter==0) {
		if (totalWidth<pieWidth + (2 * legendMaxWidth) + 20) {
			Charts[number].legend(dc.legend().x(10).y(280).itemHeight(13).gap(10)
				.horizontal(true)
				.legendWidth(totalWidth-10)
				.autoItemWidth(true)
				//.itemWidth(100)
				)
				.height(340)
				.externalRadiusPadding(40);
			Charts[number].redraw();
		};
		var legendHorizontal = Charts[number].legend().horizontal();
		if (legendHorizontal==true){
			var legendHeight = d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().getBBox().height;
			Charts[number].height(totalHeight+legendHeight-10)
				.externalRadiusPadding(-(totalHeight/2)+30+(legendHeight/2));
			Charts[number].redraw();
		}
		if (totalWidth<pieWidth) {
			Charts[number].externalRadiusPadding(-(totalHeight/2)+50+((pieWidth-totalWidth)/2));
			Charts[number].redraw();
		}
		
	Atts[number].counter=1;
	$("#"+Atts[number].chartcontainer+" g.dc-legend-item:nth-child("+(indexlast+1)+")").hide();
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);

	}
});

Charts[number].render()

function initTip(number){
	last_tip = null;
	Atts[number].tips = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction('n')
		.offset([10, 0])
		.html(function(d) {
			if (typeof showTotal !== 'undefined' && showTotal==true) {
				return "<span>" + d.data.key + "</span><br/>Anteil: " + d3.format(".1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + "</span><br/><span>"+group+": " +d3.format(",.d")(d.data.value) + "</span>";
			}
			else {
				return "<span>" + d.data.key + "</span><br/>Anteil: " + d3.format(".1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + '%' + "</span>";
			}
		});
	$(".pie-label").css( 'pointer-events', 'none' );
}

function callTip(number){
	d3.selectAll("#"+Atts[number].chartcontainer+" g.pie-slice, #"+Atts[number].chartcontainer+" text.pie-slice")
		.call(Atts[number].tips)
		.on('mouseover', function(d, l) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d, $("#"+Atts[number].chartcontainer+" .pie-slice")[characteristics.indexOf(d.data.key)]);
				last_tip = d.key;
			}
			$(".d3-tip").css("border-left", farben[l]+" solid 5px");
			var item = "#chart"+number+" g.pie-slice:nth-of-type("+(l+1)+")";
			offsetx=Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + d3.select(item).node().getBBox().height/2;
			offsety=Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) - d3.select(item).node().getBBox().width/2;
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Atts[number].tips.hide(d);
		});
}

initTip(number);

callTip(number);

function disableClick(number) {
	//Click-Event ausschalten
	d3.selectAll("#"+Atts[number].chartcontainer+" g.pie-slice > path").on('click',null);
    d3.selectAll("#"+Atts[number].chartcontainer+" g.pie-slice > path").on("click", function() { 
	});
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on('click',null);
    d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on("click", function() { 
	});
}

disableClick(number);

$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
$("#"+Atts[number].chartcontainer+" g.pie-slice-group").attr('transform', 'translate(0 0) rotate(270)');
$("#"+Atts[number].chartcontainer+" g.pie-label-group").attr('transform', 'translate(0 0) rotate(270)');
var indexlast=characteristicsLength-1
$("#"+Atts[number].chartcontainer+" g.pie-slice._"+indexlast).hide();
$("#"+Atts[number].chartcontainer+" text.pie-slice.pie-label._"+indexlast).hide();
$("#"+Atts[number].chartcontainer+" g.dc-legend-item:nth-child("+(indexlast+1)+")").hide();

function resizePie(number) {
	//Breite des Hauptcontainers einlesen
	var newWidth = document.getElementById("default"+number).offsetWidth;
	var pieWidth = d3.select("#"+Atts[number].chartcontainer+" g:nth-child(1)").node().getBBox().width;	
	var legendHorizontal = Charts[number].legend().horizontal();
	Charts[number].width(newWidth)
		.cx(newWidth/2)
		.transitionDuration(0);
	getLegendWidth(number);
	if (newWidth<pieWidth + (2 * legendMaxWidth) + 20){
		Charts[number].legend(dc.legend().x(10).y(280).itemHeight(13).gap(10)
			.horizontal(true)
			.legendWidth(newWidth-10)
			.autoItemWidth(true)
			//.itemWidth(100)
			)
			.height(340)
			.externalRadiusPadding(40);
	}
	else{
		Charts[number].legend(dc.legend().x(10).y(10).itemHeight(13).gap(10)
			.horizontal(false));
	}
	Charts[number].render()
	var legendHorizontal = Charts[number].legend().horizontal();
	if (legendHorizontal==true){
		var legendHeight = d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().getBBox().height;
		Charts[number].height(totalHeight+legendHeight-10)
			.externalRadiusPadding(-(totalHeight/2)+30+(legendHeight/2));
	}
	else {
		Charts[number].height(totalHeight)
			.externalRadiusPadding(-(totalHeight/2)+30);
	}
	if (newWidth<pieWidth) {
		Charts[number].externalRadiusPadding(-(totalHeight/2)+50+((pieWidth-newWidth)/2));
	}
	Charts[number].render()
	
	callTip(number);

	$("#"+Atts[number].chartcontainer+" g.pie-slice-group").attr('transform', 'translate(0 0) rotate(270)');
	$("#"+Atts[number].chartcontainer+" g.pie-label-group").attr('transform', 'translate(0 0) rotate(270)');
	$("#"+Atts[number].chartcontainer+" g.pie-slice._"+indexlast).hide();
	$("#"+Atts[number].chartcontainer+" text.pie-slice.pie-label._"+indexlast).hide();
	$("#"+Atts[number].chartcontainer+" g.dc-legend-item:nth-child("+(indexlast+1)+")").hide();
	
	disableClick(number);

	Charts[number].transitionDuration(1500);
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
}

$(window).resize(function(){resizePie(number)})

});

var columns=[dimension, group]									 
addDownloadButton(number);
addDownloadButtonPng(number)
addDataTablesButton(number, columns)

}