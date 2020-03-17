<div id="default2"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_choropleth'], function (choropleth) {
	choropleth.load({
		number:1,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-15-05-01.csv",		
		//dimension:"Haushaltstyp",											
		//group:"Anzahl",
	});
})

</script>