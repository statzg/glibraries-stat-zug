<div id="default2"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_row'], function (row) {
	row.load({
		number:2,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-02-01-02.csv",		
		dimension:"Kanton",											
		group:"m<sup>2</sup> pro Einwohner und Beschäftigte",							
		//characteristics:[],										
		showTotal:true,												
		showAnteil:false,											
		order:"desc",												
		highlight:{"Zug":2, "Schweiz":1}													
	});
})	
</script>