/* stat_zg_migrationmap_gemeinden.js (version 0.3 (2017.11.28)*/

/*Angepasst von http://bl.ocks.org/cingraham/7663357 */

function loadMigrationMapGemeinde(args) {
var number = (typeof args.number == 'undefined') ? 1 : args.number;
var csv_path = (typeof args.csv_path == 'undefined') ? "error" : args.csv_path;
//var dimension = (typeof args.dimension == 'undefined') ? "" : args.dimension;
//var group = (typeof args.group == 'undefined') ? "" : args.group;
//var characteristics = (typeof args.characteristics == 'undefined') ? [] : args.characteristics;
//var stack = (typeof args.stack == 'undefined') ? "" : args.stack
//var characteristicsStack = (typeof args.characteristicsStack == 'undefined') ? [] : args.characteristicsStack;
//var scale = (typeof args.scale == 'undefined') ? 1 : args.scale;
//var relative = (typeof args.relative == 'undefined') ? false : args.relative;
//var showTotal = (typeof args.showTotal == 'undefined') ? true : args.showTotal;
//var showAnteil = (typeof args.showAnteil == 'undefined') ? true : args.showAnteil;
//var showArea = (typeof args.showArea== 'undefined') ? true : args.showArea;
//var asDate = (typeof args.asDate == 'undefined') ? true : args.asDate;
//var dateUnit = (typeof args.dateUnit == 'undefined') ? "month" : args.dateUnit;
//var order = (typeof args.order == 'undefined') ? "alpha" : args.order;
//var last = (typeof args.last == 'undefined') ? "" : args.last;
//var partei = (typeof args.partei == 'undefined') ? false : args.partei;
//var highlight = (typeof args.highlight == 'undefined') ? {} : args.highlight;

//Attributeobjekt initialisieren
Atts[number]={};

Atts[number].maincontainer="default"+number
Atts[number].chartcontainer="chart"+number

//Container erstellen, falls diese noch nicht existieren (den Hauptcontainer braucht es unweigerlich)
createcontainers(number);

var coloring = d3.scale.linear()
	.domain([0, 25, 50, 75, 100])
	.range(["#007AC4", "#00A763", "#FFDD5E", "#FF8A26", "#FF403A"]);

var recoder=[0,100,50,25,75,50,100,0,25,0,75,25,50,0,50,50,75,0,50,75,25,100,100,25,0,0,100]
		
var cantoncolors=colorscheme[1][20]

function redraw(number) {

	//Width and height
	Atts[number].w = document.getElementById(Atts[number].maincontainer).offsetWidth;
	Atts[number].h = 450;
	Atts[number].center = [Atts[number].w / 2, Atts[number].h / 2]
	Atts[number].scalemax = 13500
	Atts[number].scalemin = 13000
	Atts[number].scale = Math.min( Atts[number].scalemin + (Atts[number].w - 275)*45, Atts[number].scalemax);
	Atts[number].lat = 8.508589899
	Atts[number].lon = 47.18479567

	Atts[number].projection = d3.geo.mercator()
		.center([Atts[number].lat,Atts[number].lon])
		.scale(Atts[number].scale)
		.translate([Atts[number].w / 2 , Atts[number].h / 2 ]);
		
	Atts[number].zoom = d3.behavior.zoom()
		.translate([Atts[number].w / 2, Atts[number].h / 2])
		.scale(Atts[number].scale)
		.scaleExtent([0.6 * Atts[number].scale, 8 * Atts[number].scale])
		.on("zoom", zoomed);
		
	//Define path generator
	var path = d3.geo.path()
		.projection(Atts[number].projection);
	
	var colors = ['#007ac4','#ff403a'];
  
	var circleSize = d3.scale.linear().range([0,55000]).domain([0, 137175]);

	var lineSize = d3.scale.linear().range([1,75]).domain([0, 7000]);

	//Create SVG element
	Atts[number].svg = d3.select("#" + Atts[number].chartcontainer)
	    .on("touchstart", nozoom)
		.on("touchmove", nozoom)
		.on("mousemove", mouseposition)
		.append("svg")
		.attr("width", Atts[number].w)
		.attr("height", Atts[number].h)
		.style("background", "#fff")
		.style("overflow", "hidden");
	
	var arrowhead="M374.203,1150c-25.391,0-50.818-9.721-70.199-29.044c-38.789-38.834-38.789-101.685,0-140.376L685.37,599.14L305.74,219.451c-38.716-38.741-38.716-101.614,0-140.379c38.799-38.763,101.663-38.763,140.389,0l449.857,449.915 c18.58,18.629,29.103,43.84,29.103,70.153c0,26.339-10.523,51.551-29.103,70.226l-451.592,451.59 C425.012,1140.279,399.621,1150,374.203,1150z"
	var markerblue={"id":"arrowblue", "viewBox":"0 -5 1200 1200", "refX":-200, "refY":600, "markerWidth":1, "markerHeight":1, "orient":"auto"};
	var markerred={"id":"arrowred", "viewBox":"0 -5 1200 1200", "refX":-200, "refY":600, "markerWidth":1, "markerHeight":1, "orient":"auto"};
	
	
	Atts[number].svg.append("marker")
		.attr(markerblue)
		.append("path")
			.attr("d", arrowhead)
			.attr("class","arrowHead")
			.attr("fill", colors[0]);
					
	Atts[number].svg.append("marker")
		.attr(markerred)
		.append("path")
			.attr("d", arrowhead)
			.attr("class","arrowHead")
			.attr("fill", colors[1]);
			
	Atts[number].svg.append("defs").append("clipPath")
		.attr("id", "clip" + number)
		.append("rect")
		.attr("width", Atts[number].w)
		.attr("height", Atts[number].h);
		
	Atts[number].svg.append('circle').attr('id', 'tipfollowscursor')
		.attr('r',1)
		.attr("opacity", "0");
		
	Atts[number].svg.call(Atts[number].zoom)
		.call(Atts[number].zoom.event);
	
	Atts[number].g = Atts[number].svg.append("g");

	//var coming, going;
	/*d3.csv("coming.csv", function (data) {
		coming = data;
	});*/
					
	d3.csv(csv_path, function (data) {
	
	treatmetadata(number, data);

	Atts[number].gdata = Atts[number].data;
	
	Atts[number].data = Atts[number].data.filter(function(el) {
		return el["Zielkanton"] != "Aegerisee" & el["Zielkanton"] != "Zugersee" & el["Zielkanton"] != "Zürichsee"
	});
	
		d3.json("/behoerden/gesundheitsdirektion/statistikfachstelle/daten/geojson/gemeindenundseenschweiz.json", function (json) {

		for (var i = 0; i < Atts[number].gdata.length; i++) {
			var dataName = Atts[number].gdata[i].Arbeitsgemeindenummer;
			var dataSource = Atts[number].gdata[i].Wohngemeindenummer;
			var tempObj = {};
			for (var propt in Atts[number].gdata[i]) {
				var valz = parseFloat(Atts[number].gdata[i][propt]);
				tempObj[propt] = valz;
			}
			
			//Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++) {
				var jsonState = json.features[j].properties.GMDNR;
				if (dataName == jsonState) {
					matched = true;
					json.features[j].properties.Zielkanton = dataName;
					json.features[j].properties.Arbeitsgemeinde = Atts[number].gdata[i].Arbeitsgemeinde
					json.features[j].properties.Arbeitsgemeindenummer = Atts[number].gdata[i].Arbeitsgemeindenummer
					json.features[j].properties["Arbeitskanton Kürzel"] = Atts[number].gdata[i]["Arbeitskanton Kürzel"]
					json.features[j].properties.Arbeitskanton = Atts[number].gdata[i].Arbeitskanton
					json.features[j].id = dataName;
					json.features[j].ind = 10;
					json.features[j].wohnorte = json.features[j].wohnorte || {};
					json.features[j].wohnorte[dataSource] = {"Wohnort": Atts[number].gdata[i].Wohngemeinde, "Wohnkanton Kürzel": Atts[number].gdata[i]["Wohnkanton Kürzel"], "Anzahl": Atts[number].gdata[i].Erwerbstätige }
					/*for (var propt in tempObj) {
						if(!isNaN(tempObj[propt])) {
							json.features[j].properties[propt] = tempObj[propt];
						}
					}*/
					break;
				}
			}
						//Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++) {
				var jsonState = json.features[j].properties.GMDNR;
				if (dataSource == jsonState) {
					matched = true;
					json.features[j].properties.Zielkanton = dataName;
					json.features[j].properties.Wohngemeinde = Atts[number].gdata[i].Wohngemeinde
					json.features[j].properties.Wohngemeindenummer = Atts[number].gdata[i].Wohngemeindenummer
					json.features[j].properties["Wohnkanton Kürzel"] = Atts[number].gdata[i]["Wohnkanton Kürzel"]
					json.features[j].properties.Wohnkanton = Atts[number].gdata[i].Wohnkanton
					json.features[j].id = dataSource;
					json.features[j].ind = 10;
					json.features[j].arbeitsorte = json.features[j].arbeitsorte || {};
					json.features[j].arbeitsorte[dataName] = {"Arbeitsort": Atts[number].gdata[i].Arbeitsgemeinde, "Arbeitskanton Kürzel": Atts[number].gdata[i]["Arbeitskanton Kürzel"], "Anzahl": Atts[number].gdata[i].Erwerbstätige }
					/*for (var propt in tempObj) {
						if(!isNaN(tempObj[propt])) {
							json.features[j].properties[propt] = tempObj[propt];
						}
					}*/
					break;
				}
			}
		}
		
		//Bind data and create one path per GeoJSON feature
		Atts[number].g.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("class", "state")
			.attr("id", function(d) {
				return "path" + d.properties.GMDNR;
				})
			.attr("d", path)
			.attr("stroke-width", 1)
			.style("stroke", "#fff")
			.style("fill", function(d) {
				var recoder=[0,100,50,25,75,50,100,0,25,0,75,25,50,0,50,50,75,0,50,75,25,100,100,25,0,0,100]
				var color=coloring(recoder[d.properties.KTNR]);
				if (d.properties.KTNR==0) {color="#000"}
				return color
				})
			.style("fill-opacity", function(d) {
				var opac=0.3;
				if (d.ind>=5) {opac=0.8};
				return opac;
				})
				
			.on("click", function(d) {if (d3.event.defaultPrevented) return; Atts[number].selected=d; clicked()})
			.attr("clip-path", "url(#clip"+number+")");

		Atts[number].g.selectAll("circle")
			.data(json.features)
			.enter().append("circle")
			.attr("cx", function(d) {
				var centname = d.properties.Arbeitsgemeindenummer;
				var ctroid;
				ctroid = path.centroid(d)[0];
				return ctroid;
			})
			.attr("cy", function(d) {
				var centname = d.properties.Arbeitsgemeindenummer;
				var ctroid;
				ctroid = path.centroid(d)[1];
				return ctroid;
			})
			.attr("r", function(d) {
				//var diff = d.properties.total_imm - d.properties.total_emm;
				//return circleSize(Math.sqrt(Math.abs(diff)/Math.PI));
				return 1;
		
			})
			.attr("class", "circ")
			.attr("id", function(d) {return "circle" + d.properties.GMDNR;})
			.attr("fill", function(d) {
				/*var diff = d.properties.total_imm - d.properties.total_emm;
				if(diff>0) {
					return colors[0];
				} else {
					return colors[1];
				}*/
			})
			.attr("fill-opacity", "0")
			.attr("stroke", function(d) {
				return cantoncolors[d.ind];
				})
			.attr("stroke-weight", "0.5")
			.attr("stroke-opacity", "0")
			.on("click", function(d) {if (d3.event.defaultPrevented) return; Atts[number].selected=d; clicked()});
			
			initTip(number);
			callTip(number);
			
		});
		
	});
	
//Zoomfuktion ohne Neuskalierung
/*function zoomed() {
	g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}*/

function clicked(animate) {

	//if (d3.event.defaultPrevented) return; // zoomed

	$(".hiderow").removeClass("selected");
	$("#"+Atts[number].selected.id).addClass("selected");

	var animate = (typeof animate == 'undefined') ? true : animate;
	
	Atts[number].direction = (typeof Atts[number].direction=='undefined') ? "coming" : Atts[number].direction;
	
	var homex = path.centroid(Atts[number].selected)[0];
	var homey = path.centroid(Atts[number].selected)[1];
	
	Atts[number].g.selectAll(".comingline")
		.attr("stroke-dasharray", 0)
		.attr("stroke-width", 0)
		.remove()
		
	Atts[number].g.selectAll('.cominglinetext').remove()
			
	Atts[number].g.selectAll(".goingline")
		.attr("stroke-dasharray", 0)
		.attr("stroke-width", 0)
		.remove()
		
	Atts[number].g.selectAll('.goinglinetext').remove()
	
	var theSelectedState = d3.select("#" + Atts[number].chartcontainer + " #path" + Atts[number].selected.properties.GMDNR);

	if (Atts[number].direction=="coming" || Atts[number].direction=="coming and going") {
	
		/*Linie zum Objekt*/
		
		for (var quelle in theSelectedState[0][0].__data__.wohnorte) {
			if (theSelectedState[0][0].__data__.wohnorte.hasOwnProperty(quelle)) {
				var theState = d3.select("#" + Atts[number].chartcontainer + " #path" + quelle);
				if(theState[0][0] != null) {
					var finalval=Atts[number].selected.wohnorte[quelle].Anzahl;
					var lineWidth=lineSize(parseFloat(Math.abs(finalval)));
					if (finalval==0 || finalval=="N/A") {lineWidth=0;}
					var startx = path.centroid(theState[0][0].__data__)[0];
					var starty = path.centroid(theState[0][0].__data__)[1];
					//Variablen um die Bigung hinzukriegen
					var laenge=40; //Länge des Abstands von der Geraden
					var steig=-(starty-homey)/(startx-homex); //Steigung der Linie im Koordinatensystem errechnen
					var ausrichter = startx > homex ? -1 : 1; //Damit die Linie immmer in die selbe Richtung gebogen wird
					var addy=ausrichter*laenge/Math.sqrt(steig*steig+1); //Y--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
					var addx=ausrichter*laenge*steig/Math.sqrt(steig*steig+1); //X--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
					data1=[{"quelle":Atts[number].selected.wohnorte[quelle].Wohnort, "ziel":Atts[number].selected.properties.GMDNAME, "wert":finalval}]
					Atts[number].g.append("path")
						.data(data1)
						.attr("class", "comingline")
						.attr("id", quelle + "a" + Atts[number].selected.properties.Arbeitsgemeindenummer)
						.attr("d", "M" + startx + "," + starty + " Q" + ((startx + homex)/2+addx) + " " + ((starty + homey)/2+addy) +" " + homex+" "   + homey)
						.attr("stroke-width", lineWidth)
						.attr("stroke", colors[0])
						.attr("fill", "none")
						.attr("opacity", 0.8)
						.attr("stroke-linecap", "round")
						.attr("d", function (d, i) {  
							if(!isNaN(finalval)) {
								var pl = this.getTotalLength(); //Länge der ursprünglichen Linie errechnen
								var lw = d3.select(this).attr("stroke-width"); //Breite der Linie errechnen
								var r = 2; //Radius des Zielkreises
								var m = this.getPointAtLength(pl-r-lw-(lw/3)); //Punkt bestimmen an dem die ursprüngliche Linie gekürzt wird
								var n = this.getPointAtLength(r+(lw*1)+(lw/3)); //Punkt bestimmen an dem die ursprüngliche Linie gekürzt wird
								
								//Variablen um die Bigung hinzukriegen
								var laenge=40/200*pl/pl*(pl-r-lw-(lw/3)); //Länge des Abstands von der Geraden (gekürzt um das Verhältnis Alte Länge zu Neue Länge, sowie gekurzt um dasungefähre Verhältnis zur Länge)
								var steig=-(starty-homey)/(startx-homex); //Steigung der Linie im Koordinatensystem errechnen
								var ausrichter = startx > homex ? -1 : 1; //Damit die Linie immmer in die selbe Richtung gebogen wird
								var addy=ausrichter*laenge/Math.sqrt(steig*steig+1); //Y--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
								var addx=ausrichter*laenge*steig/Math.sqrt(steig*steig+1); //X--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
								
								//Linie definieren
								var result = "M" + n.x + "," + n.y + " Q" + ((n.x + m.x)/2+addx) + " " + ((n.y + m.y)/2+addy) +" " + m.x+" "   + m.y;
								return result;
							}
						})
						.call(Atts[number].tips)
						.on('mouseover', function(d, i) {
							Atts[number].tips.show(d, d3.select('#tipfollowscursor').node());
							//last_tip = d.key;
							tiptext= "<span>Arbeitspendler/innen von <b>" + d.quelle + "</b> nach <b>" + d.ziel + "</b>:</span><br/><span>" + germanFormatters.numberFormat(",")(d.wert) + "</span>";
							$("#d3-tip"+number).html(tiptext)
							var bordercolor=colors[0]
							$("#d3-tip"+number).css("border-left", bordercolor +" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height())- parseFloat($(this).css("stroke-width"))/2);
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mousemove', function(d, i) {
							Atts[number].tips.show(d, d3.select('#tipfollowscursor').node());
							//last_tip = d.key;
							tiptext= "<span>Arbeitspendler/innen von <b>" + d.quelle + "</b> nach <b>" + d.ziel + "</b>:</span><br/><span><b>" + germanFormatters.numberFormat(",")(d.wert) + "</b></span>";
							$("#d3-tip"+number).html(tiptext)
							var bordercolor=colors[0]
							$("#d3-tip"+number).css("border-left", bordercolor +" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height())- parseFloat($(this).css("stroke-width"))/2);
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Atts[number].tips.hide(d);
						});

					
				}
			}
		}
		
		if (animate==true) {
			Atts[number].g.selectAll(".comingline").call(transition);
		}
	}

	if (Atts[number].direction=="going" || Atts[number].direction=="coming and going") {

		/*Linie vom Objekt*/
		
		for (var ziel in theSelectedState[0][0].__data__.arbeitsorte) {
			if (theSelectedState[0][0].__data__.arbeitsorte.hasOwnProperty(ziel)) {
				var theState = d3.select("#" + Atts[number].chartcontainer + " #path" + ziel);
				if(theState[0][0] != null) {
					var finalval=Atts[number].selected.arbeitsorte[ziel].Anzahl;
					var lineWidth=lineSize(parseFloat(Math.abs(finalval)));
					if (finalval==0 || finalval=="N/A") {lineWidth=0;}
					var startx = path.centroid(theState[0][0].__data__)[0];
					var starty = path.centroid(theState[0][0].__data__)[1];
					//Variablen um die Bigung hinzukriegen
					var laenge=40; //Länge des Abstands von der Geraden
					var steig=-(homey-starty)/(homex-startx); //Steigung der Linie im Koordinatensystem errechnen
					var ausrichter = homex > startx ? -1 : 1; //Damit die Linie immmer in die selbe Richtung gebogen wird
					var addy=ausrichter*laenge/Math.sqrt(steig*steig+1); //Y--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
					var addx=ausrichter*laenge*steig/Math.sqrt(steig*steig+1); //X--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
					data1=[{"quelle":Atts[number].selected.properties.GMDNAME, "ziel":Atts[number].selected.arbeitsorte[ziel].Arbeitsort, "wert":finalval}]
					Atts[number].g.append("path")
						.data(data1)
						.attr("class", "goingline")
						.attr("id", Atts[number].selected.properties.Wohngemeindenummer + "a" + ziel)
						.attr("d", "M" + homex + "," + homey + " Q" + ((homex + startx)/2+addx) + " " + ((homey + starty)/2+addy) +" " + startx+" "   + starty)
						.attr("stroke-width", lineWidth)
						.attr("stroke", colors[1])
						.attr("fill", "none")
						.attr("opacity", 0.8)
						.attr("stroke-linecap", "round")
						.attr("d", function (d, i) {  
							if(!isNaN(finalval)) {
								var pl = this.getTotalLength(); //Länge der ursprünglichen Linie errechnen
								var lw = d3.select(this).attr("stroke-width"); //Breite der Linie errechnen
								var r = 2; //Radius des Zielkreises
								var m = this.getPointAtLength(pl-r-lw-(lw/3)); //Punkt bestimmen an dem die ursprüngliche Linie gekürzt wird
								var n = this.getPointAtLength(r+(lw*1)+(lw/3)); //Punkt bestimmen an dem die ursprüngliche Linie gekürzt wird
								
								//Variablen um die Bigung hinzukriegen
								var laenge=40/200*pl/pl*(pl-r-lw-(lw/3)); //Länge des Abstands von der Geraden (gekürzt um das Verhältnis Alte Länge zu Neue Länge, sowie gekurzt um dasungefähre Verhältnis zur Länge)
								var steig=-(homey-starty)/(homex-startx); //Steigung der Linie im Koordinatensystem errechnen
								var ausrichter = homex > startx ? -1 : 1; //Damit die Linie immmer in die selbe Richtung gebogen wird
								var addy=ausrichter*laenge/Math.sqrt(steig*steig+1); //Y--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
								var addx=ausrichter*laenge*steig/Math.sqrt(steig*steig+1); //X--Koordinate des Punkts der senkrecht über de Linie mit Abstand Länge liegt
								
								//Linie definieren
								var result = "M" + n.x + "," + n.y + " Q" + ((n.x + m.x)/2+addx) + " " + ((n.y + m.y)/2+addy) +" " + m.x+" "   + m.y;
								return result;
							}
						})
						.call(Atts[number].tips)
						.on('mouseover', function(d, i) {
							Atts[number].tips.show(d, d3.select('#tipfollowscursor').node());
							//last_tip = d.key;
							tiptext= "<span>Arbeitspendler/innen von <b>" + d.quelle + "</b> nach <b>" + d.ziel + "</b>:</span><br/><span>" + germanFormatters.numberFormat(",")(d.wert) + "</span>";
							$("#d3-tip"+number).html(tiptext)
							var bordercolor=colors[1]
							$("#d3-tip"+number).css("border-left", bordercolor +" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height())- parseFloat($(this).css("stroke-width"))/2);
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mousemove', function(d, i) {
							Atts[number].tips.show(d, d3.select('#tipfollowscursor').node());
							//last_tip = d.key;
							tiptext= "<span>Arbeitspendler/innen von <b>" + d.quelle + "</b> nach <b>" + d.ziel + "</b>:</span><br/><span><b>" + germanFormatters.numberFormat(",")(d.wert) + "</b></span>";
							$("#d3-tip"+number).html(tiptext)
							var bordercolor=colors[1]
							$("#d3-tip"+number).css("border-left", bordercolor +" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height())- parseFloat($(this).css("stroke-width"))/2);
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Atts[number].tips.hide(d);
						});
					
				}
			}
		}
		
		if (animate==true) {
			Atts[number].g.selectAll(".goingline").call(transition);
		}
	}
}
	
function mouseposition() {
	var coordinates = [0, 0];
	coordinates = d3.mouse(this);
	var x = coordinates[0];
	var y = coordinates[1];
	var target = d3.select('#' + Atts[number].chartcontainer + ' #tipfollowscursor')
		.attr('cx', x)
		.attr('cy', y)
		.node();
}

function zoomed() {
	Atts[number].projection
		.translate(Atts[number].zoom.translate())
		.scale(Atts[number].zoom.scale());

	d3.selectAll('#' + Atts[number].chartcontainer + " path")
		.attr("d", path)

	setTimeout(function() {
		if (typeof Atts[number].selected!="undefined") {
			clicked(false);
		}
    }, 0);	
}

function nozoom() {
  d3.event.preventDefault();
}
	
function transition(path) {
	var IE = (navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1) ? true : false;
	if ( IE ){ } else {
	path.transition()
		.duration(1500)
		.attrTween("stroke-dasharray", tweenDash);
	}
}

function tweenDash() {
	var l = this.getTotalLength();
	var i = d3.interpolateString("0," + l, l + "," + l);
	return function(t) {return i(t)};
}

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
	
	//Nur für Kantone, nicht für Seen, deshalb Zwischenschritt
	var cantons = d3.selectAll("#"+ Atts[number].chartcontainer + " svg g circle, #" + Atts[number].chartcontainer +" svg g path").filter(function(d,i) {return d.properties.KTNR > 0});
		
	cantons.each(function(d, i){
		d3.select(this)
		.call(Atts[number].tips)
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d);
				last_tip = d.key;
			}
			var wegpendler=0;
			for (i in d.arbeitsorte) {
				wegpendler+=parseInt(d.arbeitsorte[i].Anzahl);
			}
			var zupendler=0;
			for (i in d.wohnorte) {
				zupendler+=parseInt(d.wohnorte[i].Anzahl);
			}
			if (typeof d.properties.Wohngemeinde=='undefined') {
				tiptext= "<span><b>" + d.properties.GMDNAME + "</b></span><br/><span>Keine Zu- oder Wegbendler aus dem Kanton Zug</span>";
			} else if (d.properties.KTNR==9) {
				tiptext= "<span><b>" + d.properties.GMDNAME + "</b></span><br/><span>Zupendler: <b>" + germanFormatters.numberFormat(",")(zupendler) + "</b><br>Wegpendler: <b>" + germanFormatters.numberFormat(",")(wegpendler) + "</b><br>Pendlersaldo: <b>" + germanFormatters.numberFormat(",")((zupendler - wegpendler)) + "</b></span>";
			} else {
				tiptext= "<span><b>" + d.properties.GMDNAME + "</b></span><br/><span>Zupendler aus dem Kanton Zug: <b>" + germanFormatters.numberFormat(",")(zupendler) + "</b><br>Wegpendler in den Kanton Zug: <b>" + germanFormatters.numberFormat(",")(wegpendler) + "</b><br>Pendlersaldo mit dem Kanton Zug: <b>" + germanFormatters.numberFormat(",")((zupendler - wegpendler)) + "</b></span>";
			}
			$("#d3-tip"+number).html(tiptext);
			$("#d3-tip"+number).css("border-left", coloring(recoder[d.properties.KTNR]) +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 0 - ($("#d3-tip"+number).height()));
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Atts[number].tips.hide(d);
		})
	})
}

// Zoom-Buttons
Atts[number].svg.selectAll(".button")
    .data(['zoom_in', 'zoom_out'])
    .enter()
	.append("polygon")
    .attr("points", function(d,i){return i ? "57,18 57,22, 48,22 48,18" : "22,13 22,18, 27,18 27,22 22,22 22,27 18,27 18,22 13,22 13,18 18,18 18,13" })
	.attr("class", "button")
	.attr("id", function(d){return d})
    .style("fill", function(d,i){ return i ? colors[1] : colors[0] })

// Control logic to zoom when buttons are pressed, keep zooming while they are
// pressed, stop zooming when released or moved off of, not snap-pan when
// moving off buttons, and restore pan on mouseup.

var pressed = false;
d3.selectAll('.button').on('mousedown', function(){
    pressed = true;
    disableZoom();
    zoomButton(this.id === 'zoom_in')
}).on('mouseup', function(){
    pressed = false;
}).on('mouseout', function(){
    pressed = false;
})
Atts[number].svg.on("mouseup", function(){Atts[number].svg.call(Atts[number].zoom)});

function disableZoom(){
    Atts[number].svg.on("mousedown.zoom", null)
       .on("touchstart.zoom", null)
       .on("touchmove.zoom", null)
       .on("touchend.zoom", null);
}

function zoomButton(zoom_in){
    var scale = Atts[number].zoom.scale(),
        extent = Atts[number].zoom.scaleExtent(),
        translate = Atts[number].zoom.translate(),
        x = translate[0], y = translate[1],
        factor = zoom_in ? 1.2 : 1/1.2,
        target_scale = scale * factor;

    // If we're already at an extent, done
    if (target_scale === extent[0] || target_scale === extent[1]) { return false; }
    // If the factor is too much, scale it down to reach the extent exactly
    var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
    if (clamped_target_scale != target_scale){
        target_scale = clamped_target_scale;
        factor = target_scale / scale;
    }

    // Center each vector, stretch, then put back
    x = (x - Atts[number].center[0]) * factor + Atts[number].center[0];
    y = (y - Atts[number].center[1]) * factor + Atts[number].center[1];

    // Transition to the new view over 100ms
    d3.transition().duration(100).tween("zoom", function () {
        var interpolate_scale = d3.interpolate(scale, target_scale),
            interpolate_trans = d3.interpolate(translate, [x,y]);
        return function (t) {
            Atts[number].zoom.scale(interpolate_scale(t))
                .translate(interpolate_trans(t));
            zoomed();
        };
    }).each("end", function(){
        if (pressed) zoomButton(zoom_in);
    });
}

function simulateClick(elem /* Must be the element, not d3 selection */) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(
        "click", /* type */
        true, /* canBubble */
        true, /* cancelable */
        window, /* view */
        0, /* detail */
        0, /* screenX */
        0, /* screenY */
        0, /* clientX */
        0, /* clientY */
        false, /* ctrlKey */
        false, /* altKey */
        false, /* shiftKey */
        false, /* metaKey */
        0, /* button */
        null); /* relatedTarget */
    elem.dispatchEvent(evt);
}

$( document ).ready(function() {
	setTimeout(function() {
		simulateClick(d3.select("#"+ Atts[number].chartcontainer+" #path1701").node());
    }, 1500);
	
});

//Funktion um bei Knopfklick die entsprechenden Verbindungen einzublenden und die andere auszublenden.
$(".hiderow").click(function(){
	simulateClick(d3.select("#"+ Atts[number].chartcontainer+" #path"+this.id).node())
});

$(".direction").click(function(){
	$(".direction").removeClass("selected");
	$(this).addClass("selected");
	Atts[number].direction=this.id
	if (typeof Atts[number].selected!="undefined") {
		simulateClick(d3.select("#"+ Atts[number].chartcontainer+" #path"+Atts[number].selected.id).node())
	}
});

}

redraw(number);

function resizeMap(number) {
	d3.select("#d3-tip"+number).remove();
	d3.selectAll("#"+ Atts[number].chartcontainer + " svg").remove()
	redraw(number);
}

//Funktioniert nicht wie es sollte. Lassen wir mal sein.
$(window).resize(function(){/*resizeMap(number)*/});	

var columns=["Wohnkanton", "Wohnkanton Kürzel", "Wohngemeindenummer", "Wohngemeinde", "Arbeitskanton", "Arbeitskanton Kürzel", "Arbeitsgemeindenummer", "Arbeitsgemeinde", "Erwerbstätige"]									 
addDownloadButton(number);
addDownloadButtonPng(number, true)
addDataTablesButton(number, columns)

};