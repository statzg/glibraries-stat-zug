<script type="text/javascript" src="/behoerden/gesundheitsdirektion/statistikfachstelle/daten/js/stat_zg_generals.js"></script>
<table>
				<!--<caption>Die Gemeinden des Kanton Zug</caption>-->
				<colgroup>
					<col class="w10perc" />
					<col class="w30perc" />
					<col class=fbeh"w300perc" />
					<col class="w30perc" />

				</colgroup>
			  
				<tr>
				  <th scope="col"  align="left" valign="top">Wappen</th>
				  <th scope="col"  align="left" valign="top">Gemeinde</th>
				  <th class="right" scope="col"  align="left" valign="top">Ständige Wohnbevölkerung am 31.12.<span id="jahr"></span></th>
				  <th class="right" scope="col" align="left" valign="top">Fläche in ha ohne Seen</th>
				  <th class="right" scope="col" align="left" valign="top">Höhenlage m ü.M.</th>

				</tr>
				<tr>
                  <td  width="10%"><img src="./bilder/wappen/wappen-baar" alt="Wappen Gemeinde Baar" /></td>
				  <td width="20%"><a href="http://www.baar.ch/" target="_blank">Baar</a></td>
				  <td class="right" width="30%" id="Baar"></td>
				  <td class="right" width="20%">2'478</td>
				  <td class="right" width="20%">444</td>

			  </tr>
				<tr>
                  <td><img src="./bilder/wappen/wappen-cham" alt="Wappen Gemeinde Cham" /></td>
				  <td><a href="http://www.cham.ch/" target="_blank">Cham</a></td>
				  <td class="right" id="Cham"></td>
				  <td class="right">1'776</td>
				  <td class="right">418</td>

			  </tr>
				<tr>
                  <td><img src="./bilder/wappen/wappen-huenenberg" alt="Wappen Gemeinde Hünenberg" /></td>
				  <td><a href="./hunenberg/de" target="_top">Hünenberg</a></td>
				  <td class="right" id="Hünenberg"></td>
				  <td class="right">1'841 </td>
				  <td class="right">451</td>

			  </tr>
				<tr>
                  <td><img src="./bilder/wappen/wappen-menzingen" alt="Wappen Gemeinde Menzingen" /></td>
				  <td><a href="./menzingen/de" target="_top">Menzingen</a></td>
				  <td class="right" id="Menzingen"></td>
				  <td class="right">2'747</td>
				  <td class="right">807</td>

			  </tr>
				<tr>
                  <td><img src="./bilder/wappen/wappen-neuheim" alt="Wappen Gemeinde Neuheim" /></td>
				  <td><a href="http://www.neuheim.ch/" target="_blank">Neuheim</a></td>
				  <td class="right" id="Neuheim"></td>
				  <td class="right">794</td>
				  <td class="right">666</td>

			  </tr>
				<tr>
				  <td><img src="./bilder/wappen/wappen-oberaegeri" alt="Wappen Gemeinde Oberägeri" /></td>
				  <td><a href="http://www.oberaegeri.ch/" target="_blank">Oberägeri</a></td>
				  <td class="right" id="Oberägeri"></td>
				  <td class="right">3'007</td>
				  <td class="right">737</td>

				</tr>
				<tr>
                  <td><img src="./bilder/wappen/wappen-risch" alt="Wappen Gemeinde Risch" /></td>
				  <td><a href="./risch-rotkreuz/" target="_top">Risch</a></td>
				  <td class="right" id="Risch"></td>
				  <td class="right">1'484</td>
				  <td class="right">417</td>

			  </tr>
				<tr>
				  <td><img src="./bilder/wappen/wappen-steinhausen" alt="Wappen Gemeinde Steinhausen" /></td>
				  <td><a href="./steinhausen/" target="_top">Steinhausen</a></td>
				  <td class="right" id="Steinhausen"></td>
				  <td class="right">504</td>
				  <td class="right">424</td>

				</tr>
				<tr>
                  <td><img src="./bilder/wappen/wappen-unteraegeri" alt="Wappen Gemeinde Unterägeri" /></td>
				  <td><a href="http://www.unteraegeri.ch/" target="_blank">Unterägeri</a></td>
				  <td class="right" id="Unterägeri"></td>
				  <td class="right">2'556</td>
				  <td class="right">729</td>

			  </tr>
				<tr>
				  <td><img src="./bilder/wappen/wappen-walchwil" alt="Wappen Gemeinde Walchwil" /></td>
				  <td><a href="http://www.walchwil.ch/" target="_blank">Walchwil</a></td>
				  <td class="right" id="Walchwil"></td>
				  <td class="right">1'353</td>
				  <td class="right">449</td>

				</tr>
				<tr>
                  <td><img src="./bilder/wappen/wappen-stadtzug" alt="Wappen Stadt Zug" border="0" height="31" width="31" /></td>
				  <td><a href="http://www.stadtzug.ch/" target="_blank">Zug</a></td>
				  <td class="right" id="Zug"></td>
				  <td class="right">2'165</td>
				  <td class="right">425</td>

			  </tr>
				<tr class="total">
				  <td>&nbsp;</td>
				  <td>Total</td>
				  <td class="right" id="Total">123'948</td>
				  <td class="right">20'705</td>
				  <td>&nbsp;</td>

				</tr>
		  </table>
<script>
var daten = d3.csv("/behoerden/gesundheitsdirektion/statistikfachstelle/daten/gemeindeportrait/result-gemeindeportrait-01.csv", function(error, data) {

meta = data.filter(function(el) {
	return el["Meta"] == 1
});

data = data.filter(function(el) {
	return el["Meta"] == "" | el["Meta"] == undefined
});

year = meta.filter(function( el ) { return el.Type == "year";});
if (year.length == 1) {
	$("#jahr").html(year[0].Content);
}

baar = data.filter(function( el ) { return el.Gemeinde == "Baar";});
if (baar.length == 1) {
	$("#Baar").html(germanFormatters.numberFormat(",")(baar[0]["Ständige Wohnbevölkerung"]));
}
cham = data.filter(function( el ) { return el.Gemeinde == "Cham";});
if (cham.length == 1) {
	$("#Cham").html(germanFormatters.numberFormat(",")(cham[0]["Ständige Wohnbevölkerung"]));
}
hünenberg = data.filter(function( el ) { return el.Gemeinde == "Hünenberg";});
if (hünenberg.length == 1) {
	$("#Hünenberg").html(germanFormatters.numberFormat(",")(hünenberg[0]["Ständige Wohnbevölkerung"]));
}
menzingen = data.filter(function( el ) { return el.Gemeinde == "Menzingen";});
if (menzingen.length == 1) {
	$("#Menzingen").html(germanFormatters.numberFormat(",")(menzingen[0]["Ständige Wohnbevölkerung"]));
}
neuheim = data.filter(function( el ) { return el.Gemeinde == "Neuheim";});
if (neuheim.length == 1) {
	$("#Neuheim").html(germanFormatters.numberFormat(",")(neuheim[0]["Ständige Wohnbevölkerung"]));
}
oberägeri = data.filter(function( el ) { return el.Gemeinde == "Oberägeri";});
if (oberägeri.length == 1) {
	$("#Oberägeri").html(germanFormatters.numberFormat(",")(oberägeri[0]["Ständige Wohnbevölkerung"]));
}
risch = data.filter(function( el ) { return el.Gemeinde == "Risch";});
if (risch.length == 1) {
	$("#Risch").html(germanFormatters.numberFormat(",")(risch[0]["Ständige Wohnbevölkerung"]));
}
steinhausen = data.filter(function( el ) { return el.Gemeinde == "Steinhausen";});
if (steinhausen.length == 1) {
	$("#Steinhausen").html(germanFormatters.numberFormat(",")(steinhausen[0]["Ständige Wohnbevölkerung"]));
}
unterägeri = data.filter(function( el ) { return el.Gemeinde == "Unterägeri";});
if (unterägeri.length == 1) {
	$("#Unterägeri").html(germanFormatters.numberFormat(",")(unterägeri[0]["Ständige Wohnbevölkerung"]));
}
walchwil = data.filter(function( el ) { return el.Gemeinde == "Walchwil";});
if (walchwil.length == 1) {
	$("#Walchwil").html(germanFormatters.numberFormat(",")(walchwil[0]["Ständige Wohnbevölkerung"]));
}
zug = data.filter(function( el ) { return el.Gemeinde == "Zug";});
if (zug.length == 1) {
	$("#Zug").html(germanFormatters.numberFormat(",")(zug[0]["Ständige Wohnbevölkerung"]));
}

console.log(parseInt(baar[0]["Ständige Wohnbevölkerung"])+parseInt(cham[0]["Ständige Wohnbevölkerung"])+parseInt(hünenberg[0]["Ständige Wohnbevölkerung"])+parseInt(menzingen[0]["Ständige Wohnbevölkerung"])+parseInt(neuheim[0]["Ständige Wohnbevölkerung"])+parseInt(oberägeri[0]["Ständige Wohnbevölkerung"])+parseInt(risch[0]["Ständige Wohnbevölkerung"])+parseInt(steinhausen[0]["Ständige Wohnbevölkerung"])+parseInt(unterägeri[0]["Ständige Wohnbevölkerung"])+parseInt(walchwil[0]["Ständige Wohnbevölkerung"])+parseInt(zug[0]["Ständige Wohnbevölkerung"]));

$("#Total").html(germanFormatters.numberFormat(",")(parseInt(baar[0]["Ständige Wohnbevölkerung"])+parseInt(cham[0]["Ständige Wohnbevölkerung"])+parseInt(hünenberg[0]["Ständige Wohnbevölkerung"])+parseInt(menzingen[0]["Ständige Wohnbevölkerung"])+parseInt(neuheim[0]["Ständige Wohnbevölkerung"])+parseInt(oberägeri[0]["Ständige Wohnbevölkerung"])+parseInt(risch[0]["Ständige Wohnbevölkerung"])+parseInt(steinhausen[0]["Ständige Wohnbevölkerung"])+parseInt(unterägeri[0]["Ständige Wohnbevölkerung"])+parseInt(walchwil[0]["Ständige Wohnbevölkerung"])+parseInt(zug[0]["Ständige Wohnbevölkerung"])));

})
</script>