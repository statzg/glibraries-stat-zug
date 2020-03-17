<!--<script type="text/javascript" src="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/stat_zg_generals.js"></script>
<script type="text/javascript" src="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/stat_zg_groupedbar.js"></script>
<script type="text/javascript" src="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/stat_zg_stackedbar.js"></script>
<script type="text/javascript" src="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/libraries/d3_v4.js"></script>
<script type="text/javascript" src="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/libraries/d3v4-tip.js"></script>
<script type="text/javascript" src="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/stat_zg_sunburst.js"></script>-->

<div id="default1">
	<div id="title" class="title"></div>
	<div><p>Gemeinde(n) auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="Zug" class="hiderow" href="javascript:;">Zug</a> </li>
			<li><a id="Oberägeri" class="hiderow" href="javascript:;">Oberägeri</a> </li>
			<li><a id="Unterägeri" class="hiderow" href="javascript:;">Unterägeri</a> </li>
			<li><a id="Menzingen" class="hiderow" href="javascript:;">Menzingen</a> </li>
			<li><a id="Baar" class="hiderow" href="javascript:;">Baar</a> </li>
			<li><a id="Cham" class="hiderow" href="javascript:;">Cham</a> </li>
			<li><a id="Hünenberg" class="hiderow" href="javascript:;">Hünenberg</a> </li>
			<li><a id="Steinhausen" class="hiderow" href="javascript:;">Steinhausen</a> </li>
			<li><a id="Risch" class="hiderow" href="javascript:;">Risch</a> </li>
			<li><a id="Walchwil" class="hiderow" href="javascript:;">Walchwil</a> </li>
			<li><a id="Neuheim" class="hiderow" href="javascript:;">Neuheim</a> </li>
		</ul>
	</div>
	<div id="subtitle" class="subtitle"></div>	
	<div id="chart1"></div>
	<div id="description" class="description"></div>
	<div id="source" class="source"></div>
</div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		libs: "libraries"
	}
});

require(['stat_zg_groupedbar'], function (groupedbar) {
	args1 ={
		number:1,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-01-01-01.csv",	
		dimension:"Jahr",											
		group:"Anzahl",	
		stack:"Gemeinde",					
		characteristicsStack:["Zug", "Oberägeri", "Unterägeri", "Menzingen", "Baar", "Cham", "Hünenberg", "Steinhausen", "Risch", "Walchwil", "Neuheim"],
		scale:2,													
		showTotal:true,												
		showAnteil:false											
	}

	groupedbar.load(args1);

	args1.groupFilter=[]

	//Funktion um bei Knopfklick die entsprechende Grafik einzublenden und die andere auszublenden.
	$(".hiderow").click(function(){
		shown=false
		for (k = 0; k < args1.groupFilter.length; k++) {
			if (this.id==args1.groupFilter[k]) {
				shown=true;
				j=k
			}
		}
		if (shown==false) {
			args1.groupFilter.push(this.id);
			$(this).addClass("selected")
			$(this).parent().addClass("selected")
		} else {
			args1.groupFilter.splice(j, 1)
			$(this).removeClass("selected")
			$(this).parent().removeClass("selected")
		}
		groupedbar.load(args1);
	});
});
</script>