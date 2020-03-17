<div id="default1"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_sankey'], function (sankey) {
	sankey.load({
		number:1,
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-04-01.csv",
		//characteristics:[],
		scale:1
	});
})

</script>