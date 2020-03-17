<div id="default3"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_line'], function (line) {
	line.load({
		number:3,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-03-00-03.csv",		
		dimension:"Datum",											
		group:"Arbeitslosenquote",							
		//characteristics:[],										
		showTotal:true,												
		showAnteil:false,
		showArea:true,
		asDate:true,									
	});
})

</script>