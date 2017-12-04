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

// load the data (using the timelyportfolio csv method)
d3.csv(csv_path, function(error, data) {

function redraw() {

var totalWidth = document.getElementById(Atts[number].maincontainer).offsetWidth;
var totalHeight = 400;

var units = "Mio Franken";

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
    .nodePadding(40)
    .size([width, height]);

var path = sankey.link();

	//set up graph in same style as original example but empty
	graph = {"nodes" : [], "links" : []};

    Atts[number].data.forEach(function (d) {
      graph.nodes.push({ "name": d.source });
      graph.nodes.push({ "name": d.target });
      graph.links.push({ "source": d.source,
                         "target": d.target,
                         "value": +d.value });
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
		graph.nodes[i] = { "name": d };
    });

	sankey
		.nodes(graph.nodes)
		.links(graph.links)
		.layout(100);

for (i=0; i<graph.nodes.length; i++) {
	characteristics.push(graph.nodes[i].name)
}

characteristics.splice(characteristics.indexOf("Steuerverwaltung"),1)
characteristics.splice(0,0,"Steuerverwaltung")
	
colorScale = d3.scale.ordinal()
            .domain(characteristics)
            .range(colorscheme[scale][graph.nodes.length]);

// add in the links
  var link = svg.append("g").selectAll(".sankey-link")
		.data(graph.links)
    .enter().append("path")
		.attr("class", "sankey-link")
		.attr("d", path)
		.style("stroke", function(d) { 
			if (d.target.name=="Steuerverwaltung") {
				var bordercolor=colorScale(d.source.name)
			} else {
				var bordercolor=colorScale(d.target.name)
			}
			return d.color = bordercolor; })
		.style("stroke-width", function(d) { return Math.max(2, d.dy); })
		.sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
  /*link.append("title")
		.text(function(d) {
    		return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });*/

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
		  return d.color = colorScale(d.name); })
      //.style("stroke", "#FFFFFF")
    /*.append("title")
      .text(function(d) { 
		  return d.name + "\n" + format(d.value); });*/

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
	.filter(function(d) { return d.x < width / 2; })
      .attr("x", sankey.nodeWidth()/2)
      .attr("text-anchor", "middle")
	.filter(function(d) { return d.x < width / 3; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start")
	  //Dreizeilige Texte Links von Hand zentrieren (unschön aber einfach)
	  .attr("y", function(d) { return (d.dy / 2) - 16; });
	  
	d3.selectAll("#"+Atts[number].chartcontainer+" g.sankey-node > text")
		.call(wrap, 105);

		
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
			if (d.name == 'Bund') return 'nw'
			if (d.name == 'Kanton Zug') return 'nw'
			if (d.name == 'Gemeinden') return 'nw'
			if (d.name == 'Kirchgemeinden') return 'nw'
			if (d.name == 'Bürgergemeinden') return 'nw'
			if (d.name == 'Juristische Personen (Wirtschaft)') return 'ne'
			if (d.name == 'Natürliche Personen (Private)') return 'ne'
			else return 'n'
		})
		.offset([0, 0])
		.html("no data");
}

function callTip(number){
	//Total der Einnahmen und Ausgaben ermitteln
	result = $.grep(graph.nodes, function(e){ return e.name == "Steuerverwaltung"; });
	//console.log(result[0].value)
	d3.selectAll("#"+Atts[number].chartcontainer+" g.sankey-node > rect")
		.call(Atts[number].tips)
		.on('mouseover', function(d, i) {
			if(d.key !== last_tip) {
				Atts[number].tips.show(d);
				last_tip = d.key;
			}
			if (d.name=="Steuerverwaltung") {
				tiptext= "<span>" + d.name + "</span><br/><span>Betrag: " + germanFormatters.numberFormat(",")(d.value) +  " Mio CHF</span>";
			} else {
				tiptext= "<span>" + d.name + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.value/result[0].value) + "</span><br/><span>Betrag: " +germanFormatters.numberFormat(",")(d.value)+  " Mio CHF</span>";
			}
			$("#d3-tip"+number).html(tiptext)
			$("#d3-tip"+number).css("border-left", colorScale(d.name) +" solid 5px");
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height()));
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
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
			tiptext= "<span>" + d.source.name + " -> " + d.target.name + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.value/result[0].value) + "</span><br/><span>Betrag: " +germanFormatters.numberFormat(",")(d.value)+  " Mio CHF</span>";
			$("#d3-tip"+number).html(tiptext)
			if (d.target.name=="Steuerverwaltung") {
				var bordercolor=colorScale(d.source.name)
			} else {
				var bordercolor=colorScale(d.target.name)
			}
			$("#d3-tip"+number).css("border-left", bordercolor +" solid 5px");
			//console.log($("#d3-tip"+number))
			//console.log(this)
			//console.log(this.attributes.style.value);
			//console.log(this.path);
			//console.log($(this).css("stroke-width"));
			//console.log(this.getAttribute('d').split(/(?=[LMC ,])/));
			//console.log(this.pathSegList);
			var pathSegList = this.pathSegList;
			var steigung=Math.abs(pathSegList[1]['y1']-pathSegList[1]['y2'])
			//console.log(parseFloat(this.attributes.style.value.replace( /^\D+/g, '')));
			offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height())- parseFloat($(this).css("stroke-width"))/2);
			offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height()) - parseFloat($(this).css("stroke-width"))/2 + steigung/2);
			$("#d3-tip"+number).css( 'left', offsetx);
			$("#d3-tip"+number).css( 'top', offsety);
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

var columns=["source", "target", "value"]									 
addDownloadButton(number);
addDownloadButtonPng(number)
addDataTablesButton(number, columns)

};