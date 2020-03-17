<div id="default2"></div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_bar'], function (bar) {
	bar.load({
		number:2,													//Nummer des Charts auf der Seite, keine Nummer darf doppelt verwendet werden (integer)
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-02-02-02.csv",		//Ort der Datenablage als relativer Pfad (string)
		dimension:"Jahr",											//Spaltentitel für Dimension auf der X-Achse (string)
		group:"Stunden über dem Grenzwert",							//Spaltentitel der Wertespalte (string)
		//characteristics=[],										//Liste der Charakteristiken für X-Dimension (array)
		//scale:1,													//Pipolare/kategoriale Farbskala (1) oder auch eine sequenzielle Farbskala (2) (nur diese Optionen)
		relative:false,												//Sollen die Werte relativ ausgewiesen werden? (boolean)
		showTotal:true,												//Soll das Total angezeigt werden? (boolen)
		showAnteil:false,											//Sollen die relativen Werte angezeigt werden? (boolean)
		order:"list",												//Wie sollen die Charakteristika angeordnet werden (gemäss der Liste "characteristics" (list), Alphabetisch (alpha) (nur diese Optionen
		last:"",														//Eine Charakteristik die immer am Ende angezeigt werden soll (string)
		showBarLabels:"always"
	});
})
</script>