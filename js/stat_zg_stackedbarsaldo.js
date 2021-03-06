﻿/* stat_zg_stackedbar.js (version 0.3 (2017.11.28)*/
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		"libs": "libraries/",
		"crossfilter": "libraries/crossfilter",
		"d3": "libraries/d3",
		"dc": "libraries/dc"
    }
});

define(['stat_zg_generals','dc','libraries/d3-tip'], function(generals,dc,d3tip){
	return {
		load: function(args) {
			var number = (typeof args.number == 'undefined') ? 1 : args.number;
			var csv_path = (typeof args.csv_path == 'undefined') ? "error" : args.csv_path;
			var dimension = (typeof args.dimension == 'undefined') ? "" : args.dimension;
			var group = (typeof args.group == 'undefined') ? "" : args.group;
			var characteristics = (typeof args.characteristics == 'undefined') ? [] : args.characteristics;
			var stack = (typeof args.stack == 'undefined') ? "" : args.stack
			var characteristicsStack = (typeof args.characteristicsStack == 'undefined') ? [] : args.characteristicsStack;
			var scale = (typeof args.scale == 'undefined') ? 1 : args.scale;
			var relative = (typeof args.relative == 'undefined') ? false : args.relative;
			var showTotal = (typeof args.showTotal == 'undefined') ? true : args.showTotal;
			var showAnteil = (typeof args.showAnteil == 'undefined') ? true : args.showAnteil;
			//var showArea = (typeof args.showArea== 'undefined') ? true : args.showArea;
			//var asDate = (typeof args.asDate == 'undefined') ? true : args.asDate;
			//var dateUnit = (typeof args.dateUnit == 'undefined') ? true : args.dateUnit;
			//var order = (typeof args.order == 'undefined') ? "alpha" : args.order;
			//var last = (typeof args.last == 'undefined') ? "" : args.last;
			//var partei = (typeof args.partei == 'undefined') ? false : args.partei;
			//var highlight = (typeof args.highlight == 'undefined') ? {} : args.highlight;
			var asPercent=(typeof args.asPercent == 'undefined') ? false : args.asPercent;
			var showBarLabels = (typeof args.showBarLabels == 'undefined') ? "never" : args.showBarLabels;
			var saldolabel = (typeof args.saldolabel == 'undefined') ? "Missing Saldolabel" : args.saldolabel;

			//Attributeobjekt initialisieren
			Atts[number]={};

			Atts[number].maincontainer="default"+number
			Atts[number].chartcontainer="chart"+number

			//Container erstellen, falls diese noch nicht existieren (den Hauptcontainer braucht es unweigerlich)
			generals.createcontainers(number);

			//Breite des Containers ermitteln
			var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
			var totalHeight = 360

			//Charttyp dem Container zuweisen
			Charts[number] = dc.barChart("#"+Atts[number].chartcontainer);

			//Daten einlesen
			var daten = d3.csv(csv_path + '?' + Math.floor(Math.random() * 1000), function(error, data) {
				
			var dataValues = d3.values(data)[0];
			if (dimension == undefined | dimension=="") {dimension = Object.keys(dataValues)[1];};
			if (group == undefined | group=="") {group = Object.keys(dataValues)[2];};
			if (stack == undefined | stack=="") {stack = Object.keys(dataValues)[0];};
				
			data.forEach(function(x) {
				x[group] = +x[group];
			});
				
			generals.treatmetadata(number, data, stack, dimension, group);
				
			Atts[number].dataset = crossfilter(Atts[number].data),
				Atts[number].maindimension = Atts[number].dataset.dimension(function(d) {return d[stack];}),
				Atts[number].maingroup       = Atts[number].maindimension.group().reduce(function(p, v) {
					++p.count;
					p[v[dimension]] = (p[v[dimension]] || 0) + v[group];
					p.total += +v[group];
					if(v[dimension]!="Minus") {
						p.saldo += +v[group];
					} else {
						p.saldo += +v[group]*2;
					}
					return p;
				}, function(p, v) {
					--p.count;
					p[v[dimension]] = (p[v[dimension]] || 0) - v[group];
					p.total -= -v[group];
					if(v[dimension]!="Minus") {
						p.saldo += -v[group];
					} else {
						p.saldo += -v[group]*2;
					}
					return p;
				}, function() {
					return { total:0, count:0, saldo:0};
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
				.xAxis().ticks(4)
				;
				
			if (relative==true || asPercent==true) {
			Charts[number].yAxis().tickFormat(d3.format('.0%'));
			Charts[number].renderLabel(false)
			Charts[number].yAxisPadding("0%");
			}
			else {
			Charts[number].yAxis().tickFormat(germanFormatters.numberFormat(","));	
			}

			if (typeof characteristicsStack !== []) {
			Charts[number].x(d3.scale.ordinal().domain(characteristicsStack));
			}

			Charts[number].filter = function() {};

			Charts[number].legend(dc.legend().x(10).y(330).itemHeight(13).gap(10)
						.horizontal(true)
						.legendWidth(totalWidth-10)
						.autoItemWidth(true));

			//Legende Anders ordnen
			dc.override(Charts[number], 'legendables', function() {
				var items = Charts[number]._legendables();
				items[0].name=saldolabel;
				items=items.reverse()
				return items;
			});

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
					
				//Maximale Breite der BarLabels	
				/*var maxwidthbar=0
				var maxheightbar=0
				Charts[number].selectAll("#"+Atts[number].chartcontainer+" text.barLabel")
					.attr('transform', function (d) {
						var coordx = this.getBBox().width;
						if (maxwidthbar < coordx) {
							maxwidthbar = coordx;
						}
						var coordy = this.getBBox().height;
						if (maxheightbar < coordy) {
							maxheightbar = coordy;
						}
					});*/
				
				var legendy=330+maxheight
				d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend").attr("transform", "translate(10,"+legendy+")")
				var legendHeight = d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().getBBox().height;
				Charts[number].width(totalWidth)
				Charts[number].height(totalHeight+maxheight+legendHeight-20)
					.margins({left: YWidth, top: 10, right: 10, bottom: 40 + maxheight + legendHeight});
				Charts[number].render()
				Charts[number].selectAll(".x .tick text")
					.call(generals.wrap, tickwidth);
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
					.call(generals.wrap, Math.min(150, maxwidth));
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
				
				//Letztes Element der Legende ersetzen mit Saldo
				legendLength=d3.select("#"+Atts[number].chartcontainer+" g.dc-legend").node().childElementCount;
				d3.select("#"+Atts[number].chartcontainer+" svg > g.dc-legend g.dc-legend-item:nth-child("+legendLength+") rect").remove();
				d3.select("#"+Atts[number].chartcontainer+" svg > g.dc-legend g.dc-legend-item:nth-child("+legendLength+")").append("line").attr("x1",0).attr("y1",7).attr("x2",13).attr("y2",7).style("stroke", colorscheme[scale][1]).style("stroke-width", 2);
				d3.selectAll('svg > g > g.y > g > text').each(function(d, i) {
					d3.select(this).text(d3.select(this).text().replace("-",""));
				});
				//Wenn nötig Legende umbrechen, funktioniert nur bis 2 Zeilen.
				getLegendWidth(number);
				if (legendMaxWidth > totalWidth-30){
					Charts[number].selectAll("#"+Atts[number].chartcontainer+" g.dc-legend text")
						.call(generals.wrap, totalWidth-30);
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
				//Wenn nötig BarLabels drehen
				/*if (maxwidthbar-6>tickwidth*0.75) {
					d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").attr("transform", function (d) {
						console.log(this.getBBox());
						return ("rotate(90, "+this.getBBox().x+", "+this.getBBox().y+"), translate("+(-(this.getBBox().width/2))+", "+(-this.getBBox().height)+")")
					});
				}*/
				//Click-Event ausschalten
				d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on('click',null);
				d3.selectAll("#"+Atts[number].chartcontainer+" g.stack > rect").on("click", function() { 
				});
				d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on('click',null);
				d3.selectAll("#"+Atts[number].chartcontainer+" g.dc-legend-item").on("click", function() { 
				});
				
				//hide every second x-label if more than 30
				if (Atts[number].maingroup.all().length >= 30) {
					d3.selectAll("#"+Atts[number].chartcontainer+" g.axis.x g.tick text").each(function(d, i) {
						if ( i % 2 == 0) {
							d3.select(this).attr("visibility", "hidden");
						}
					});
				};
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
						columnindex=i-(d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").size()*(Math.floor(i/d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").size())))
						if (showBarLabels=="mouseOver") {
							d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").each(function(e, j) {
								if (j==columnindex) {
									d3.select(this).attr("visibility", "visible");
								}
							});
						}
						if(d.key !== last_tip) {
							Atts[number].tips.show(d);
							last_tip = d.key;
						}
						
						if (asPercent==true) {wert=germanFormatters.numberFormat(",.1f")(d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]]*100)+'%'}
						else if (d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]] % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]])}
						else {wert=germanFormatters.numberFormat(",")(d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]])}
						
						if (showTotal==true & showAnteil==true) {
							tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/Atts[number].maingroup.all().length)]+ "</span><br/><span>Anteil: " +(Math.round((d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]]/d.data.value["total"])*1000)/10).toFixed(1) + '%' + "</span><br/><span>Anzahl: " + wert +  "</span><br/><span>"+saldolabel+": "+germanFormatters.numberFormat(",")(d.data.value["saldo"])+"</span>";
						}
						else if (showTotal==true) {
							tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/Atts[number].maingroup.all().length)]+ "</span><br/><span>"+group+": " + wert +  "</span><br/><span>"+saldolabel+": "+germanFormatters.numberFormat(",")(d.data.value["saldo"])+"</span>";
						}
						else if (showAnteil==true) {
							tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/Atts[number].maingroup.all().length)]+ "</span><br/><span>Anteil: " +(Math.round((d.data.value[characteristics[Math.floor(i/Atts[number].maingroup.all().length)]]/d.data.value["total"])*1000)/10).toFixed(1) + '%' + "</span><br/><span>"+saldolabel+": "+germanFormatters.numberFormat(",")(d.data.value["saldo"])+"</span>";
						}
						else {
							tiptext= "<span>"/* + d.data.key + "</span><br/><span>" */+characteristics[Math.floor(i/Atts[number].maingroup.all().length)]+ "</span><br/><span>"+saldolabel+": "+germanFormatters.numberFormat(",")(d.data.value["saldo"])+"</span>";
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
				d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").each(function(d, i) {
					if (d.data.value["saldo"] % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value["saldo"])}
					else {wert=germanFormatters.numberFormat(",")(d.data.value["saldo"])}
					d3.select(this).text(wert);
					if (showBarLabels=="mouseOver" | showBarLabels=="never") {
						d3.select(this).attr("visibility", "hidden");
					}
				});
			}

			function addSaldo() {
				var barwidth=1*$("#"+Atts[number].chartcontainer+" rect.bar")[1].attributes.width.value
				d3.selectAll("#"+Atts[number].chartcontainer+" text.barLabel").each(function(d, i) {
					d3.select("#"+Atts[number].chartcontainer+" svg g g").append("line")
					.attr("x1",Charts[number].x().range()[i])
					.attr("y1",Charts[number].y().range()[0]-(d.data.value["saldo"]-Charts[number].y().domain()[0])/(Charts[number].y().domain()[1]-Charts[number].y().domain()[0])*(Charts[number].y().range()[1]+Charts[number].y().range()[0]))
					.attr("x2",Charts[number].x().range()[i]+barwidth)
					.attr("y2",Charts[number].y().range()[0]-(d.data.value["saldo"]-Charts[number].y().domain()[0])/(Charts[number].y().domain()[1]-Charts[number].y().domain()[0])*(Charts[number].y().range()[1]+Charts[number].y().range()[0]))
					.style("stroke", colorscheme[scale][1])
					.style("stroke-width", 2)
				});
				//Minusbalken entfernen
				d3.select('g.stack:nth-child(1)').remove();	
			}

			initTip(number);

			callTip(number);

			formatBarLabels();

			addSaldo();

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
				addSaldo();
			});

				Atts[number].exportdata = Atts[number].exportdata.filter(function(el) {
					return el[dimension] != "Minus";
				});

			});

			var columns=[stack];
			columns = columns.concat(characteristics)
			columns.splice(columns.indexOf("Minus"),1)
			console.log(columns)
			generals.addDownloadButton(number);
			generals.addDownloadButtonPng(number)
			generals.addDataTablesButton(number, columns, wide=true)	

		}
	}
});
