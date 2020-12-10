<div class="container" id="default1" style="border: 1px solid #e6e6e2; padding:5px 5px 5px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;">

	<div><p>Gemeinde(n) auswählen:</p>
		<ul class="subelements-listing">
			<li><a id="Zug" class="hiderow" href="javascript:;">Zug</a> </li>
			<li><a id="Oberägeri" class="hiderow" href="javascript:;">Oberägeri</a> </li>
			<li><a id="Unterägeri" class="hiderow" href="javascript:;">Unterägeri</a> </li>
			<li><a id="Menzingen" class="hiderow" href="javascript:;">Menzingen</a> </li>
			<li><a id="Baar" class="hiderow" href="javascript:;">Baar</a> </li>
			<li><a id="Cham" class="hiderow" href="javascript:;">Cham</a> </li>
			<li><a id="Hünenberg" class="hiderow" href="javascript:;">Hünenberg</a> </li>
			<li><a id="Steinhausen" class="hiderow" href="javascript:;">Steinhausen</a> </li>
			<li><a id="Risch" class="hiderow" href="javascript:;">Risch</a> </li>
			<li><a id="Walchwil" class="hiderow" href="javascript:;">Walchwil</a> </li>
			<li><a id="Neuheim" class="hiderow" href="javascript:;">Neuheim</a> </li>
		</ul>
	</div>

	<div class="isolatecontainer">
		<div id="wirtschaftsstruktur-container">
			<div id='title' class='title'>Wirtschaftsstruktur</div>
			<div id='subtitle' class='subtitle'><span id="gemeindename">Kanton Zug</span> <span class="wirtschaftsstrukturyear"></span></div>
			<div id="wirtschaftsstruktur-chart" class="overlaycontainer" style="position: relative;">
				<div id="wirtschaftsstrukturw1-chart" class="non-float" style="position: relative; z-index: 100;"></div>
				<div id="wirtschaftsstrukturw2-chart" class="non-float" style="position: absolute; top: 0; left: 0; z-index: 99;"></div>
			</div>
			<div id='source' class='source'>Quelle: Bundesamt für Statistik, STATENT</div>
		</div>
	</div>

</div>

<script type="text/javascript">

require.config({
   urlArgs: "bust=" + (new Date()).getTime(),
   baseUrl: '/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/'
});

require(['stat_zg_wirtschaftsstruktur'], function (wirtschaftsstruktur) {

	args1 ={
		number:1,													
		characteristics:["Baar", "Cham", "Hünenberg", "Menzingen", "Neuheim", "Oberägeri", "Risch", "Steinhausen", "Unterägeri", "Walchwil" ,"Zug"],
		groupFilter:["Baar", "Cham", "Hünenberg", "Menzingen", "Neuheim", "Oberägeri", "Risch", "Steinhausen", "Unterägeri", "Walchwil" ,"Zug"],
		nofilter:true
		}

	function addaptfromuri() {
		//if uri attribute is defined
		if (typeof uri.search(true)["gemeinde"] != "undefined") {
			//remove all selected classes
			$(".hiderow").removeClass("selected");
			$(".hiderow").parent().removeClass("selected");
			//reset groupfilter
			args1.groupFilter=[]
			//if only one item is defined
			if(typeof uri.search(true)["gemeinde"] =="string") {
				args1.groupFilter.push(uri.search(true)["gemeinde"].charAt(0).toUpperCase() + uri.search(true)["gemeinde"].slice(1).replace("ae", "ä").replace("oe", "ö").replace("ue", "ü"));
				$("[id='"+uri.search(true)["gemeinde"]+"']").addClass("selected")
				$("[id='"+uri.search(true)["gemeinde"]+"']").parent().addClass("selected")
			} 
			//if more than one item is defined
			else {
				for(k=0; k < uri.search(true)["gemeinde"].length; k++) {
					args1.groupFilter.push(uri.search(true)["gemeinde"][k].charAt(0).toUpperCase() + uri.search(true)["gemeinde"][k].slice(1).replace("ae", "ä").replace("oe", "ö").replace("ue", "ü"));
					$("[id='"+uri.search(true)["gemeinde"][k]+"']").addClass("selected")
					$("[id='"+uri.search(true)["gemeinde"][k]+"']").parent().addClass("selected")
				}
			}
			args1.nofilter=false
		//if uri attribtute is not defined
		} else {
			if (args1.nofilter==false) {
				for(k=0; k < args1.groupFilter.length; k++) {
					console.log(args1.groupFilter[k].charAt(0).toLowerCase() + args1.groupFilter[k].slice(1).replace("ä", "ae").replace("ö", "oe").replace("ü", "ue"));
					uri.addSearch('gemeinde',args1.groupFilter[k].charAt(0).toLowerCase() + args1.groupFilter[k].slice(1).replace("ä", "ae").replace("ö", "oe").replace("ü", "ue"));
					$("[id='"+args1.groupFilter[k]+"']").addClass("selected");
					$("[id='"+args1.groupFilter[k]+"']").parent().addClass("selected");
				};
				window.history.pushState("", "", uri.href());
			}
		}
	}
	
	addaptfromuri(args1.nofilter);
	
	function addaptsubtitle() {
		if(args1.groupFilter.length!=11) {
			$("#gemeindename").html(args1.groupFilter.sort().join(', '))
		} else {
			$("#gemeindename").html("Kanton Zug")
		}
	}

	addaptsubtitle();

	wirtschaftsstruktur.load(args1);
	
	//Funktion um bei Knopfklick die entsprechende Grafik einzublenden und die andere auszublenden.
	$(".hiderow").click(function(){
		//determine if item was previously activated
		shown=false
		for (k = 0; k < args1.groupFilter.length; k++) {
			if (this.id==args1.groupFilter[k]) {
				shown=true;
				j=k
			}
		}
		//if item is activaded by click
		if (shown==false | args1.nofilter==true) {
			if (args1.nofilter==true) {
				args1.groupFilter=[]
			}
			args1.groupFilter.push(this.id);
			$(this).addClass("selected")
			$(this).parent().addClass("selected")
			uri.addSearch('gemeinde',this.id.charAt(0).toLowerCase() + this.id.slice(1).replace("ä", "ae").replace("ö", "oe").replace("ü", "ue"));
			window.history.pushState("", "", uri.href());
			args1.nofilter=false
		//if item is deactivated by click
		} else {
			args1.groupFilter.splice(j, 1)
			$(this).removeClass("selected")
			$(this).parent().removeClass("selected")
			uri.removeSearch('gemeinde',this.id.charAt(0).toLowerCase() + this.id.slice(1).replace("ä", "ae").replace("ö", "oe").replace("ü", "ue"));
			//if args1.groufilter is now empty
			if(args1.groupFilter.length==0) {
				args1.groupFilter=args1.characteristics.slice()
				args1.nofilter=true
			}
			window.history.pushState("", "", uri.href());
		}
		
		addaptsubtitle();
				
		wirtschaftsstruktur.load(args1);
	});
})

</script>