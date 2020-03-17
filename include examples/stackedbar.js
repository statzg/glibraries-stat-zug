<div id="default3"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_stackedbar'], function (stackedbar) {
	stackedbar.load({
		number:3,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-01-02-03.csv",		
		dimension:"Erwerbstätigkeit",											
		group:"Anzahl",
		stack:"Haushaltstyp",						
		characteristics:["Frau nicht erwerbstätig, Mann Vollzeit erwerbstätig", "Frau Teilzeit erwerbstätig (1-49%), Mann Vollzeit erwerbstätig", "Frau Teilzeit erwerbstätig (50-89%), Mann Vollzeit erwerbstätig", "Frau und Mann Vollzeit erwerbstätig", "Andere Kombinationen"],	
		characteristicsStack:["Paarhaushalte: jüngstes Kind 0- bis 6-jährig", "Paarhaushalte: jüngstes Kind 7- bis 14-jährig", "Paarhaushalte: jüngstes Kind 15- bis 24-jährig", "Paarhaushalte mit anderen Personen ohne Kinder unter 25 Jahren", "Paarhaushalte ohne weitere Haushaltsmitglieder"],								
		scale:1,													
		relative:true,												
		showTotal:true,												
		showAnteil:true																					
	});
})

</script>