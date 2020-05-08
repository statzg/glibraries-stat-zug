<div id="default2"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_bar'], function (bar) {
	bar.load({
		number:2,
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-02-02-02.csv",
		dimension:"Jahr",
		group:"Stunden über dem Grenzwert",
		//characteristics:[],
		//scale:1,
		relative:false,
		showTotal:true,
		showAnteil:false,
		order:"list",
		last:"",
		showBarLabels:"always"
	});
})
</script>