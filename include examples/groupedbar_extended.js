<div id="default1">
	<div><p>Gemeinde(n) auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="Baar" class="gemeinde" href="javascript:;">Baar</a> </li>
			<li><a id="Cham" class="gemeinde" href="javascript:;">Cham</a> </li>
			<li><a id="Hünenberg" class="gemeinde" href="javascript:;">Hünenberg</a> </li>
			<li><a id="Menzingen" class="gemeinde" href="javascript:;">Menzingen</a> </li>
			<li><a id="Neuheim" class="gemeinde" href="javascript:;">Neuheim</a> </li>
			<li><a id="Oberägeri" class="gemeinde" href="javascript:;">Oberägeri</a> </li>
			<li><a id="Risch" class="gemeinde" href="javascript:;">Risch</a> </li>
			<li><a id="Steinhausen" class="gemeinde" href="javascript:;">Steinhausen</a> </li>
			<li><a id="Unterägeri" class="gemeinde" href="javascript:;">Unterägeri</a> </li>
			<li><a id="Walchwil" class="gemeinde" href="javascript:;">Walchwil</a> </li>
			<li><a id="Zug" class="gemeinde" href="javascript:;">Zug</a> </li>
			<li><a id="Mittelwert" class="gemeinde" href="javascript:;">Mittelwert</a> </li>
			<li><a id="Alle" class="gemeinde" href="javascript:;">Alle</a> </li>
		</ul>
	</div>
	<div><p>Kennzahl auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="01" class="kennzahl" href="javascript:;">Nettoschuld pro Einwohnerin oder Einwohner</a> </li>
			<li><a id="02" class="kennzahl" href="javascript:;">Bruttoverschuldungsanteil</a> </li>
			<li><a id="03" class="kennzahl" href="javascript:;">Nettoverschuldungsquotient</a> </li>
			<li><a id="04" class="kennzahl" href="javascript:;">Selbstfinanzierungsgrad</a> </li>
			<li><a id="05" class="kennzahl" href="javascript:;">Selbstfinanzierungsanteil</a> </li>
			<li><a id="06" class="kennzahl" href="javascript:;">Investitionsanteil</a> </li>
			<li><a id="07" class="kennzahl" href="javascript:;">Zinsbelastungsanteil</a> </li>
			<li><a id="08" class="kennzahl" href="javascript:;">Kapitaldienstanteil</a> </li>
			<li><a id="09" class="kennzahl" href="javascript:;">Ergebnis der Erfolgsrechnung</a> </li>
			<li><a id="10" class="kennzahl" href="javascript:;">Nettoinvestitionen</a> </li>
		</ul>
	</div>
	<div><p>Jahr(e) auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="2018" class="year" href="javascript:;">2018</a> </li>
			<li><a id="2017" class="year" href="javascript:;">2017</a> </li>
			<li><a id="2016" class="year" href="javascript:;">2016</a> </li>
			<li><a id="2015" class="year" href="javascript:;">2015</a> </li>
			<li><a id="2014" class="year" href="javascript:;">2014</a> </li>
			<li><a id="Alle" class="year" href="javascript:;">Alle</a> </li>
		</ul>
	</div>
	<div id="title" class="title"></div>
	<div id="subtitle" class="subtitle"></div>	
	<div id="chart1"></div>
	<div id="description" class="description"></div>
	<div id="source" class="source"></div>
</div>

<script>

require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/',
	paths: {
		libs: "libraries"
	}
});

require(['stat_zg_groupedbar'], function (groupedbar) {
args1 ={
	number:1,													
	csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-03-01.csv",	
	dimension:"Jahr",											
	//group:"Anzahl",	
	stack:"Gemeinde",		
	characteristicsStack:["Zug", "Oberägeri", "Unterägeri", "Menzingen", "Baar", "Cham", "Hünenberg", "Steinhausen", "Risch", "Walchwil", "Neuheim", "Mittelwert"],
	scale:2,													
	showTotal:true,												
	showAnteil:false											
}

args1.groupFilter=[]
args1.characteristics=[];

if (typeof uri.search(true)["kennzahl"] == "undefined") {
	uri.addSearch('kennzahl',"01");
	window.history.pushState("", "", uri.href());
}
if (typeof uri.search(true)["kennzahl"] != "undefined") {
	args1.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-03-"+uri.search(true)["kennzahl"]+".csv";
	$("#"+uri.search(true)["kennzahl"]).addClass("selected");$
	$("#"+uri.search(true)["kennzahl"]).parent().addClass("selected");
}
if (typeof uri.search(true)["gemeinde"] != "undefined") {
	if(typeof uri.search(true)["gemeinde"] =="string") {
		args1.groupFilter.push(uri.search(true)["gemeinde"]);
		$("#"+uri.search(true)["gemeinde"]).addClass("selected")
		$("#"+uri.search(true)["gemeinde"]).parent().addClass("selected")
	} else {
		for(k=0; k < uri.search(true)["gemeinde"].length; k++) {
			args1.groupFilter.push(uri.search(true)["gemeinde"][k]);
			$("#"+uri.search(true)["gemeinde"][k]).addClass("selected")
			$("#"+uri.search(true)["gemeinde"][k]).parent().addClass("selected")
		}
	}
}
if (typeof uri.search(true)["year"] != "undefined") {
	if(typeof uri.search(true)["year"] =="string") {
		args1.characteristics.push(uri.search(true)["year"]);
		$("#"+uri.search(true)["year"]).addClass("selected")
		$("#"+uri.search(true)["year"]).parent().addClass("selected")
	} else {
		for(k=0; k < uri.search(true)["year"].length; k++) {
			args1.characteristics.push(uri.search(true)["year"][k]);
			$("#"+uri.search(true)["year"][k]).addClass("selected")
			$("#"+uri.search(true)["year"][k]).parent().addClass("selected")
		}
	}
}

groupedbar.load(args1);

//Funktion um bei Knopfklick die Gemeinden einzublenden oder auszublenden.
$(".gemeinde").click(function(){
	if(this.id=="Alle") {
		$(".gemeinde").removeClass("selected")
		$(".gemeinde").parent().removeClass("selected")
		args1.groupFilter=[]
		uri.removeSearch('gemeinde');
		window.history.pushState("", "", uri.href());
	} else {
		shown=false
		for (k = 0; k < args1.groupFilter.length; k++) {
			if (this.id==args1.groupFilter[k]) {
				shown=true;
				j=k
			}
		}
		if (shown==false) {
			args1.groupFilter.push(this.id);
			$(this).addClass("selected")
			$(this).parent().addClass("selected")
			uri.addSearch('gemeinde',this.id);
			window.history.pushState("", "", uri.href());
		} else {
			args1.groupFilter.splice(j, 1)
			$(this).removeClass("selected")
			$(this).parent().removeClass("selected")
			uri.removeSearch('gemeinde',this.id);
			window.history.pushState("", "", uri.href());
		}
	}
	groupedbar.load(args1);
});

//Funktion um bei Knopfklick die Kennzahl einzublenden oder auszublenden.
$(".kennzahl").click(function(){
	$(".kennzahl").removeClass("selected");
	$(".kennzahl").parent().removeClass("selected");
	args1.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-03-"+this.id+".csv";
	$(this).addClass("selected");
	$(this).parent().addClass("selected");
	groupedbar.load(args1);
	uri.setSearch('kennzahl',this.id);
	window.history.pushState("", "", uri.href());
});

//Funktion um bei Knopfklick die Jahr einzublenden oder auszublenden.
$(".year").click(function(){
	if(this.id=="Alle") {
		$(".year").removeClass("selected")
		$(".year").parent().removeClass("selected")
		args1.characteristics=[]
		uri.removeSearch('year');
		window.history.pushState("", "", uri.href());
	} else {
		shown=false
		if (typeof args1.characteristics == "undefined") {
			args1.characteristics=[];
		}
		for (k = 0; k < args1.characteristics.length; k++) {
			if (this.id==args1.characteristics[k]) {
				shown=true;
				j=k
			}
		}
		if (shown==false) {
			args1.characteristics.push(this.id);
			$(this).addClass("selected")
			$(this).parent().addClass("selected")
			uri.addSearch('year',this.id);
			window.history.pushState("", "", uri.href());
		} else {
			args1.characteristics.splice(j, 1)
			$(this).removeClass("selected")
			$(this).parent().removeClass("selected")
			uri.removeSearch('year',this.id);
			window.history.pushState("", "", uri.href());
		}
	}
	groupedbar.load(args1);	
});

});

</script>