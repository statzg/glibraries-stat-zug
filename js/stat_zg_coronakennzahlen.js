/* stat_zg_kennzahlen.js (version 0.1 (2018.11.14)*/

require.config({
  //baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
  //baseUrl: 'https://cdn.jsdelivr.net/gh/statzg/glibraries-stat-zug@master/js/',
  baseUrl: 'https://survey.zg.ch/cdn/js/',
  paths: {
    "libs": "libraries",
	"d3v4": "libraries/d3_v4"
  }
});

define(['d3v4'],  function(d3v4) {

	return {
		load: function(showlink, csv_path) {
			var showlink = (typeof showlink == 'undefined') ? "false" : showlink;
			var csv_path = (typeof csv_path == 'undefined') ? "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-01-e1.csv" : csv_path;
			d3v4.csv(csv_path + '?' + Math.floor(Math.random() * 1000), function (data) {
				format=d3v4.timeParse("%d.%m.%Y")
				data.forEach(function(x) {
					x["Datumstr"] = x["Datum"];
					x["Datum"] = format(x["Datum"]);
					x["Anzahl"] = +x["Anzahl"];
				});
				x = data.map(function(d) {
					return {
					"Tag": d.Datum
					};
				});
				latestdate = d3v4.max(x.map(d=>d.Tag));
				yesterday = new Date(latestdate.getTime());
				yesterday.setDate(yesterday.getDate()-1);
				twodaysago = new Date(latestdate.getTime());
				twodaysago.setDate(twodaysago.getDate()-2);
				threedaysago = new Date(latestdate.getTime());
				threedaysago.setDate(threedaysago.getDate()-3);
				console.log(latestdate)
				console.log(yesterday)
				console.log(twodaysago)
				console.log(threedaysago)
				dauer = latestdate.getDay() == 0 ? "72" : "24";
				aktuelleDaten=data.filter(function(d) { return d.Datum >= latestdate })
				vorherigeDaten=data.filter(function(d) { return d.Datum >= yesterday & d.Datum < latestdate })
				if (dauer=="72") {
					vorherigeDaten=data.filter(function(d) { return d.Datum >= threedaysago & d.Datum < twodaysago })
				}
				NeueFallzahl=aktuelleDaten.filter(function(d) { return d.Typ == "Fallzahl" })[0].Anzahl-vorherigeDaten.filter(function(d) { return d.Typ == "Fallzahl" })[0].Anzahl;
				Hospitalisationen=aktuelleDaten.filter(function(d) { return d.Typ == "Hospitalisierte" })[0].Anzahl;
				Fallzahl=aktuelleDaten.filter(function(d) { return d.Typ == "Fallzahl" })[0].Anzahl;
				Genesene=aktuelleDaten.filter(function(d) { return d.Typ == "Genesene" })[0].Anzahl;
				Verstorbene=aktuelleDaten.filter(function(d) { return d.Typ == "Todesfälle" })[0].Anzahl;
				dateNameFormat = d3v4.timeFormat("%-d.%-m.%Y");
				$("#coronazahlen").append( "<p id='NeuInfiziertePersonen'></p>")
				$("#coronazahlen").append( "<p id='Hospitalisationen'></p>")
				$("#coronazahlen").append( "<p id='InfiziertePersonen'></p>")
				$("#coronazahlen").append( "<p id='GenesenePersonen'></p>")
				$("#coronazahlen").append( "<p id='VerstorbenePersonen'></p>")
				$("#coronazahlen").append( "<p id='Stand'></p>")
				if (showlink==true) {
					$("#coronazahlen").append( "<p id='Link'></p>")
					$("#Link").html("<a href='/behoerden/gesundheitsdirektion/statistikfachstelle/themen/gesundheit/corona'>Detaillierte Statistiken </a>");
				}
				$("#NeuInfiziertePersonen").html("<b>"+NeueFallzahl+"</b> neue Fälle in den letzten "+ dauer +" Stunden");
				$("#Hospitalisationen").html("<b>"+Hospitalisationen+"</b> Hospitalisationen");
				$("#InfiziertePersonen").html("<b>"+Fallzahl+"</b> Fälle seit Beginn der Pandemie");
				$("#GenesenePersonen").html("<b>"+Genesene+"</b> genesene Personen seit Beginn der Pandemie");
				$("#VerstorbenePersonen").html("<b>"+Verstorbene+"</b> Todesfälle seit Beginn der Pandemie");
				$("#Stand").html("Stand: "+dateNameFormat(latestdate.setDate(latestdate.getDate()+1))+ ", 8:00 Uhr");
			});
		}
	}
})