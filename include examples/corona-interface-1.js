<div id="default1" style="border: 1px solid #e6e6e2; padding:5px 5px 5px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;">
	<div style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Daten auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="01" class="art1" href="javascript:;">Positiv getestete Fälle</a> </li>
			<li><a id="03" class="art1" href="javascript:;">Neue Fälle</a> </li>
			<li><a id="06" class="art1" href="javascript:;">Quarantänefälle</a> </li></span>
		</ul>
	</div>
	<div style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Basis auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="e1" class="basis1" href="javascript:;">Absolute Fallzahlen</a> </li>
			<li><a id="e2" class="basis1" href="javascript:;">Fallzahlen pro 100'000 Einwohner</a> </li>
			<li><a id="e3" class="basis1" href="javascript:;">Durchschnitt der letzten 7 Tage</a> </li>
			<li><a id="e4" class="basis1" href="javascript:;">Summe der letzten 7 Tage</a> </li>
		</ul>
	</div>
	<div id="kennzahlen101" style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Kennzahl(en) auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="Aktive Fälle" class="hiderow1" href="javascript:;">Aktive Fälle</a> </li>
			<li><a id="Fallzahl" class="hiderow1" href="javascript:;">Fallzahl</a> </li>
			<li><a id="Genesene" class="hiderow1" href="javascript:;">Genesene</a> </li>
			<li><a id="Hospitalisierte" class="hiderow1" href="javascript:;">Hospitalisierte</a> </li>
			<li><a id="Hospitalisierte in Intensivpflege" class="hiderow1" href="javascript:;">Hospitalisierte in Intensivpflege</a> </li>
			<li><a id="Todesfälle" class="hiderow1" href="javascript:;">Todesfälle</a> </li>
		</ul>
	</div>
	<div id="kennzahlen106" style="background-color: #d0eef7; padding:0px 5px 0px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; margin-bottom: 0.5em;"><p style="margin-bottom: 0.3em">Kennzahl(en) auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="Isolation" class="hiderow2" href="javascript:;">Isolation</a> </li>
			<li><a id="Quarantäne aus Contact Tracing" class="hiderow2" href="javascript:;">Quarantäne aus Contact Tracing</a> </li>
			<li><a id="Quarantäne nach Rückkehr aus Risikoland" class="hiderow2" href="javascript:;">Quarantäne nach Rückkehr aus Risikoland</a> </li>
			<li><a id="Quarantäne via SwissCovid App" class="hiderow2" href="javascript:;">Quarantäne via SwissCovid App</a> </li>
			<li><a id="Quarantäne Total" class="hiderow2" href="javascript:;">Quarantäne Total</a> </li>
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
	baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

var dict01 = {
  "Aktive Fälle": "aktive",
  "aktive": "Aktive Fälle",
  "Fallzahl": "fallzahl",
  "fallzahl": "Fallzahl",
  "Genesene": "genesene",
  "genesene": "Genesene",
  "Hospitalisierte": "hospitalisierte",
  "hospitalisierte": "Hospitalisierte",
  "Hospitalisierte in Intensivpflege":"intensivpflege",
  "intensivpflege":"Hospitalisierte in Intensivpflege",
  "Todesfälle":"todesfaelle",
  "todesfaelle":"Todesfälle",
  "Isolation":"isolation",
  "isolation":"Isolation",
  "Quarantäne aus Contact Tracing":"qct",
  "qct":"Quarantäne aus Contact Tracing",
  "Quarantäne nach Rückkehr aus Risikoland":"qr",
  "qr":"Quarantäne nach Rückkehr aus Risikoland",
  "Quarantäne via SwissCovid App":"qsca",
  "qsca":"Quarantäne via SwissCovid App",
  "Quarantäne Total":"qt",
  "qt":"Quarantäne Total"
};


require(['stat_zg_multiline'], function (multiline) {

	$("#kennzahlen101").hide()
	$("#kennzahlen106").hide()
	$("#e4").hide()

	characteristics01=["Aktive Fälle", "Fallzahl", "Genesene","Hospitalisierte", "Hospitalisierte in Intensivpflege", "Todesfälle"]
	characteristics06=["Isolation","Quarantäne aus Contact Tracing","Quarantäne nach Rückkehr aus Risikoland","Quarantäne via SwissCovid App","Quarantäne Total"]
	groupfilter01=[]
	groupfilter06=[]

	args1 ={
		number:1,													
		csv_path:"/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-01-e1.csv",
		dimension:"Datum",											
		group:"Anzahl",
		stack:"Typ",						
		//characteristics:[],
		characteristicsStack:characteristics01,								
		scale:1,													
		showTotal:true,												
		showAnteil:false,
		asDate:true,												
		dateUnit:"date",
		removeZero:false,
		downloadSource:true,
		showLastValue:true,
		groupFilter:[],
		onlyDots:false
	}


	if (typeof uri.search(true)["kennzahlen101"] != "undefined") {
		if(typeof uri.search(true)["kennzahlen101"] =="string") {
			groupfilter01.push(dict01[uri.search(true)["kennzahlen101"]]);
			$("[id='"+dict01[uri.search(true)["kennzahlen101"]]+"']").addClass("selected")
			$("[id='"+dict01[uri.search(true)["kennzahlen101"]]+"']").parent().addClass("selected")
		} else {
			for(k=0; k < uri.search(true)["kennzahlen101"].length; k++) {
				groupfilter01.push(dict01[uri.search(true)["kennzahlen101"][k]]);
				$("[id='"+dict01[uri.search(true)["kennzahlen101"][k]]+"']").addClass("selected")
				$("[id='"+dict01[uri.search(true)["kennzahlen101"][k]]+"']").parent().addClass("selected")
			}
		}
	} else {
		for(k=0; k < characteristics01.length; k++) {
			groupfilter01.push(characteristics01[k]);
			uri.addSearch('kennzahlen101',dict01[characteristics01[k]]);
			$("[id='"+characteristics01[k]+"']").addClass("selected");
			$("[id='"+characteristics01[k]+"']").parent().addClass("selected");
		};
		window.history.pushState("", "", uri.href());
	}
	if (typeof uri.search(true)["kennzahlen106"] != "undefined") {
		if(typeof uri.search(true)["kennzahlen106"] =="string") {
			groupfilter06.push(dict01[uri.search(true)["kennzahlen106"]]);
			$("[id='"+dict01[uri.search(true)["kennzahlen106"]]+"']").addClass("selected")
			$("[id='"+dict01[uri.search(true)["kennzahlen106"]]+"']").parent().addClass("selected")
		} else {
			for(k=0; k < uri.search(true)["kennzahlen106"].length; k++) {
				groupfilter06.push(dict01[uri.search(true)["kennzahlen106"][k]]);
				$("[id='"+dict01[uri.search(true)["kennzahlen106"][k]]+"']").addClass("selected")
				$("[id='"+dict01[uri.search(true)["kennzahlen106"][k]]+"']").parent().addClass("selected")
			}
		}
	} else {
		for(k=0; k < characteristics06.length; k++) {
			groupfilter06.push(characteristics06[k]);
			uri.addSearch('kennzahlen106',dict01[characteristics06[k]]);
			$("[id='"+characteristics06[k]+"']").addClass("selected");
			$("[id='"+characteristics06[k]+"']").parent().addClass("selected");
		};
		window.history.pushState("", "", uri.href());
	}
	if (typeof uri.search(true)["art1"] == "undefined") {
		uri.addSearch('art1',"03");
		window.history.pushState("", "", uri.href());
	}
	if (typeof uri.search(true)["basis1"] == "undefined") {
		uri.addSearch('basis1',"e3");
		window.history.pushState("", "", uri.href());
	}
	if (typeof uri.search(true)["art1"] != "undefined" & typeof uri.search(true)["basis1"] != "undefined") {
		args1.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-"+uri.search(true)["art1"]+"-"+uri.search(true)["basis1"]+".csv";
		if (uri.search(true)["art1"]=="01" | uri.search(true)["art1"]=="03") {
			args1.groupFilter=groupfilter01;
			args1.characteristicsStack=characteristics01
			$("#kennzahlen101").show()
		} else {
			args1.groupFilter=groupfilter06;
			args1.characteristicsStack=characteristics06
			$("#kennzahlen106").show()
		}
		if (uri.search(true)["art1"]=="03") {
			args1.onlyDots=false;
			$("#e3").show()
			$("#e4").show()
		}
		$("#"+uri.search(true)["art1"]).addClass("selected");
		$("#"+uri.search(true)["art1"]).parent().addClass("selected");
		$("#"+uri.search(true)["basis1"]).addClass("selected");
		$("#"+uri.search(true)["basis1"]).parent().addClass("selected");
	}

	multiline.load(
	args1										
	);

	//Funktion um bei Knopfklick die Art zu wechseln.
	$(".art1").click(function(){
		$(".art1").removeClass("selected");
		$(".art1").parent().removeClass("selected");
		if (this.id=="01") {
			if(uri.search(true)["basis1"]=="e3" | uri.search(true)["basis1"]=="e4") {
				$(".basis1").removeClass("selected");
				$(".basis1").parent().removeClass("selected");
				uri.setSearch('basis1',"e1");
				window.history.pushState("", "", uri.href());
				$("#e1").addClass("selected");
				$("#e1").parent().addClass("selected");
			}
			args1.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-"+this.id+"-"+uri.search(true)["basis1"]+".csv";
			args1.characteristicsStack=characteristics01;
			args1.groupFilter=dict01[uri.search(true)["kennzahlen101"]];
			args1.removeZero=false;
			args1.onlyDots=false;
			$("#kennzahlen106").hide()
			$("#kennzahlen101").show()
			$("#e3").hide()
			$("#e4").hide()
		} else if (this.id=="03") {
			args1.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-"+this.id+"-"+uri.search(true)["basis1"]+".csv";
			args1.characteristicsStack=characteristics01;
			args1.groupFilter=dict01[uri.search(true)["kennzahlen101"]];
			args1.removeZero=false;
			args1.onlyDots=false;
			$("#kennzahlen106").hide()
			$("#kennzahlen101").show()
			$("#e3").show()
			$("#e4").show()
		} else {
			if(uri.search(true)["basis1"]=="e4") {
				$(".basis1").removeClass("selected");
				$(".basis1").parent().removeClass("selected");
				uri.setSearch('basis1',"e1");
				window.history.pushState("", "", uri.href());
				$("#e1").addClass("selected");
				$("#e1").parent().addClass("selected");
			}
			args1.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-"+this.id+"-"+uri.search(true)["basis1"]+".csv";
			args1.characteristicsStack=characteristics06;
			args1.groupFilter=dict01[uri.search(true)["kennzahlen106"]];
			args1.removeZero=false;
			args1.onlyDots=false;
			$("#kennzahlen101").hide()
			$("#kennzahlen106").show()
			$("#e3").show()
			$("#e4").hide()
		}
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		multiline.load(args1);
		uri.setSearch('art1',this.id);
		window.history.pushState("", "", uri.href());
	});

	//Funktion um bei Knopfklick die Basis zu wechseln.
	$(".basis1").click(function(){
		$(".basis1").removeClass("selected");
		$(".basis1").parent().removeClass("selected");
		args1.csv_path="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/themen/result-themen-14-03-"+uri.search(true)["art1"]+"-"+this.id+".csv";
		$(this).addClass("selected");
		$(this).parent().addClass("selected");
		multiline.load(args1);
		uri.setSearch('basis1',this.id);
		window.history.pushState("", "", uri.href());
	});

	//Funktion um bei Knopfklick die entsprechende Grafik einzublenden und die andere auszublenden.
	$(".hiderow1").click(function(){
		shown=false
		for (k = 0; k < groupfilter01.length; k++) {
			if (this.id==groupfilter01[k]) {
				shown=true;
				j=k
			}
		}
		if (shown==false) {
			groupfilter01.push(this.id);
			$(this).addClass("selected")
			$(this).parent().addClass("selected")
			uri.addSearch('kennzahlen101',dict01[this.id]);
			window.history.pushState("", "", uri.href());
		} else {
			groupfilter01.splice(j, 1)
			$(this).removeClass("selected")
			$(this).parent().removeClass("selected")
			uri.removeSearch('kennzahlen101',dict01[this.id]);
			window.history.pushState("", "", uri.href());
		}
		args1.groupFilter=groupfilter01
		multiline.load(args1);
	});
		//Funktion um bei Knopfklick die entsprechende Grafik einzublenden und die andere auszublenden.
	$(".hiderow2").click(function(){
		shown=false
		for (k = 0; k < groupfilter06.length; k++) {
			if (this.id==groupfilter06[k]) {
				shown=true;
				j=k
			}
		}
		if (shown==false) {
			groupfilter06.push(this.id);
			$(this).addClass("selected")
			$(this).parent().addClass("selected")
			uri.addSearch('kennzahlen106',dict01[this.id]);
			window.history.pushState("", "", uri.href());
		} else {
			groupfilter06.splice(j, 1)
			$(this).removeClass("selected")
			$(this).parent().removeClass("selected")
			uri.removeSearch('kennzahlen106',dict01[this.id]);
			window.history.pushState("", "", uri.href());
		}
		args1.groupFilter=groupfilter06
		multiline.load(args1);
	});
})

</script>