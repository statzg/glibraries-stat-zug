<div id="default2"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_groupedbar'], function (groupedbar) {
	groupedbar.load({
		number:2,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-01-04-02.csv",	
		dimension:"Region",											
		group:"Anteil",	
		stack:"Sprache",					
		characteristics:["Zug", "Zentralschweiz", "Zürich", "Aargau", "Schweiz"],	
		characteristicsStack:["Schweizerdeutsch", "Hochdeutsch", "Französisch", "Italienisch", "Englisch", "Andere Sprache(n)"],
		scale:2,													
		showTotal:true,												
		showAnteil:false,
		percent:true												
	});
})
</script>