/* stat_zg_kennzahlen.js (version 0.1 (2018.11.14)*/

require.config({
  baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
  paths: {
    libs: "libraries"
  }
});

define(['libs/d3_v4'],  function(d3v4) {

	return {
		load: function() {
			csv_path ="https://raw.githubusercontent.com/statzg/glibraries-stat-zug/master/daten/result-themen-14-03-01.csv";
			d3v4.csv(csv_path, function (data) {
				format=d3.time.format("%d.%m.%Y")
				data.forEach(function(x) {
					x["Datumstr"] = x["Datum"];
					x["Datum"] = format.parse(x["Datum"]);
					x["Anzahl"] = +x["Anzahl"];
				});
				x = data.map(function(d) {
					return {
					"Tag": d.Datum
					};
				});
				latestdate = d3.max(x.map(d=>d.Tag));
				aktuelleDaten=data.filter(function(d) { return d.Datum >= latestdate })
				Fallzahl=aktuelleDaten.filter(function(d) { return d.Typ == "Fallzahl" })[0].Anzahl;
				Genesene=aktuelleDaten.filter(function(d) { return d.Typ == "Genesene" })[0].Anzahl;
				Verstorbene=aktuelleDaten.filter(function(d) { return d.Typ == "Todesfälle" })[0].Anzahl;
				dateNameFormat = d3.time.format("%-d.%-m.%Y");
				$("#Infizierte").html("Infizierte Personen: "+Fallzahl);
				$("#Genesene").html("Genesene Personen: "+Genesene);
				$("#Verstorbene").html("Verstorbene Personen: "+Verstorbene);
				$("#Stand").html("Stand: "+dateNameFormat(latestdate)+ ", 8:00 Uhr");
			});
		}
	}
})