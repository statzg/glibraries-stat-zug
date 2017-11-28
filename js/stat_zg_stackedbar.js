/* stat_zg_stackedbar.js (version 0.3 (2017.11.28)*/

function loadStackedBar(number, csv_path, dimension, group, stack, characteristics, scale, relative, showTotal, characteristicsStack) {

Atts[number]={};

Atts[number].maincontainer="default"+number
Atts[number].chartcontainer="chart"+number

//Breite des Containers ermitteln
var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
var totalHeight = 360

//Charttyp dem Container zuweisen
Charts[number] = dc.barChart("#"+Atts[number].chartcontainer);

//Daten einlesen
var daten = d3.csv(csv_path, function(error, data) {
	data.forEach(function(x) {
		x[group] = +x[group];
	});
	
treatmetadata(number, data);
	
Atts[number].dataset = crossfilter(Atts[number].data),
	Atts[number].maindimension = Atts[number].dataset.dimension(function(d) {return d[stack];}),
	Atts[number].maingroup       = Atts[number].maindimension.group().reduce(function(p, v) {
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
	Atts[number].seconddimension = Atts[number].dataset.dimension(function (d) {
		return d[dimension];
	});
	Atts[number].secondgroup = Atts[number].seconddimension.group().reduceSum(function (d) {
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

//Ausprägungen in Array abfüllen, wenn nicht manuell definiert (für Farbzuweisung)
if (typeof characteristics === 'undefined' || characteristics.length==0) {
	characteristics = [];
	Atts[number].secondgroup.all().forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
var characteristicsLength= characteristics.length;

var colorScale = d3.scale.ordinal()
            .domain(characteristics)
            .range(colorscheme[scale][characteristicsLength]);

Charts[number]
	.width(totalWidth)
	.height(totalHeight)
	.x(d3.scale.ordinal())
	.xUnits(dc.units.ordinal)
	.margins({left: 20, top: 10, right: 10, bottom: 40})
	.brushOn(false)
	.barPadding(0.2)
	.outerPadding(0.2)
	.centerBar(false)
	//.clipPadding(1)
	.controlsUseVisibility(true)
	.title(function(d) {
		return ""; //d.key + '[' + this.layer + ']: ' + d.value[this.layer] + " " + d.value["total"];
	})
	.dimension(Atts[number].maindimension)
	.group(Atts[number].maingroup, characteristics[0] + "", sel_stack(characteristics[0]))
	.renderLabel(true)
	.ordinalColors(colorscheme[scale][characteristicsLength])
	.transitionDuration(0)
	.yAxisPadding("5%")
	;

if (typeof relative !== 'undefined' && relative==true) {
Charts[number].yAxis().tickFormat(d3.format('.0%'));
Charts[number].renderLabel(false)
Charts[number].yAxisPadding("0%");
}
else {
Charts[number].yAxis().tickFormat(germanFormatters.numberFormat(","));	
}

if (typeof characteristicsStack !== 'undefined' && relative==true) {
Charts[number].x(d3.scale.ordinal().domain(characteristicsStack));
}

//Farben in der Legende manuell zuweisen. funktionier nicht mit der Legende.
/*Charts[number].on('renderlet', function(chart){
	for (var i=1; i<=characteristicsLength; ++i) {
	var j=i-1;
	chart.selectAll("g.stack._"+j+" > rect").attr("fill", function(d){
		return colorscheme[scale][characteristicsLength][i-1];
		
	});
	chart.selectAll("g.dc-legend-item:nth-child("+i+") > rect").attr("fill", function(d){
		return colorscheme[scale][characteristicsLength][i-1];
		
	});}
	})*/

Charts[number].filter = function() {};

Charts[number].legend(dc.legend().x(10).y(330).itemHeight(13).gap(10)
			.horizontal(true)
			.legendWidth(totalWidth-10)
			.autoItemWidth(true));

//Legende Anders ordnen
/*dc.override(Charts[number], 'legendables', function() {
	var items = Charts[number]._legendables();
	return items.reverse();
});*/

for(var i = 1; i<characteristicsLength; ++i){
	Charts[number].stack(Atts[number].maingroup, characteristics[i], sel_stack(characteristics[i]));
}

Charts[number].render()

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
		Charts[number].margins({left: YWidth, top: 10, right: 10, bottom: 40});
		Charts[number].render()
	}
}

adaptY();

function getLegendWidth(number) {
	var legendLength = d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().childElementCount;
	var legendWidthArray = [];
	var legendHeightArray = [];
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
		.margins({left: YWidth, top: 10, right: 10, bottom: 40 + +Math.min(150, maxwidth) + legendHeight});
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
	//Click-Event ausschalten
	d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on('click',null);
    d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on("click", function() { 
    });
	d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on('click',null);
    d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on("click", function() { 
	});
}

rotateX();

function initTip(number){
	last_tip = null;
	Atts[number].tips = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction('n')
		.offset([0, 0])
		.html("no data");
}

function callTip(number){
	d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect")
		.call(Atts[number].tips)
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d);
				last_tip = d.key;
			}
			
			if (d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]] % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]])}
			else {wert=germanFormatters.numberFormat(",")(d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]])}
			
			if (showTotal==true) {
				tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/Atts[number].maingroup.all().length)]+ "</span><br/><span>Anteil: " +(Math.round((d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]]/d.data.value["total"])*1000)/10).toFixed(1) + '%' + "</span><br/><span>Anzahl: " + wert +  "</span>";
			}
			else {
				tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/Atts[number].maingroup.all().length)]+ "</span><br/><span>Anteil: " +(Math.round((d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]]/d.data.value["total"])*1000)/10).toFixed(1) + '%' + "</span>";
			};
			$("#d3-tip"+number).html(tiptext)
			$("#d3-tip"+number).css("border-left", colorScale.range()[Math.floor(i/Atts[number].maingroup.all().length)] +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) -18 - ($("#d3-tip"+number).height()/2));
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Atts[number].tips.hide(d);
		});
}


function formatBarLabels(){
	d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").each(function(d, i) {
		if (d.data.value["tota"] % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value["total"])}
		else {wert=germanFormatters.numberFormat(",")(d.data.value["total"])}
		d3.select(this).text(wert);
	});
}

initTip(number);

callTip(number);

formatBarLabels();

$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);

$(window).resize(function(event) {
  //Breite des Hauptcontainers einlesen
	var totalWidth = document.getElementById('default'+number).offsetWidth;
	Charts[number].width(totalWidth)
		.transitionDuration(0);
	Charts[number].legend(dc.legend().x(10).y(300).itemHeight(13).gap(10)
			.legendWidth(totalWidth-10)
			.autoItemWidth(true)
			.horizontal(true)
			)
	Charts[number].render()

	rotateX();	
	callTip(number);
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
	formatBarLabels();
});

var columns=[dimension, stack, group]									 
addDownloadButton(number);
addDownloadButtonPng(number)
addDataTablesButton(number, columns)									
	
});

}
