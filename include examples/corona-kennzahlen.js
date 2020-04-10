<p id="Infizierte"></p>
<p id="Genesene"></p>
<p id="Verstorbene"></p>
<p></p>
<p id="Stand"></p>
<p><a href="/behoerden/gesundheitsdirektion/statistikfachstelle/themen/gesundheit/corona">Detaillierte Statistik </a></p>

<script>

require.config({
   urlArgs: "bust=" + (new Date()).getTime(),
   baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
   paths: {
     libs: "libraries"
   }
});

require(['stat_zg_coronakennzahlen'], function (coronakennzahlen) {
    coronakennzahlen.load()
})

</script>