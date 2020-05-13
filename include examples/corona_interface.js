<div id="default4">
	<div><p>Altersgruppe auswählen:</p>
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
	</div>
	<div><p>Geschlecht auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="Total" class="geschlecht" href="javascript:;">Total</a> </li>
			<li><a id="männlich" class="geschlecht" href="javascript:;">männlich</a> </li>
			<li><a id="weiblich" class="geschlecht" href="javascript:;">weiblich</a> </li>
		</ul>
	</div>
	<div><p>Kennzahl von:</p>
		<ul class="subelements-listing">
			<li><a id="k1" class="kennzahl" href="javascript:;">Fallzahl</a> </li>
			<li><a id="k2" class="kennzahl" href="javascript:;">Todesfälle</a> </li>
			<li><a id="k3" class="kennzahl" href="javascript:;">Hospitalisationen</a> </li>
			<li><a id="k4" class="kennzahl" href="javascript:;">Genesene</a> </li>
		</ul>
	</div>
	<div id="title" class="title"></div>
	<div id="subtitle" class="subtitle"></div>	
	<div id="chart4"></div>
	<div id="description" class="description"></div>
	<div id="source" class="source"></div>
</div>

<script>
require.config({
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_groupedbar'], function (groupedbar) {
	args4 ={
		number:4,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-04-k1.csv",	
		dimension:"Geschlecht",											
		//group:"Anzahl",	
		stack:"Alterskategorie",		
		characteristicsStack:["Zug", "Oberägeri", "Unterägeri", "Menzingen", "Baar", "Cham", "Hünenberg", "Steinhausen", "Risch", "Walchwil", "Neuheim", "Mittelwert"],
		scale:1,													
		showTotal:true,												
		showAnteil:false											
	}

	args4.groupFilter=[]
	args4.characteristics=[];

	if (typeof uri.search(true)["kennzahl"] == "undefined") {
		uri.addSearch('kennzahl',"k1");
		window.history.pushState("", "", uri.href());
	}
	if (typeof uri.search(true)["kennzahl"] != "undefined") {
		args4.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-04-"+uri.search(true)["kennzahl"]+".csv";
		$("#"+uri.search(true)["kennzahl"]).addClass("selected");
		$("#"+uri.search(true)["kennzahl"]).parent().addClass("selected");
	}
	if (typeof uri.search(true)["alter"] != "undefined") {
		if(typeof uri.search(true)["alter"] =="string") {
			args4.groupFilter.push(uri.search(true)["alter"]);
			$("#"+uri.search(true)["alter"]).addClass("selected")
			$("#"+uri.search(true)["alter"]).parent().addClass("selected")
		} else {
			for(k=0; k < uri.search(true)["alter"].length; k++) {
				args4.groupFilter.push(uri.search(true)["alter"][k]);
				$("#"+uri.search(true)["alter"][k]).addClass("selected")
				$("#"+uri.search(true)["alter"][k]).parent().addClass("selected")
			}
		}
	}
	if (typeof uri.search(true)["geschlecht"] != "undefined") {
		if(typeof uri.search(true)["geschlecht"] =="string") {
			args4.characteristics.push(uri.search(true)["geschlecht"]);
			$("#"+uri.search(true)["geschlecht"]).addClass("selected")
			$("#"+uri.search(true)["geschlecht"]).parent().addClass("selected")
		} else {
			for(k=0; k < uri.search(true)["geschlecht"].length; k++) {
				args4.characteristics.push(uri.search(true)["geschlecht"][k]);
				$("#"+uri.search(true)["geschlecht"][k]).addClass("selected")
				$("#"+uri.search(true)["geschlecht"][k]).parent().addClass("selected")
			}
		}
	}

	groupedbar.load(args4);

	//Funktion um bei Knopfklick die Alterskategorien einzublenden oder auszublenden.
	$(".alter").click(function(){
		if(this.id=="Alle") {
			$(".alter").removeClass("selected")
			$(".alter").parent().removeClass("selected")
			args4.groupFilter=[]
			uri.removeSearch('alter');
			window.history.pushState("", "", uri.href());
		} else {
			shown=false
			for (k = 0; k < args4.groupFilter.length; k++) {
				if (this.id==args4.groupFilter[k]) {
					shown=true;
					j=k
				}
			}
			if (shown==false) {
				args4.groupFilter.push(this.id);
				$(this).addClass("selected")
				$(this).parent().addClass("selected")
				uri.addSearch('alter',this.id);
				window.history.pushState("", "", uri.href());
			} else {
				args4.groupFilter.splice(j, 1)
				$(this).removeClass("selected")
				$(this).parent().removeClass("selected")
				uri.removeSearch('alter',this.id);
				window.history.pushState("", "", uri.href());
			}
		}
		groupedbar.load(args4);
	});

	//Funktion um bei Knopfklick die Kennzahl einzublenden oder auszublenden.
	$(".kennzahl").click(function(){
		$(".kennzahl").removeClass("selected");
		$(".kennzahl").parent().removeClass("selected");
		args4.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-04-"+this.id+".csv";
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		groupedbar.load(args4);
		uri.setSearch('kennzahl',this.id);
		window.history.pushState("", "", uri.href());
	});

	//Funktion um bei Knopfklick die Geschlechter einzublenden oder auszublenden.
	$(".geschlecht").click(function(){
		if(this.id=="Alle") {
			$(".geschlecht").removeClass("selected")
			$(".geschlecht").parent().removeClass("selected")
			args4.characteristics=[]
			uri.removeSearch('geschlecht');
			window.history.pushState("", "", uri.href());
		} else {
			shown=false
			if (typeof args4.characteristics == "undefined") {
				args3.characteristics=[];
			}
			for (k = 0; k < args4.characteristics.length; k++) {
				if (this.id==args4.characteristics[k]) {
					shown=true;
					j=k
				}
			}
			if (shown==false) {
				args4.characteristics.push(this.id);
				$(this).addClass("selected")
				$(this).parent().addClass("selected")
				uri.addSearch('geschlecht',this.id);
				window.history.pushState("", "", uri.href());
			} else {
				args4.characteristics.splice(j, 1);
				$(this).removeClass("selected")
				$(this).parent().removeClass("selected")
				uri.removeSearch('geschlecht',this.id);
				window.history.pushState("", "", uri.href());  
			}
		}
		groupedbar.load(args4);	
	});
});
</script>