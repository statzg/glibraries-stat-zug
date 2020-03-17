<div id="kennzahlcontainer"></div>

<script>

require.config({
   urlArgs: "bust=" + (new Date()).getTime(),
   baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
   paths: {
     libs: "libraries"
   }
});

require(['stat_zg_kennzahlen'], function (kennzahlen) {
    kennzahlen.load({
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-kennzahlen.csv",
		identifikator:"18-01"	
	})
})

</script>