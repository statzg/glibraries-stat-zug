<div id="default2"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_migrationmap_spital'], function (migrationmap) {
	migrationmap.load({
		number:2,
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-01-02.csv"
	});
})

</script>