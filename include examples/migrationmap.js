<div id="default1"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_migrationmap'], function (migrationmap) {
	migrationmap.load({
		number:1,
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-11-01-01.csv"
	});
})

</script>