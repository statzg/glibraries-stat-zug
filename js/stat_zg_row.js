/* stat_zg_row.js (version 0.3 (2017.11.28)*/

require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		"libs": "libraries/",
		"crossfilter": "libraries/crossfilter",
		"d3": "libraries/d3",
		"dc": "libraries/dc"
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
			//var scale = (typeof args.scale == 'undefined') ? 1 : args.scale;
			//var relative = (typeof args.relative == 'undefined') ? false : args.relative;
			var showTotal = (typeof args.showTotal == 'undefined') ? true : args.showTotal;
			var showAnteil = (typeof args.showAnteil == 'undefined') ? true : args.showAnteil;
			//var showArea = (typeof args.showArea== 'undefined') ? true : args.showArea;
			//var asDate = (typeof args.asDate == 'undefined') ? true : args.asDate;
			//var dateUnit = (typeof args.dateUnit == 'undefined') ? true : args.dateUnit;
			var order = (typeof args.order == 'undefined') ? "alpha" : args.order;
			//var last = (typeof args.last == 'undefined') ? "" : args.last;
			//var partei = (typeof args.partei == 'undefined') ? false : args.partei;
			var highlight = (typeof args.highlight == 'undefined') ? {} : args.highlight;

			showAnteil = typeof showAnteil !== 'undefined' ? showAnteil : false;
			characteristics = characteristics || undefined;

			//Attributeobjekt initialisieren
			Atts[number]={};

			Atts[number].maincontainer="default"+number
			Atts[number].chartcontainer="chart"+number

			//Container erstellen, falls diese noch nicht existieren (den Hauptcontainer braucht es unweigerlich)
			generals.createcontainers(number);

			//Breite des Containers ermitteln
			var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;

			//Charttyp dem Container zuweisen

			d3.selectAll("#"+Atts[number].chartcontainer+" svg").remove()

			Charts[number] = dc.rowChart("#"+Atts[number].chartcontainer);

			//Daten einlesen
			var daten = d3.csv(csv_path + '?' + Math.floor(Math.random() * 1000), function(error, data) {

			var dataValues = d3.values(data)[0];
			if (dimension == undefined | dimension=="") {dimension = Object.keys(dataValues)[0];};
			if (group == undefined | group=="") {group = Object.keys(dataValues)[1];};
				
			var dataValues = d3.values(data)[0];
			if (group=="") {group = Object.keys(dataValues)[1];	};
				
				data.forEach(function(x) {
					x[group] = parseFloat(x[group]);
				});

			if (group.indexOf(" (%)") !== -1) {
				Atts[number].percent=true
				Atts[number].grouplabel=group.replace(" (%)","")
			}
			else {
				Atts[number].percent=false
				Atts[number].grouplabel=group
			}

			generals.treatmetadata(number, data);
				
			//Daten an Crossfilter übergeben
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
				Atts[number].maingroup.all().forEach(function (x) {
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
				.dimension(Atts[number].maindimension)
				.group(Atts[number].maingroup)
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

			if (Atts[number].percent==true) {
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
				
			Charts[number].render();

			Charts[number].filter = function() {};

			function initTip(number) {
				d3.selectAll("#d3-tip"+number).remove();
				last_tip = null;
				Atts[number].tips = d3tip()
					.attr('class', 'd3-tip')
					.attr('id', 'd3-tip'+number)
					.direction('n')
					.offset([-2, 0])
					.html(function(d, i) {
						if (Atts[number].percent==true) {wert=germanFormatters.numberFormat(",.1%")(d.value)}
						else if (d.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.value)}
						else {wert=germanFormatters.numberFormat(",")(d.value)}
						if (showTotal==true && showAnteil==true){
							return "<span>" + d.key + "</span><br/><span>Anteil:" + (Math.round((d.value/Atts[number].secondgroup["Total"].value())*1000)/10).toFixed(2) + '%' + "</span><br/><span>"+Atts[number].grouplabel+": " + wert + "</span>";
						}
						else if (showTotal==true){
							return "<span>" + d.key + "</span><br/><span>"+Atts[number].grouplabel+": " + wert + "</span>";
						}
						else if (showAnteil==true){
							return "<span>" + d.key + "</span><br/><span>Anteil:" + (Math.round((d.value/Atts[number].secondgroup["Total"].value())*1000)/10).toFixed(2) + '%' + "</span>";
						}
						else {
							return "<span>" + d.key + "</span>";
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
				d3.selectAll("#"+Atts[number].chartcontainer+" g.row > rect, #"+Atts[number].chartcontainer+" text.row")
					.call(Atts[number].tips)
					.on('mouseover', function(d, i) {
						if(d.key !== last_tip) {
							Atts[number].tips.show(d, $("#"+Atts[number].chartcontainer+" g.row > rect")[Math.floor(i/2)]);
							last_tip = d.key;
						}
						$("#d3-tip"+number).css("border-left", colorScale.range()[getColorId(d)] +" solid 5px");
						$("#d3-tip"+number).css("border-left", colorScale.range()[getColorId(d)] +" solid 5px");
						offsetx=Math.max(document.getElementsByClassName("d3-tip").offsetLeft + 20, 0) //+ (document.getElementsByClassName("d3-tip")[1].offsetWidth/2);
						$("#d3-tip"+number).css( 'left', offsetx);
					})
					.on('mouseout', function(d) {
						last_tip = null;
						Atts[number].tips.hide(d);
					}); 
			}

			function rotateX(){
				//Breite eines Zwischenstrichs
				var tickwidth=d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#"+Atts[number].chartcontainer+" g.axis > g.tick:nth-child(1)").attr("transform")).translate[0];

				//Zeilen umbrechen, wenn breiter als Zwischenstrich
				Charts[number].selectAll(".x .tick text")
					.call(generals.wrap, tickwidth);

				//Maximale Breite der Skalenbezeichner	
				var maxwidth=0
				var maxheight=0
				Charts[number].selectAll("#"+Atts[number].chartcontainer+" g.axis > g > text")
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
					.call(generals.wrap, tickwidth);
				var maxwidth=0
				var maxheight=0
				Charts[number].selectAll("#"+Atts[number].chartcontainer+" g.axis > g > text")
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
					.call(generals.wrap, Math.min(150, maxwidth));
				d3.selectAll("#"+Atts[number].chartcontainer+" g.axis > g > text")
					.style("text-anchor", "start")
				//var moveleft = (-maxheight)/2-3
				d3.selectAll("#"+Atts[number].chartcontainer+" g.axis > g > text").attr("transform", function (d) {
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

			initTip(number);
			callTip(number);

			var doit;

			//window.onresize = function(event) {
			window.addEventListener('resize', function(){
				clearTimeout(doit);
				doit = setTimeout(function() {
					//Breite des Hauptcontainers einlesen
					d3.selectAll("#"+Atts[number].chartcontainer+" svg").remove()
					var newWidth = document.getElementById('default').offsetWidth;
					Charts[number].width(newWidth)
						.transitionDuration(0);

					Charts[number].render();
					rotateX();
					callTip(number);
					
					Charts[number].transitionDuration(1500);
				}, 200);
			});
				
			var columns=[dimension, group]									 
			generals.addDownloadButton(number);
			generals.addDownloadButtonPng(number)
			generals.addDataTablesButton(number, columns)
				
			});
		}
	}
});
