﻿/* stat_zg_stackedbar.js (version 0.2 (2017.07.19)*/

function loadBar(number, csv_path, dimension, group, characteristics, scale, relative, showTotal, showAnteil, order, last) {
order = typeof order !== 'undefined' ? order : "alpha";
last = typeof last !== 'undefined' ? last : "";

var maincontainer="default"+number
var chartcontainer="chart"+number

//Breite des Containers ermitteln
var totalWidth = document.getElementById(maincontainer).offsetWidth;
var totalHeight = 320

//Charttyp dem Container zuweisen
Charts[number] = dc.barChart("#"+chartcontainer);

//Daten einlesen
var daten = d3.csv(csv_path, function(error, data) {
	data.forEach(function(x) {
		x[group] = +x[group];
	});
	
meta = data.filter(function(el) {
	return el["Meta"] == 1
});
	
data = data.filter(function(el) {
	return el["Meta"] == "NA" | el["Meta"] == undefined
});

title = meta.filter(function( el ) { return el.Type == "title";});
if (title.length == 1) {
$("#"+maincontainer+" #title").html(title[0].Content);
}

subtitle = meta.filter(function( el ) { return el.Type == "subtitle";});
if (subtitle.length == 1) {
$("#"+maincontainer+" #subtitle").html(subtitle[0].Content);
}

description = meta.filter(function( el ) { return el.Type == "description";});
if (description.length == 1) {
$("#"+maincontainer+" #description").html(description[0].Content);
}

source = meta.filter(function( el ) { return el.Type == "source";});
if (source.length == 1) {
$("#"+maincontainer+" #source").html("Quelle: "+source[0].Content);
}
	
Datasets[number] = crossfilter(data),
	MainDimensions[number] = Datasets[number].dimension(function (d) {
		return d[dimension];
	}),
	MainGroups[number] = MainDimensions[number].group().reduceSum(function (d) {
		return d[group];
	});	
	SecondaryGroups[number]={};
	SecondaryGroups[number]["Total"] = Datasets[number].groupAll().reduceSum(function (d) {
        return d[group];
    });

//Ausprägungen in Array abfüllen, wenn nicht manuell definiert (für Farbzuweisung)
if (typeof characteristics === 'undefined' || characteristics.length==0) {
	characteristics = [];
	if (order=="desc"){
	MainGroups[number].all().sort(function(a,b) {return (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0);} ).forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
	else if (order=="asc"){
	MainGroups[number].all().sort(function(a,b) {return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);} ).forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
	else {
		MainGroups[number].all().forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
}
var characteristicsLength= characteristics.length;

if (last!=="") {
	characteristics.splice(characteristics.indexOf(last),1)
	characteristics.splice(characteristics.length,0,last)
}

var colorScale = d3.scale.ordinal()
            .domain(characteristics)
            .range(colorscheme[scale][characteristicsLength]);

Charts[number]
	.width(totalWidth)
	.height(totalHeight)
	.x(d3.scale.ordinal())
	.xUnits(dc.units.ordinal)
	.margins({left: 20, top: 10, right: 10, bottom: 20})
	.brushOn(false)
	.barPadding(0.2)
	.outerPadding(0.2)
	.centerBar(false)
	//.clipPadding(1)
	.controlsUseVisibility(true)
	.title(function(d) {
		return ""; //d.key + '[' + this.layer + ']: ' + d.value[this.layer] + " " + d.value["total"];
	})
	.dimension(MainDimensions[number])
	.group(MainGroups[number])
	.renderLabel(true)
	.ordinalColors(colorscheme[scale][characteristicsLength])
	.transitionDuration(0)
	.yAxisPadding("5%")
	.ordering(function(d) { return characteristics.indexOf(d.key); })
	;

Charts[number].filter = function() {};

Charts[number].yAxis().tickFormat(germanFormatters.numberFormat(","));

Charts[number].render()

function adaptY(){
	maxwidth=0
	Charts[number].selectAll("#"+chartcontainer+" g.axis.y > g > text")
		.attr('transform', function (d) {
			var coordx = this.getBBox().width;
			if (maxwidth < coordx) {
				maxwidth = coordx;
			}
		});
	YWidth=maxwidth+7;
	if (YWidth>20) {
		Charts[number].margins({left: YWidth, top: 10, right: 10, bottom: 20});
		Charts[number].render()
	}
}

adaptY();

function rotateX(){
	//Breite eines Zwischenstrichs
	var tickwidth=d3.transform(d3.selectAll("#"+chartcontainer+" g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+chartcontainer+" g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];;

	//Zeilen umbrechen, wenn breiter als Zwischenstrich
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);

	//Maximale Breite der Skalenbezeichner	
	var maxwidth=0
	var maxheight=0
	Charts[number].selectAll("#"+chartcontainer+" g.axis.x > g > text")
		.attr('transform', function (d) {
			var coordx = this.getBBox().width;
			if (maxwidth < coordx) {
				maxwidth = coordx;
			}
			var coordy = this.getBBox().height;
			if (maxheight < coordy) {
				maxheight = coordy;
			}
		});

	Charts[number].height(totalHeight+maxheight-20)
		.margins({left: YWidth, top: 10, right: 10, bottom: 10 + maxheight});
	Charts[number].render()
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);
	var maxwidth=0
	var maxheight=0
	Charts[number].selectAll("#"+chartcontainer+" g.axis.x > g > text")
		.attr('transform', function (d) {
			var coordx = this.getBBox().width;
			if (maxwidth < coordx) {
				maxwidth = coordx;
			}
			var coordy = this.getBBox().height;
			if (maxheight < coordy) {
				maxheight = coordy;
			}
		});
	//Wenn immer noch zu breit dann rotieren
	if (maxwidth-6>tickwidth*0.75) {
	Charts[number].height(totalHeight+Math.min(150, maxwidth)-20)
		.margins({left: YWidth, top: 10, right: 10, bottom: 10 + +Math.min(150, maxwidth)});
	Charts[number].render()
	Charts[number].selectAll(".x .tick text")
		.call(wrap, Math.min(150, maxwidth));
	d3.selectAll("#"+chartcontainer+" g.axis.x > g > text")
		.style("text-anchor", "start")
	//var moveleft = (-maxheight)/2-3
	d3.selectAll("#"+chartcontainer+" g.axis.x > g > text").attr("transform", function (d) {
		var moveleft = (-(this.getBBox().height)/2)-5;
		return ("rotate(90), translate(10,"+moveleft+")")
	});
	}
	//Click-Event ausschalten
	d3.selectAll("#"+chartcontainer+" g.stack > rect").on('click',null);
    d3.selectAll("#"+chartcontainer+" g.stack > rect").on("click", function() { 
    });
}

rotateX();

function initTip(number){
	last_tip = null;
	Tips[number] = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction('n')
		.offset([0, 0])
		.html("no data");
}

function callTip(number){
	d3.selectAll("#"+chartcontainer+" g.stack > rect")
		.call(Tips[number])
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Tips[number].show(d);
				last_tip = d.key;
			}
			if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
			else {wert=germanFormatters.numberFormat(",")(d.data.value)}
			if (showTotal==true & showAnteil==true) {
				tiptext= "<span>" + d.data.key + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.data.value/SecondaryGroups[number]["Total"].value()) + "</span><br/><span>"+group+": " +wert+  "</span>";
			}
			else if (showTotal==true) {
				tiptext= "<span>" + d.data.key + "</span><br/><span>"+group+": " +wert+  "</span>";
			}
			else if (showAnteil==true) {
				tiptext= "<span>" + d.data.key + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.data.value/SecondaryGroups[number]["Total"].value()) + "</span>";
			}
			else {
				tiptext= "<span>" + d.data.key + "</span>";
			};

			$("#d3-tip"+number).html(tiptext)
			$("#d3-tip"+number).css("border-left", colorScale.range()[Math.floor(i/MainGroups[number].all().length)] +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) -18 - ($("#d3-tip"+number).height()/2));
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Tips[number].hide(d);
		});
}

function formatBarLabels(){
	d3.selectAll("#"+chartcontainer+" text.barLabel").each(function(d, i) {
		if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
		else {wert=germanFormatters.numberFormat(",")(d.data.value)}
		d3.select(this).text(wert);
	});
}

initTip(number);

callTip(number);

formatBarLabels();

window.onresize = function(event) {
  //Breite des Hauptcontainers einlesen
	totalWidth = document.getElementById('default'+number).offsetWidth;
	Charts[number].width(totalWidth)
		.transitionDuration(0);
	Charts[number].render()

	rotateX();	
	callTip(number);
	formatBarLabels();
	
};
	
});

addDownloadButton(maincontainer, chartcontainer, number);
addDownloadButtonPng(maincontainer, chartcontainer, number)

}

//Ansatz für Labels
/*Charts[number].on('renderlet', function(chart){
	var barsData = [];
	var bars = chart.selectAll('.bar').each(function (d) {
		barsData.push(d);
	});

	//Remove old values (if found)
	d3.select(bars[0][0].parentNode).select('#inline-labels').remove();
	//Create group for labels 
	var gLabels = d3.select(bars[0][0].parentNode).append('g').attr('id', 'inline-labels');
	for (var i = bars[0].length - 1; i >= 0; i--) {
		var b = bars[0][i];
		//Only create label if bar height is tall enough
		if (+b.getAttribute('height') < 18) continue;
		gLabels.append("text")
			.text(barsData[i].data.value)
			.attr('x', +b.getAttribute('x') + (b.getAttribute('width') / 2))
			.attr('y', +b.getAttribute('y') + 15)
			.attr('text-anchor', 'middle');
	}
});*/

