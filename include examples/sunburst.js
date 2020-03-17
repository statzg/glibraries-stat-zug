<div id="default4"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_sunburst'], function (sunburst) {
	sunburst.load({
		number:4,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-01-01-04.csv",
		levels:["Welt","Kontinent", "Region", "Staat"]
	});
})

</script>