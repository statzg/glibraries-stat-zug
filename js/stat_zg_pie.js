/* stat_zg_pie.js (version 0.2 (2017.07.10)*/

function getLegendWidth(number) {
	var legendLength = d3.select("#chart"+number+" g.dc-legend").node().childElementCount;
	var legendWidthArray = [];
	for (i=0; i < legendLength; i++) {
		var j=i+1;
		var item = "#chart"+number+" g.dc-legend-item:nth-of-type("+j+")";
		legendWidthArray[i]=d3.select(item).node().getBBox().width;
	};
	legendMaxWidth = Math.max.apply(null, legendWidthArray);
}

function loadPie(number, csv_path, dimension, group, characteristics, scale, showTotal, order, last) {
order = typeof order !== 'undefined' ? order : "alpha";
last = typeof last !== 'undefined' ? last : "";

Atts[number]={};

Atts[number].maincontainer="default"+number;
Atts[number].chartcontainer="chart"+number;

//Breite des Containers ermitteln
var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
totalHeight = 300;

//Charttyp dem Container zuweisen
Charts[number] = dc.pieChart("#"+Atts[number].chartcontainer);

//Daten einlesen
var daten = d3.csv(csv_path, function (error, data) {
	data.forEach(function(d) {
		d[group] = +d[group];
	});

Atts[number].meta = data.filter(function(el) {
	return el["Meta"] == 1
});
	
Atts[number].data = data.filter(function(el) {
	return el["Meta"] == "NA" | el["Meta"] == undefined
});

Atts[number].title=Atts[number].meta.filter(function( el ) { return el.Type == "title";});
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
	
//Daten an Crossfilter übergeben
Atts[number].dataset = crossfilter(Atts[number].data),
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

characteristicsLength= characteristics.length;

var colorScale = d3.scale.ordinal()
            .domain(characteristics)
            .range(colorscheme[scale][characteristicsLength]);
			
Charts[number].width(totalWidth)
	.cx(totalWidth/2)
    .cy((totalHeight/2)-10)
	.height(totalHeight)
    .slicesCap(15)
    .dimension(Atts[number].maindimension)
    .group(Atts[number].maingroup)
	.controlsUseVisibility(true)
	.externalRadiusPadding(10)
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
		if (dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) > 4) {
			return d3.format(".1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100);
		};
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
				.externalRadiusPadding(20+(legendHeight/2));
			Charts[number].redraw();
		}
	Atts[number].counter=1;
	}
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
});

Charts[number].render()

function initTip(number){
	last_tip = null;
	Atts[number].tips = d3.tip()
		.attr('class', 'd3-tip')
		.direction('n')
		.offset([5, 0])
		.html(function(d) {
			if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
			else {wert=germanFormatters.numberFormat(",")(d.data.value)}
			if (typeof showTotal !== 'undefined' && showTotal==true) {
				return "<span>" + d.data.key + "</span><br/>Anteil: " + germanFormatters.numberFormat(",.1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + "</span><br/><span>"+group+": " + wert + "</span>";
			}
			else {
				return "<span>" + d.data.key + "</span><br/>Anteil: " + germanFormatters.numberFormat(",.1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + "</span>";
			}
		});
	$(".pie-label").css( 'pointer-events', 'none' );
}

function callTip(number){
	d3.selectAll("#"+Atts[number].chartcontainer+" g.pie-slice, #"+Atts[number].chartcontainer+" text.pie-slice")
		.call(Atts[number].tips)
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d, $("#"+Atts[number].chartcontainer+" .pie-slice")[characteristics.indexOf(d.data.key)]);
				last_tip = d.key;
			}
			$(".d3-tip").css("border-left", colorScale.range()[i]+" solid 5px");
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
			.externalRadiusPadding(20+(legendHeight/2));
	}
	else {
		Charts[number].height(totalHeight)
			.externalRadiusPadding(10);
	}
	Charts[number].render()
	
	callTip(number);
	
	disableClick(number);

	Charts[number].transitionDuration(1500);
	$("#"+Atts[number].maincontainer+" .dc-legend-item text").attr("x", 17);
}

var columns=[dimension, group]
addDownloadButton(number);
addDownloadButtonPng(number);
addDataTablesButton(number, columns)

$(window).resize(function(){resizePie(number)})



	// render the table(s)
	//tabulate(data, [dimension, group]); // 2 column table

});

}