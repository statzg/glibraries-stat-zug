/* stat_zg_groupedBar.js (version 0.2 (2017.07.19)*/

function loadGroupedBar(number, csv_path, dimension, group, stack, characteristics, characteristicsStack, scale, relative, showTotal, showAnteil, popup) {

if (typeof popup !== 'undefined' & popup==true) {
	$.colorbox({html:'<div id="default'+(number)+'"><div id="title" class="title"></div><div id="subtitle" class="subtitle"></div><div id="chart'+(number)+'"></div><div id="description" class="description"></div><div id="source" class="source"></div></div>', width:"100%", height:"100%"});
}

Atts[number]={};

Atts[number].maincontainer="default"+number
Atts[number].chartcontainer="chart"+number

//Breite des Containers ermitteln
var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
var totalHeight = 360;

if (typeof popup !== 'undefined' & popup==true) {
	totalHeight=$("#cboxLoadedContent").height()-150;
}

if (typeof showAnteil === 'undefined') {showAnteil=true;};
if (typeof showTotal === 'undefined') {showTotal=true;};

//Charttyp dem Container zuweisen
Charts[number] = dc.compositeChart("#"+Atts[number].chartcontainer);

//Daten einlesen
var daten = d3.csv(csv_path, function(error, data) {
	data.forEach(function(x) {
		x[group] = +x[group];
	});

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
	
Datasets[number]= crossfilter(Atts[number].data),
	MainDimensions[number] = Datasets[number].dimension(function(d) {return d[stack];}),
	MainGroups[number] = MainDimensions[number].group().reduce(function(p, v) {
		++p.count;
		p[v[dimension]] = (p[v[dimension]] || 0) + v[group];
		p.total += +v[group];
		return p;
	}, function(p, v) {
		--p.count;
		p[v[dimension]] = (p[v[dimension]] || 0) - v[group];
		p.total -= -v[group];
		return p;
	}, function() {
		return { total:0, count:0};
	});
	SecondDimension = Datasets[number].dimension(function (d) {
		return d[dimension];
	});
	SecondGroup = SecondDimension.group().reduceSum(function (d) {
		return d[group];
	});
	if (typeof relative !== 'undefined' && relative==true) {
		function sel_stack(i) {
			return function(d) {
				return d.value[i]/d.value["total"];
			};
		};
	}
	else {
		function sel_stack(i) {
			return function(d) {
				return d.value[i];
			};
		};
	};			

//Auspr�gungen in Array abf�llen, wenn nicht manuell definiert (f�r Farbzuweisung)
if (typeof characteristics === 'undefined' || characteristics.length==0) {
	characteristics = [];
	SecondGroup.all().forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
characteristicsLength= characteristics.length;

var colorScale = d3.scale.ordinal()
            .domain(characteristics)
            .range(colorscheme[scale][characteristicsLength]);
			
columns = [];

for (var i=0; i < characteristicsLength; i++) {
	columns[i] = dc.barChart(Charts[number])
	//.gap(160)
	.group(MainGroups[number], characteristics[i] + "", sel_stack(characteristics[i]))
	.centerBar(false)
	.colors(colorscheme[scale][characteristicsLength][i])
	.title(function(d) {
		return "";
	})
	;
}

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
	var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
	
	//Zeilen umbrechen, wenn breiter als Zwischenstrich
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);

	//Maximale Breite und H�he der Skalenbezeichner	
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
	
	//Legende nach unten verschieben
	var legendy=totalHeight-30+maxheight
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend").attr("transform", "translate(10,"+legendy+")")
	var legendHeight = d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().getBBox().height;
	//H�he der Grafik den neuen Begebenheiten anpassen
	Charts[number].width(totalWidth)
	Charts[number].height(totalHeight+maxheight+legendHeight-20)
		.margins({left: YWidth, top: 10, right: 10, bottom: 40 + maxheight + legendHeight});
	Charts[number].render()
	//Zeilen nach rerender wieder umbrechen
	Charts[number].selectAll("#"+Atts[number].chartcontainer+" .x .tick text")
		.call(wrap, tickwidth);
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend").attr("transform", "translate(10,"+legendy+")")
	
	//Maximale Breite und H�he der Skalenbezeichner
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
		.margins({left: YWidth, top: 10, right: 10, bottom: 40 + +Math.min(150, maxwidth) + legendHeight});
	Charts[number].render()
	Charts[number].selectAll("#"+Atts[number].chartcontainer+" .x .tick text")
		.call(wrap, Math.min(150, maxwidth));
	var legendy=totalHeight-30+Math.min(150, maxwidth)
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend").attr("transform", "translate(10,"+legendy+")")
	d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text")
		.style("text-anchor", "start")
	d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text").attr("transform", function (d) {
		var moveleft = (-(this.getBBox().height)/2)-5;
		return ("rotate(90), translate(10,"+moveleft+")")
	});
	}
	//Wenn n�tig Legende umbrechen, funktioniert nur bis 2 Zeilen.
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
	//Click-Event ausschalten
	d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on('click',null);
    d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on("click", function() { 
    });
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on('click',null);
    d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on("click", function() { 
	});
	$("title").html("")
}

function initTip(){
	last_tip = null;
	Tips[number] = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction('n')
		.offset([-15, 0])
		.html("no data");
}

function callTip(){
	d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect")
		.call(Tips[number])
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Tips[number].show(d);
				last_tip = d.key;
			}
			
			if (d.data.value[characteristics[Math.floor(i/MainGroups[number].all().length)]] % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value[characteristics[Math.floor(i/MainGroups[number].all().length)]])}
			else {wert=germanFormatters.numberFormat(",")(d.data.value[characteristics[Math.floor(i/MainGroups[number].all().length)]])}
			
			if (showTotal==true & showAnteil==true) {
				tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/MainGroups[number].all().length)]+ "</span><br/><span>Anteil: " +Math.round((d.data.value[characteristics[Math.floor(i/MainGroups[number].all().length)]]/d.data.value["total"])*100).toFixed(2) + '%' + "</span><br/><span>"+group+": " + wert +  "</span>";
			}
			else if (showTotal==true) {
				tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/MainGroups[number].all().length)]+ "</span><br/><span>"+group+": " + wert +  "</span>";
			}
			else if (showAnteil==true) {
				tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/MainGroups[number].all().length)]+ "</span><br/><span>Anteil: " +Math.round((d.data.value[characteristics[Math.floor(i/MainGroups[number].all().length)]]/d.data.value["total"])*100).toFixed(2) + '%' + "</span>";
			}
			else {
				tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/MainGroups[number].all().length)]+ "</span>";
			};
			$("#d3-tip"+number).html(tiptext)
			$("#d3-tip"+number).css("border-left", colorScale.range()[Math.floor(i/MainGroups[number].all().length)] +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
			$("#d3-tip"+number).css( 'left', offsetx);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Tips[number].hide(d);
		});
}


Charts[number]
	.width(totalWidth)
	.height(totalHeight)
	.dimension(MainDimensions[number])
	.group(MainGroups[number], characteristics[0] + "", sel_stack(characteristics[0]))
	.margins({left: 20, top: 10, right: 10, bottom: 40})
	//.elasticY(true)
	.x(d3.scale.ordinal())
	.xUnits(dc.units.ordinal)
	.brushOn(false)
	.compose(columns)
	.controlsUseVisibility(true)
	.transitionDuration(0)
	.renderLabel(true)
	.title(function(d) {
		return "";
	})
	.ordering(function(d) { return characteristicsStack.indexOf(d.key); })
	.yAxisPadding("10%")
	;
	
Charts[number].legend(dc.legend().x(10).y(totalHeight-40).itemHeight(13).gap(10)
			.horizontal(true)
			.legendWidth(totalWidth-10)
			.autoItemWidth(true));

//Breite der Balken so anpassen, dass sie nicht �berschneiden.
Charts[number].on('renderlet', function(chart){
	//Breite eines Zwischenstrichs
	var tickwidth=d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];
	var groupwidth=tickwidth*0.9;
	var yAxis=d3.svg.axis().scale(d3.scale.ordinal()).orient("bottom").ticks(4);
		
	for (var j=2; j <= characteristicsLength+1; j++) {
		for (var i=1; i <= MainGroups[number].all().length; i++) {

			var bbox = chart.selectAll("#"+Atts[number].chartcontainer+" g.sub:nth-child("+j+") > g > g > rect:nth-child("+i+")").node().getBBox();
			var barwidth=groupwidth/characteristicsLength;
			var newx=bbox.x + 0.05*tickwidth + (barwidth*(j-2))
			chart.selectAll("#"+Atts[number].chartcontainer+" g.sub:nth-child("+j+") > g > g > rect:nth-child("+i+")").attr("width", ""+barwidth+"");
			chart.selectAll("#"+Atts[number].chartcontainer+" g.sub:nth-child("+j+") > g > g > rect:nth-child("+i+")").attr("x", ""+newx+"");

		}
	}
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
});

if (typeof relative !== 'undefined' && relative==true) {
Charts[number].yAxis().tickFormat(d3.format('.0%'));
Charts[number].renderLabel(false);
}
else {
Charts[number].yAxis().tickFormat(germanFormatters.numberFormat(","));	
}

for (var i=0; i < characteristicsLength; i++) {
	columns[i].filter = function() {};
}

//Legende r�ckw�rts wiedergeben
/*dc.override(Charts[number], 'legendables', function() {
	var items = Charts[number]._legendables();
	return items.reverse();
});*/

Charts[number].render();

function adaptY(){
	maxwidth=0
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
		.compose(columns);
		Charts[number].render()
	}
}

adaptY();

rotateX();
initTip();
callTip();

$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);

//window.onresize = function(event) {
window.addEventListener('resize', function(){
  //Breite des Hauptcontainers einlesen
	if (typeof oldWidth === 'undefined') {
		oldWidth=totalWidth
	}
	newWidth = document.getElementById('default'+number).offsetWidth;
	Charts[number].width(newWidth);
	Charts[number].legend(dc.legend().x(10).y(totalHeight-40).itemHeight(13).gap(10)
			.legendWidth(newWidth-10)
			.autoItemWidth(true)
			.horizontal(true)
	)

	Charts[number].on('renderlet', function(chart){
	//Breite eines Zwischenstrichs
	var tickwidth=d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];;
	var groupwidth=tickwidth*0.9;

		for (var j=2; j <= characteristicsLength+1; j++) {
			for (var i=1; i <= MainGroups[number].all().length; i++) {

				var bbox = chart.selectAll("#"+Atts[number].chartcontainer+" g.sub:nth-child("+j+") > g > g > rect:nth-child("+i+")").node().getBBox();
				var barwidth=groupwidth/characteristicsLength;
				var newx=bbox.x + 0.05*tickwidth + (barwidth*(j-2))
				chart.selectAll("#"+Atts[number].chartcontainer+" g.sub:nth-child("+j+") > g > g > rect:nth-child("+i+")").attr("width", ""+barwidth+"");
				chart.selectAll("#"+Atts[number].chartcontainer+" g.sub:nth-child("+j+") > g > g > rect:nth-child("+i+")").attr("x", ""+newx+"");
			}
		}
	});
	
	Charts[number].render();
	
	rotateX();
	callTip();
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
	});

if (typeof newWidth !== 'undefined') oldWidth=newWidth;	

});

addDownloadButton(Atts[number].maincontainer, Atts[number].chartcontainer, number);
addDownloadButtonPng(Atts[number].maincontainer, Atts[number].chartcontainer, number);

}