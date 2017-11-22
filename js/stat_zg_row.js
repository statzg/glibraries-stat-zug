﻿/* stat_zg_line.js (version 0.1 (2017.06.12)*/

function loadRow(number, csv_path, dimension, group, characteristics, scale, highlight, canton, order, showAnteil) {
showAnteil = typeof showAnteil !== 'undefined' ? showAnteil : false;
characteristics = characteristics || undefined;

var maincontainer="default"+number
var chartcontainer="chart"+number

//Breite des Containers ermitteln
var totalWidth = document.getElementById(maincontainer).offsetWidth;

//Charttyp dem Container zuweisen
Charts[number] = dc.rowChart("#"+chartcontainer);

//Daten einlesen
var daten = d3.csv(csv_path, function(error, data) {
	data.forEach(function(x) {
		x[group] = +x[group];
	});
	
var dataValues = d3.values(data)[0];
if (group=="") {group = Object.keys(dataValues)[1];	};

Attributes[number]={};

if (group.indexOf(" (%)") !== -1) {
	Attributes[number]["percent"]=true
	Attributes[number]["grouplabel"]=group.replace(" (%)","")
}
else {
	Attributes[number]["percent"]=false
	Attributes[number]["grouplabel"]=group
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
            .domain(["normal","highlight1","highlight2"])
            .range(colorscheme[1][3]);

Charts[number]
    .width(totalWidth)
    .height(Math.max(characteristicsLength*24+20,300))
    .elasticX(true)
    .dimension(MainDimensions[number])
    .group(MainGroups[number])
	.title(function(d) {
		return ""; 
	})
	.margins({left: 10, top: 10, right: 10, bottom: 10})
	.transitionDuration(1500)
	.colors(colorScale)
	.colorAccessor(function(d) {
		if (d.key in highlight) {
			return "highlight"+highlight[d.key]
		}
		else if(d.value <0) {
			return "highlight2"
		}
		else {
			return "normal"
		}
	});

if (Attributes[number]["percent"]==true) {
	var formatPercent = d3.format(".0%");
	Charts[number].x(d3.scale.linear())
	.xAxis().tickFormat(formatPercent);
}
else {
	Charts[number].xAxis().tickFormat(germanFormatters.numberFormat(","));
}

function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
		if (arraytosearch[i][key] == valuetosearch) {
			return i;
		}
    }
    return null;
}
	
if (order=="desc") {
	Charts[number].ordering(function(d) { return -d.value });
}
else if (order=="asc") {
	Charts[number].ordering(function(d) { return d.value });
}
else if (order=="alpha") {
	Charts[number].ordering(function(d) { return d.key });
}
else if (order=="list") {
	Charts[number].ordering(function(d) { return characteristics.indexOf(d.key) });
}
else {};

/*Charts[number].on('pretransition', function(chart){
	chart.selectAll('g.row text').each(function(d){                           
        d3.select(this).style("fill",                            
            (function(d){
				console.log(d.key)
                var colorcode ="#fff"
				if(highlight[d.key] === 1)   
					colorcode ="#000";
				return colorcode;
            })
		)
    }); 

});*/
	
Charts[number].render();

Charts[number].filter = function() {};

function initTip(number) {
	d3.selectAll("#d3-tip"+number).remove();
	last_tip = null;
	Tips[number] = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction('n')
		.offset([-2, 0])
		.html(function(d, i) {
			if (Attributes[number]["percent"]==true) {wert=germanFormatters.numberFormat(",.1%")(d.value)}
			else if (d.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.value)}
			else {wert=germanFormatters.numberFormat(",")(d.value)}
			if (showAnteil==true){
				return "<span>" + ((canton==true) ? cantondic[d.key] : d.key) + "</span><br/><span>Anteil:" + (Math.round((d.value/SecondaryGroups[number]["Total"].value())*1000)/10).toFixed(2) + '%' + "</span><br/><span>"+Attributes[number]["grouplabel"]+": " + wert + "</span>";
			}
			else {
				return "<span>" + ((canton==true) ? cantondic[d.key] : d.key) + "</span><br/><span>"+Attributes[number]["grouplabel"]+": " + wert + "</span>";
			}
		});
	$("text.row").css( 'pointer-events', 'none' );
}

function getColorId(d) {
	if (d.key in highlight) {
		return highlight[d.key]
	}
	else if(d.value <0) {
		return 2
	}
	else {
		return 0
	}
}

function callTip(number) {
	d3.selectAll("#"+chartcontainer+" g.row > rect, #"+chartcontainer+" text.row")
		.call(Tips[number])
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Tips[number].show(d, $("#"+chartcontainer+" g.row > rect")[Math.floor(i/2)]);
				last_tip = d.key;
			}
			$("#d3-tip"+number).css("border-left", colorScale.range()[getColorId(d)] +" solid 5px");
			$("#d3-tip"+number).css("border-left", colorScale.range()[getColorId(d)] +" solid 5px");
			offsetx=Math.max(document.getElementsByClassName("d3-tip").offsetLeft + 20, 0) //+ (document.getElementsByClassName("d3-tip")[1].offsetWidth/2);
			$("#d3-tip"+number).css( 'left', offsetx);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Tips[number].hide(d);
		}); 
}

function rotateX(){
	//Breite eines Zwischenstrichs
	var tickwidth=d3.transform(d3.selectAll("#"+chartcontainer+" g.axis > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+chartcontainer+" g.axis > g.tick:nth-child(1)").attr("transform")).translate[0];

	//Zeilen umbrechen, wenn breiter als Zwischenstrich
	Charts[number].selectAll(".x .tick text")
		.call(wrap, tickwidth);

	//Maximale Breite der Skalenbezeichner	
	var maxwidth=0
	var maxheight=0
	Charts[number].selectAll("#"+chartcontainer+" g.axis > g > text")
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

	Charts[number].height(Math.max(characteristicsLength*24+20,300)+maxheight-20)
		.margins({left: 10, top: 10, right: 10, bottom: 10 + maxheight});
	Charts[number].render()
	Charts[number].selectAll(".axis .tick text")
		.call(wrap, tickwidth);
	var maxwidth=0
	var maxheight=0
	Charts[number].selectAll("#"+chartcontainer+" g.axis > g > text")
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
	Charts[number].height(Math.max(characteristicsLength*24+20,300)+Math.min(150, maxwidth)-20)
		.margins({left: 10, top: 10, right: 10, bottom: 10 + +Math.min(150, maxwidth)});
	Charts[number].render()
	Charts[number].selectAll(".axis .tick text")
		.call(wrap, Math.min(150, maxwidth));
	d3.selectAll("#"+chartcontainer+" g.axis > g > text")
		.style("text-anchor", "start")
	//var moveleft = (-maxheight)/2-3
	d3.selectAll("#"+chartcontainer+" g.axis > g > text").attr("transform", function (d) {
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

initTip(number);
callTip(number);

//window.onresize = function(event) {
window.addEventListener('resize', function(){
  //Breite des Hauptcontainers einlesen
	var newWidth = document.getElementById('default').offsetWidth;
	Charts[number].width(newWidth)
		.transitionDuration(0);

	Charts[number].render();
	rotateX();
	callTip(number);
	
	Charts[number].transitionDuration(1500);
	
	});
});

addDownloadButton(maincontainer, chartcontainer, number);
addDownloadButtonPng(maincontainer, chartcontainer, number)

}
