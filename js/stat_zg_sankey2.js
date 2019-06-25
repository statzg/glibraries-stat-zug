/* stat_zg_sankey.js (version 0.3 (2017.11.28)*/

/*Angepasst von http://bl.ocks.org/d3noob/c9b90689c1438f57d649*/

function loadSankey(args) {
var number = (typeof args.number == 'undefined') ? 1 : args.number;
var csv_path = (typeof args.csv_path == 'undefined') ? "error" : args.csv_path;
//var dimension = (typeof args.dimension == 'undefined') ? "" : args.dimension;
//var group = (typeof args.group == 'undefined') ? "" : args.group;
var characteristics = (typeof args.characteristics == 'undefined') ? [] : args.characteristics;
//var stack = (typeof args.stack == 'undefined') ? "" : args.stack
//var characteristicsStack = (typeof args.characteristicsStack == 'undefined') ? [] : args.characteristicsStack;
var scale = (typeof args.scale == 'undefined') ? 1 : args.scale;
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

// load the data (using the timelyportfolio csv method)
d3.csv(csv_path, function(error, data) {
	
data.forEach(function(x) {
	x['Betrag'] = +x['Betrag'];
});

var units = "Franken";

function redraw() {

var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
var totalHeight = 800;
var margin = {top: 10, right: 0, bottom: 10, left: 0};
    width = totalWidth - margin.left - margin.right,
    height = totalHeight - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; };

treatmetadata(number, data);

// append the svg canvas to the page
svg = d3.select("#"+Atts[number].chartcontainer).append("svg")
	//.attr("preserveAspectRatio", "xMinYMin meet")
	//.attr("viewBox", "0 0 "+width+" "+height)
	//class to make it responsive
	//.classed("svg-content-responsive", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(60)
    .nodePadding(10)
    .size([width, height]);

// append a defs (for definition) element to your SVG
var defs = svg.append('defs');

var path = sankey.link();

	totalAusgaben=0;
	//set up graph in same style as original example but empty
	graph = {"nodes" : [], "links" : []};

    Atts[number].data.forEach(function (d) {
      graph.nodes.push({ "name": d.Quelle });
      graph.nodes.push({ "name": d.Ziel });
      graph.links.push({ "source": d.Quelle,
                         "target": d.Ziel,
                         "value": +d.Betrag });
     });
	 
    // return only the distinct / unique nodes
    graph.nodes = d3.keys(d3.nest()
		.key(function (d) { return d.name; })
		.map(graph.nodes));

    // loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
		graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
		graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });

    //now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graph.nodes.forEach(function (d, i) {
		graph.nodes[i] = { "name": d, "nodeid":i };
    });


	//console.log(graph.nodes);

	sankey
		.nodes(graph.nodes)
		.links(graph.links)
		.layout(10);

for (i=0; i<graph.nodes.length; i++) {
	characteristics.push(graph.nodes[i].name)
}

myColor = d3.scale.linear().domain([-0.2,0,0.2,0.4,0.6,0.8,1])
			.range(['#c3cec3','#007AC4','#00A763','#FFDD5E','#FFDD5E','#FF8A26','#FF403A'])


// add in the links
  var link = svg.append("g").selectAll(".sankey-link")
		.data(graph.links)
    .enter().append("path")
		.attr("class", "sankey-link")
		.attr("d", path)
		.style("stroke", function(d) { 
			var bordercolor=myColor(d.source.nodeid/graph.nodes.length)
			return d.color = bordercolor; })
		.style("stroke-width", function(d) { return Math.max(2, d.dy); })
		.sort(function(a, b) { return b.dy - a.dy; })
		.style('stroke', function(d, i) {

		//Farbverlauf anstatt einfarbige Verbindung	
		// make unique gradient ids  
		const gradientID = 'gradient'+i;

		const startColor = myColor(d.source.nodeid/graph.nodes.length);
		const stopColor = myColor(d.target.nodeid/graph.nodes.length);
		
		const linearGradient = defs.append('linearGradient')
			.attr('id', gradientID)
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", d.source.x+60).attr("y1", 0)
			.attr("x2", d.target.x).attr("y2", 0);

		linearGradient.selectAll('stop') 
		  .data([                             
			  {offset: '0%', color: startColor },      
			  {offset: '100%', color: stopColor }    
			])                  
		  .enter().append('stop')
		  .attr('offset', function(d) {
			return d.offset; 
		  })   
		  .attr('stop-color', function(d) {
			return d.color;
		  });
			return 'url(#'+gradientID+')';
		});		

// add in the nodes
  var node = svg.append("g").selectAll(".sankey-node")
      .data(graph.nodes)
    .enter().append("g")
	  .attr("class", "sankey-node")
      .attr("transform", function(d) { 
		  return "translate(" + (d.x+2) + "," + (d.y) + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { 
		  this.parentNode.appendChild(this); })
      .on("drag", dragmove));

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return (Math.max(2,d.dy)); })
      .attr("width", sankey.nodeWidth()-4)
      .style("fill", function(d) { 
		  return d.color = myColor(d.nodeid/graph.nodes.length); })
      //.style("stroke", "#FFFFFF")
    /*.append("title")
      .text(function(d) { 
		  return d.name + "\n" + format(d.value); });*/

// add in the title for the nodes
  node.append("text")
      .attr("x", sankey.nodeWidth()-5)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
	.filter(function(d) { return d.x < width / 2; })
      .attr("x", sankey.nodeWidth()/2)
      .attr("text-anchor", "middle")
	.filter(function(d) { return d.x < width / 3; })
      .attr("x", 5)
      .attr("text-anchor", "start");
	
	node.selectAll('text')
	.filter(function(d) { return d.dy < 11})
	.text("");
	  //Dreizeilige Texte Links von Hand zentrieren (unschön aber einfach)
	  //.attr("y", function(d) { return (d.dy / 2) - 16; });
	  
//	d3.selectAll("#"+Atts[number].chartcontainer+" g.sankey-node > text")
//		.call(wrap, 200);

    graph.nodes.forEach(function (d, i) {
		if (d.targetLinks.length==0) {
			totalAusgaben=totalAusgaben+graph.nodes[i].value;
		}
	});
		
// the function for moving the nodes
function dragmove(d) {
    d3.select(this).attr("transform", 
        "translate(" + (d.x+2) + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
		
}

function initTip(number){
	last_tip = null;
	Atts[number].tips = d3.tip()
		.attr('class', 'd3-tip')
		.attr('id', 'd3-tip'+number)
		.direction(function(d) {
			if (typeof d.sourceLinks !== 'undefined' && d.sourceLinks.length == 0) return "nw"
			if (typeof d.targetLinks !== 'undefined' && d.targetLinks.length == 0) return 'ne'
			else return 'n'
		})
		.offset([0, 0])
		.html("no data");
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function mergeColors(c1, c2) {
	var rgb1=hexToRgb(c1)
	var rgb2=hexToRgb(c2)
	var r=(rgb1.r+rgb2.r)/2
	var g=(rgb1.g+rgb2.g)/2
	var b=(rgb1.b+rgb2.b)/2
	return(rgbToHex(r, g, b));
}

function callTip(number){
	//Total der Einnahmen und Ausgaben ermitteln
	result = $.grep(graph.nodes, function(e){ return e.name == "Steuerverwaltung"; });

	d3.selectAll("#"+Atts[number].chartcontainer+" g.sankey-node > rect")
		.call(Atts[number].tips)
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d);
				last_tip = d.key;
			}
			tiptext= "<span>" + d.name + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.value/totalAusgaben) + "</span><br/><span>Betrag: " + germanFormatters.numberFormat(",")(d.value) +  " " + units + "</span>";
			$("#d3-tip"+number).html(tiptext)
			$("#d3-tip"+number).css("border-left", myColor(d.nodeid/graph.nodes.length) +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height()));
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
			$("#d3-tip"+number).css( 'pointer-events', 'none' );
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Atts[number].tips.hide(d);
		});
	d3.selectAll("#"+Atts[number].chartcontainer+" path.sankey-link")
		.call(Atts[number].tips)
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d);
				last_tip = d.key;
			}
			tiptext= "<span>" + d.source.name + " -> " + d.target.name + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.value/totalAusgaben) + "</span><br/><span>Betrag: " +germanFormatters.numberFormat(",")(d.value)+  " " + units + "</span>";
			$("#d3-tip"+number).html(tiptext)
			var bordercolor=mergeColors(myColor(d.source.nodeid/graph.nodes.length), myColor(d.target.nodeid/graph.nodes.length))
			$("#d3-tip"+number).css("border-left", bordercolor +" solid 5px");
			var pathSegList = this.pathSegList;
			var steigung=Math.abs(pathSegList[1]['y1']-pathSegList[1]['y2'])
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height())- parseFloat($(this).css("stroke-width"))/2);
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height()) - parseFloat($(this).css("stroke-width"))/2 + steigung/2);
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
			$(".d3-tip").css( 'pointer-events', 'none' );
		})
		.on('mouseout', function(d) {
			last_tip = null;
			Atts[number].tips.hide(d);
		});

}

redraw();
initTip(number);
callTip(number);

function resizeSankey(number) {
	d3.selectAll("svg").remove()
	redraw();
	callTip(number);
}

$(window).resize(function(){resizeSankey(number)});
  
  
}); 

var columns=["Quelle", "Ziel", "Betrag"]									 
addDownloadButton(number);
addDownloadButtonPng(number)
addDataTablesButton(number, columns)

};