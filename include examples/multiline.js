<div id="default1"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_multiline'], function (multiline) {
	multiline.load({
		number:1,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-01-05-01.csv",		
		dimension:"Jahr",											
		group:"Einwohner",
		stack:"Szenario",						
		//characteristics:[],
		characteristicsStack:["Referenzszenario", "'hohes' Szenario", "'tiefes' Szenario"],									
		scale:1,													
		showTotal:true,												
		showAnteil:false,
		asDate:true,												
		dateUnit:"year"														
	});
})
</script>