<table class="listing">
<tbody>
<tr>
<td><strong>Nombre d’habitants </strong><span id="bevölkerungyear"></span></td>
<td id="bevölkerung"></td>
</tr>
<tr>
<td> </td>
<td> </td>
</tr>
<tr>
<td><strong>Superficie totale du canton </strong>en ha</td>
<td>23'873</td>
</tr>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Zones bâties </td>
<td>3'306</td>
</tr>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Zones agricoles </td>
<td>10'366</td>
</tr>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forêts </td>
<td>6'529</td>
</tr>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lacs </td>
<td>3'172</td>
</tr>
<tr>
<td> </td>
<td> </td>
</tr>
<tr>
<td><strong><a href="http://www.zg.ch/behoerden/gemeinden">communes</a></strong></td>
<td>11</td>
</tr>
<tr>
<td> </td>
<td> </td>
</tr>
<tr>
<td><strong>Point le plus haut</strong> en mètres d'altitude </td>
<td>1'580 Wildspitz (Rossberg) </td>
</tr>
<tr>
<td> </td>
<td> </td>
</tr>
<tr>
<td><strong>Structure économique</strong>, Nombre d’actifs par secteur <span id="wirtschaftsstrukturyear"></span></td>
<td> </td>
</tr>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Secteur primaire (“Agriculture“)</td>
<td><span id="wsabs1"></span> (<span id="wsrel1"></span>)</td>
</tr>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Secteur secondaire (“Industrie“)</td>
<td><span id="wsabs2"></span> (<span id="wsrel2"></span>)</td>
</tr>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Secteur tertiaire (“Services“)</td>
<td><span id="wsabs3"></span> (<span id="wsrel3"></span>)</td>
</tr>
<tr>
<td> </td>
<td> </td>
</tr>
<tr>
<td><strong>Nombre d'employés </strong><span class="wirtschaftyear"></span></td>
<td><span id="Beschäftigte"></span></td>
</tr>
<tr>
<td><strong>Equivalent plein temps </strong><span class="wirtschaftyear"></span></td>
<td><span id="Vollzeitäquivalente"></span></td>
</tr>
<tr>
<td><strong>Nombre d’entreprises </strong><span class="wirtschaftyear"></span></td>
<td><span id="Betriebe"></span></td>
</tr>
<tr>
<td> </td>
<td> </td>
</tr>
<tr>
<td><strong>Logements </strong><span id="wohnungenyear"></span></td>
<td><span id="wohnungen"></span></td>
</tr>
</tbody>
</table>

<script>
require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		libs: "libraries",
		"d3queue":"libraries/queue",
		"dc": "libraries/dc"
	}
});

require(['stat_zg_generals','dc','d3queue'], function(generals,dc,queue){
	var bevölkerung = dc.numberDisplay("#bevölkerung");
	var bestandwohnungen = dc.numberDisplay("#wohnungen");
	var betriebe = dc.numberDisplay("#betriebe");
	var beschäftigte = dc.numberDisplay("#beschäftigte");
		
	var q = queue.queue()
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
		.defer(d3.csv, "/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-10.csv");

	q.await(function(error, data0, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10) {
		
		if (error) throw error;

		//Metadaten auslesen und Daten berechnen.
		meta1 = data1.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year1 = meta1.filter(function( el ) { return el.Type == "year";});
		if (year1.length == 1) {
			$("#bevölkerungyear").html("("+year1[0].Content+")");
		}

		data1 = data1.filter(function(el) {
			return el["Meta"] == ""
		});
				
		var tots1 = d3.sum(data1, function(d) { 
			return d["Ständige Wohnbevölkerung"]; 
		});
		
		$("#bevölkerung").html(germanFormatters.numberFormat(",")(tots1));

		meta3 = data3.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year3 = meta3.filter(function( el ) { return el.Type == "year";});
		if (year3.length == 1) {
			$("#wohnungenyear").html("("+year3[0].Content+")");
		}
		
		data3 = data3.filter(function(el) {
			return el["Meta"] == ""
		});
		
		var tots3 = d3.sum(data3, function(d) { 
			return d["Wohnungen"]; 
		});
		
		$("#wohnungen").html(germanFormatters.numberFormat(",")(tots3));
		
		meta6 = data6.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year6 = meta6.filter(function( el ) { return el.Type == "year";});
		if (year6.length == 1) {
			$(".wirtschaftyear").html("("+year6[0].Content+")");
		}
		
		data6 = data6.filter(function(el) {
			return el["Meta"] == ""
		});
		
		var betriebe = d3.sum(data6, function(d) { 
			return d.Betriebe; 
		});
		
		var beschäftigte = d3.sum(data6, function(d) { 
			return d.Beschäftigte; 
		});
		
		var vollzeitäquivalente = d3.sum(data6, function(d) { 
			return d.Vollzeitäquivalente; 
		});
		
		$("#Betriebe").html(germanFormatters.numberFormat(",f")(betriebe));
		$("#Beschäftigte").html(germanFormatters.numberFormat(",f")(beschäftigte));
		$("#Vollzeitäquivalente").html(germanFormatters.numberFormat(",f")(vollzeitäquivalente));
		
		meta10 = data10.filter(function(el) {
			return el["Meta"] == 1
		});
		
		year10 = meta10.filter(function( el ) { return el.Type == "year";});
		if (year10.length == 1) {
			$("#wirtschaftsstrukturyear").html("("+year10[0].Content+")");
		}
		
		data10 = data10.filter(function(el) {
			return el["Meta"] == ""
		});
		
		var data110 = d3.nest()
			.key(function(d) { return d.Sektor;})
			.rollup(function(d) { 
				return d3.sum(d, function(g) {return g["Beschäftigte"]; });
			}).entries(data10);
		
		var tots10 = d3.sum(data110, function(d) { 
			return d.values; 
		});
		
		$("#wsabs1").html(germanFormatters.numberFormat(",")(data110.filter(function(d, i) {return d.key == "Land- und Forstwirtschaft"})[0].values));
		$("#wsabs2").html(germanFormatters.numberFormat(",")(data110.filter(function(d, i) {return d.key == "Industrie und Gewerbe"})[0].values));
		$("#wsabs3").html(germanFormatters.numberFormat(",")(data110.filter(function(d, i) {return d.key == "Dienstleistung"})[0].values));
		$("#wsrel1").html(germanFormatters.numberFormat(",.1%")((data110.filter(function(d, i) {return d.key == "Land- und Forstwirtschaft"})[0].values)/tots10));
		$("#wsrel2").html(germanFormatters.numberFormat(",.1%")((data110.filter(function(d, i) {return d.key == "Industrie und Gewerbe"})[0].values)/tots10));
		$("#wsrel3").html(germanFormatters.numberFormat(",.1%")((data110.filter(function(d, i) {return d.key == "Dienstleistung"})[0].values)/tots10));

	})
})  

</script>