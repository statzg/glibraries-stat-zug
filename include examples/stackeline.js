<div id="default3"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_stackedline'], function (stackedline) {
	stackedline.load({
		number:3,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-08-00-03.csv",		
		dimension:"Jahr",											
		group:"Energieverbrauch in TJ (Terrajoule)",
		stack:"Energieträger",						
		//characteristics:[],
		characteristicsStack:["Erdölbrennstofe", "Treibstofe", "Elektrizität", "Gas", "Kohle und Koks", "Holz und Holzkohle", "Fernwärme", "Abfälle", "Übrige erneuerbare Energien"],									
		scale:1,													
		relative:false,												
		showTotal:true,												
		showAnteil:false,
		showArea:true,										
		asDate:true,												
		dateUnit:"year"														
	});
})

</script>