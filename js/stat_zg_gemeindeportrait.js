function loadGemeindeportrait(version) {

	var version = (typeof version == 'undefined') ? "online" : version;

	//Objekte für Grafik- und Tabelle-Export initialisieren.
	Atts[2]={};
	Atts[3]={};
	Atts[4]={};
	Atts[5]={};
	Atts[6]={};
	Atts[7]={};
	Atts[8]={};

	Atts[2].maincontainer="kennzahlen-container"
	Atts[3].maincontainer="entwicklung-container"
	Atts[4].maincontainer="altersstruktur-container"
	Atts[5].maincontainer="wirtschaftsstruktur-container"
	Atts[6].maincontainer="bauzonen-container"
	if (version!="print") {
		Atts[7].maincontainer="geschlechtsstruktur-container"
		Atts[8].maincontainer="religionsstruktur-container"
	}
	Atts[2].chartcontainer="kennzahlen-chart"
	Atts[3].chartcontainer="entwicklung-chart"
	Atts[4].chartcontainer="altersstruktur-chart"
	Atts[5].chartcontainer="wirtschaftsstruktur-chart"
	Atts[6].chartcontainer="bauzonen-chart"
	if (version!="print") {
		Atts[7].chartcontainer="geschlechtsstruktur-chart"
		Atts[8].chartcontainer="religionsstruktur-chart"
	}
	
	if (version=="online") {
		$('h1.documentFirstHeading').html("Kantonsporträt");
		tduration=1000
	}
	if (version=="iframe") {
		tduration=1000
	}
	if (version=="print") {
		tduration=200
	}
	
	//URL-Parameter für Gemeinde setzen, falls noch nicht gesetzt
	if (version=="online") {
//		var uri = new URI(window.location.href);
		
		if (typeof uri.search(true)["gemeinde"] == "undefined") {
			gemeinde="kanton"
			uri.setSearch("gemeinde", gemeinde)
			window.history.pushState("", "", uri.href());
		} else {
			gemeinde = (uri.search(true)["gemeinde"].charAt(0).toLowerCase() + uri.search(true)["gemeinde"].slice(1)).replace("ae", "ä").replace("oe", "ö").replace("ue", "ü");
			
		}

		if (typeof uri.search(true)["merkmal"] == "undefined") {
			merkmal="kennzahlen"
			uri.setSearch("merkmal", merkmal)
			window.history.pushState("", "", uri.href());
			$(".hiderow#"+merkmal).addClass("selected")
			$(".hiderow#"+merkmal).parent().addClass("selected")
		} else {
			merkmal = uri.search(true)["merkmal"];
			
		}
	}
	if (version=="iframe") {
		merkmal="kennzahlen"
	}

    var numberFormat = d3.format(".2f");

	//Übersichtskarte initialisieren
    karte = dc.geoChoroplethChart("#karte");
	
	//Kennzahlen initialisieren
	var fläche = dc.numberDisplay("#fläche");
	var höhenlage = dc.numberDisplay("#höhenlage");
	var bevölkerung = dc.numberDisplay("#bevölkerung");
	var ausländeranteil = dc.numberDisplay("#ausländeranteil");
	var haushalte = dc.numberDisplay("#haushalte");
	var anteileinpersonenhaushalte = dc.numberDisplay("#anteileinpersonenhaushalte");
	var bestandwohnungen = dc.numberDisplay("#wohnungen");
	var neuwohnungen = dc.numberDisplay("#neuwohnungen");
	var volksschüler = dc.numberDisplay("#volksschüler");
	var betriebe = dc.numberDisplay("#betriebe");
	var beschäftigte = dc.numberDisplay("#beschäftigte");
	var steuerfuss = dc.numberDisplay("#steuerfuss");
	
	//Grafiken initialisieren
	var entwicklungsChart = dc.compositeChart("#entwicklung-chart");
	var altersstrukturChart = dc.barChart("#altersstruktur-chart");
	var wirtschaftsstrukturChart1 = dc.pieChart("#wirtschaftsstruktur1-chart");
	var wirtschaftsstrukturChart2 = dc.pieChart("#wirtschaftsstruktur2-chart");
	var bauzonenChart = dc.barChart("#bauzonen-chart");
	if (version!="print") {
		var geschlechterstrukturChart = dc.pieChart("#geschlechtsstruktur-chart");
		var religionsstrukturChart = dc.pieChart("#religionsstruktur-chart");
	}
	
	//Alle Daten einlesen
	if (version=="online" | version=="iframe") {
	var q = queue()
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-00.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-01.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-02.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-03.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-04.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-05.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-06.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-07.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-08.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-09.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-10.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-11.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-12.csv")
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-13.csv");
	}
	else if (version=="print") {
	var q = queue()
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-00.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-01.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-02.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-03.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-04.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-05.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-06.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-07.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-08.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-09.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-10.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-11.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-12.csv")
		.defer(d3.csv, "gemeindeportrait/result-gemeindeportrait-13.csv");
	}
	
	q.await(function(error, data0, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13 ) {
		
		if (error) throw error;

		//Metadaten auslesen und Datenobjekte für Tabellen-Export generieren.
		meta1 = data1.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year1 = meta1.filter(function( el ) { return el.Type == "year";});
		if (year1.length == 1) {
			$(".bevölkerungyear").html("("+year1[0].Content+")");
		}
		
		meta2 = data2.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year2 = meta2.filter(function( el ) { return el.Type == "year";});
		if (year2.length == 1) {
			$(".haushalteyear").html("("+year2[0].Content+")");
		}

		meta3 = data3.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year3 = meta3.filter(function( el ) { return el.Type == "year";});
		if (year3.length == 1) {
			$(".wohnungenyear").html("("+year3[0].Content+")");
		}
		
		meta4 = data4.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year4 = meta4.filter(function( el ) { return el.Type == "year";});
		if (year4.length == 1) {
			$(".neubauwohnungenyear").html("("+year4[0].Content+")");
		}
		
		meta5 = data5.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year5 = meta5.filter(function( el ) { return el.Type == "year";});
		if (year5.length == 1) {
			$(".volksschüleryear").html("("+year5[0].Content+")");
		}
		
		meta6 = data6.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year6 = meta6.filter(function( el ) { return el.Type == "year";});
		if (year6.length == 1) {
			$(".wirtschaftyear").html("("+year6[0].Content+")");
		}
		
		meta7 = data7.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year7 = meta7.filter(function( el ) { return el.Type == "year";});
		if (year7.length == 1) {
			$(".steuerfussyear").html("("+year7[0].Content+")");
		}
		
		meta8 = data8.filter(function(el) {
			return el["Meta"] == 1
		});	
		
		Atts[3].meta=meta8

		Atts[3].typerow = meta8.filter(function( el ) { return el.Type == "datatypes";});
		if (Atts[3].typerow.length == 1) {
			Atts[3].datatypes = (Atts[3].typerow[0].Content).split(/,\s?/);
		}	
		
		Atts[3].data = data8.filter(function(el) {
			return el["Meta"] == "NA" | el["Meta"] == undefined | el["Meta"] == ""
		});
		
		Atts[3].data.forEach(function(x) {
			x["Bevölkerung"] = +x["Bevölkerung"];
			x["Ausländer"] = +x["Ausländer"];
		});
		
		meta9 = data9.filter(function(el) {
			return el["Meta"] == 1
		});
		
		Atts[4].meta=meta9
		
		Atts[4].typerow = meta9.filter(function( el ) { return el.Type == "datatypes";});
		if (Atts[4].typerow.length == 1) {
			Atts[4].datatypes = (Atts[4].typerow[0].Content).split(/,\s?/);
		}	
		
		Atts[4].data = data9.filter(function(el) {
			return el["Meta"] == "NA" | el["Meta"] == undefined | el["Meta"] == ""
		});
		
		Atts[4].data.forEach(function(x) {
			x["Anzahl"] = +x["Anzahl"];
		});
		
		year9 = meta9.filter(function( el ) { return el.Type == "year";});
		if (year9.length == 1) {
			$(".altersstrukturyear").html("("+year9[0].Content+")");
		}
		
		meta10 = data10.filter(function(el) {
			return el["Meta"] == 1
		});
		
		Atts[5].meta=meta10
		
		Atts[5].typerow = meta10.filter(function( el ) { return el.Type == "datatypes";});
		if (Atts[5].typerow.length == 1) {
			Atts[5].datatypes = (Atts[5].typerow[0].Content).split(/,\s?/);
		}	
		
		Atts[5].data = data10.filter(function(el) {
			return el["Meta"] == "NA" | el["Meta"] == undefined | el["Meta"] == ""
		});
		
		Atts[5].data.forEach(function(x) {
			x["Betriebe"] = +x["Betriebe"];
			x["Beschäftigte"] = +x["Beschäftigte"];
		});
		
		year10 = meta10.filter(function( el ) { return el.Type == "year";});
		if (year10.length == 1) {
			$(".wirtschaftsstrukturyear").html("("+year10[0].Content+")");
		}
		
		meta11 = data11.filter(function(el) {
			return el["Meta"] == 1
		});
		
		Atts[6].meta=meta11
		
		Atts[6].typerow = meta11.filter(function( el ) { return el.Type == "datatypes";});
		if (Atts[6].typerow.length == 1) {
			Atts[6].datatypes = (Atts[6].typerow[0].Content).split(/,\s?/);
		}	
		
		Atts[6].data = data11.filter(function(el) {
			return el["Meta"] == "NA" | el["Meta"] == undefined | el["Meta"] == ""
		});
		
		Atts[6].data.forEach(function(x) {
			x["Fläche"] = +x["Fläche"];
		});
		
		year11 = meta11.filter(function( el ) { return el.Type == "year";});
		if (year11.length == 1) {
			$(".bauzonenyear").html("("+year11[0].Content+")");
		}
		
		meta12 = data12.filter(function(el) {
			return el["Meta"] == 1
		});
		
		Atts[7].meta=meta12
		
		Atts[7].typerow = meta12.filter(function( el ) { return el.Type == "datatypes";});
		if (Atts[7].typerow.length == 1) {
			Atts[7].datatypes = (Atts[7].typerow[0].Content).split(/,\s?/);
		}	
		
		Atts[7].data = data12.filter(function(el) {
			return el["Meta"] == "NA" | el["Meta"] == undefined | el["Meta"] == ""
		});
		
		Atts[7].data.forEach(function(x) {
			x["Anzahl"] = +x["Anzahl"];
		});
		
		year12 = meta12.filter(function( el ) { return el.Type == "year";});
		if (year12.length == 1) {
			$(".geschlechtsstrukturyear").html("("+year12[0].Content+")");
		}
		
		meta13 = data13.filter(function(el) {
			return el["Meta"] == 1
		});
		
		Atts[8].meta=meta13
		
		Atts[8].typerow = meta13.filter(function( el ) { return el.Type == "datatypes";});
		if (Atts[8].typerow.length == 1) {
			Atts[8].datatypes = (Atts[8].typerow[0].Content).split(/,\s?/);
		}	
		
		Atts[8].data = data13.filter(function(el) {
			return el["Meta"] == "NA" | el["Meta"] == undefined | el["Meta"] == ""
		});
		
		Atts[8].data.forEach(function(x) {
			x["Anzahl"] = +x["Anzahl"];
		});
		
		year13 = meta13.filter(function( el ) { return el.Type == "year";});
		if (year13.length == 1) {
			$(".religionsstrukturyear").html("("+year13[0].Content+")");
		}
		
		//Daten in Crossfilter-Objekt abfüllen.
		var data = crossfilter();
		
		data.add(data0.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: d["Homepage"], "Fläche in ha":d["Fläche in ha"], "Höhenlage in Meter über Meer":d["Höhenlage in Meter über Meer"], "Ständige Wohnbevölkerung": 0, "Ausländer/innen": 0, "Haushalte":0, "Einpersonenhaushalte":0, "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0, "Betriebe": 0, "Beschäftigte": 0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));		
		data.add(data1.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung": d["Ständige Wohnbevölkerung"], "Ausländer/innen": d["Ausländer/innen"], "Haushalte":0, "Einpersonenhaushalte":0, "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0, "Betriebe": 0, "Beschäftigte": 0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data2.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte": d["Haushalte"], "Einpersonenhaushalte": d["Einpersonenhaushalte"], "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0, "Betriebe": 0, "Beschäftigte": 0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data3.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen": d["Wohnungen"], "Neuerstellte Wohnungen": 0, "Volksschüler":0, "Betriebe": 0, "Beschäftigte": 0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data4.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen": d["Neuerstellte Wohnungen"], "Volksschüler":0, "Betriebe": 0, "Beschäftigte": 0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data5.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler": d["Volksschüler"], "Betriebe": 0, "Beschäftigte": 0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data6.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe": d["Betriebe"], "Beschäftigte": d["Beschäftigte"], "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data7.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe": 0, "Beschäftigte": 0, "Steuerfuss":d["Steuerfuss"], "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));	
		data.add(data8.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe":0, "Beschäftigte":0, "Steuerfuss":0, "Jahr":d["Jahr"], "Bevölkerung":d["Bevölkerung"], "Ausländer":d["Ausländer"], "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data9.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe":0, "Beschäftigte":0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":d["Alterskategorie"], "GeschlechtNation":d["Typ"], "AnzahlPersonen":d["Anzahl"], "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data10.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe":0, "Beschäftigte":0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":d["Sektor"], "BetriebenachSektor":d["Betriebe"], "BeschäftigtenachSektor":d["Beschäftigte"], "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data11.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe":0, "Beschäftigte":0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":d["Zone"], "Fläche":d["Fläche"], "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":"NaN", "AnzahlReligion":0};
		}))
		data.add(data12.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe":0, "Beschäftigte":0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":d["Geschlecht"], "AnzahlGeschlecht":d["Anzahl"], "Religion":"NaN", "AnzahlReligion":0};
		}));
		data.add(data13.map(function(d) {
			return {Gemeinde: d["Gemeinde"], Homepage: "NaN", "Fläche in ha":0, "Höhenlage in Meter über Meer":0, "Ständige Wohnbevölkerung":0, "Ausländer/innen":0,  "Haushalte":0, "Einpersonenhaushalte":0 , "Wohnungen":0, "Neuerstellte Wohnungen":0, "Volksschüler":0 , "Betriebe":0, "Beschäftigte":0, "Steuerfuss":0, "Jahr":0, "Bevölkerung":0, "Ausländer":0, "Alterskategorie":"NaN", "GeschlechtNation":"NaN", "AnzahlPersonen":0, "Sektor":"NaN", "BetriebenachSektor":0, "BeschäftigtenachSektor":0, "Zone":"NaN", "Fläche":0, "Geschlecht":"NaN", "AnzahlGeschlecht":0, "Religion":d["Religion"], "AnzahlReligion":d["Anzahl"]};
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
		
		var gemeinden = data.dimension(function (d) {
			return d["Gemeinde"];
		});
		var jahr = data.dimension(function (d) {
			return +d["Jahr"];
		});
		var einwohner = gemeinden.group().reduceSum(function (d) {
			return +d["Ständige Wohnbevölkerung"];
		});
		var einwohnerTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Ständige Wohnbevölkerung"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Ständige Wohnbevölkerung"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
		var ausländer = gemeinden.group().reduceSum(function (d) {
			return d["Ausländer/innen"];
		});
		var ausländerTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Ausländer/innen"];
				p.pop += +v["Ständige Wohnbevölkerung"];
				p.ant = p.tot/p.pop;
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Ausländer/innen"];
				p.pop -= +v["Ständige Wohnbevölkerung"];
				p.ant = p.tot/p.pop;
				return p;
			},
			function () { return {n:0,tot:0,pop:0,ant:0}; }
		);
		var haushalteTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Haushalte"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Haushalte"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
			
		var einpersonenhaushalteTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Einpersonenhaushalte"];
				p.pop += +v["Haushalte"];
				p.ant = p.tot/p.pop;
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Einpersonenhaushalte"];
				p.pop -= +v["Haushalte"];
				p.ant = p.tot/p.pop;
				return p;
			},
			function () { return {n:0,tot:0,pop:0,ant:0}; }
		);
			
		var wohnungen = gemeinden.group().reduceSum(function (d) {
			return +d["Wohnungen"];
		});
		
		var wohnungenTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Wohnungen"];
				return p;
			},
			function (p, v) {
				--p.n;
					p.tot -= +v["Wohnungen"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
			
		var neuewohnungen = gemeinden.group().reduceSum(function (d) {
			return +d["Neuerstellte Wohnungen"];
		});
			
		var neuewohnungenTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Neuerstellte Wohnungen"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Neuerstellte Wohnungen"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
			
		var volksschülerInnen = gemeinden.group().reduceSum(function (d) {
			return +d["Volksschüler"];
		});
		
		var volksschülerTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Volksschüler"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Volksschüler"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
		
		var betriebegroup = gemeinden.group().reduceSum(function (d) {
			return +d["Betriebe"];
		});
		
		var betriebeTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Betriebe"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Betriebe"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
			
		var beschäftigtegroup = gemeinden.group().reduceSum(function (d) {
			return +d["Beschäftigte"];
		});
		
		var beschäftigteTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Beschäftigte"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Beschäftigte"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
			
		var steuerfussgroup = gemeinden.group().reduceSum(function (d) {
			return +d["Steuerfuss"];
		});
		
		var SteuerfussTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Steuerfuss"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Steuerfuss"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
		
		var flächeinha = gemeinden.group().reduceSum(function (d) {
			return +d["Fläche in ha"];
		});
		
		var flächeinhaTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Fläche in ha"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Fläche in ha"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
		
		var höhenlagemüm = gemeinden.group().reduceSum(function (d) {
			return +d["Höhenlage in Meter über Meer"];
		});
		
		var höhenlagemümTotal = data.groupAll().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Höhenlage in Meter über Meer"];
				return p;
			},
			function (p, v) {
				--p.n;
				p.tot -= +v["Höhenlage in Meter über Meer"];
				return p;
			},
			function () { return {n:0,tot:0}; }
		);
			
		var einwohnerprojahr = jahr.group().reduceSum(function (d) {
			return +d["Bevölkerung"];
		});
		var Realeinwohnerprojahr = remove_bins(einwohnerprojahr);
			
		var ausländeranteilprojahr = jahr.group().reduce(
			function (p, v) {
				++p.n;
				p.tot += +v["Ausländer"];
				p.pop += +v["Bevölkerung"];
				p.ant = p.tot/p.pop;
				return p;
			},
			function (p, v) {
				--p.n
				p.tot -= +v["Ausländer"];
				p.pop -= +v["Bevölkerung"];
				p.ant = p.tot/p.pop;
				return p;
			},
			function () { return {n:0,tot:0,pop:0,ant:0}; }
		);
			
		var Realausländeranteilprojahr = remove_bins(ausländeranteilprojahr);
			
		var altersstrukturStack=data.dimension(function (d) {
			return d["Alterskategorie"];
		});
				
		var AltersstrukturGroup= altersstrukturStack.group().reduce(function(p, v) {
			++p.count;
			if (v["GeschlechtNation"]=="Schweizerinnen" | v["GeschlechtNation"]=="Ausländerinnen") {
				p["Negativ"] = (p["Negativ"] || 0) + +v["AnzahlPersonen"];
				p[v["GeschlechtNation"]] = (p[v["GeschlechtNation"]] || 0) - +v["AnzahlPersonen"];
			}
			else {
				p[v["GeschlechtNation"]] = (p[v["GeschlechtNation"]] || 0) + +v["AnzahlPersonen"];
			}
			p.total += +v["AnzahlPersonen"];
			return p;
		}, function(p, v) {
			--p.count;
			if (v["GeschlechtNation"]=="Schweizerinnen" | v["GeschlechtNation"]=="Ausländerinnen") {
				p["Negativ"] = (p["Negativ"] || 0) - +v["AnzahlPersonen"];
				p[v["GeschlechtNation"]] = (p[v["GeschlechtNation"]] || 0) + +v["AnzahlPersonen"];
			}
			else {
				p[v["GeschlechtNation"]] = (p[v["GeschlechtNation"]] || 0) - +v["AnzahlPersonen"];
			}
			p.total -= +v["AnzahlPersonen"];
			return p;
		}, function() {
			return { total:0, count:0};
		});
		var RealAltersstrukturGroup = remove_bins(AltersstrukturGroup)
		
		var altersstrukturkategorien = data.dimension(function (d) {
			return d["GeschlechtNation"];
		});
		var altersstrukturGroup2 = altersstrukturkategorien.group().reduceSum(function (d) {
			return +d["AnzahlPersonen"];
		});
		var AnzahlPersonenTotal = data.groupAll().reduceSum(function (d) {
			return d["AnzahlPersonen"];
		});
		
		var GeschlechtDimension = data.dimension(function (d) {
			return d["Geschlecht"];
		});
		var GeschlechtGroup = GeschlechtDimension.group().reduceSum(function (d) {
			return d["AnzahlGeschlecht"];
		});
		var RealGeschlechtGroup = remove_bins(GeschlechtGroup);		
		
		var ReligionDimension = data.dimension(function (d) {
			return d["Religion"];
		});
		var ReligionGroup = ReligionDimension.group().reduceSum(function (d) {
			return d["AnzahlReligion"];
		});
		var RealReligionGroup = remove_bins(ReligionGroup);		
		
		var SektorDimension = data.dimension(function (d) {
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
		
		var ZoneDimension = data.dimension(function (d) {
			return d["Zone"];
		});
		var FlächenachZoneGroup = ZoneDimension.group().reduceSum(function (d) {
			return d["Fläche"];
		});
		var RealFlächenachZoneGroup = remove_bins(FlächenachZoneGroup)
		
		var FlächeTotal = data.groupAll().reduceSum(function (d) {
			return d["Fläche"];
		});

		//Funktion um ein bestimmtes Stack zu wählen
		function sel_stack(i) {
			return function(d) {
				return d.value[i];
			};
		};
		
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
			if (version=="online") {
			var totalWidth = document.getElementById('default').offsetWidth;
			var mapheight = 400
			var heightmax = 400
			var heightmin = 240
			var mapheight = Math.min( heightmin + (totalWidth - 286)*1, heightmax);
			var scale = 82000
			var scalemax = 82000
			var scalemin = 50000
			var scale = Math.min( scalemin + (totalWidth - 286)*180.5, scalemax);
			var lat = 8.548589899
			var lon = 47.15309567
			var pfadKarte = "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/geojson/gemeinden.json"
			}
			if (version=="iframe") {
			var totalWidth = document.getElementById('default').offsetWidth;
			var mapheight = 400
			var heightmax = 380
			var heightmin = 240
			var mapheight = Math.min( heightmin + (totalWidth - 286)*1, heightmax);
			var scale = 82000
			var scalemax = 82000
			var scalemin = 50000
			var scale = Math.min( scalemin + (totalWidth - 286)*180.5, scalemax);
			var lat = 8.548589899
			var lon = 47.15309567
			var pfadKarte = "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/geojson/gemeinden.json"
			}
			else if (version=="print") {
			var totalWidth = document.getElementById('karte').offsetWidth;
			var mapheight = 350
			var heightmax = 350
			var heightmin = 240
			var mapheight = Math.min( heightmin + (totalWidth - 286)*1, heightmax);
			var scale = 75000
			var scalemax = 75000
			var scalemin = 50000
			var scale = Math.min( scalemin + (totalWidth - 286)*180.5, scalemax);
			var lat = 8.548589899
			var lon = 47.15309567
			var pfadKarte = "geojson/gemeinden.json"
			}
			
			if (typeof uri.search(true)["isolate"] != "undefined") {
				totalWidth=650
			}
			
			var projection = d3.geo.mercator()
				.center([lat,lon])
				.scale(scale)
				.translate([totalWidth / 2 , mapheight / 2 ]);
				//.translate([totalWidth/2,height/2]);
			
			d3.json(pfadKarte, function (statesJson) {
			
				var namenGemeinden=["Baar", "Cham", "Hünenberg", "Menzingen", "Neuheim", "Oberägeri", "Risch", "Steinhausen", "Unterägeri", "Walchwil" ,"Zug", "See"]
				
				karte.width(totalWidth)
					.height(mapheight)
					.dimension(gemeinden)
					.group(einwohner)
					.colors(d3.scale.ordinal().domain(namenGemeinden)
						.range([colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], colorscheme[1][1][0], "#ebf4fa"]))
					.colorAccessor(function(d) { 
						return d ? d.key : "See";
					})
					.projection(projection)
					.overlayGeoJson(statesJson.features, "gemeinde", function (d) {
						return d.properties.name;
					})
					.valueAccessor(function(kv) {
						return kv.value;
					})
					.title(function (d) {
						return "Gemeinde: " + d.key + "";
					})
					//Filterfunktionen müssen etwas angepasst werden, damit es mit dem Verbergen klappt und damit noch einige andere Sachen angepasst werden können.
					.addFilterHandler(function (filters, filter) {
						if (filter != "Zugersee" && filter != "Aegerisee") {
							$('#müm').show();
							if (version=="online") {
								showall();
								$('#flag').attr("src", "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/"+ filter.toLowerCase().replace("ü", "ue").replace("ä", "ae")+ ".png")
								$('h1.documentFirstHeading').html("Gemeindeporträt "+filter);
								$('#URLdownload').val(encodeURI("https://www.zg.ch/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportraits.html?selection="+filter.toLowerCase()));
								gemeinde=(filter.charAt(0).toLowerCase() + filter.slice(1)).replace("ä", "ae").replace("ö", "oe").replace("ü", "ue");
								uri.setSearch("gemeinde", gemeinde)
								window.history.pushState("", "", uri.href());
							}
							else if (version=="iframe") {
								showall();
								$('#flag').attr("src", "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/"+ filter.toLowerCase().replace("ü", "ue").replace("ä", "ae")+ ".png")
								$('h1.maintitle').html("Gemeindeporträt "+filter);
								$('#URLdownload').val(encodeURI("https://www.zg.ch/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportraits.html?selection="+filter.toLowerCase()));
							}
							else if (version=="print") {
								$('#mainflag').attr("src", "logos/gross/"+ filter.replace("ü", "ü").replace("ä", "ä")+ ".png")
								$('#maintitle').html("Gemeindeporträt "+filter);
							}
							$('.gemeindename').html("Gemeinde "+filter);
							$('.ebene').html("Einwohnergemeinde");
							filters.length = 0; // empty the array
							filters.push(filter);
						}
						return filters;
					})
					.removeFilterHandler(function (filters, filter) {
						$('#müm').hide();
						if (version=="online") {
							showall();
							$('#flag').attr("src", "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/kanton.png")
							$('h1.documentFirstHeading').html("Kantonsporträt");
							$('input[name="Url"]').val(encodeURI("https://www.zg.ch/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportraits.html"));
							uri.setSearch("gemeinde", "kanton")
							window.history.pushState("", "", uri.href());
							gemeinde="kanton";
						}
						else if (version=="iframe") {
							showall();
							$('#flag').attr("src", "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/kanton.png")
							$('h1.maintitle').html("Kantonsportrait");
							$('input[name="Url"]').val(encodeURI("https://www.zg.ch/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportraits.html"));
						}
						else if (version=="print") {
							$('#mainflag').attr("src", "")
							$('#maintitle').html("Kantonsporträt");
						}
						$('.gemeindename').html("Kanton Zug");
						$('.ebene').html("Kanton");
						filters.length = 0;
						return filters;
					});
				
				//Vermutlich überflüssig
				var number=1;
				
				//Auch FilterAll muss etwas angepasst werden
				dc.override(karte, "filterAll", function () {
					var g = this._filterAll();
					$('#müm').hide();
					if (version=="online") {
						showall();
						$('#flag').attr("src", "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/kanton.png")
						$('h1.documentFirstHeading').html("Kantonsporträt");
						$('input[name="Url"]').val(encodeURI("https://www.zg.ch/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportraits.html"));
					}
					else if (version=="iframe") {
						showall();
						$('#flag').attr("src", "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/kanton.png")
						$('h1.maintitle').html("Kantonsportrait");
						$('input[name="Url"]').val(encodeURI("https://www.zg.ch/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportraits.html"));
					}
					else if (version=="print") {
						$('#mainflag').attr("src", "")
						$('#maintitle').html("Kantonsporträt");
					}
					$('.gemeindename').html("Kanton Zug");
					$('.ebene').html("Kanton");
					return g;
				});
				
				//Filter von URL-Parameter übernehmen
				if (version=="online") {
					if (gemeinde!="kanton") {
						if (karte.filters()[0]!=(gemeinde.charAt(0).toUpperCase() + gemeinde.slice(1)).replace("ae", "ä").replace("oe", "ö").replace("ue", "ü")) {
							karte.filter((gemeinde.charAt(0).toUpperCase() + gemeinde.slice(1)).replace("ae", "ä").replace("oe", "ö").replace("ue", "ü"));
						}
					}
				}
				
				//Kennzahlen
				fläche
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(flächeinhaTotal);
				
				höhenlage
					.valueAccessor(function (d) {
						var höheübermeer=d.tot
						if (höheübermeer>1000) { höheübermeer=NaN}
						return höheübermeer;
					}).formatNumber(germanFormatters.numberFormat(","))
					.group(höhenlagemümTotal);
				
				bevölkerung
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(einwohnerTotal);
					
				ausländeranteil
					.valueAccessor(anteil).formatNumber(d3.format('.1%'))
					.group(ausländerTotal);
					
				haushalte
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(haushalteTotal);
					
				anteileinpersonenhaushalte
					.valueAccessor(anteil).formatNumber(d3.format('.1%'))
					.group(einpersonenhaushalteTotal);
					
				bestandwohnungen
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(wohnungenTotal);
				
				neuwohnungen
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(neuewohnungenTotal);
					
				volksschüler
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(volksschülerTotal);
					
				betriebe
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(betriebeTotal);

				beschäftigte
					.valueAccessor(total).formatNumber(germanFormatters.numberFormat(","))
					.group(beschäftigteTotal);
				
				steuerfuss
					.valueAccessor(function (d) {
						var steuerfuss=d.tot
						if (steuerfuss>200) { steuerfuss=data7[11].Steuerfuss}
						return steuerfuss;
					}).formatNumber(germanFormatters.numberFormat(","))
					.group(SteuerfussTotal);
					
				for (i = 0; i < Realeinwohnerprojahr.all().length; i++) {
					if (typeof min == 'undefined' || min > Realeinwohnerprojahr.all()[i].key) {var min = Realeinwohnerprojahr.all()[i].key};
					if (typeof max == 'undefined' || max < Realeinwohnerprojahr.all()[i].key) {var max = Realeinwohnerprojahr.all()[i].key};
				}
				
				//Grafik zur Bevölkerungsentwicklung			
				var height=Math.min(500, (1.2*totalWidth));
				if (version=="online" | version=="iframe") {
					var links=65;
					var rechts=65;
				}
				else if (version=="print") {
					var links=75;
					var rechts=60;
				}
				
				entwicklungsChart
					.width(totalWidth)
					.height(height)
					.transitionDuration(tduration)
					.margins({left: links, top: 10, right: rechts, bottom: 30})
					.dimension(jahr)
					.group(Realeinwohnerprojahr)
					.x(d3.scale.linear().domain([min-1,max+1]))
					//.x(d3.scale.ordinal())
					//.xUnits(dc.units.ordinal)
					.elasticY(true)
					.brushOn(false)
					._rangeBandPadding(1)
					.compose([
						dc.barChart(entwicklungsChart)
							.group(Realeinwohnerprojahr, "Bevölkerung")
							.ordinalColors([colorscheme[1][2][0]])
							.yAxisPadding("15%")
							.gap(totalWidth/200)
							.centerBar(true)
							.title(function(d) {
								return ""; 
							}),
						dc.lineChart(entwicklungsChart)
							.group(Realausländeranteilprojahr, "Anteil Ausländer/innen in %")
							.valueAccessor(function (d) {
								return d.value.ant;
							})
							.yAxisPadding("10%")
							.ordinalColors([colorscheme[1][2][1]])
							.useRightYAxis(true)
							.interpolate("linear")
							.dotRadius(10)
							.title(function(d) {
								return ""; 
							})
					])
					.yAxisLabel("Bevölkerung")
					.rightYAxisLabel("Anteil Ausländer/innen in %")
					.renderHorizontalGridLines(true)
					.legend(dc.legend().x(20).y(height-20).itemHeight(13).gap(10)
					.horizontal(true)
					.legendWidth(totalWidth-10)
					.autoItemWidth(true))
					.filter = function() {}
					;
				
				entwicklungsChart.yAxis().tickFormat(germanFormatters.numberFormat(","));
				entwicklungsChart.xAxis().tickFormat(germanFormatters.numberFormat(""));
				entwicklungsChart.rightYAxis().tickFormat(d3.format('.0%'));
				
				//Funktion zur Bestimmung der Legendenbreite
				function getLegendWidth() {
					var legendLength = d3.select("#entwicklung-chart g.dc-legend").node().childElementCount;
					var legendWidthArray = [];
					legendHeightArray = [];
					for (i=0; i < legendLength; i++) {
						var j=i+1;
						var item = "#entwicklung-chart g.dc-legend-item:nth-of-type("+j+")";
						legendWidthArray[i]=d3.select(item).node().getBBox().width;
						legendHeightArray[i]=d3.select(item).node().getBBox().height;
					};
					legendMaxWidth = Math.max.apply(null, legendWidthArray);
				}
				
				//Funktion um beim Entwicklungschart, wenn nötig die x-Achse anzupassen und die Legende wenn nötig umzubrechen (je nach Breite)
				function rotateXentwicklung(){
					//Breite eines Zwischenstrichs
					var tickwidth=d3.transform(d3.selectAll("#entwicklung-chart g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#entwicklung-chart g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];;

					//Zeilen umbrechen, wenn breiter als Zwischenstrich
					entwicklungsChart.selectAll(".x .tick text")
						.call(wrap, tickwidth);

					//Maximale Breite der Skalenbezeichner	
					maxwidth=0
					maxheight=0
					entwicklungsChart.selectAll("#entwicklung-chart g.axis.x > g > text")
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

					legendy=height-40+maxheight
					d3.selectAll("#entwicklung-chart g.dc-legend").attr("transform", "translate(10,"+legendy+")")
					var legendHeight = d3.select("#entwicklung-chart g.dc-legend").node().getBBox().height;
					entwicklungsChart.height(height+maxheight+legendHeight-30)
						.margins({left: links, top: 10, right: rechts, bottom: (30 + maxheight + legendHeight)});
					entwicklungsChart.render()
					entwicklungsChart.selectAll(".x .tick text")
						.call(wrap, tickwidth);
					d3.selectAll("#entwicklung-chart g.dc-legend").attr("transform", "translate(10,"+legendy+")")
					maxwidth=0
					maxheight=0
					entwicklungsChart.selectAll("#entwicklung-chart g.axis.x > g > text")
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
					entwicklungsChart.height(height+Math.min(150, maxwidth)+legendHeight-30)
						.margins({left: links, top: 10, right: rechts, bottom: 30 +Math.min(150, maxwidth) + legendHeight});
					entwicklungsChart.render()
					entwicklungsChart.selectAll(".x .tick text")
						.call(wrap, Math.min(150, maxwidth));
					legendy=height-40+Math.min(150, maxwidth)
					d3.selectAll("#entwicklung-chart g.dc-legend").attr("transform", "translate(10,"+legendy+")")
					d3.selectAll("#entwicklung-chart g.axis.x > g > text")
						.style("text-anchor", "start")
					//var moveleft = (-maxheight)/2-3
					d3.selectAll("#entwicklung-chart g.axis.x > g > text").attr("transform", function (d) {
						var moveleft = (-(this.getBBox().height)/2)-5;
						return ("rotate(90), translate(10,"+moveleft+")")
					});
					}
					//Wenn nötig Legende umbrechen, funktioniert nur bis 2 Zeilen.
					getLegendWidth();
					if (legendMaxWidth > totalWidth-30){
						entwicklungsChart.selectAll("#entwicklung-chart g.dc-legend text")
							.call(wrap, totalWidth-30);
					d3.selectAll("#entwicklung-chart g.dc-legend text").attr("transform", function (d) {
						var height = (this.getBBox().height);
						if(height == 14) {
						return ("translate(0,0)")
						}
						if(height > 15) {
						return ("translate(0,-6)")
						}
					});
					}
					$("#entwicklung-chart .dc-legend-item text").attr("x", 17);
					
					var transx=d3.transform(d3.selectAll("#entwicklung-chart g.chart-body:nth-child(2)").attr("transform")).translate[0];
					var transy=d3.transform(d3.selectAll("#entwicklung-chart g.chart-body:nth-child(2)").attr("transform")).translate[1];
					d3.selectAll("#entwicklung-chart g.chart-body").attr("transform", "translate("+transx+","+transy+")")
				}
				
				//Grafik zur Alterstruktur
				var characteristics=["Schweizerinnen", "Ausländerinnen", "Negativ", "Schweizer", "Ausländer"]
				var characteristicsStack=["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-84", "85-89", "90-94", "95-99", "100+"]
				var colorsAltersstruktur=[colorscheme[1][4][2], colorscheme[1][4][3],  ,colorscheme[1][4][1], colorscheme[1][4][0]];
				
				altersstrukturChart
					.width(Math.min(500, totalWidth))
					.height(Math.min(500, totalWidth))
					.x(d3.scale.ordinal().domain(characteristicsStack))
					.xUnits(dc.units.ordinal)
					.margins({left: 50, top: 10, right: 10, bottom: 40})
					.brushOn(false)
					.barPadding(0.2)
					.outerPadding(0.2)
					.centerBar(false)
					//.clipPadding(1)
					.controlsUseVisibility(true)
					.title(function(d) {
						return ""; //d.key + '[' + this.layer + ']: ' + d.value[this.layer] + " " + d.value["total"];
					})
					.dimension(altersstrukturStack)
					.group(RealAltersstrukturGroup, characteristics[0] + "", sel_stack(characteristics[0]))
					//.renderLabel(true)
					.ordinalColors(colorsAltersstruktur)
					.transitionDuration(tduration)
					.yAxisPadding("5%")
					.elasticY(true)
					.filter = function() {}
					;
					
				//Farben in der Legende manuell zuweisen. funktionier nicht mit der Legende.
				/*Charts[number].on('renderlet', function(chart){
					for (var i=1; i<=characteristicsLength; ++i) {
					var j=i-1;
					chart.selectAll("g.stack._"+j+" > rect").attr("fill", function(d){
						return colorscheme[scale][characteristicsLength][i-1];
						
					});
					chart.selectAll("g.dc-legend-item:nth-child("+i+") > rect").attr("fill", function(d){
						return colorscheme[scale][characteristicsLength][i-1];
						
					});}
					})*/

				altersstrukturChart.legend(dc.legend().x(10).y(10).itemHeight(13).gap(10)
							.horizontal(false)
							.autoItemWidth(true));

				//Beim ersten mal Zeichnen, das "Negativ" aus der Legende entfernen und Legende richtig ordnen.
				if (redrawx==0) {
					//Legende Anders ordnen
					dc.override(altersstrukturChart, 'legendables', function() {
						var items = altersstrukturChart._legendables();
						items.splice(2, 1);
						items.splice(3, 1, items.splice(2, 1)[0])
						items.splice(3, 1, items.splice(0, 1)[0])
						items.splice(3, 1, items.splice(0, 1)[0])
						return items;
					});
				}
				
				redrawx=redrawx+1;

				for(var i = 1; i < 5; ++i){
					altersstrukturChart.stack(RealAltersstrukturGroup, characteristics[i], sel_stack(characteristics[i]));
				}
				
				//Ganze Alterpyramide drehen, wird als gestappelte Balken erstellt.
				altersstrukturChart.on('pretransition', function(c) {
					c.svg().select('g').attr("transform","rotate(270 "+(Math.min(500, totalWidth)/2)+", "+(Math.min(500, totalWidth)/2)+")");
					c.svg().selectAll('g.axis:nth-child(2) > g > text').attr("transform","translate(12,25) rotate(90 0,0)");
					c.svg().select('g:nth-child(3) > g:nth-child(3)').attr("transform","translate(12,25) rotate(90 0,0)");
					c.svg().selectAll('g.axis:nth-child(3) > g > text').each(function(d, i) {
						d3.select(this).text(d3.select(this).text().replace("-",""));
					});
				});
				
				altersstrukturChart.yAxis().tickFormat(germanFormatters.numberFormat(","));
				
				if (version!="print") {
					//Grafik zur Geschlechterstruktur
					var characteristicsGeschlechterstruktur=["Frauen", "Männer"]
					
					var colorScaleGeschlechterstruktur = d3.scale.ordinal()
						.domain(characteristicsGeschlechterstruktur)
						.range([colorscheme[1][2][1],colorscheme[1][2][0]]);
					
					var GeschlechterHeight=Math.min(500, totalWidth);
					
					geschlechterstrukturChart.width(totalWidth)
						.cx(totalWidth/2)
						.cy(Math.min(500, totalWidth)/2)
						.height(GeschlechterHeight)
						.slicesCap(15)
						.dimension(GeschlechtDimension)
						.group(RealGeschlechtGroup)
						.controlsUseVisibility(true)
						.externalRadiusPadding(0.1*GeschlechterHeight)
						.emptyTitle("Keine Daten vorhanden")
						.innerRadius(0.2*GeschlechterHeight)
						.colors(colorScaleGeschlechterstruktur)
						.transitionDuration(tduration)
						.title(function(d) {
							return ""; 
						})
						.ordering(function(d) { return characteristicsGeschlechterstruktur.indexOf(d.key); })
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
						
					//Grafik zur Religionsstruktur
					var characteristicsReligionsstruktur=["römisch-katholisch", "evangelisch-reformiert", "andere oder keine Konfession"]
					
					var colorScaleReligionsstruktur = d3.scale.ordinal()
						.domain(characteristicsReligionsstruktur)
						.range(colorscheme[1][3]);
					
					var ReligionsHeight=Math.min(500, totalWidth);
					
					religionsstrukturChart.width(totalWidth)
						.cx(totalWidth/2)
						.cy(Math.min(500, totalWidth)/2)
						.height(ReligionsHeight)
						.slicesCap(15)
						.dimension(ReligionDimension)
						.group(RealReligionGroup)
						.controlsUseVisibility(true)
						.externalRadiusPadding(0.1*ReligionsHeight)
						.emptyTitle("Keine Daten vorhanden")
						.innerRadius(0.2*ReligionsHeight)
						.colors(colorScaleReligionsstruktur)
						.transitionDuration(tduration)
						.title(function(d) {
							return ""; 
						})
						.ordering(function(d) { return characteristicsReligionsstruktur.indexOf(d.key); })
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
				}
								
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
					.slicesCap(15)
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
					.slicesCap(15)
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
				
				//Grafik zu den Bauzonen erstellen
				characteristicsBauzonen=["Wohnzonen", "Mischzonen", "Kernzonen", "Arbeitszonen", "Öffentliche Bauten und Anlagen (OeIB)", "Bauzonen mit besonderen Vorschriften, weitere Zonen"]
				
				var colorScaleBauzonen = d3.scale.ordinal()
					.domain(characteristicsBauzonen)
					.range(colorscheme[1][6]);
				
				if (version=="online") {
					var hoeheBauzonen=500;
					var faktorBauzonen=1.2;
				}
				if (version=="iframe") {
					var hoeheBauzonen=400;
					var faktorBauzonen=1.2;
				}
				else if (version=="print") {
					var hoeheBauzonen=380;
					var faktorBauzonen=1;
				}
				
				var bauzonenHeight=Math.min(hoeheBauzonen, (faktorBauzonen*totalWidth));
				
				bauzonenChart
					.width(totalWidth)
					.height(bauzonenHeight)
					.x(d3.scale.ordinal())
					.xUnits(dc.units.ordinal)
					.margins({left: 50, top: 10, right: 10, bottom: 20})
					.brushOn(false)
					.barPadding(0.2)
					.outerPadding(0.2)
					.centerBar(false)
					//.clipPadding(1)
					.controlsUseVisibility(true)
					.title(function(d) {
						return "";
					})
					.dimension(ZoneDimension)
					.group(RealFlächenachZoneGroup)
					.renderLabel(true)
					.elasticY(true)
					.colors(colorScaleBauzonen)
					.colorAccessor(function(d) { 
						return d.key
					})
					.transitionDuration(tduration)
					.yAxisPadding("5%")
					.ordering(function(d) { return characteristicsBauzonen.indexOf(d.key); })
					.filter = function() {};
					
				bauzonenChart.on('renderlet', function(c) {
					d3.selectAll("#bauzonen-chart text.barLabel").each(function(d, i) {
						if (d.data.value % 1) {wert=(germanFormatters.numberFormat(",.1f")(d.data.value))+" ha"}
						else {wert=(germanFormatters.numberFormat(",")(d.data.value))+" ha"}
						d3.select(this).text(wert);
					});
				});
				
				//Funktion um wenn nötig bei Bauzonen Labels der X-Achse anzupassen
				function rotateXbauzonen(){
					//Breite eines Zwischenstrichs
					var tickwidth=d3.transform(d3.selectAll("#bauzonen-chart g.axis.x > g.tick:nth-child(2)").attr("transform")).translate[0]-d3.transform(d3.selectAll("#bauzonen-chart g.axis.x > g.tick:nth-child(1)").attr("transform")).translate[0];

					//Zeilen umbrechen, wenn breiter als Zwischenstrich
					bauzonenChart.selectAll(".x .tick text")
						.call(wrap, tickwidth);

					//Maximale Breite der Skalenbezeichner
					var maxwidth=0
					var maxheight=0
					bauzonenChart.selectAll("#bauzonen-chart g.axis.x > g > text")
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

					bauzonenChart.height(bauzonenHeight+maxheight-20)
						.margins({left: 50, top: 10, right: 10, bottom: 10 + maxheight});
					bauzonenChart.render()
					bauzonenChart.selectAll(".x .tick text")
						.call(wrap, tickwidth);
					var maxwidth=0
					var maxheight=0
					bauzonenChart.selectAll("#bauzonen-chart g.axis.x > g > text")
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
					bauzonenChart.height(bauzonenHeight+Math.min(150, maxwidth)-20)
						.margins({left: 50, top: 10, right: 10, bottom: 10 + +Math.min(150, maxwidth)});
					bauzonenChart.render()
					bauzonenChart.selectAll(".x .tick text")
						.call(wrap, Math.min(150, maxwidth));
					d3.selectAll("#bauzonen-chart g.axis.x > g > text")
						.style("text-anchor", "start");
					d3.selectAll("#bauzonen-chart g.axis.x > g > text > tspan")
						.attr("x", 0);
					//var moveleft = (-maxheight)/2-3
					d3.selectAll("#bauzonen-chart g.axis.x > g > text").attr("transform", function (d) {
						var moveleft = (-(this.getBBox().height)/2)-5;
						return ("rotate(90), translate(10,"+moveleft+")")
					});
					}
					//Click-Event ausschalten
					d3.selectAll("#bauzonen-chart g.stack > rect").on('click',null);
					d3.selectAll("#bauzonen-chart g.stack > rect").on("click", function() {
					});
				}

				//Alles Zeichen
				dc.renderAll();
				
				//X-Achsen der Breit anpassen.
				rotateXentwicklung();
				rotateXbauzonen();
				
				//Funktionen um Tooltips zu definieren für verschieden Charts
				function callTipKarte(number){
		
					//Nur für Gemeinden, nicht für Seen, deshalb Zwischenschritt
					var communes = d3.selectAll("#karte svg g path").filter(function(d,i) {return d.id < 2000});
					
					communes.each(function(d, i){
						d3.select(this)
						.call(Tips[number])
						.on('mouseover', function(d, i) {
							if(d.key !== last_tip) {
								Tips[number].show(d, $("circle")[d.ind]);
								last_tip = d.key;
							}
							tiptext= "<span><b>" + d.properties.name + "</b></span><br/><br/><span><img src='/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/"+ d.properties.name.toLowerCase().replace("ü", "ue").replace("ä", "ae")+ ".png' alt='' width='75' ></span>";
							$("#d3-tip"+number).html(tiptext);
							$("#d3-tip"+number).css("background", "#fff");
							$("#d3-tip"+number).css("border-left", colorscheme[1][2][0]+" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 0 - ($("#d3-tip"+number).height()));
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Tips[number].hide(d);
						})
					})
				}
				
				function callTipBevölkerungsentwicklung(number){
					d3.selectAll("#entwicklung-chart g.stack > rect")
						.call(Tips[number])
						.on('mouseover', function(d, i) {
							if(d.key !== last_tip) {
								Tips[number].show(d);
								last_tip = d.key;
							}
							if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
							else {wert=germanFormatters.numberFormat(",")(d.data.value)}
							tiptext= "<span>" + d.data.key + "</span><br/><span>Einwohnerzahl: " +wert+  "</span>";
							$("#d3-tip"+number).html(tiptext)
							$("#d3-tip"+number).css("border-left", colorscheme[1][2][0]+" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 33 - (($("#d3-tip"+number).width()+30)/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) +5 - (($("#d3-tip"+number).height()+18)/2));
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Tips[number].hide(d);
						});
					d3.selectAll("circle.dot")
						.call(Tips[number])
						.on('mouseover', function(d, i) {
							if(d.data.key !== last_tip) {
								Tips[number].show(d);
								last_tip = d.data.key;
							}
							tiptext= "<span>" + d.data.key + "</span><br/><span>Anteil: " + d3.format('.1%')(d.data.value.ant) + "</span>";
							$("#d3-tip"+number).html(tiptext)
							$("#d3-tip"+number).css("border-left", colorscheme[1][2][1] +" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 33 - (($("#d3-tip"+number).width()+30)/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - (($("#d3-tip"+number).height()+18)/2));
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Tips[number].hide(d);
							//document.getElementsByClassName("dot")
							d3.selectAll("circle.dot").attr('style', "fill-opacity:0.000001");
							d3.selectAll("path.yRef").attr('style', "display:none");
							d3.selectAll("path.xRef").attr('style', "display:none");
						});
				}
				
				function callTipAltersstruktur(number){
					d3.selectAll("#altersstruktur-chart g.stack > rect")
						.call(Tips[number])
						.on('mouseover', function(d, i) {
							if(d.key !== last_tip) {
								Tips[number].show(d);
								last_tip = d.key;
							}
							if (d.data.value[characteristics[Math.floor(i/RealAltersstrukturGroup.all().length)]] % 1) {wert=germanFormatters.numberFormat(",.1f")(Math.abs(d.data.value[characteristics[Math.floor(i/RealAltersstrukturGroup.all().length)]]))}
							else {wert=germanFormatters.numberFormat(",")(Math.abs(d.data.value[characteristics[Math.floor(i/RealAltersstrukturGroup.all().length)]]))}
							tiptext= "<span>"+characteristics[Math.floor(i/RealAltersstrukturGroup.all().length)]+" "+ d.data.key+ " Jahre</span><br/><span>Anteil in der Altersgruppe: " + Math.abs((Math.round((d.data.value[characteristics[Math.floor(i/RealAltersstrukturGroup.all().length)]]/d.data.value["total"])*1000)/10).toFixed(1)) + '%' + "</span><br/><span>Anteil Gesamtbevölkerung: " + Math.abs((Math.round((d.data.value[characteristics[Math.floor(i/RealAltersstrukturGroup.all().length)]]/AnzahlPersonenTotal.value())*1000)/10).toFixed(1)) + '%' + " </span><br/><span>Anzahl: " + wert +  "</span>";
							$("#d3-tip"+number).html(tiptext)
							$("#d3-tip"+number).css("border-left", colorsAltersstruktur[Math.floor(i/RealAltersstrukturGroup.all().length)] +" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 33 - (($("#d3-tip"+number).width()+30)/2) + ((d3.selectAll("#altersstruktur-chart g.stack > rect")[0][i].height.baseVal.value)/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) + 5 - ($("#d3-tip"+number).height()+18/2));
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Tips[number].hide(d);
						});
				}

				if (version!="print") {
					function callTipReligionsstruktur(number){
						d3.selectAll("#religionsstruktur-chart g.pie-slice, #religionsstruktur-chart text.pie-slice")
							.call(Tips[number])
							.on('mouseover', function(d, i) {
								if(d.key !== last_tip) {
									Tips[number].show(d, $("#religionsstruktur-chart g.pie-slice")[characteristicsReligionsstruktur.indexOf(d.data.key)]);
									last_tip = d.key;
								}
								if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
								else {wert=germanFormatters.numberFormat(",")(d.data.value)}
								gruppe="Anzahl Personen";
								tiptext="<span>" + d.data.key + "</span><br/>Anteil: " + germanFormatters.numberFormat(",.1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + "</span><br/><span>"+gruppe+": " + wert + "</span>"
								$("#d3-tip"+number).html(tiptext)
								$("#d3-tip"+number).css("border-left", colorScaleReligionsstruktur(d.data.key)+" solid 5px");
								offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
								offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) -10 - ($("#d3-tip"+number).height()/2));
								$("#d3-tip"+number).css( 'left', offsetx);
								$("#d3-tip"+number).css( 'top', offsety);
							})
							.on('mouseout', function(d) {
								last_tip = null;
								Tips[number].hide(d);
							});
					}

					function callTipGeschlechterstruktur(number){
						d3.selectAll("#geschlechtsstruktur-chart g.pie-slice, #geschlechtsstruktur-chart text.pie-slice")
							.call(Tips[number])
							.on('mouseover', function(d, i) {
								if(d.key !== last_tip) {
									Tips[number].show(d, $("#geschlechtsstruktur-chart g.pie-slice")[characteristicsGeschlechterstruktur.indexOf(d.data.key)]);
									last_tip = d.key;
								}
								if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
								else {wert=germanFormatters.numberFormat(",")(d.data.value)}
								gruppe="Anzahl";
								tiptext="<span>" + d.data.key + "</span><br/>Anteil: " + germanFormatters.numberFormat(",.1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + "</span><br/><span>"+gruppe+": " + wert + "</span>"
								$("#d3-tip"+number).html(tiptext)
								$("#d3-tip"+number).css("border-left", colorScaleGeschlechterstruktur(d.data.key)+" solid 5px");
								offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
								offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) -10 - ($("#d3-tip"+number).height()/2));
								$("#d3-tip"+number).css( 'left', offsetx);
								$("#d3-tip"+number).css( 'top', offsety);
							})
							.on('mouseout', function(d) {
								last_tip = null;
								Tips[number].hide(d);
							});
					}
				}
				
				function callTipWirtschaftsstruktur(number){
					d3.selectAll("#wirtschaftsstruktur"+number+"-chart g.pie-slice, #wirtschaftsstruktur"+number+"-chart text.pie-slice")
						.call(Tips[number])
						.on('mouseover', function(d, i) {
							if(d.key !== last_tip) {
								Tips[number].show(d, $("#wirtschaftsstruktur"+number+"-chart g.pie-slice")[characteristicsWirtschaftsstruktur.indexOf(d.data.key)]);
								last_tip = d.key;
							}
							if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
							else {wert=germanFormatters.numberFormat(",")(d.data.value)}
							if (number==1) {var gruppe="Anzahl Betriebe"} else {var gruppe="Anzahl Beschäftigte"};
							tiptext="<span>" + d.data.key + "</span><br/>Anteil: " + germanFormatters.numberFormat(",.1%")(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI)*100)/100) + "</span><br/><span>"+gruppe+": " + wert + "</span>"
							$("#d3-tip"+number).html(tiptext)
							$("#d3-tip"+number).css("border-left", colorScaleWirtschaftstruktur(d.data.key)+" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 18 - ($("#d3-tip"+number).width()/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) -10 - ($("#d3-tip"+number).height()/2));
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Tips[number].hide(d);
						});
				}
				
				function callTipBauzonen(number){
					d3.selectAll("#bauzonen-chart g.stack > rect")
						.call(Tips[number])
						.on('mouseover', function(d, i) {
							if(d.key !== last_tip) {
								Tips[number].show(d);
								last_tip = d.key;
							}
							if (d.data.value % 1) {wert=germanFormatters.numberFormat(",.1f")(d.data.value)}
							else {wert=germanFormatters.numberFormat(",")(d.data.value)}
							tiptext= "<span>" + d.data.key + "</span><br/><span>Anteil: " + germanFormatters.numberFormat(",.1%")(d.data.value/FlächeTotal.value()) + "</span><br/><span>Fläche: " +wert+  " ha</span>";
							$("#d3-tip"+number).html(tiptext)
							$("#d3-tip"+number).css("border-left", colorScaleBauzonen(d.data.key)+" solid 5px");
							offsetx=(Number($("#d3-tip"+number).css( "left" ).slice(0, -2)) + 20 - ($("#d3-tip"+number).width()/2));
							offsety=(Number($("#d3-tip"+number).css( "top" ).slice(0, -2)) -18 - ($("#d3-tip"+number).height()/2));
							$("#d3-tip"+number).css( 'left', offsetx);
							$("#d3-tip"+number).css( 'top', offsety);
						})
						.on('mouseout', function(d) {
							last_tip = null;
							Tips[number].hide(d);
						});
				}
				
				//Tooltips anbinden
				
				callTipKarte("karte");
				callTipBevölkerungsentwicklung("bevölkerungsentwicklung");
				callTipAltersstruktur("altersstruktur");
				if (version!="print") {
					callTipGeschlechterstruktur("geschlechterstruktur");
					callTipReligionsstruktur("religionsstruktur");
				}
				callTipWirtschaftsstruktur(1);
				callTipWirtschaftsstruktur(2);
				callTipBauzonen("bauzonen");
				
				//Abstand in der Legende erhöhen
				
				$(".dc-legend-item text").attr("x", 17);
				$("title").remove();
			
				//Erst nach dem Zeichnen aller Grafiken: Kuchendiagramm mit Pfeilen ergänzen, 

				$( document ).ready(function() {
					setTimeout(function() {
					
						var arrowhead="M374.203,1150c-25.391,0-50.818-9.721-70.199-29.044c-38.789-38.834-38.789-101.685,0-140.376L685.37,599.14L305.74,219.451c-38.716-38.741-38.716-101.614,0-140.379c38.799-38.763,101.663-38.763,140.389,0l449.857,449.915 c18.58,18.629,29.103,43.84,29.103,70.153c0,26.339-10.523,51.551-29.103,70.226l-451.592,451.59 C425.012,1140.279,399.621,1150,374.203,1150z"
						var markerblack={"id":"arrowblack", "viewBox":"0 -5 1200 1200", "refX":-200, "refY":600, "markerWidth":3, "markerHeight":3, "orient":"auto"};
						
						svg = d3.selectAll("#wirtschaftsstruktur1-chart svg")
						
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
				
				//Bei der Alterspyramide die Helferkategorie mit negativen Werte ausblenden
				$("g.stack:nth-child(3)").hide();
				//Bei der Wirtschaftsstruktur den Mouseover reparieren
				$('#wirtschaftsstruktur1-chart').css( 'pointer-events', 'none' );
				$('.pie-slice').css( 'pointer-events', 'all' );
				//Bei den Seen in der Karte den Mouseover deaktivieren
				$('.zugersee').css( 'pointer-events', 'none' );
				$('.aegerisee').css( 'pointer-events', 'none' );

				/*$( document ).ready(function() {
					setTimeout(
						function() 
						{

						}, 1000);
				});*/
				
			});
			
		}


		//Objekt mit Tips erstellen
		if (typeof Tips == 'undefined') { Tips = {} };
		
		//Funktion zur Initialisierung der Tooltips
		function initTip(number){
			last_tip = null;
			Tips[number] = d3.tip()
				.attr('class', 'd3-tip')
				.attr('id', 'd3-tip'+number)
				.direction('n')
				.offset([0, 0])
				.html("no data");
			$(".pie-label").css( 'pointer-events', 'none' );
		}

		//Tooptips effektiv initialisieren, noch vor allem anderen
		initTip("karte");
		initTip("bevölkerungsentwicklung");
		initTip("altersstruktur");
		if (version!="print") {
			initTip("geschlechterstruktur");
			initTip("religionsstruktur");
		}
		initTip(1);
		initTip(2);
		initTip("bauzonen");
		
		//Effektives Zeichnen der Grafiken.	
		neuzeichnen();

		//Funktion für die Änderung der Fensterbreite
		function resizeWindow() {
			if (version=="online" | version=="iframe") {
				showall()
			}
			d3.selectAll(".d3-tip").remove();
			d3.selectAll("svg").remove()
			neuzeichnen()
		}
		
		if (version=="online" | version=="iframe") {	
			//Funktion um bei Knopfklick die entsprechende Grafik einzublenden und die andere auszublenden.
			$(".hiderow").click(function(){
				merkmal=this.id;
				if (version=="online") {
					
					for (i = 0; i < hide.length; i++) {
						$('#'+hide[i]+'-container').show(0);
					}

					uri.setSearch("merkmal", merkmal)
					window.history.pushState("", "", uri.href());
					d3.selectAll(".d3-tip").remove();
					d3.selectAll("svg").remove()
					neuzeichnen()
				}
				for (i = 0; i < hide.length; i++) {
					if (merkmal==hide[i]) {
						shown=i;
						$('#'+hide[i]+'-container').show(500);
						$(".hiderow#"+hide[i]).addClass("selected")
						$(".hiderow#"+hide[i]).parent().addClass("selected")
					}
					else {
						$('#'+hide[i]+'-container').hide(500);
						$(".hiderow#"+hide[i]).removeClass("selected")
						$(".hiderow#"+hide[i]).parent().removeClass("selected")
					}
				}
			});
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
	if (version=="online" | version=="iframe") {
		//Funktionen um immer nur eine Grafik (nebst der Karte) anzuzeigen.
		//Alle Objekte die verborgen werden können
		var hide=["kennzahlen", "entwicklung", "altersstruktur", "geschlechtsstruktur", "religionsstruktur", "wirtschaftsstruktur", "bauzonen"]

		//Zum neu zeichen müssen alle Grafiken eingeblendet werden, nach einer Sekunde werden sie wieder ausgeblendet.
		function showall() {
			if ('parentIFrame' in window) {
				parentIFrame.autoResize(false);
			}
			for (i = 0; i < hide.length; i++) {
				$('#'+hide[i]+'-container').show(0);
			}
			if (typeof uri.search(true)["isolate"] == "undefined") {
				setTimeout(	
					function() {
						for (i = 0; i < hide.length; i++) {
							if (merkmal!=hide[i]) {
								$('#'+hide[i]+'-container').hide(0);
							}
							else {
								$(".hiderow#"+hide[i]).addClass("selected")
								$(".hiderow#"+hide[i]).parent().addClass("selected")
							}
						}
						if ('parentIFrame' in window) {
							parentIFrame.autoResize(true);
						}					
					}, 1000);
			}
		}
		
		//Standarmässig werden die Kennzahlen angezeigt.
		var shown=0
		
		//Beim Seiten laden werden nach 2 Sekunden alle ausser gewähltes Merkmal (gemäss url) ausgeblendet.
		$( document ).ready(function() {
			if (typeof uri.search(true)["isolate"] == "undefined") {
				setTimeout(	
					function() {
						for (i = 0; i < hide.length; i++) {
							if (merkmal!=hide[i]) {
								$('#'+hide[i]+'-container').hide()
							} 
							else {
								$(".hiderow#"+hide[i]).addClass("selected")
								$(".hiderow#"+hide[i]).parent().addClass("selected")
							}
						}
					}, 2000);
			}
		});
		
		//Bei verschiedenen Grafiken die Download-Knöpfe anbringen
		var columns=["Gemeinde", "Jahr", "Bevölkerung", "Ausländer"];
		addDownloadButton(3);
		addDownloadButtonPng(3);
		addDataTablesButton(3, columns);

		var columns=["Gemeinde", "Alterskategorie", "Typ", "Anzahl"];
		addDownloadButton(4);
		addDownloadButtonPng(4);
		addDataTablesButton(4, columns);
		
		var columns=["Gemeinde", "Sektor", "Betriebe", "Beschäftigte"];
		addDownloadButton(5);
		addDownloadButtonPng(5);
		addDataTablesButton(5, columns);

		var columns=["Gemeinde", "Zone", "Fläche"];
		addDownloadButton(6);
		addDownloadButtonPng(6);
		addDataTablesButton(6, columns);
		
		var columns=["Gemeinde", "Geschlecht", "Anzahl"];
		addDownloadButton(7);
		addDownloadButtonPng(7);
		addDataTablesButton(7, columns);
		
		var columns=["Gemeinde", "Religion", "Anzahl"];
		addDownloadButton(8);
		addDownloadButtonPng(8);
		addDataTablesButton(8, columns);
	}

}
