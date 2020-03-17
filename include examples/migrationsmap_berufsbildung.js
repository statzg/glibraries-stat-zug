<div id="default5"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_migrationsmap_berufsbildung'], function (migrationsmap) {
	migrationsmap.load({
		number:5,
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-15-04-05.csv"
	});
})

</script>