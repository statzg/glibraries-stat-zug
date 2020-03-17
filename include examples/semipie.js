<div id="default2"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_semipie'], function (semipie) {
	semipie.load({
		number:2,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-17-00-02.csv",		
		dimension:"Partei",											
		group:"Sitzzahl",
		characteristics:["Parteilos", "ALG", "SP", "CSP", "GLP", "CVP", "FDP", "SVP", "ZTotal"],
		//scale:2,													
		showTotal:true,
		order:"list",
		//last:"",
		partei:true
	});
})

</script>