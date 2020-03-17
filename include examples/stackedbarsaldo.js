<div id="default1"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_stackedbarsaldo'], function (stackedbarsaldo) {
	stackedbarsaldo.load({
		number:1,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-01-07-01.csv",		
		dimension:"Ereignis",											
		group:"Anzahl",
		stack:"Jahr",						
		characteristics:["Minus", "Auswanderung (international)", "Wegzug (interkantonal)", "Zuzug (interkantonal)", "Einwanderung (international)"],
		scale:1,													
		relative:false,												
		showTotal:true,												
		showAnteil:false,
		showBarLabels:"never",
		saldolabel:"Migrationssaldo"																		
	});
})

</script>