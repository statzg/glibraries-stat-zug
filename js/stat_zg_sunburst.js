function loadSunburst(args) {
	var number = typeof args.number == 'undefined' ? 1 : args.number;
	var csv_path = typeof args.csv_path == 'undefined' ? "error" : args.csv_path;
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
	//var removeZero = (typeof args.removeZero == 'undefined') ? false : args.removeZero;

	//Attributeobjekt initialisieren
	Atts[number] = {};

	Atts[number].maincontainer = "default" + number;
	Atts[number].chartcontainer = "chart" + number;
	
	createcontainers(number);

	var width = document.getElementById(Atts[number].maincontainer).offsetWidth,
	    height = 400,
	    maxRadius = Math.min(width, height) / 2 - 5;

	var formatNumber = d3v4.format(',d');

	Atts[number].x = d3v4.scaleLinear().range([0, 2 * Math.PI]).clamp(true);

	Atts[number].y = d3v4.scaleSqrt().range([maxRadius * .1, maxRadius]);

	var color = d3v4.scaleOrdinal(['#007ac4', '#3388aa', '#499399', '#5d9d8a', '#6ea680', '#81b077', '#94b970', '#a7c16b', '#bcc866', '#d1d062', '#e8d760', '#ffdd5e', '#ffd156', '#ffc750', '#ffbb49', '#ffae43', '#ffa23f', '#ff963b', '#ff8738', '#ff7936', '#ff6936', '#ff5637', '#ff403a']);

	Atts[number].partition = d3v4.partition();

	var arc = d3v4.arc().startAngle(function (d) {
		return Atts[number].x(d.x0);
	}).endAngle(function (d) {
		return Atts[number].x(d.x1);
	}).innerRadius(function (d) {
		return Math.max(0, Atts[number].y(d.y0));
	}).outerRadius(function (d) {
		return Math.max(0, Atts[number].y(d.y1));
	});

	Atts[number].middleArcLine = function middleArcLine(d) {
		var halfPi = Math.PI / 2;
		var angles = [Atts[number].x(d.x0) - halfPi, Atts[number].x(d.x1) - halfPi];
		var r = Math.max(0, (Atts[number].y(d.y0) + Atts[number].y(d.y1)) / 2);

		var middleAngle = (angles[1] + angles[0]) / 2;
		var invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
		if (invertDirection) {
			angles.reverse();
		}

		var path = d3v4.path();
		path.arc(0, 0, r, angles[0], angles[1], invertDirection);
		return path.toString();
	};

	var textFits = function textFits(d) {
		var CHAR_SPACE = 6;

		var deltaAngle = Atts[number].x(d.x1) - Atts[number].x(d.x0);
		var r = Math.max(0, (Atts[number].y(d.y0) + Atts[number].y(d.y1)) / 2);
		var perimeter = r * deltaAngle;

		return d.data.name.length * CHAR_SPACE < perimeter;
	};

	var svg = d3v4.select("#" + Atts[number].chartcontainer)
		.append('svg')
		.style('width', width)
		.style('height', height)
		.attr("width", width)
		.attr("height", height)
		.attr('viewBox', -width / 2 + ' ' + -height / 2 + ' ' + width + ' ' + height)
		.on('click', function () {
			return focusOn();
		}); // Reset zoom on canvas click

	function buildHierarchy(csv) {
		var root = { "name": "Schweiz", "children": [] };
		for (var i = 0; i < csv.length; i++) {
			if (csv[i][1] != "" & csv[i][2] != "") {
				var sequence = csv[i][0] + "&" + csv[i][1] + "&" + csv[i][2];
			} else if (csv[i][1] == "" & csv[i][2] != "") {
				var sequence = csv[i][0] + "&" + csv[i][2];
			} else if (csv[i][1] != "" & csv[i][2] == "") {
				var sequence = csv[i][0] + "&" + csv[i][1];
			} else if (csv[i][1] == "" & csv[i][2] == "") {
				var sequence = csv[i][0];
			}
			var size = +csv[i][3];
			if (isNaN(size)) {
				// e.g. if this is a header row
				continue;
			}
			var parts = sequence.split("&");
			var currentNode = root;
			for (var j = 0; j < parts.length; j++) {
				var children = currentNode["children"];
				var nodeName = parts[j];
				var childNode;
				if (j + 1 < parts.length) {
					// Not yet at the end of the sequence; move down the tree.
					var foundChild = false;
					for (var k = 0; k < children.length; k++) {
						if (children[k]["name"] == nodeName) {
							childNode = children[k];
							foundChild = true;
							break;
						}
					}
					// If we don't already have a child node for this branch, create it.
					if (!foundChild) {
						childNode = { "name": nodeName, "children": [] };
						children.push(childNode);
					}
					currentNode = childNode;
				} else {
					// Reached the end of the sequence; create a leaf node.
					childNode = { "name": nodeName, "size": size };
					children.push(childNode);
				}
			}
		}
		return root;
	};

	var daten = d3.csv(csv_path, function(error, data) {
		
		data.forEach(function(x) {
			x["Anzahl"] = +x["Anzahl"];
		});
		
		treatmetadata(number, data);
	});
	
	d3v4.text(csv_path, function (text) {
		var csv = d3v4.csvParseRows(text);
		var json = buildHierarchy(csv);
		callgraph(json);
	});

	function callgraph(root) {

		Atts[number].root = d3v4.hierarchy(root);
		Atts[number].root.sum(function (d) {
			return d.size;
		});

		Atts[number].slice = svg.selectAll('g.slice').data(Atts[number].partition(Atts[number].root).descendants());

		Atts[number].slice.exit().remove();

		Atts[number].newSlice = Atts[number].slice.enter().append('g').attr('class', 'slice').on('click', function (d) {
			d3v4.event.stopPropagation();
			focusOn(d);
		});

		Atts[number].newSlice.append('path').attr('class', 'main-arc').style('fill', function (d) {
			return color((d.children ? d : d.parent).data.name);
		}).attr('d', arc);

		Atts[number].newSlice.append('path').attr('class', 'hidden-arc').attr('id', function (_, i) {
			return 'hiddenArc_' + number + '_' + i;
		}).attr('d', Atts[number].middleArcLine);

		Atts[number].text = Atts[number].newSlice.append('text')
			.attr('display', function (d) {
				return textFits(d) ? null : 'none';
			});

		// Add white contour
		/*text.append('textPath')
  	.attr('startOffset','50%')
  	.attr('xlink:href', (_, i) => `#hiddenArc${i}` )
  	.text(d => d.data.name)
  	.style('fill', 'none')
  	.style('stroke', '#fff')
  	.style('stroke-width', 5)
  	.style('stroke-linejoin', 'round');*/

		Atts[number].text.append('textPath').attr('startOffset', '50%').attr('xlink:href', function (_, i) {
			return location.href + ('#hiddenArc_' + number + '_' + i);
		}).text(function (d) {
			return d.data.name;
		});

		initTip(number);
		callTip(number);
	}

	function initTip(number) {
		last_tip = null;
		Atts[number].tips = d3v4.tip()
			.attr('class', 'd3-tip')
			.attr('id', 'd3-tip' + number)
			.direction('n')
			.offset([-30, 0])
			.html("no data");
	}

	function callTip(number) {
		d3v4.selectAll("path").call(Atts[number].tips).on('mouseover', function (d, i) {
			if (d.key !== last_tip) {
				Atts[number].tips.show(d);
				last_tip = d.key;
			}
			label = d.data.name;

			if (d.data.value % 1) {
				wert = germanFormatters.numberFormat(",.1f")(d.data.value);
			} else {
				wert = germanFormatters.numberFormat(",")(d.data.value);
			}

			if (d.parent == null) {
				tiptext = "<span>" + label + "</span><br/><span>Anteil am Total: 100%</span><br/><span>Anzahl Personen: " + germanFormatters.numberFormat(",")(d.value) + "</span>";
			} else if (d.parent.parent == null) {
				tiptext = "<span>Kanton " + label + "</span><br/><span>Anteil am Total: " + (Math.round(d.value / d.parent.value * 1000) / 10).toFixed(1) + '%' + "</span><br/><span>Anzahl Personen: " + germanFormatters.numberFormat(",")(d.value) + "</span>";
			} else if (d.parent.parent.parent == null) {
				tiptext = "<span>" + label + "</span><br/><span>Anteil am Total: " + (Math.round(d.value / d.parent.parent.value * 1000) / 10).toFixed(1) + '%' + "</span><br/><span>Anteil am Kanton: " + (Math.round(d.value / d.parent.value * 1000) / 10).toFixed(1) + '%' + "</span><br/><span>Anzahl Personen: " + germanFormatters.numberFormat(",")(d.value) + "</span>";
			} else if (d.parent.parent.parent.parent == null) {
				tiptext = "<span>" + label + "</span><br/><span>Anteil am Total: " + (Math.round(d.value / d.parent.parent.parent.value * 1000) / 10).toFixed(1) + '%' + "</span><br/><span>Anteil am Kanton: " + (Math.round(d.value / d.parent.parent.value * 1000) / 10).toFixed(1) + '%' + "</span><br/><span>Anteil am Bezirk: " + (Math.round(d.value / d.parent.value * 1000) / 10).toFixed(1) + '%' + "</span><br/><span>Anzahl Personen: " + germanFormatters.numberFormat(",")(d.value) + "</span>";
			}

			$("#d3-tip" + number).html(tiptext);
			$("#d3-tip" + number).css("border-left", color((d.children ? d : d.parent).data.name) + " solid 5px");
			offsetx = Number($("#d3-tip" + number).css("left").slice(0, -2)) + 18 - $("#d3-tip" + number).width() / 2;
			offsety = Number($("#d3-tip" + number).css("top").slice(0, -2)) + 18 - $("#d3-tip" + number).height() / 2;
			$("#d3-tip" + number).css('left', offsetx);
			$("#d3-tip" + number).css('top', offsety);
		}).on('mouseout', function (d) {
			last_tip = null;
			Atts[number].tips.hide(d);
			//d3.selectAll("circle.dot").attr('style', "fill-opacity:0.000001");
			//d3.selectAll("path.yRef").attr('style', "display:none");
			//d3.selectAll("path.xRef").attr('style', "display:none");
		});
	}

	function focusOn() {
		var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x0: 0, x1: 1, y0: 0, y1: 1, children: "" };

		// Reset to top-level if no data point specified

		//Für Toplevel macht zoom kein Sinn.
		if (d.children != null) {

			var transition = svg.transition().duration(750).tween('scale', function () {
				var xd = d3v4.interpolate(Atts[number].x.domain(), [d.x0, d.x1]),
				    yd = d3v4.interpolate(Atts[number].y.domain(), [d.y0, 1]);
				return function (t) {
					Atts[number].x.domain(xd(t));Atts[number].y.domain(yd(t));
				};
			});

			transition.selectAll('path.main-arc').attrTween('d', function (d) {
				return function () {
					return arc(d);
				};
			});

			transition.selectAll('path.hidden-arc').attrTween('d', function (d) {
				return function () {
					return Atts[number].middleArcLine(d);
				};
			});

			transition.selectAll('text').attrTween('display', function (d) {
				return function () {
					return textFits(d) ? null : 'none';
				};
			});

			moveStackToFront(d);
		}

		//

		function moveStackToFront(elD) {
			svg.selectAll('.slice').filter(function (d) {
				return d === elD;
			}).each(function (d) {
				this.parentNode.appendChild(this);
				if (d.parent) {
					moveStackToFront(d.parent);
				}
			});
		}
	}

	var columns=["Kanton", "Bezirk", "Gemeinde", "Anzahl"]
	addDownloadButton(number);
	addDataTablesButton(number, columns)

}