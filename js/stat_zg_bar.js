﻿/* stat_zg_bar.js (version 0.3 (2017.11.28)*/

require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		"libs": "libraries/",
		"crossfilter": "https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.5/crossfilter",
		"d3": "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3",
		"dc": "https://cdnjs.cloudflare.com/ajax/libs/dc/2.1.0/dc"
    }
});

define(['stat_zg_generals','dc','libs/d3-tip'], function(generals,dc,d3tip){
	return {
		load: function(args) {
			
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
			//var dateUnit = (typeof args.dateUnit == 'undefined') ? true : args.dateUnit;
			var order = (typeof args.order == 'undefined') ? "alpha" : args.order;
			var last = (typeof args.last == 'undefined') ? "" : args.last;
			//var partei = (typeof args.partei == 'undefined') ? false : args.partei;
			//var highlight = (typeof args.highlight == 'undefined') ? {} : args.highlight;
			var percent = (typeof args.percent == 'undefined') ? false : args.percent;
			var showBarLabels = (typeof args.showBarLabels == 'undefined') ? "always" : args.showBarLabels;

			//Attributeobjekt initialisieren
			Atts[number]={};

			Atts[number].maincontainer="default"+number
			Atts[number].chartcontainer="chart"+number

			//Container erstellen, falls diese noch nicht existieren (den Hauptcontainer braucht es unweigerlich)
			generals.createcontainers(number);

			//Breite des Containers ermitteln
			var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
			var totalHeight = 320

			//Charttyp dem Container zuweisen
			Charts[number] = dc.barChart("#"+Atts[number].chartcontainer);

			//Daten einlesen
			var daten = d3.csv(csv_path, function(error, data) {

			var dataValues = d3.values(data)[0];
			if (dimension == undefined | dimension=="") {dimension = Object.keys(dataValues)[1];};
			if (group == undefined | group=="") {group = Object.keys(dataValues)[2];};
				
			data.forEach(function(x) {
				x[group] = +x[group];
			});
				
			generals.treatmetadata(number, data);

			Atts[number].dataset = crossfilter(Atts[number].data),
				Atts[number].maindimension = Atts[number].dataset.dimension(function (d) {
					return d[dimension];
				}),
				Atts[number].maingroup = Atts[number].maindimension.group().reduceSum(function (d) {
					return d[group];
				});
				Atts[number].secondgroup={};
				Atts[number].secondgroup["Total"] = Atts[number].dataset.groupAll().reduceSum(function (d) {
					return d[group];
				});

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
				.dimension(Atts[number].maindimension)
				.group(Atts[number].maingroup)
				.renderLabel(true)
				.ordinalColors(colorscheme[scale][characteristicsLength])
				.transitionDuration(0)
				.yAxisPadding("5%")
				.ordering(function(d) { return characteristics.indexOf(d.key); })
				;

			Charts[number].filter = function() {};

			if (percent==true) {
				Charts[number].yAxis().tickFormat(d3.format(".1%"));
			} else {
				Charts[number].yAxis().tickFormat(germanFormatters.numberFormat(","));
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
					Charts[number].margins({left: YWidth, top: 10, right: 10, bottom: 20});
					Charts[number].render()
				}
			}

			adaptY();

			function rotateX(){
				//Breite eines Zwischenstrichs
				var tickwidth=d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];;

				//Zeilen umbrechen, wenn breiter als Zwischenstrich
				Charts[number].selectAll(".x .tick text")
					.call(generals.wrap, tickwidth);

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

				Charts[number].height(totalHeight+maxheight-20)
					.margins({left: YWidth, top: 10, right: 10, bottom: 10 + maxheight});
				Charts[number].render()
				Charts[number].selectAll(".x .tick text")
					.call(generals.wrap, tickwidth);
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
				Charts[number].height(totalHeight+Math.min(150, maxwidth)-20)
					.margins({left: YWidth, top: 10, right: 10, bottom: 10 + +Math.min(150, maxwidth)});
				Charts[number].render()
				Charts[number].selectAll(".x .tick text")
					.call(generals.wrap, Math.min(150, maxwidth));
				d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text")
					.style("text-anchor", "start")
				//var moveleft = (-maxheight)/2-3
				d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x > g > text").attr("transform", function (d) {
					var moveleft = (-(this.getBBox().height)/2)-5;
					return ("rotate(90), translate(10,"+moveleft+")")
				});
				}
				//Click-Event ausschalten
				d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on('click',null);
				d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on("click", function() {
				});
			}

			rotateX();

			function initTip(number){
				last_tip = null;
				Atts[number].tips = d3tip()
					.attr('class', 'd3-tip')
					.attr('id', 'd3-tip'+number)
					.direction('n')
					.offset([5, 0])
					.html("no data");
					
				if (showBarLabels!="never") {
					Atts[number].tips
						.direction('s')
						.offset([5, 0]);
				}
			}

			function callTip(number){
				d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect")
					.call(Atts[number].tips)
					.on('mouseover', function(d, i) {
						if (showBarLabels=="mouseOver") {
							d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").each(function(e, j) {
								if (j==i) {
									d3.select(this).attr("visibility", "visible");
								}
							});
						}
						if(d.key !== last_tip) {
							Atts[number].tips.show(d);
							last_tip = d.key;
						}
						if (percent==true) {wert=d3.format(".1%")(d.data.value)}
						else if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
						else {wert=germanFormatters.numberFormat(",")(d.data.value)}
						if (showTotal==true & showAnteil==true) {
							tiptext= "<span>" + d.data.key + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.data.value/Atts[number].secondgroup["Total"].value()) + "</span><br/><span>"+group+": " +wert+  "</span>";
						}
						else if (showTotal==true) {
							tiptext= "<span>" + d.data.key + "</span><br/><span>"+group+": " +wert+  "</span>";
						}
						else if (showAnteil==true) {
							tiptext= "<span>" + d.data.key + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.data.value/Atts[number].secondgroup["Total"].value()) + "</span>";
						}
						else {
							tiptext= "<span>" + d.data.key + "</span>";
						};

						$("#d3-tip"+number).html(tiptext)
						$("#d3-tip"+number).css("border-left", colorScale.range()[Math.floor(i/Atts[number].maingroup.all().length)] +" solid 5px");
						offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
						offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 0 - ($("#d3-tip"+number).height()));
						$("#d3-tip"+number).css( 'left', offsetx);
						if (showBarLabels=="never") {
							$("#d3-tip"+number).css( 'top', offsety);
						}
					})
					.on('mouseout', function(d) {
						last_tip = null;
						Atts[number].tips.hide(d);
						if (showBarLabels=="mouseOver") {
							d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").each(function(d, i) {
								d3.select(this).attr("visibility", "hidden");
							});
						}
					});
			}

			function formatBarLabels(){
				if (showBarLabels!="never") {
					d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").each(function(d, i) {
						if (percent==true) {wert=d3.format(".1%")(d.data.value)}
						else if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
						else {wert=germanFormatters.numberFormat(",")(d.data.value)}
						d3.select(this).text(wert);
						if (showBarLabels=="mouseOver") {
							d3.select(this).attr("visibility", "hidden");
						}
					});
				}
				if (showBarLabels=="never") {
					d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").remove()
				}
			}

			initTip(number);

			callTip(number);

			formatBarLabels();

			var doit;

			window.onresize = function(event) {
				clearTimeout(doit);
				doit = setTimeout(function() {
					//Breite des Hauptcontainers einlesen
					totalWidth = document.getElementById('default'+number).offsetWidth;
					Charts[number].width(totalWidth)
						.transitionDuration(0);
					Charts[number].render()

					rotateX();
					callTip(number);
					formatBarLabels();
				}, 200);
			};

			});

			var columns=[dimension, group];
			generals.addDownloadButton(number);
			generals.addDownloadButtonPng(number);
			generals.addDataTablesButton(number, columns);
		}
	}
});
