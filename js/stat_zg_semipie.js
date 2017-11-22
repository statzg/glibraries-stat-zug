/* stat_zg_pie.js (version 0.2 (2017.07.10)*/

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

function loadSemiPie(number, csv_path, dimension, group, characteristics, scale, showTotal, order, last, partei) {
order = typeof order !== 'undefined' ? order : "alpha";
last = typeof last !== 'undefined' ? last : "";
partei = typeof partei !== 'undefined' ? partei : false;

var maincontainer="default"+number
var chartcontainer="chart"+number

//Breite des Containers ermitteln
var totalWidth = document.getElementById(maincontainer).offsetWidth;
totalHeight = 300;

//Charttyp dem Container zuweisen
Charts[number] = dc.pieChart("#"+chartcontainer);

//Daten einlesen
var daten = d3.csv(csv_path, function (error, data) {
	data.forEach(function(d) {
		d[group] = +d[group];
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

total=0;
for (k = 0; k < data.length; k++) {
	total=total+data[k][group]
};

ZTotal={}
ZTotal[dimension] = "ZTotal";
ZTotal[group] = total;
ZTotal["Meta"] = "NA";
ZTotal["Type"] = "NA";
ZTotal["Content"] = "NA";

data.push(ZTotal)

//Daten an Crossfilter übergeben
Datasets[number] = crossfilter(data),
	MainDimensions[number] = Datasets[number].dimension(function (d) {
		return d[dimension];
    }),
    MainGroups[number] = MainDimensions[number].group().reduceSum(function (d) {
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

if (last!=="") {
	characteristics.splice(characteristics.indexOf(last),1)
	characteristics.splice(characteristics.length,0,last)
}

characteristics.splice(characteristics.indexOf("ZTotal"),1)
characteristics.splice(characteristics.length,0,"ZTotal")

var characteristicsLength= characteristics.length;

if (partei==true) {
	parteien=["SVP", "FDP","CVP", "GLP", "CSP", "SP", "ALG", "Parteilos"]
	var farben=['#4c9596','#007ac4','#ff8e39','#a0bd6d','#ffdd5e','#ff403a','#76aa7c','#ff6d36']
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
    .dimension(MainDimensions[number])
    .group(MainGroups[number])
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

Counters[number]=0;

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
	pieWidth = d3.select("#"+chartcontainer+" g:nth-child(1)").node().getBBox().width;	
	if (Counters[number]==0) {
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
			var legendHeight = d3.select("#"+chartcontainer+" g.dc-legend").node().getBBox().height;
			Charts[number].height(totalHeight+legendHeight-10)
				.externalRadiusPadding(-(totalHeight/2)+30+(legendHeight/2));
			Charts[number].redraw();
		}
		if (totalWidth<pieWidth) {
			Charts[number].externalRadiusPadding(-(totalHeight/2)+50+((pieWidth-totalWidth)/2));
			Charts[number].redraw();
		}
		
	Counters[number]=1;
	$("#"+chartcontainer+" g.dc-legend-item:nth-child("+(indexlast+1)+")").hide();
	$("#"+maincontainer+" .dc-legend-item text").attr("x", 17);

	}
});

Charts[number].render()

function initTip(number){
	last_tip = null;
	Tips[number] = d3.tip()
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
	d3.selectAll("#"+chartcontainer+" g.pie-slice, #"+chartcontainer+" text.pie-slice")
		.call(Tips[number])
		.on('mouseover', function(d, l) {
			if(d.key !== last_tip) {
				Tips[number].show(d, $("#"+chartcontainer+" .pie-slice")[characteristics.indexOf(d.data.key)]);
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
			Tips[number].hide(d);
		});
}

initTip(number);

callTip(number);

function disableClick(number) {
	//Click-Event ausschalten
	d3.selectAll("#"+chartcontainer+" g.pie-slice > path").on('click',null);
    d3.selectAll("#"+chartcontainer+" g.pie-slice > path").on("click", function() { 
	});
	d3.selectAll("#"+chartcontainer+" g.dc-legend-item").on('click',null);
    d3.selectAll("#"+chartcontainer+" g.dc-legend-item").on("click", function() { 
	});
}

disableClick(number);

$("#"+maincontainer+" .dc-legend-item text").attr("x", 17);
$("#"+chartcontainer+" g.pie-slice-group").attr('transform', 'translate(0 0) rotate(270)');
$("#"+chartcontainer+" g.pie-label-group").attr('transform', 'translate(0 0) rotate(270)');
var indexlast=characteristicsLength-1
$("#"+chartcontainer+" g.pie-slice._"+indexlast).hide();
$("#"+chartcontainer+" text.pie-slice.pie-label._"+indexlast).hide();
$("#"+chartcontainer+" g.dc-legend-item:nth-child("+(indexlast+1)+")").hide();

function resizePie(number) {
	//Breite des Hauptcontainers einlesen
	var newWidth = document.getElementById("default"+number).offsetWidth;
	var pieWidth = d3.select("#"+chartcontainer+" g:nth-child(1)").node().getBBox().width;	
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
		var legendHeight = d3.select("#"+chartcontainer+" g.dc-legend").node().getBBox().height;
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

	$("#"+chartcontainer+" g.pie-slice-group").attr('transform', 'translate(0 0) rotate(270)');
	$("#"+chartcontainer+" g.pie-label-group").attr('transform', 'translate(0 0) rotate(270)');
	$("#"+chartcontainer+" g.pie-slice._"+indexlast).hide();
	$("#"+chartcontainer+" text.pie-slice.pie-label._"+indexlast).hide();
	$("#"+chartcontainer+" g.dc-legend-item:nth-child("+(indexlast+1)+")").hide();
	
	disableClick(number);

	Charts[number].transitionDuration(1500);
	$("#"+maincontainer+" .dc-legend-item text").attr("x", 17);
}

$(window).resize(function(){resizePie(number)})

});

addDownloadButton(maincontainer, chartcontainer, number);
addDownloadButtonPng(maincontainer, chartcontainer, number)

}