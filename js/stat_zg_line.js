/* stat_zg_line.js (version 0.2 (2017.07.19)*/

function loadLine(number, csv_path, dimension, group, characteristics, scale, showTotal, showAnteil, showArea, asDate) {

var maincontainer="default"+number
var chartcontainer="chart"+number

//Breite des Containers ermitteln
var totalWidth = document.getElementById(maincontainer).offsetWidth;
var totalHeight = 320

//Charttyp dem Container zuweisen
Charts[number] = dc.lineChart("#"+chartcontainer);

//Daten einlesen


var daten = d3.csv(csv_path, function(error, data) {
	if (asDate==true) {
		data.forEach(function(x) {
			x[dimension] = new Date(x[dimension]);
			x[group] = +x[group];
		});
	}
	else {
		data.forEach(function(x) {
			x[group] = +x[group];
		});
	}

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

//Daten an Crossfilter übergeben
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
	MainGroups[number].all().forEach(function (x) {
			characteristics.push(x["key"]);
		});
	}
var characteristicsLength= characteristics.length;

colorScale = d3.scale.ordinal()
            .domain(characteristics)
            .range(colorscheme[scale][1]);

var order = characteristics;
			
function sort_group(group, order) {
    return {
        all: function() {
            var g = group.all(), map = {};
         
            g.forEach(function(kv) {
                map[kv.key] = kv.value;
            });
            return order.map(function(k) {
                return {key: k, value: map[k]};
            });
        }
    };
};

var sorted_group = sort_group(MainGroups[number], order);

			
Charts[number]
	.width(totalWidth)
	.height(totalHeight)
	.margins({left: 20, top: 10, right: 10, bottom: 20})
	.brushOn(false)
	//.xAxisLabel('Fruit')
	//.yAxisLabel('Quantity Sold')
	.dimension(MainDimensions[number])
	.group(MainGroups[number])
	.title(function(d) {
		return ""; 
	})
	.yAxisPadding("5%")
	.dotRadius(10)
	.renderArea(showArea)
	.interpolate("linear")
	.colors(colorscheme[scale][1])
	.transitionDuration(1500);
			
if (asDate==true) {
Charts[number]
	.x(d3.time.scale())
    .round(d3.time.month.round)
    .xUnits(d3.time.months);
	
	function calc_domain(chart) {
		var min = d3.min(chart.group().all(), function(kv) { return kv.key; }),
			max = d3.max(chart.group().all(), function(kv) { return kv.key; });
			max = d3.time.month.offset(max, 1);
		Charts[number].x().domain([min, max]);
	}
	Charts[number].on('preRender', calc_domain);
	Charts[number].on('preRedraw', calc_domain);
}
else {
Charts[number]
	.x(d3.scale.ordinal().domain(order))
	.xUnits(dc.units.ordinal)
	.group(sorted_group)
}

Charts[number].yAxis().tickFormat(germanFormatters.numberFormat(","));
	
Charts[number].render();

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

function getLegendWidth(number) {
	var legendLength = d3.select("#"+chartcontainer+" g.dc-legend").node().childElementCount;
	var legendWidthArray = [];
	legendHeightArray = [];
	for (i=0; i < legendLength; i++) {
		var j=i+1;
		var item = "#"+chartcontainer+" g.dc-legend-item:nth-of-type("+j+")";
		legendWidthArray[i]=d3.select(item).node().getBBox().width;
		legendHeightArray[i]=d3.select(item).node().getBBox().height;
	};
	legendMaxWidth = Math.max.apply(null, legendWidthArray);
}

function rotateX(){
	//Breite eines Zwischenstrichs
	var tickwidth=d3.transform(d3.selectAll("#"+chartcontainer+" g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+chartcontainer+" g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];;
	var totalWidth = document.getElementById(maincontainer).offsetWidth;
	
	//Zeilen umbrechen, wenn breiter als Zwischenstrich
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);

	//Maximale Breite der Skalenbezeichner	
	maxwidth=0
	maxheight=0
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

	Charts[number].width(totalWidth)
	Charts[number].height(totalHeight+maxheight-20)
		.margins({left: YWidth, top: 10, right: 10, bottom: 40 + maxheight });
	Charts[number].render()
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);
	maxwidth=0
	maxheight=0
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
		.margins({left: YWidth, top: 10, right: 10, bottom: 40 + +Math.min(150, maxwidth) });
	Charts[number].render()
	Charts[number].selectAll(".x .tick text")
		.call(wrap, Math.min(150, maxwidth));
	d3.selectAll("#"+chartcontainer+" g.axis.x > g > text")
		.style("text-anchor", "start")
	d3.selectAll("#"+chartcontainer+" g.axis.x > g > text").attr("transform", function (d) {
		var moveleft = (-(this.getBBox().height)/2)-5;
		return ("rotate(90), translate(10,"+moveleft+")")
	});
	}
}

rotateX();

function initTip(){
	last_tip = null;
	Tips[number] = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction('n')
		.offset([-30, 0])
		.html("no data");
}

function callTip(){		
	d3.selectAll("circle.dot")
		.call(Tips[number])
		.on('mouseover', function(d, i) {
			if(d.data.key !== last_tip) {
				Tips[number].show(d);
				last_tip = d.data.key;
			}

			if (asDate==true){
				var monthNameFormat = d3.time.format("%B %Y");
				label=monthNameFormat(d.data.key)}
			else {label=d.data.key}
			
			if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
			else {wert=germanFormatters.numberFormat(",")(d.data.value)}
			
			if (showTotal==true & showAnteil==true) {
				tiptext= "<span>" + label + "</span><br/><span>Anteil: " + (Math.round((d.data.value/SecondaryGroups[number]["Total"].value())*1000)/10).toFixed(2) + '%' + "</span><br/><span>"+group+": " +wert+  "</span>";
			}
			else if (showTotal==true) {
				tiptext= "<span>" + label + "</span><br/><span>"+group+": " + wert +  "</span>";
			}
			else if (showAnteil==true) {
				tiptext= "<span>" + label + "</span><br/><span>Anteil: " + (Math.round((d.data.value/SecondaryGroups[number]["Total"].value())*1000)/10).toFixed(2) + '%' + "</span>";
			}
			else {
				tiptext= "<span>" + label + "</span>";
			};
			$("#d3-tip"+number).html(tiptext)
			$("#d3-tip"+number).css("border-left", colorScale.range()[Math.floor(i/MainGroups[number].all().length)] +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).height()/2));
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Tips[number].hide(d);
			//document.getElementsByClassName("dot")
			d3.selectAll("circle.dot").attr('style', "fill-opacity:0.000001");
			d3.selectAll("path.yRef").attr('style', "display:none");
			d3.selectAll("path.xRef").attr('style', "display:none");
		});
}

initTip();
callTip();

//window.onresize = function(event) {
window.addEventListener('resize', function(){
  //Breite des Hauptcontainers einlesen
	var newWidth = document.getElementById(maincontainer).offsetWidth;
	Charts[number].width(newWidth)
		.transitionDuration(0);

	Charts[number].render();

	rotateX();
	callTip();
	
	Charts[number].transitionDuration(1500);
	});
});

addDownloadButton(maincontainer, chartcontainer, number);
addDownloadButtonPng(maincontainer, chartcontainer, number);

}
