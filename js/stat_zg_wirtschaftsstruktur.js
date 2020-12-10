
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		"libs": "libraries/",
		"urijs":"libraries/URI",
		"crossfilter": "libraries/crossfilter",
		"d3": "libraries/d3",
		"dc": "libraries/dc",
		"d3queue":"libraries/queue"
    },
    shim:{
		'crossfilter':{
			exports:'crossfilter'
		} 
    }
//	findNestedDependencies: true,
/*	shim:{
		'dc':{
			deps:['d3'],
			exports:'dc'	
		}
	}*/
});

define(['stat_zg_generals','dc','libs/d3-tip','d3queue'], function(generals,dc,d3tip,queue){

	return {
		load: function(args) {
			var number = typeof args.number == 'undefined' ? 1 : args.number;
			var gemeinde = (typeof gemeinde == 'undefined') ? "Zug" : args.groupFilter;
			
			//Objekte für Grafik- und Tabelle-Export initialisieren.
			Atts[number]={};

			Atts[number].maincontainer="wirtschaftsstruktur-container"

			Atts[number].chartcontainer="wirtschaftsstruktur-chart"
			
			var tduration=1000
			
			//Grafiken initialisieren
			var wirtschaftsstrukturChart1 = dc.pieChart("#wirtschaftsstrukturw1-chart");
			var wirtschaftsstrukturChart2 = dc.pieChart("#wirtschaftsstrukturw2-chart");
			
			//Alle Daten einlesen
			var q = queue.queue()
				.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-10.csv");

			
			q.await(function(error, data10) {
				
				if (error) throw error;

				//Metadaten auslesen und Datenobjekte für Tabellen-Export generieren.
				meta10 = data10.filter(function(el) {
					return el["Meta"] == 1
				});
				
				Atts[number].meta=meta10
				
				Atts[number].typerow = meta10.filter(function( el ) { return el.Type == "datatypes";});
				if (Atts[number].typerow.length == 1) {
					Atts[number].datatypes = (Atts[number].typerow[0].Content).split(/,\s?/);
				}	
				
				Atts[number].data = data10.filter(function(el) {
					return el["Meta"] == "NA" | el["Meta"] == undefined | el["Meta"] == ""
				});
				
				Atts[number].data.forEach(function(x) {
					x["Betriebe"] = +x["Betriebe"];
					x["Beschäftigte"] = +x["Beschäftigte"];
				});
					
				Atts[number].exportdata=Atts[number].data
				
				year10 = meta10.filter(function( el ) { return el.Type == "year";});
				if (year10.length == 1) {
					$(".wirtschaftsstrukturyear").html("("+year10[0].Content+")");
				}
				
				//Daten in Crossfilter-Objekt abfüllen.
				Atts[number].dataset = crossfilter();
				
				Atts[number].dataset.add(data10.map(function(d) {
					return {Gemeinde: d["Gemeinde"], "Sektor":d["Sektor"], "BetriebenachSektor":d["Betriebe"], "BeschäftigtenachSektor":d["Beschäftigte"]};
				}));

				//Crossfilter Gruppen und Dimensionen definieren.
				
				//Funktion um leere Zeilen aus Gruppen entfernen
				function remove_bins(source_group) { // (source_group, bins...}
					var bins = ["", "NaN", 0];
					return {
						all:function () {
							return source_group.all().filter(function(d) {
								return bins.indexOf(d.key) === -1;
							});
						}
					};
				}	
				
				var gemeinden = Atts[number].dataset.dimension(function (d) {
					return d["Gemeinde"];
				});
								
				function multivalue_filter(values) {
					return function(v) {
						return values.indexOf(v) !== -1;
					};
				}

				gemeinden.filterFunction(multivalue_filter(args.groupFilter));

				var einwohner = gemeinden.group().reduceSum(function (d) {
					return +d["Ständige Wohnbevölkerung"];
				});
				
				var SektorDimension = Atts[number].dataset.dimension(function (d) {
					return d["Sektor"];
				});
				
				var BetriebenachSektorGroup = SektorDimension.group().reduceSum(function (d) {
					return d["BetriebenachSektor"];
				});
				var RealBetriebenachSektorGroup = remove_bins(BetriebenachSektorGroup);
				var BeschäftigtenachSektorGroup = SektorDimension.group().reduceSum(function (d) {
					return d["BeschäftigtenachSektor"];
				});
				var RealBeschäftigtenachSektorGroup = remove_bins(BeschäftigtenachSektorGroup);
				
				//Accessor-Funktionen
				var average = function(d) {
					return d.n ? d.tot / d.n : 0;
				};
				
				var total = function(d) {
					return d.tot;
				};
				
				var anteil = function(d) {
					return d.ant;
				};
				
				var rowCount = function(d) {
					return d.n;
				};

				//Counter für Anzahl Redraws
				var redrawx=0;
					
				function neuzeichnen() {

					//Karte
					var totalWidth = document.getElementById('default').offsetWidth;
					
					if (typeof uri.search(true)["isolate"] != "undefined") {
						totalWidth=650
					}
					
					var namenGemeinden=["Baar", "Cham", "Hünenberg", "Menzingen", "Neuheim", "Oberägeri", "Risch", "Steinhausen", "Unterägeri", "Walchwil" ,"Zug", "See"]
					
					//Grafik zur Wirtschaftsstruktur
					var characteristicsWirtschaftsstruktur=["Land- und Forstwirtschaft", "Industrie und Gewerbe", "Dienstleistung"]
					
					var colorScaleWirtschaftstruktur = d3.scale.ordinal()
						.domain(characteristicsWirtschaftsstruktur)
						.range([colorscheme[1][3][2],colorscheme[1][3][1],colorscheme[1][3][0]]);
					
					var wirtschaftsHeight=Math.min(500, totalWidth);
					
					//Es werden zwei Kuchen übereinander gelegt
					wirtschaftsstrukturChart1.width(totalWidth)
						.cx(totalWidth/2)
						.cy(Math.min(500, totalWidth)/2)
						.height(wirtschaftsHeight)
						//.slicesCap(15)
						.dimension(SektorDimension)
						.group(RealBetriebenachSektorGroup)
						.controlsUseVisibility(true)
						.externalRadiusPadding(0.1*wirtschaftsHeight)
						.emptyTitle("Keine Daten vorhanden")
						.innerRadius(0.3*wirtschaftsHeight)
						.colors(colorScaleWirtschaftstruktur)
						.transitionDuration(tduration)
						.title(function(d) {
							return ""; 
						})
						.ordering(function(d) { return characteristicsWirtschaftsstruktur.indexOf(d.key); })
						.legend(dc.legend().x(10).y(10).itemHeight(13).gap(10)
							.horizontal(false))
						.on('renderlet', function(chart){
							//Labels mit Prozentzahlen ersetzen
							chart.selectAll('text.pie-slice').text( function(d) {
								if (dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) > 3) {
									return d3.format(".1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100);
								};
							});
						})
						.filter = function() {}
						;
						
					wirtschaftsstrukturChart2.width(totalWidth)
						.cx(totalWidth/2)
						.cy(Math.min(500, totalWidth)/2)
						.height(wirtschaftsHeight)
						//.slicesCap(15)
						.dimension(SektorDimension)
						.group(RealBeschäftigtenachSektorGroup)
						.controlsUseVisibility(true)
						.externalRadiusPadding(0.2*wirtschaftsHeight)
						.emptyTitle("Keine Daten vorhanden")
						.innerRadius(0.2*wirtschaftsHeight)
						.colors(colorScaleWirtschaftstruktur)
						.transitionDuration(tduration)
						.title(function(d) {
							return ""; 
						})
						.ordering(function(d) { return characteristicsWirtschaftsstruktur.indexOf(d.key); })
						.on('renderlet', function(chart){
							//Labels mit Prozentzahlen ersetzen
							chart.selectAll('text.pie-slice').text( function(d) {
								if (dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) > 3) {
									return d3.format(".1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100);
								};
							});
						})
						.filter = function() {}
						;
					

					//Alles Zeichen
					wirtschaftsstrukturChart1.render();
					wirtschaftsstrukturChart2.render();
					//dc.renderAll();
					
					//Objekt mit Tips erstellen
					if (typeof Tips == 'undefined') { Tips = {} };
					
					//Funktion zur Initialisierung der Tooltips
					function initTip(subnumber){
						last_tip = null;
						Tips[subnumber] = d3tip()
							.attr('class', 'd3-tip')
							.attr('id', 'd3-tip'+subnumber)
							.direction('n')
							.offset([0, 0])
							.html("no data");
						$(".pie-label").css( 'pointer-events', 'none' );
					}
					
					d3.selectAll(".d3-tip").remove();
					//Tooptips effektiv initialisieren, noch vor allem anderen
					initTip("w1");
					initTip("w2");					
					
					function callTipWirtschaftsstruktur(subnumber){
						d3.selectAll("#wirtschaftsstruktur"+subnumber+"-chart g.pie-slice, #wirtschaftsstruktur"+subnumber+"-chart text.pie-slice")
							.call(Tips[subnumber])
							.on('mouseover', function(d, i) {
								if(d.key !== last_tip) {
									Tips[subnumber].show(d, $("#wirtschaftsstruktur"+subnumber+"-chart g.pie-slice")[characteristicsWirtschaftsstruktur.indexOf(d.data.key)]);
									last_tip = d.key;
								}
								if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
								else {wert=germanFormatters.numberFormat(",")(d.data.value)}
								if (subnumber==1) {var gruppe="Anzahl Betriebe"} else {var gruppe="Anzahl Beschäftigte"};
								tiptext="<span>" + d.data.key + "</span><br/>Anteil: " + germanFormatters.numberFormat(",.1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + "</span><br/><span>"+gruppe+": " + wert + "</span>"
								$("#d3-tip"+subnumber).html(tiptext)
								$("#d3-tip"+subnumber).css("border-left", colorScaleWirtschaftstruktur(d.data.key)+" solid 5px");
								offsetx=(Number($("#d3-tip"+subnumber).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+subnumber).width()/2));
								offsety=(Number($("#d3-tip"+subnumber).css( "top" ).slice(0, -2)) -10 - ($("#d3-tip"+subnumber).height()/2));
								$("#d3-tip"+subnumber).css( 'left', offsetx);
								$("#d3-tip"+subnumber).css( 'top', offsety);
							})
							.on('mouseout', function(d) {
								last_tip = null;
								Tips[subnumber].hide(d);
							});
					}
					
					//Tooltips anbinden
					
					callTipWirtschaftsstruktur("w1");
					callTipWirtschaftsstruktur("w2");
					
					//Abstand in der Legende erhöhen
					
					$(".dc-legend-item text").attr("x", 17);
					$("title").remove();
				
					//Erst nach dem Zeichnen aller Grafiken: Kuchendiagramm mit Pfeilen ergänzen, 

					$( document ).ready(function() {
						setTimeout(function() {
						
							var arrowhead="M374.203,1150c-25.391,0-50.818-9.721-70.199-29.044c-38.789-38.834-38.789-101.685,0-140.376L685.37,599.14L305.74,219.451c-38.716-38.741-38.716-101.614,0-140.379c38.799-38.763,101.663-38.763,140.389,0l449.857,449.915 c18.58,18.629,29.103,43.84,29.103,70.153c0,26.339-10.523,51.551-29.103,70.226l-451.592,451.59 C425.012,1140.279,399.621,1150,374.203,1150z"
							var markerblack={"id":"arrowblack", "viewBox":"0 -5 1200 1200", "refX":-200, "refY":600, "markerWidth":3, "markerHeight":3, "orient":"auto"};
							
							svg = d3.selectAll("#wirtschaftsstrukturw1-chart svg")
							
							min=269
							max=500
							
							svg.selectAll("marker").remove();
							svg.selectAll(".arrow").remove();
							svg.selectAll(".arrowtext").remove();
							
							
							svg.append("marker")
								.attr(markerblack)
								.append("path")
									.attr("d", arrowhead)
									.attr("class","arrowHead")
									.attr("fill", "#32444a")
									//.attr("fill-opacity", "0.5");
											
							svg.append("path")
								.attr("class", "arrow")
								.attr("id", "line1")
								.attr("stroke-width", (0.01*wirtschaftsHeight))
								.attr("stroke", "#32444a")
								.attr("fill", "none")
								.attr("stroke-linecap", "round")
								//.attr("stroke-opacity", "0.5")
								.attr("marker-end", "url(#arrowblack)")
								.attr("d", function(d) {
									/*var scalewidth=1*d3.transform(svg.select("g.axis.y").attr("transform")).translate[0];
									var rectwidth=svg.select("g.sub._0 rect:nth-child(1)").attr("width");
									var y1=svg.select("g.sub._0 rect:nth-child(1)").attr("y")-5;
									var x1=(1*svg.select("g.sub._0 rect:nth-child(1)").attr("x"))+scalewidth+rectwidth/2;
									var y2=svg.select("g.sub._0 rect:nth-child(2)").attr("y")-5;
									var x2=(1*svg.select("g.sub._0 rect:nth-child(2)").attr("x"))+scalewidth+rectwidth/2-20;*/
									return "M"+((totalWidth/2)-(0.08*wirtschaftsHeight))+","+((wirtschaftsHeight/2)-(0.04*wirtschaftsHeight))+" "+((totalWidth/2)+(0.32*wirtschaftsHeight))+" "+((wirtschaftsHeight/2)-(0.04*wirtschaftsHeight));
								});
									
							svg.append("text")
								.attr("class", "arrowtext")
								.attr("x", ((totalWidth/2)-(0.08*wirtschaftsHeight)))
								.attr("y", ((wirtschaftsHeight/2)-(0.06*wirtschaftsHeight)))
								.attr("font-size", (10+(0.02*wirtschaftsHeight)))
								.attr("fill", "#32444a")
								.text("Betriebe");	
									
							svg.append("path")
								.attr("class", "arrow")
								.attr("id", "line2")
								.attr("stroke-width", (0.01*wirtschaftsHeight))
								.attr("stroke", "#32444a")
								.attr("fill", "none")
								.attr("stroke-linecap", "round")
								//.attr("stroke-opacity", "0.5")
								.attr("marker-end", "url(#arrowblack)")
								.attr("d", function(d) {
									/*var scalewidth=1*d3.transform(svg.select("g.axis.y").attr("transform")).translate[0];
									var rectwidth=svg.select("g.sub._0 rect:nth-child(1)").attr("width");
									var y1=svg.select("g.sub._0 rect:nth-child(1)").attr("y")-5;
									var x1=(1*svg.select("g.sub._0 rect:nth-child(1)").attr("x"))+scalewidth+rectwidth/2;
									var y2=svg.select("g.sub._0 rect:nth-child(2)").attr("y")-5;
									var x2=(1*svg.select("g.sub._0 rect:nth-child(2)").attr("x"))+scalewidth+rectwidth/2-20;*/
									return "M"+((totalWidth/2)-(0.08*wirtschaftsHeight))+","+((wirtschaftsHeight/2)+(0.06*wirtschaftsHeight))+" "+((totalWidth/2)+(0.21*wirtschaftsHeight))+" "+((wirtschaftsHeight/2)+(0.06*wirtschaftsHeight));
								});
								
							svg.append("text")
								.attr("class", "arrowtext")
								.attr("x", ((totalWidth/2)-(0.08*wirtschaftsHeight)))
								.attr("y", ((wirtschaftsHeight/2)+(0.04*wirtschaftsHeight)))
								.attr("font-size", (10+(0.02*wirtschaftsHeight)))
								.attr("fill", "#32444a")
								.text("Beschäftigte");	
									
						}, 1000);
						
					});
					
					//Bei der Wirtschaftsstruktur den Mouseover reparieren
					$('#wirtschaftsstrukturw1-chart').css( 'pointer-events', 'none' );
					$('.pie-slice').css( 'pointer-events', 'all' );
					
				}
				
				//Effektives Zeichnen der Grafiken.	
				neuzeichnen();

				//Funktion für die Änderung der Fensterbreite
				function resizeWindow() {
					d3.selectAll(".d3-tip").remove();
					d3.selectAll("svg").remove()
					neuzeichnen()
				}
				
				var w = 0;

				$( window ).on('load', function(){
					w = $( window ).width();
				});
				
				var doit;
				
				$(window).resize(function(){
					if (typeof uri.search(true)["isolate"] == "undefined") {
						if( w != $( window ).width() ){
							clearTimeout(doit);
							doit = setTimeout(function() {
								resizeWindow()
							}, 200);
							w = $( window ).width();
							delete w;
						}
					}
				});	

			});
				
			//Download-Knöpfe anbringen
			var columns=["Gemeinde", "Sektor", "Betriebe", "Beschäftigte"];
			generals.addDownloadButton(number);
			generals.addDownloadButtonPng(number);
			generals.addDataTablesButton(number, columns);
		}
	}
});