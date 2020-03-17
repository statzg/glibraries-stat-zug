<div id="default1"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_dualline'], function (dualline) {
	dualline.load({
		number:1,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-07-03-01.csv",		
		dimension:"Jahr",											
		group:"Anzahl",
		stack:"Gruppe",						
		//characteristics:[],
		characteristicsStack:["Anzahl Betriebe", "Nutzfläche pro Betrieb in ha"],										
		scale:2,													
		showTotal:true,												
		showAnteil:false,
		asDate:false														
	});
})

</script>