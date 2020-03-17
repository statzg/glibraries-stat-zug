<div id="default3">
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
			<li><a id="Total" class="gemeinde" href="javascript:;">Total</a> </li>
			<li><a id="Alle" class="gemeinde" href="javascript:;">Alle</a> </li>
		</ul>
	</div>
	<div><p>Ebene auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="e01" class="ebene" href="javascript:;">Gemeindesteuern</a> </li>
			<li><a id="e02" class="ebene" href="javascript:;">Kantonssteuern</a> </li>
			<li><a id="e03" class="ebene" href="javascript:;">Bundessteuern</a> </li>
			<li><a id="e04" class="ebene" href="javascript:;">Summe</a> </li>
		</ul>
	</div>
	<div><p>Erträge von:</p>
		<ul class="subelements-listing">
			<li><a id="k01" class="kennzahl" href="javascript:;">Natürliche Personen</a> </li>
			<li><a id="k02" class="kennzahl" href="javascript:;">Natürliche Personen pro Einwohner/in</a> </li>
			<li><a id="k03" class="kennzahl" href="javascript:;">Juristische Personen</a> </li>
			<li><a id="k04" class="kennzahl" href="javascript:;">Total</a> </li>
		</ul>
	</div>
	<div><p>Jahr(e) auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="2018" class="year" href="javascript:;">2018</a> </li>
			<li><a id="2017" class="year" href="javascript:;">2017</a> </li>
			<li><a id="2016" class="year" href="javascript:;">2016</a> </li>
			<li><a id="2015" class="year" href="javascript:;">2015</a> </li>
			<li><a id="2014" class="year" href="javascript:;">2014</a> </li>
			<li><a id="2013" class="year" href="javascript:;">2013</a> </li>
			<li><a id="2012" class="year" href="javascript:;">2012</a> </li>
			<li><a id="Alle" class="year" href="javascript:;">Alle</a> </li>
		</ul>
	</div>
	<div id="title" class="title"></div>
	<div id="subtitle" class="subtitle"></div>	
	<div id="chart3"></div>
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
	args3 ={
		number:3,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-04-03-e01-k01.csv",	
		dimension:"Jahr",											
		//group:"Anzahl",	
		stack:"Gemeinde",		
		characteristicsStack:["Zug", "Oberägeri", "Unterägeri", "Menzingen", "Baar", "Cham", "Hünenberg", "Steinhausen", "Risch", "Walchwil", "Neuheim", "Mittelwert"],
		scale:2,													
		showTotal:true,												
		showAnteil:false											
	}

	args3.groupFilter=[]
	args3.characteristics=[];

	if (typeof uri.search(true)["ebene"] == "undefined") {
		uri.addSearch('ebene',"e01");
		window.history.pushState("", "", uri.href());
	}
	if (typeof uri.search(true)["kennzahl"] == "undefined") {
		uri.addSearch('kennzahl',"k01");
		window.history.pushState("", "", uri.href());
	}
	if (typeof uri.search(true)["ebene"] != "undefined" & typeof uri.search(true)["kennzahl"] != "undefined") {
		args3.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-04-03-"+uri.search(true)["ebene"]+"-"+uri.search(true)["kennzahl"]+".csv";
		$("#"+uri.search(true)["ebene"]).addClass("selected");
		$("#"+uri.search(true)["ebene"]).parent().addClass("selected");
		$("#"+uri.search(true)["kennzahl"]).addClass("selected");
		$("#"+uri.search(true)["kennzahl"]).parent().addClass("selected");
	}
	if (typeof uri.search(true)["gemeinde"] != "undefined") {
		if(typeof uri.search(true)["gemeinde"] =="string") {
			args3.groupFilter.push(uri.search(true)["gemeinde"]);
			$("#"+uri.search(true)["gemeinde"]).addClass("selected")
			$("#"+uri.search(true)["gemeinde"]).parent().addClass("selected")
		} else {
			for(k=0; k < uri.search(true)["gemeinde"].length; k++) {
				args3.groupFilter.push(uri.search(true)["gemeinde"][k]);
				$("#"+uri.search(true)["gemeinde"][k]).addClass("selected")
				$("#"+uri.search(true)["gemeinde"][k]).parent().addClass("selected")
			}
		}
	}
	if (typeof uri.search(true)["year"] != "undefined") {
		if(typeof uri.search(true)["year"] =="string") {
			args3.characteristics.push(uri.search(true)["year"]);
			$("#"+uri.search(true)["year"]).addClass("selected")
			$("#"+uri.search(true)["year"]).parent().addClass("selected")
		} else {
			for(k=0; k < uri.search(true)["year"].length; k++) {
				args3.characteristics.push(uri.search(true)["year"][k]);
				$("#"+uri.search(true)["year"][k]).addClass("selected")
				$("#"+uri.search(true)["year"][k]).parent().addClass("selected")
			}
		}
	}

	groupedbar.load(args3);

	//Funktion um bei Knopfklick die Gemeinden einzublenden oder auszublenden.
	$(".gemeinde").click(function(){
		if(this.id=="Alle") {
			$(".gemeinde").removeClass("selected")
			$(".gemeinde").parent().removeClass("selected")
			args3.groupFilter=[]
			uri.removeSearch('gemeinde');
			window.history.pushState("", "", uri.href());
		} else {
			shown=false
			for (k = 0; k < args3.groupFilter.length; k++) {
				if (this.id==args3.groupFilter[k]) {
					shown=true;
					j=k
				}
			}
			if (shown==false) {
				args3.groupFilter.push(this.id);
				$(this).addClass("selected")
				$(this).parent().addClass("selected")
				uri.addSearch('gemeinde',this.id);
				window.history.pushState("", "", uri.href());
			} else {
				args3.groupFilter.splice(j, 1)
				$(this).removeClass("selected")
				$(this).parent().removeClass("selected")
				uri.removeSearch('gemeinde',this.id);
				window.history.pushState("", "", uri.href());
			}
		}
		groupedbar.load(args3);
	});

	//Funktion um bei Knopfklick die Ebene einzublenden oder auszublenden.
	$(".ebene").click(function(){
		$(".ebene").removeClass("selected");
		$(".ebene").parent().removeClass("selected");
		args3.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-04-03-"+this.id+"-"+uri.search(true)["kennzahl"]+".csv";
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		groupedbar.load(args3);
		uri.setSearch('ebene',this.id);
		window.history.pushState("", "", uri.href());
	});

	//Funktion um bei Knopfklick die Kennzahl einzublenden oder auszublenden.
	$(".kennzahl").click(function(){
		$(".kennzahl").removeClass("selected");
		$(".kennzahl").parent().removeClass("selected");
		args3.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-18-04-03-"+uri.search(true)["ebene"]+"-"+this.id+".csv";
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		groupedbar.load(args3);
		uri.setSearch('kennzahl',this.id);
		window.history.pushState("", "", uri.href());
	});

	//Funktion um bei Knopfklick die Jahr einzublenden oder auszublenden.
	$(".year").click(function(){
		if(this.id=="Alle") {
			$(".year").removeClass("selected")
			$(".year").parent().removeClass("selected")
			args3.characteristics=[]
			uri.removeSearch('year');
			window.history.pushState("", "", uri.href());
		} else {
			shown=false
			if (typeof args3.characteristics == "undefined") {
				args3.characteristics=[];
			}
			for (k = 0; k < args3.characteristics.length; k++) {
				if (this.id==args3.characteristics[k]) {
					shown=true;
					j=k
				}
			}
			if (shown==false) {
				args3.characteristics.push(this.id);
				$(this).addClass("selected")
				$(this).parent().addClass("selected")
				uri.addSearch('year',this.id);
				window.history.pushState("", "", uri.href());
			} else {
				args3.characteristics.splice(j, 1);
				$(this).removeClass("selected")
				$(this).parent().removeClass("selected")
				uri.removeSearch('year',this.id);
				window.history.pushState("", "", uri.href());  
			}
		}
		groupedbar.load(args3);	
	});
});
</script>