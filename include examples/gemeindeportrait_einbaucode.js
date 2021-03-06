<div class="container" id="default">

    <div style="float:right; position: absolute; right:0px; top:30px">
		<img id="flag" src='/behoerden/gesundheitsdirektion/statistikfachstelle/daten/logos/kanton.png' alt='Wappen' width='75' >
	</div>
	
	<div id="karte" class="non-float">
	<div> <strong>Gemeinden</strong> (bitte wählen)
	<span style="float:right"><a class="reset" href="javascript:karte.filterAll(); dc.redrawAll();" style="display: none;">Zurück zum Kantonsportrait</a></span>
	</div>
    </div>

	<div>
		<ul class="subelements-listing">
			<li><a id="kennzahlen" class="hiderow" href="javascript:;">Kennzahlen</a> </li>
			<li><a id="entwicklung" class="hiderow" href="javascript:;">Bevölkerungsentwicklung</a> </li>
			<li><a id="altersstruktur" class="hiderow" href="javascript:;">Altersstruktur</a> </li>
			<li><a id="geschlechtsstruktur" class="hiderow" href="javascript:;">Geschlechterverhältnis</a> </li>
			<li><a id="religionsstruktur" class="hiderow" href="javascript:;">Konfessionen</a> </li>
			<li><a id="wirtschaftsstruktur" class="hiderow" href="javascript:;">Wirtschaftsstruktur</a> </li>
			<li><a id="bauzonen" class="hiderow" href="javascript:;">Raumstruktur</a> </li>
		</ul>
	</div>

	<div id="kennzahlen-container">
	<h3 id="title">Kennzahlen <span class="gemeindename">Kanton Zug</span> </h3> 
	<div id="kennzahlen-chart" class="non-float">
		<table width="100%">
			<col width="70%">
			<col width="30%">
			<tr>
				<td>Fläche ohne Seen</td>
				<td align="right"><span id="fläche"></span><span> ha</span></td>
			</tr>
			<tr id="müm" style="display: none;">
				<td>Höhenlage</td>
				<td align="right"><span id="höhenlage"></span> m.ü.M.</td>
			</tr>
			<tr>
				<td>Ständige Wohnbevölkerung <span class="bevölkerungyear"></span></td>
				<td align="right"><span id="bevölkerung"></span></td>
			</tr>
			<tr>
				<td>Anteil Ausländer/innen <span class="bevölkerungyear"></span></td>
				<td align="right"><span id="ausländeranteil"></span></td>
			</tr>
			<tr>
				<td>Haushalte <span class="haushalteyear"></span></td>
				<td align="right"><span id="haushalte"></span></td>
			</tr>
			<tr>
				<td>Anteil Einpersonenhaushalte<span class="haushalteyear"></span></td>
				<td align="right"><span id="anteileinpersonenhaushalte"></span></td>
			</tr>
			<tr>
				<td>Wohnungen <span class="wohnungenyear"></span></td>
				<td align="right"><span id="wohnungen"></span></td>
			</tr>
			<tr>
				<td>Neuerstellte Wohnungen <span class="neubauwohnungenyear"></span></td>
				<td align="right"><span id="neuwohnungen"></span></td>
			</tr>
			<tr>
				<td>Volksschüler/innen <span class="volksschüleryear"></span></td>
				<td align="right"><span id="volksschüler"></span></td>
			</tr>
			<tr>
				<td>Betriebe <span class="wirtschaftyear"></span></td>
				<td align="right"><span id="betriebe"></span></td>
			</tr>
			<tr>
				<td>Beschäftigte <span class="wirtschaftyear"></span></td>
				<td align="right"><span id="beschäftigte"></span></td>
			</tr>
			<tr>
				<td>Steuerfuss <span class="ebene">Kanton</span> <span class="steuerfussyear"></span></td>
				<td align="right"><span id="steuerfuss"></span></td>
			</tr>
		</table>
	</div>
	</div>
	
	<div class="isolatecontainer">
	<div id="entwicklung-container">
	<h3 id="title">Bevölkerungsentwicklung <span class="gemeindename">Kanton Zug</span></h3>
	
	<div id="entwicklung-chart" class="non-float">
	</div>
	</div>
	</div>

	<div class="isolatecontainer">	
	<div id="altersstruktur-container">
	<h3 id="title">Altersstruktur <span class="gemeindename">Kanton Zug</span> <span class="altersstrukturyear"></span></h3>
	
	<div id="altersstruktur-chart" class="non-float" style="text-align:center; display:block;">
	</div>
	</div>
	</div>

	<div class="isolatecontainer">
	<div id="geschlechtsstruktur-container">
	<h3 id="title">Geschlechterverhältnis <span class="gemeindename">Kanton Zug</span> <span class="geschlechtsstrukturyear"></span></h3>
	
	<div id="geschlechtsstruktur-chart" class="non-float" style="text-align:center; display:block;">
	</div>
	</div>
	</div>

	<div class="isolatecontainer">
	<div id="religionsstruktur-container">
	<h3 id="title">Konfessionen <span class="gemeindename">Kanton Zug</span> <span class="religionsstrukturyear"></span></h3>
	
	<div id="religionsstruktur-chart" class="non-float" style="text-align:center; display:block;">
	</div>
	</div>
	</div>
	
	<div class="isolatecontainer">
	<div id="wirtschaftsstruktur-container">
	<h3 id="title">Wirtschaftsstruktur <span class="gemeindename">Kanton Zug</span> <span class="wirtschaftsstrukturyear"></span></h3>
	
	<div id="wirtschaftsstruktur-chart" class="overlaycontainer" style="position: relative;">
		<div id="wirtschaftsstruktur1-chart" class="non-float" style="position: relative; z-index: 100;">
		</div>
		<div id="wirtschaftsstruktur2-chart" class="non-float" style="position: absolute; top: 0; left: 0; z-index: 99;">
	    </div>
	</div>
	</div>
	</div>
	
	<div class="isolatecontainer">
	<div id="bauzonen-container">
	<h3 id="title">Raumstruktur (Bauzonen) <span class="gemeindename">Kanton Zug</span> <span class="bauzonenyear"></span></h3>
	
	<div id="bauzonen-chart" class="non-float">
	</div>
	</div>
	</div>
	
    <!--<div style="margin-top:10px">
        <a href="javascript:karte.filterAll(); dc.redrawAll();">Zurück zum Kantonsportrait</a>
    </div>-->

</div>

<form>
	<input type="button" id="downloadPDF" value="Portrait als PDF ausgeben"/>
</form>

<script type="text/javascript">

require.config({
   urlArgs: "bust=" + (new Date()).getTime(),
   baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_gemeindeportrait'], function (gemeindeportrait) {
	gemeindeportrait.load();
})

//loadGemeindeportrait();
</script>