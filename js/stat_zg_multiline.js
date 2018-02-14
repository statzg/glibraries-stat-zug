﻿/* stat_zg_multiline.js (version 0.3 (2017.11.28)*/

function loadMultiLine(args) {
var number = (typeof args.number == 'undefined') ? 1 : args.number;
var csv_path = (typeof args.csv_path == 'undefined') ? "error" : args.csv_path;
var dimension = (typeof args.dimension == 'undefined') ? "" : args.dimension;
var group = (typeof args.group == 'undefined') ? "" : args.group;
var characteristics = (typeof args.characteristics == 'undefined') ? [] : args.characteristics;
var stack = (typeof args.stack == 'undefined') ? "" : args.stack
var characteristicsStack = (typeof args.characteristicsStack == 'undefined') ? [] : args.characteristicsStack;
var scale = (typeof args.scale == 'undefined') ? 1 : args.scale;
//var relative = (typeof args.relative == 'undefined') ? false : args.relative;
var showTotal = (typeof args.showTotal == 'undefined') ? true : args.showTotal;
var showAnteil = (typeof args.showAnteil == 'undefined') ? true : args.showAnteil;
//var showArea = (typeof args.showArea== 'undefined') ? true : args.showArea;
var asDate = (typeof args.asDate == 'undefined') ? true : args.asDate;
var dateUnit = (typeof args.dateUnit == 'undefined') ? "month" : args.dateUnit;
//var order = (typeof args.order == 'undefined') ? "alpha" : args.order;
//var last = (typeof args.last == 'undefined') ? "" : args.last;
//var partei = (typeof args.partei == 'undefined') ? false : args.partei;
//var highlight = (typeof args.highlight == 'undefined') ? {} : args.highlight;

//Attributeobjekt initialisieren
Atts[number]={};

Atts[number].maincontainer="default"+number
Atts[number].chartcontainer="chart"+number

//Container erstellen, falls diese noch nicht existieren (den Hauptcontainer braucht es unweigerlich)
createcontainers(number);

//Breite des Containers ermitteln
var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
var totalHeight = 360

//Charttyp dem Container zuweisen
Charts[number] = dc.compositeChart("#"+Atts[number].chartcontainer);

//Daten einlesen

var daten = d3.csv(csv_path, function(error, data) {
	
var dataValues = d3.values(data)[0];
if (dimension == undefined | dimension=="") {dimension = Object.keys(dataValues)[0];};
if (group == undefined | group=="") {group = Object.keys(dataValues)[2];};
if (stack == undefined | stack=="") {stack = Object.keys(dataValues)[1];};	

	if (asDate==true) {
		data.forEach(function(x) {
			x["Datum"] = x[dimension];
			x[dimension] = new Date(x[dimension]);
			x[group] = +x[group];
		});
	}
	else {
		data.forEach(function(x) {
			x[group] = +x[group];
		});
	}

treatmetadata(number, data);

//Daten an Crossfilter übergeben
Atts[number].dataset = crossfilter(Atts[number].data),
	Atts[number].maindimension = Atts[number].dataset.dimension(function (d) {
		return d[dimension];
	}),
	Atts[number].maingroup = Atts[number].maindimension.group().reduceSum(function (d) {
		return d[group];
	});	

//Ausprägungen in Array abfüllen, wenn nicht manuell definiert (für Farbzuweisung)
if (typeof characteristics === 'undefined' || characteristics.length==0) {
	characteristics = [];
	Atts[number].maingroup.all().forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
var characteristicsLength= characteristics.length;

colorScale = d3.scale.ordinal()
            .domain(characteristics)
            .range(colorscheme[scale][characteristicsStack.length]);
			
var createPropertyGroup = function(i) {
    return Atts[number].maindimension.group().reduceSum(function (d) {if (d[stack]===characteristicsStack[i]) {return d[group];}else{return 0;}});
}

Atts[number].secondgroup={};
for (var i = 0; i < characteristicsStack.length; i++) {
	Atts[number].secondgroup[characteristicsStack[i]]=createPropertyGroup(i)
}

Charts[number+100]=[]
for (var i = 0; i < characteristicsStack.length; i++) {
	Charts[number+100][i]= dc.lineChart(Charts[number])
			.group(Atts[number].secondgroup[characteristicsStack[i]], characteristicsStack[i])
			.ordinalColors([colorscheme[scale][characteristicsStack.length][i]])
			.yAxisPadding("5%")
			.dotRadius(10)
			.interpolate("linear")
			.title(function(d) {
				return ""; 
			})
}

Charts[number]
	.width(totalWidth)
	.height(totalHeight)
	.transitionDuration(1500)
	.margins({left: 20, top: 10, right: 10, bottom: 40})
	.dimension(Atts[number].maindimension)
	.elasticY(true)
	.legend(dc.legend().x(70).y(10).itemHeight(13).gap(5))
	.brushOn(false)
     //._rangeBandPadding(1)
	.compose(Charts[number+100])
	.renderHorizontalGridLines(true);
	
	
if (asDate==true) {
Charts[number]
	.x(d3.time.scale())
    .round(d3.time.month.round)
    .xUnits(d3.time.months);
	function calc_domain(chart) {
		var min = d3.min(Charts[number+100][0].group().all(), function(kv) { return kv.key; }),
			max = d3.max(Charts[number+100][0].group().all(), function(kv) { return kv.key; });
			max = d3.time.month.offset(max, 1);
		Charts[number].x(d3.time.scale().domain([min, max]));
	}
	Charts[number].on('preRender', calc_domain);
	Charts[number].on('preRedraw', calc_domain);
}
else {
Charts[number]
	.x(d3.scale.ordinal().domain(characteristics))
	.xUnits(dc.units.ordinal);
}
	
Charts[number].legend(dc.legend().x(10).y(330).itemHeight(13).gap(10)
			.horizontal(true)
			.legendWidth(totalWidth-10)
			.autoItemWidth(true));
			
Charts[number].yAxis().tickFormat(germanFormatters.numberFormat(","));
	
Charts[number].render();

var YWidth=0

function adaptY(){
	var maxwidth=0
	Charts[number].selectAll("#"+Atts[number].chartcontainer+" g.axis.y > g > text")
		.attr('transform', function (d) {
			var coordx = this.getBBox().width;
			if (maxwidth < coordx) {
				maxwidth = coordx;
			}
		});
	YWidth=maxwidth+7;
	if (YWidth>20) {
		Charts[number].margins({left: YWidth, top: 10, right: 10, bottom: 40})
		.compose(Charts[number+100]);
		Charts[number].render()
	}
}

adaptY();

function getLegendWidth(number) {
	var legendLength = d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().childElementCount;
	var legendWidthArray = [];
	legendHeightArray = [];
	for (i=0; i < legendLength; i++) {
		var j=i+1;
		var item = "#"+Atts[number].chartcontainer+" g.dc-legend-item:nth-of-type("+j+")";
		legendWidthArray[i]=d3.select(item).node().getBBox().width;
		legendHeightArray[i]=d3.select(item).node().getBBox().height;
	};
	legendMaxWidth = Math.max.apply(null, legendWidthArray);
}

function rotateX(){
	//Breite eines Zwischenstrichs
	var tickwidth=d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];;
	totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;

	//Zeilen umbrechen, wenn breiter als Zwischenstrich
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);

	//Maximale Breite der Skalenbezeichner	
	var maxwidth=0
	var maxheight=0
	Charts[number].selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text")
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

	var legendy=330+maxheight
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend").attr("transform", "translate(10,"+legendy+")")
	var legendHeight = d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().getBBox().height;
	Charts[number].width(totalWidth)
	Charts[number].height(totalHeight+maxheight+legendHeight-20)
		.margins({left: YWidth, top: 10, right: 10, bottom: 40 + maxheight + legendHeight});
	Charts[number].render()
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend").attr("transform", "translate(10,"+legendy+")")
	var maxwidth=0
	var maxheight=0
	Charts[number].selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text")
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
	Charts[number].height(totalHeight+Math.min(150, maxwidth)+legendHeight-20)
		.margins({left: YWidth, top: 10, right: 10, bottom: 40 +Math.min(150, maxwidth) + legendHeight});
	Charts[number].render()
	Charts[number].selectAll(".x .tick text")
		.call(wrap, Math.min(150, maxwidth));
	var legendy=330+Math.min(150, maxwidth)
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend").attr("transform", "translate(10,"+legendy+")")
	d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text")
		.style("text-anchor", "start")
	//var moveleft = (-maxheight)/2-3
	d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text").attr("transform", function (d) {
		var moveleft = (-(this.getBBox().height)/2)-5;
		return ("rotate(90), translate(10,"+moveleft+")")
	});
	}
	//Wenn nötig Legende umbrechen, funktioniert nur bis 2 Zeilen.
	getLegendWidth(number);
	if (legendMaxWidth > totalWidth-30){
		Charts[number].selectAll("#"+Atts[number].chartcontainer+" g.dc-legend text")
			.call(wrap, totalWidth-30);
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend text").attr("transform", function (d) {
		var height = (this.getBBox().height);
		if(height == 14) {
		return ("translate(0,0)")
		}
		if(height > 15) {
		return ("translate(0,-6)")
		}
	});
	}
}

rotateX();

function initTip(){
	last_tip = null;
	Atts[number].tips = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction('n')
		.offset([-30, 0])
		.html("no data");
}

function callTip(){		
	d3.selectAll("circle.dot")
		.call(Atts[number].tips)
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d);
				last_tip = d.key;
			}
			//console.log($(this).parent().parent().parent().parent())
			if (asDate==true){
				var monthNameFormat = d3.time.format("%B %Y");
				var yearNameFormat = d3.time.format("%Y");
				if (dateUnit=="year") {
					label=yearNameFormat(d.data.key)
				}
				else {
					label=monthNameFormat(d.data.key)
				}
			}
			else {label=d.data.key}
			
			if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
			else {wert=germanFormatters.numberFormat(",")(d.data.value)}

			if (showTotal==true & showAnteil==true) {
				tiptext= "<span>"+characteristicsStack[$(this).parent().parent().parent().parent().index()-2]+"</span><br/><span>" + label + "</span><br/><span>Anteil: " +(Math.round((d.data.value/Atts[number].maingroup.all()[i-(($(this).parent().index())*characteristicsLength)].value)*1000)/10).toFixed(1) + '%' + "</span><br/><span>"+group+": " + wert +  "</span>";
			}
			else if (showTotal==true) {
				tiptext= "<span>"+characteristicsStack[$(this).parent().parent().parent().parent().index()-2]+ "</span><br/><span>"+ label + "</span><br/><span>"+group+": " + wert +  "</span>";
			}
			else if (showAnteil==true) {
				tiptext= "<span>"+characteristicsStack[$(this).parent().parent().parent().parent().index()-2]+"</span><br/><span>" + label + "</span><br/><span>Anteil: " +(Math.round((d.data.value/Atts[number].maingroup.all()[i-(($(this).parent().index())*characteristicsLength)].value)*1000)/10).toFixed(1) + '%' + "</span>";
			}
			else {
				tiptext= "<span>"+characteristicsStack[$(this).parent().parent().parent().parent().index()-2]+"</span><br/><span>" + label + "</span>";
			};
			$("#d3-tip"+number).html(tiptext)
			$("#d3-tip"+number).css("border-left", colorScale.range()[$(this).parent().parent().parent().parent().index()-2] +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).height()/2));
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Atts[number].tips.hide(d);
			d3.selectAll("circle.dot").attr('style', "fill-opacity:0.000001");
			d3.selectAll("path.yRef").attr('style', "display:none");
			d3.selectAll("path.xRef").attr('style', "display:none");
		});
}

initTip();
callTip();
$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);

//window.onresize = function(event) {
window.addEventListener('resize', function(){
  //Breite des Hauptcontainers einlesen
	var newWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
	Charts[number].width(newWidth)
		.transitionDuration(0);
	Charts[number].legend(dc.legend().x(10).y(330).itemHeight(13).gap(10)
			.legendWidth(totalWidth-10)
			.autoItemWidth(true)
			.horizontal(true)
			)
	Charts[number].render();
	
	callTip();
	rotateX();
	
	Charts[number].transitionDuration(1500);
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
	});
});

if (asDate==true) {
	var columns=["Datum", stack, group]									 
} else {
	var columns=[dimension, stack, group]
}
addDownloadButton(number);
addDownloadButtonPng(number)
addDataTablesButton(number, columns)

}