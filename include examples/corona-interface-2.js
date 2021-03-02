<div id="default2" style="border: 1px solid #e6e6e2; padding:5px 5px 5px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;">
	<!--<div style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Altersgruppe auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="0-4" class="alter" href="javascript:;">0-4</a> </li>
			<li><a id="5-9" class="alter" href="javascript:;">5-9</a> </li>
			<li><a id="10-14" class="alter" href="javascript:;">10-14</a> </li>
			<li><a id="15-19" class="alter" href="javascript:;">15-19</a> </li>
			<li><a id="20-24" class="alter" href="javascript:;">20-24</a> </li>
			<li><a id="25-29" class="alter" href="javascript:;">25-29</a> </li>
			<li><a id="30-34" class="alter" href="javascript:;">30-34</a> </li>
			<li><a id="35-39" class="alter" href="javascript:;">35-39</a> </li>
			<li><a id="40-44" class="alter" href="javascript:;">40-44</a> </li>
			<li><a id="45-49" class="alter" href="javascript:;">45-49</a> </li>
			<li><a id="50-54" class="alter" href="javascript:;">50-54</a> </li>
			<li><a id="55-59" class="alter" href="javascript:;">55-59</a> </li>
			<li><a id="60-64" class="alter" href="javascript:;">60-64</a> </li>
			<li><a id="65-69" class="alter" href="javascript:;">65-69</a> </li>
			<li><a id="70-74" class="alter" href="javascript:;">70-74</a> </li>
			<li><a id="75-79" class="alter" href="javascript:;">75-79</a> </li>
			<li><a id="80-84" class="alter" href="javascript:;">80-84</a> </li>
			<li><a id="85-89" class="alter" href="javascript:;">85-89</a> </li>
			<li><a id="90+" class="alter" href="javascript:;">90+</a> </li>
			<li><a id="Alle" class="alter" href="javascript:;">Alle</a> </li>
		</ul>
	</div>-->
	<div style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Indikator auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="i1" class="indikator78" href="javascript:;">Altersklassen</a> </li>
			<li><a id="i2" class="indikator78" href="javascript:;">Geschlecht</a> </li>
			<li><a id="i3" class="indikator78" href="javascript:;">Gemeinde</a> </li>
		</ul>
	</div>
	<div style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Basis auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="b1" class="basis78" href="javascript:;">Absolute Fallzahl</a> </li>
			<li><a id="b2" class="basis78" href="javascript:;">Relative Fallzahl pro 100'000</a> </li>
		</ul>
	</div>
	<div style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Kennzahl auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="k1" class="kennzahl78" href="javascript:;">Fallzahl</a> </li>
			<li><a id="k2" class="kennzahl78" href="javascript:;">Todesfälle</a> </li>
			<li><a id="k3" class="kennzahl78" href="javascript:;">Hospitalisationen</a> </li>
			<li><a id="k4" class="kennzahl78" href="javascript:;">Durchgeführte Tests</a> </li>
		</ul>
	</div>
	<div id="default7"></div>
	<div id="default8"></div>
</div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

//var folder="https://raw.githubusercontent.com/statzg/glibraries-stat-zug/master/data/"
var folder="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/"

characteristics7i1=["0 - 9 Jahre", "10 - 19 Jahre", "20 - 29 Jahre", "30 - 39 Jahre", "40 - 49 Jahre", "50 - 59 Jahre", "60 - 69 Jahre", "70 - 79 Jahre", "80+ Jahre"]
characteristics8i1=["0 - 9 Jahre", "10 - 19 Jahre", "20 - 29 Jahre", "30 - 39 Jahre", "40 - 49 Jahre", "50 - 59 Jahre", "60 - 69 Jahre", "70 - 79 Jahre", "80+ Jahre", "Unbekannt"]
characteristics7i2=["männlich", "weiblich"]
characteristics8i2=["männlich", "weiblich", "Unbekannt"]
characteristics7i3=["Baar", "Cham", "Hünenberg", "Menzingen", "Neuheim", "Oberägeri", "Risch", "Steinhausen", "Unterägeri", "Walchwil", "Zug"]
characteristics8i3=["Baar", "Cham", "Hünenberg", "Menzingen", "Neuheim", "Oberägeri", "Risch", "Steinhausen", "Unterägeri", "Walchwil", "Zug"]


require(['stat_zg_stackedbar', 'stat_zg_bar'], function (stackedbar, bar) {
	args7={
		number:7,													
		csv_path:folder + "result-themen-14-03-07-k1-b1.csv",		
		dimension:"Altersklasse",											
		group:"Anzahl Fälle",
		stack:"Woche",
		characteristics:["0 - 9 Jahre", "10 - 19 Jahre", "20 - 29 Jahre", "30 - 39 Jahre", "40 - 49 Jahre", "50 - 59 Jahre", "60 - 69 Jahre", "70 - 79 Jahre", "80+ Jahre"],					
		scale:1,													
		relative:false,
		asDate:true,
		dateUnit:"week",								
		showTotal:true,												
		showAnteil:true																					
	}
	
	args8={
		number:8,													
		csv_path:folder + "result-themen-14-03-08-k1-b1.csv",		
		dimension:"Altersklasse",											
		group:"Anzahl Fälle",
		characteristics:["0 - 9 Jahre", "10 - 19 Jahre", "20 - 29 Jahre", "30 - 39 Jahre", "40 - 49 Jahre", "50 - 59 Jahre", "60 - 69 Jahre", "70 - 79 Jahre", "80+ Jahre", "Unbekannt"],
		scale:1,													
		showTotal:true,
		//order:"alpha",
		//last:"Unbekannt"
	}

	if (typeof uri.search(true)["indikator78"] == "undefined") {
		uri.addSearch('indikator78',"i1");
		window.history.pushState("", "", uri.href());
		indikator78="i1"
	}
	if (typeof uri.search(true)["kennzahl78"] == "undefined") {
		uri.addSearch('kennzahl78',"k1");
		window.history.pushState("", "", uri.href());
		kennzahl78="k1"
	}
	if (typeof uri.search(true)["basis78"] == "undefined") {
		uri.addSearch('basis78',"b1");
		window.history.pushState("", "", uri.href());
		basis78="b1"
	}
	if (typeof uri.search(true)["kennzahl78"] != "undefined" & typeof uri.search(true)["basis78"] != "undefined" & typeof uri.search(true)["indikator78"] != "undefined") {
		kennzahl78=uri.search(true)["kennzahl78"]
		basis78=uri.search(true)["basis78"]
		indikator78=uri.search(true)["indikator78"]
		args7.csv_path=folder + "result-themen-14-03-07-"+indikator78+"-"+kennzahl78+"-"+basis78+".csv";
		args8.csv_path=folder + "result-themen-14-03-08-"+indikator78+"-"+kennzahl78+"-"+basis78+".csv";
		if(basis78=="b1") {
			args7.group="Anzahl Fälle"
			args7.showAnteil=true
			args8.group="Anzahl Fälle"
		} else {
			args7.group="Inzidenz pro 100'000"
			args7.showAnteil=false
			args8.group="Inzidenz pro 100'000"
		}
		if(indikator78=="i1") {
			args7.dimension="Altersklasse"
			args7.characteristics=characteristics7i1
			args8.dimension="Altersklasse"
			args8.characteristics=characteristics8i1
		} else if (indikator78=="i2") {
			args7.dimension="Geschlecht"
			args7.characteristics=characteristics7i2
			args8.dimension="Geschlecht"
			args8.characteristics=characteristics8i2
		} else if (indikator78=="i3") {
			args7.dimension="Gemeinde"
			args7.characteristics=characteristics7i3
			args8.dimension="Gemeinde"
			args8.characteristics=characteristics8i3
			$("#k2").hide()
			$("#k3").hide()
			$("#k4").hide()
			kennzahl78="k1"
			$(".kennzahl78").removeClass("selected");
			$(".kennzahl78").parent().removeClass("selected");
			args7.csv_path=folder + "result-themen-14-03-07-"+indikator78+"-"+kennzahl78+"-"+basis78+".csv";
			args8.csv_path=folder + "result-themen-14-03-08-"+indikator78+"-"+kennzahl78+"-"+basis78+".csv";
			uri.setSearch('kennzahl78',"k1");
			window.history.pushState("", "", uri.href());

		}
		$("#"+kennzahl78).addClass("selected");
		$("#"+kennzahl78).parent().addClass("selected");
		$("#"+uri.search(true)["basis78"]).addClass("selected");
		$("#"+uri.search(true)["basis78"]).parent().addClass("selected");
		$("#"+uri.search(true)["indikator78"]).addClass("selected");
		$("#"+uri.search(true)["indikator78"]).parent().addClass("selected");
	}
	/*if (typeof uri.search(true)["alter"] != "undefined") {
		if(typeof uri.search(true)["alter"] =="string") {
			args2.groupFilter.push(uri.search(true)["alter"]);
			$("#"+uri.search(true)["alter"]).addClass("selected")
			$("#"+uri.search(true)["alter"]).parent().addClass("selected")
		} else {
			for(k=0; k < uri.search(true)["alter"].length; k++) {
				args2.groupFilter.push(uri.search(true)["alter"][k]);
				$("#"+uri.search(true)["alter"][k]).addClass("selected")
				$("#"+uri.search(true)["alter"][k]).parent().addClass("selected")
			}
		}
	} else {
		for(k=0; k < groupfilter.length; k++) {
			args2.groupFilter.push(groupfilter[k]);
			uri.addSearch('alter',groupfilter[k]);
			$("[id='"+groupfilter[k]+"']").addClass("selected");
			$("[id='"+groupfilter[k]+"']").parent().addClass("selected");
		};
		window.history.pushState("", "", uri.href());
	}*/

	stackedbar.load(args7);
	bar.load(args8);

	//Funktion um bei Knopfklick die Alterskategorien einzublenden oder auszublenden.
	/*$(".alter").click(function(){
		if(this.id=="Alle") {
			$(".alter").addClass("selected")
			$(".alter").parent().addClass("selected")
			$(this).removeClass("selected")
			$(this).parent().removeClass("selected")
			args2.groupFilter=["0-24","25-44","45-64","65+"]
			uri.removeSearch('alter');
			window.history.pushState("", "", uri.href());
		} else {
			shown=false
			for (k = 0; k < args2.groupFilter.length; k++) {
				if (this.id==args2.groupFilter[k]) {
					shown=true;
					j=k
				}
			}
			if (shown==false) {
				args2.groupFilter.push(this.id);
				$(this).addClass("selected")
				$(this).parent().addClass("selected")
				uri.addSearch('alter',this.id);
				window.history.pushState("", "", uri.href());
			} else {
				args2.groupFilter.splice(j, 1)
				$(this).removeClass("selected")
				$(this).parent().removeClass("selected")
				uri.removeSearch('alter',this.id);
				window.history.pushState("", "", uri.href());
			}
		}
		groupedbar.load(args2);
	});*/

	//Funktion um bei Knopfklick die Kennzahl anzupassen.
	$(".kennzahl78").click(function(){
		$(".kennzahl78").removeClass("selected");
		$(".kennzahl78").parent().removeClass("selected");
		args7.csv_path=folder + "result-themen-14-03-07-"+indikator78+"-"+this.id+"-"+basis78+".csv";
		args8.csv_path=folder + "result-themen-14-03-08-"+indikator78+"-"+this.id+"-"+basis78+".csv";
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		stackedbar.load(args7);
		bar.load(args8);
		kennzahl78=this.id;
		uri.setSearch('kennzahl78',this.id);
		window.history.pushState("", "", uri.href());
	});
	//Funktion um bei Knopfklick die Basis anzupassen.
	$(".basis78").click(function(){
		$(".basis78").removeClass("selected");
		$(".basis78").parent().removeClass("selected");
		args7.csv_path=folder + "result-themen-14-03-07-"+indikator78+"-"+kennzahl78+"-"+this.id+".csv";
		args8.csv_path=folder + "result-themen-14-03-08-"+indikator78+"-"+kennzahl78+"-"+this.id+".csv";
		if(this.id=="b1") {
			args7.group="Anzahl Fälle"
			args7.showAnteil=true
			args8.group="Anzahl Fälle"
		} else {
			args7.group="Inzidenz pro 100'000"
			args7.showAnteil=false
			args8.group="Inzidenz pro 100'000"
		}
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		stackedbar.load(args7);
		bar.load(args8);
		basis78=this.id;
		uri.setSearch('basis78',this.id);
		window.history.pushState("", "", uri.href());
	});
		//Funktion um bei Knopfklick die Basis anzupassen.
	$(".indikator78").click(function(){
		$(".indikator78").removeClass("selected");
		$(".indikator78").parent().removeClass("selected");
		args7.csv_path=folder + "result-themen-14-03-07-"+this.id+"-"+kennzahl78+"-"+basis78+".csv";
		args8.csv_path=folder + "result-themen-14-03-08-"+this.id+"-"+kennzahl78+"-"+basis78+".csv";
		$("#k2").show()
		$("#k3").show()
		$("#k4").show()
		if(this.id=="i1") {
			args7.dimension="Altersklasse"
			args7.characteristics=characteristics7i1
			args8.dimension="Altersklasse"
			args8.characteristics=characteristics8i1
		} else if(this.id=="i2") {
			args7.dimension="Geschlecht"
			args7.characteristics=characteristics7i2
			args8.dimension="Geschlecht"
			args8.characteristics=characteristics8i2
		} else if(this.id=="i3") {
			args7.dimension="Gemeinde"
			args7.characteristics=characteristics7i3
			args8.dimension="Gemeinde"
			args8.characteristics=characteristics8i3
			$("#k2").hide()
			$("#k3").hide()
			$("#k4").hide()
			kennzahl78="k1"
			$(".kennzahl78").removeClass("selected");
			$(".kennzahl78").parent().removeClass("selected");
			$("#k1").addClass("selected");
			$("#k1").parent().addClass("selected");
			uri.setSearch('kennzahl78',"k1");
			args7.csv_path=folder + "result-themen-14-03-07-"+this.id+"-"+kennzahl78+"-"+basis78+".csv";
			args8.csv_path=folder + "result-themen-14-03-08-"+this.id+"-"+kennzahl78+"-"+basis78+".csv";

		}
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		stackedbar.load(args7);
		bar.load(args8);
		indikator78=this.id;
		uri.setSearch('indikator78',this.id);
		window.history.pushState("", "", uri.href());
	});
});
</script>