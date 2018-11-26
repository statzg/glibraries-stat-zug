/* stat_zg_kennzahlen.js (version 0.1 (2018.11.14)*/

function loadKennzahl(args) {
	var csv_path = (typeof args.csv_path == 'undefined') ? "error" : args.csv_path;
	var identifikator = (typeof args.identifikator == 'undefined') ? "01" : args.identifikator;

	$("#kennzahlcontainer").css({ border: "5px solid #006fba", padding: "10px" })

	if ( $( "#kennzahlcontainer > h1#zahl" ).length === 0) {
		$("#kennzahlcontainer").prepend( "<h1 id='zahl' class='zahl' style='margin:0'></h1>" );
	}
	if ( $( "#kennzahlcontainer > p#beschreibung" ).length === 0) {
		$("#kennzahlcontainer > h1#zahl").after( "<p id='beschreibung' class='beschreibung' style='margin-bottom: 0;'></p>" );
	}

	d3v4.csv(csv_path, function (data) {
	
		kennzahl=data.filter(function(d) { return d.Identifikator == identifikator });
	
		$("#zahl").html(kennzahl[0].Kennzahl);
		$("#beschreibung").html(kennzahl[0].Beschreibung);
	
	})
	
};