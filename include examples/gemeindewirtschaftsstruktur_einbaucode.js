<div class="container" id="default1" style="border: 1px solid #e6e6e2; padding:5px 5px 5px 5px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;">

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
		groupFilter:["Hünenberg"],
		nofilter:false
		}

	function addaptfromuri() {
		//if uri attribute is defined
		if (typeof uri.search(true)["gemeinde"] != "undefined") {
			//reset groupfilter
			args1.groupFilter=[]
			//if only one item is defined
			if(typeof uri.search(true)["gemeinde"] =="string") {
				args1.groupFilter.push(uri.search(true)["gemeinde"].charAt(0).toUpperCase() + uri.search(true)["gemeinde"].slice(1).replace("ae", "ä").replace("oe", "ö").replace("ue", "ü"));
			} 
			//if more than one item is defined
			else {
				for(k=0; k < uri.search(true)["gemeinde"].length; k++) {
					args1.groupFilter.push(uri.search(true)["gemeinde"][k].charAt(0).toUpperCase() + uri.search(true)["gemeinde"][k].slice(1).replace("ae", "ä").replace("oe", "ö").replace("ue", "ü"));
				}
			}
			args1.nofilter=false
		//if uri attribtute is not defined
		} else {
			if (args1.nofilter==false) {
				for(k=0; k < args1.groupFilter.length; k++) {
					uri.addSearch('gemeinde',args1.groupFilter[k].charAt(0).toLowerCase() + args1.groupFilter[k].slice(1).replace("ä", "ae").replace("ö", "oe").replace("ü", "ue"));
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
})

</script>