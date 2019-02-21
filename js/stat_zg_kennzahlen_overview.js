/* stat_zg_kennzahlen.js (version 0.1 (2018.11.14)*/

function loadKennzahlen(args) {
	var csv_path = (typeof args.csv_path == 'undefined') ? "error" : args.csv_path;

	d3v4.csv(csv_path, function (data) {
	
		console.log(data.length);

		d3v4.select("#kennzahlencontainer").selectAll("div").data(data).enter()
			.append("div")
			.attr("class", "kennzahlcontainer")
			.attr("id", function(d) {return "kennzahlcontainer-" + d.Identifikator})
			.html(function(d) { console.log(d); return "<img src='/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/cloud/population.png' width='24' height='24' style='float:right;'> <h2 id='zahl' class='zahl' style='margin:0'>"+d.Kennzahl+"</h2>  <p id='beschreibung' class='beschreibung' style='margin-bottom: 0; font-size: 14px'>"+d.Beschreibung+"</p>"; })
			.style("border", "5px solid #006fba")
			.style("padding", "10px")
			.style("margin", "5px")
			.style("width", "175px")
			.style("float", "left")
		
		d3v4.selectAll(".kennzahlcontainer").sort(function(a, b) {
			return d3v4.ascending(Math.random(), Math.random());
		})
		
		var $grid = $('.kennzahlencontainer').imagesLoaded( function() {
			$grid.masonry({
				itemSelector: '.kennzahlcontainer'
			});
		});
	})
	
};