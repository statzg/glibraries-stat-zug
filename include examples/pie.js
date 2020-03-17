<div id="default1"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_pie'], function (pie) {
	pie.load({
		number:1,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-01-03-01.csv",		
		dimension:"Religionen",											
		group:"Anzahl",
		characteristics:["Römisch-katholisch", "Evangelisch-reformiert", "Andere"],
		scale:1,													
		showTotal:true
	});
})

</script>