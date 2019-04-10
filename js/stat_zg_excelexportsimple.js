//Attributes defining the datasheet
filename="Datentabelle.xlsx"
autofilters=true;

//Polyfill for Object.assign (for IE)
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

//Polyfill for String.startsWith
if (!String.prototype.startsWith) {
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var toString = {}.toString;
		var startsWith = function(search) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			if (search && toString.call(search) == '[object RegExp]') {
				throw TypeError();
			}
			var stringLength = string.length;
			var searchString = String(search);
			var searchLength = searchString.length;
			var position = arguments.length > 1 ? arguments[1] : undefined;
			// `ToInteger`
			var pos = position ? Number(position) : 0;
			if (pos != pos) { // better `isNaN`
				pos = 0;
			}
			var start = Math.min(Math.max(pos, 0), stringLength);
			// Avoid the `indexOf` call if no match is possible
			if (searchLength + start > stringLength) {
				return false;
			}
			var index = -1;
			while (++index < searchLength) {
				if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
					return false;
				}
			}
			return true;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'startsWith', {
				'value': startsWith,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.startsWith = startsWith;
		}
	}());
}

//function for calculation text width in pixel
function getTextWidth(text, font) {
// re-use canvas object for better performance
var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
var context = canvas.getContext("2d");
context.font = font;
var metrics = context.measureText(strip(text));
return metrics.width;
}

//function to remove all html-tags (currently only used in getTextWidth)
function strip(html)
{
	var tmp = document.createElement("DIV");
	if (html instanceof Date) {
		html=html.toISOString().slice(0,10).replace(/-/g,".");
	}
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

//function to create rich text object, if text provided contains html tags (still very bassic, only one layer supported and only subscript, superscript, italic and bold.)
function createRichText(html, size, bold) {
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	if (tmp.childNodes.length==0) {
		var rT=""
	}
	else if (tmp.childNodes.length==1 & tmp.childNodes[0].nodeType==3) {
		var rT=tmp.childNodes[0].nodeValue
	} 
	else {
		var rT={}
		rT.richText=[]
		for (node=0; node<tmp.childNodes.length; ++node) {
			if (tmp.childNodes[node].nodeType==3) {
				rT.richText.push({'font': {'name': 'Arial', 'family': 2, 'size': size, 'bold': bold},'text': tmp.childNodes[node].nodeValue})
			}
			if (tmp.childNodes[node].nodeType==1) {
				if (tmp.childNodes[node].nodeName=="SUB") {
					rT.richText.push({'font': {'name': 'Arial', 'family': 2, 'size': size, 'bold': bold, 'vertAlign': 'subscript'},'text': tmp.childNodes[node].innerText})
				}
				else if (tmp.childNodes[node].nodeName=="SUP") {
					rT.richText.push({'font': {'name': 'Arial', 'family': 2, 'size': size, 'bold': bold, 'vertAlign': 'superscript'},'text': tmp.childNodes[node].innerText})
				}
				else if (tmp.childNodes[node].nodeName=="I") {
					rT.richText.push({'font': {'name': 'Arial', 'family': 2, 'size': size, 'bold': bold, 'italic': 'true'},'text': tmp.childNodes[node].innerText})
				}
				else if (tmp.childNodes[node].nodeName=="B") {
					rT.richText.push({'font': {'name': 'Arial', 'family': 2, 'size': size, 'bold': true},'text': tmp.childNodes[node].innerText})
				}
				else {
					rT.richText.push({'font': {'name': 'Arial', 'family': 2, 'size': size, 'bold': bold},'text': tmp.childNodes[node].innerText})
				}
			}
		}
	}
	//console.log(rT);
	return rT
}

//function that actually creates xlsx file
function createXLSXsimple (number, columns) {
	
	Datasheets[number]={};

	//create workbook object and define some attributes
	var workbook = new ExcelJS.Workbook();
 	workbook.creator = 'Statistik Kanton Zug';
	workbook.lastModifiedBy = 'Statistik Kanton Zug';
	workbook.created = new Date();
	workbook.modified = new Date();
	//workbook.lastPrinted = new Date();
	
	if (typeof Atts[number].datatypes=="undefined") {
		Atts[number].datatypes=[]
		for (var i = 0; i < columns.length; i++) {
		Atts[number].datatypes.push("string");
		}
	}
	
	//create worksheet object
	var worksheet = workbook.addWorksheet("Datenblatt");
	
	var minCellWidth=10
	var maxCellWidth=100
	
	//Define column widths depending on data	
	Datasheets[number].cellWidths=[]
	for (i=0; i<columns.length; ++i) {
		var cw=(d3.max(Atts[number].data, function(d) { return getTextWidth(d[columns[i]], "10pt arial"); })/7.025)+2;
		if (Atts[number].datatypes[i]=="miochf") {
			cw=cw+10
		}
		Datasheets[number].cellWidths.push(cw);
	}
	
	//Limit column widths with min and max
	for (i=0; i<columns.length; ++i) {
		if (Datasheets[number].cellWidths[i]<minCellWidth) {
			Datasheets[number].cellWidths[i]=minCellWidth
		}
		if (Datasheets[number].cellWidths[i]>maxCellWidth) {
			Datasheets[number].cellWidths[i]=maxCellWidth
		}
	}
	
	//Fill array with default width for remaining columns up to 100	
	for (i=columns.length; i<100; i++) {
		Datasheets[number].cellWidths.push(8.43)
	}
	
	//Create array with summed up column widths
	Datasheets[number].cellWidthsSums=[0.0]
	for (i=0; i<Datasheets[number].cellWidths.length; ++i) {
		Datasheets[number].cellWidthsSums.push(Datasheets[number].cellWidthsSums[i]+Datasheets[number].cellWidths[i])
	}
	
	//Define columns
	var defineColumns = []
	for (i=0; i<columns.length; ++i) {
		defineColumns.push({header: createRichText(columns[i], 10, false), key: columns[i], width: Datasheets[number].cellWidths[i]})
	}
	worksheet.columns = defineColumns;
	
	//Counter for header rows and total rows (one row is allready defined though column definition)
	var headerRows=1
	var totalRows=1
	
	//If title exist splice it in at the top
	console.log(Atts[number].meta);
	var title = Atts[number].meta.filter(function( el ) { return el.Type == "title";});
	if (title.length == 1 & title[0].Content != "") {
		if (title[0].Content!="") {
			var titlestr=createRichText([title[0].Content], 20, true)
			var titlelength=getTextWidth(title[0].Content, "20pt arial")
			worksheet.spliceRows(headerRows, 0, [titlestr]);
			++headerRows;
			++totalRows;
		}
	} else if (typeof($('#'+Atts[number].maincontainer+'').prevAll('h2')[0]) != 'undefined') {
		var titlestr=$('#'+Atts[number].maincontainer+'').prevAll('h2')[0].textContent;
		var titlelength=getTextWidth(titlestr, "20pt arial")
		worksheet.spliceRows(headerRows, 0, [titlestr]);
		++headerRows;
		++totalRows;
	} else if (typeof($('#'+Atts[number].maincontainer+'').prevAll('h3')[0]) != 'undefined') {
		var titlestr=$('#'+Atts[number].maincontainer+'').prevAll('h3')[0].textContent;
		var titlelength=getTextWidth(titlestr, "20pt arial")
		worksheet.spliceRows(headerRows, 0, [titlestr]);
		++headerRows;
		++totalRows;
	}
	
	//If subtitle exists splice it in
	var subtitle = Atts[number].meta.filter(function( el ) { return el.Type == "subtitle";});
	if (subtitle.length == 1) {
		if (subtitle[0].Content!="") {
			var subtitlestr=createRichText([subtitle[0].Content], 12, true)
			worksheet.spliceRows(headerRows, 0, [subtitlestr]);
			var subtitleRow=headerRows
			++headerRows;
			++totalRows;
		}
	}
	
	//Splice in spacer row
	worksheet.spliceRows(headerRows, 0, [""]);
	var spacerRow=headerRows;
	++headerRows;
	++totalRows;
	
	//Add actual data to sheet
	Atts[number].data.forEach(function(d) {
		var cellContent=[]
		for (i=0; i<columns.length; ++i) {
			switch(Atts[number].datatypes[i]) {
				case "string":
				case "year":
					var cellCT=createRichText(d[columns[i]], 10, false)
					break;
				default:
					var cellCT=d[columns[i]]
					break;
			}
			cellContent.push(cellCT)
		}
		worksheet.addRow(cellContent)
		++totalRows;
	});

	//Add spacer row at the bottom, before remaining meta data
	worksheet.addRow([""]);
	++totalRows;
	
	//If description exists add it at the bottom
	var description = Atts[number].meta.filter(function( el ) { return el.Type == "description";});
	if (description.length == 1) {
		if (description[0].Content!="") {
			var descriptionstr=createRichText([description[0].Content], 10, false)
			worksheet.addRow([descriptionstr]);
			++totalRows;
			var descriptionRow=totalRows;
		}
	}
	
	//If source exist add it at the bottom
	var source = Atts[number].meta.filter(function( el ) { return el.Type == "source";});
	if (source.length == 1) {
		if (source[0].Content!="") {
			var sourcestr=createRichText([source[0].Content], 10, false)
			worksheet.addRow(["Datenquelle: " + sourcestr]);
			++totalRows;
			var sourceRow=totalRows;
		}
	}
	
	//Add spacer row at the bottom, before remaining meta data
	worksheet.addRow([""]);
	++totalRows
	var logoRow=totalRows;
	
	//Add file source in any case
	worksheet.addRow(["Fachstelle Statistik des Kantons Zug"]);
	++totalRows
	var filesourceRow=totalRows;

	//Add border to data portion (including header row)
	for (i=headerRows; i<(Atts[number].data.length+headerRows+1); ++i) {
		var row = worksheet.getRow(i);
		row.eachCell(function(cell, colNumber) {
			cell.border= {
				top: {style:'thin', color: {argb:'FFD9D9D9'}},
				left: {style:'thin', color: {argb:'FFD9D9D9'}},
				bottom: {style:'thin', color: {argb:'FFD9D9D9'}},
				right: {style:'thin', color: {argb:'FFD9D9D9'}}
			}
		});
	}
	
	//Add font to all rows 
	worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
		row.font = { name: 'Arial', family: 2, size: 10 };
	});

	//Add formating to metadata rows
	Datasheets[number].cellHeights=[]
	var headerHeight=0.0;
	var maxMerge=0
	
	//Add formating to title row
	if (typeof titlelength != 'undefined') {
		var firstRow = worksheet.getRow(1);
		firstRow.font = { name: 'Arial', family: 2, size: 20, bold: true };
		firstRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
	
		//Merge cells
		var merge=0
		while (Datasheets[number].cellWidthsSums[merge] < ((titlelength/7.025)+10)
				& Datasheets[number].cellWidthsSums[merge] < 90) {
			++merge
		}
		worksheet.mergeCells(1,1,1,merge)

		firstRow.height = Math.ceil(((titlelength/7.025)+10)/Datasheets[number].cellWidthsSums[merge])*30;
		Datasheets[number].cellHeights.push(firstRow.height)
		headerHeight += firstRow.height
		if (merge>maxMerge) {maxMerge=merge;}
	}
	
	var fontSizeSubtitle=12
	//Add formating to subtitle row
	if (subtitle.length == 1 && subtitle[0].Content!="") {	
		var secondRow = worksheet.getRow(subtitleRow);
		secondRow.font = { name: 'Arial', family: 2, size: fontSizeSubtitle, bold: true };
		secondRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
		
		//Merge cells
		var merge=0
		while (Datasheets[number].cellWidthsSums[merge] < ((getTextWidth(subtitle[0].Content, fontSizeSubtitle+"pt arial")/7.025)+10)
				& Datasheets[number].cellWidthsSums[merge] < 90) {
			++merge
		}
		worksheet.mergeCells(subtitleRow,1,subtitleRow,merge)

		secondRow.height = Math.ceil(((getTextWidth(subtitle[0].Content, fontSizeSubtitle+"pt arial")/7.025)+10)/Datasheets[number].cellWidthsSums[merge])*20;
		Datasheets[number].cellHeights.push(secondRow.height)
		headerHeight += secondRow.height
		if (merge>maxMerge) {maxMerge=merge;}
	}
	
	worksheet.getRow(spacerRow).height = 15
	Datasheets[number].cellHeights.push(15.0)
	
	//Adapt hight of logoRow to fit the logo
	worksheet.getRow(logoRow).height = 79
	
	//Adapt header row so that text fits in cells
	var dataHeaderRow = worksheet.getRow(headerRows);
	dataHeaderRow.alignment = { vertical: 'top', horizontal: 'left', wrapText: true};

	//find max rows
	maxRows=1
	for (i=1; i<=dataHeaderRow._cells.length; ++i) {
		maxRows = Math.max(maxRows, Math.ceil(((getTextWidth(dataHeaderRow.getCell(i).value, "10pt arial")/7.025)+1)/Datasheets[number].cellWidths[i]));
	}

	//adjust header row heights (add some space for auto filters)
	dataHeaderRow.height = (maxRows*15);
	if (autofilters==true) {
		dataHeaderRow.height = (maxRows*15)+12;
	}
	Datasheets[number].cellHeights.push(dataHeaderRow.height)
	
	//Add cell heights to array for data rows (including spacer row at bottom)
	for (i=headerRows+1; i<(Atts[number].data.length+headerRows+2); ++i) {
		worksheet.getRow(i).height = 15
		Datasheets[number].cellHeights.push(15.0)
		worksheet.getRow(i).alignment = { vertical: 'middle'}
	}
	
	//Add formating to description row
	if (description.length == 1 && description[0].Content!="") {
		var descRow = worksheet.getRow(descriptionRow);
		//descRow.font = { name: 'Arial', family: 2, size: 20, bold: true };
		descRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
	
		//Merge cells
		var merge=0
		while (Datasheets[number].cellWidthsSums[merge] < ((getTextWidth(description[0].Content, "10pt arial")/7.025)+10)
				& Datasheets[number].cellWidthsSums[merge] < 90) {
			++merge
		}
		worksheet.mergeCells(descriptionRow,1,descriptionRow,merge)

		descRow.height = Math.ceil(((getTextWidth(description[0].Content, "10pt arial")/7.025)+10)/Datasheets[number].cellWidthsSums[merge])*15;
		Datasheets[number].cellHeights.push(descRow.height)
	}
	
	//Add formating to source row
	if (source.length == 1 && source[0].Content!="") {
		var sourcRow = worksheet.getRow(sourceRow);
		sourcRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
	
		//Merge cells
		var merge=0
		while (Datasheets[number].cellWidthsSums[merge] < ((getTextWidth("Quelle: " + source[0].Content, "10pt arial")/7.025)+10)
				& Datasheets[number].cellWidthsSums[merge] < 90) {
			++merge
		}
		worksheet.mergeCells(sourceRow,1,sourceRow,merge)

		sourcRow.height = Math.ceil(((getTextWidth("Quelle: " + source[0].Content, "10pt arial")/7.025)+10)/Datasheets[number].cellWidthsSums[merge])*15;
		Datasheets[number].cellHeights.push(sourcRow.height)
	}
	
	//Add formating to filesource row
	var filesourcRow = worksheet.getRow(filesourceRow);
	filesourcRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};

	//Merge cells
	var merge=0
	while (Datasheets[number].cellWidthsSums[merge] < ((getTextWidth("Fachstelle Statistik des Kantons Zug", "10pt arial")/7.025)+10)
			& Datasheets[number].cellWidthsSums[merge] < 90) {
		++merge
	}
	worksheet.mergeCells(filesourceRow,1,filesourceRow,merge)

	filesourcRow.height = Math.ceil(((getTextWidth("Fachstelle Statistik des Kantons Zug", "10pt arial")/7.025)+10)/Datasheets[number].cellWidthsSums[merge])*15;
	Datasheets[number].cellHeights.push(filesourcRow.height)
	
	//Create array with summed up cell heights
	Datasheets[number].cellHeightsSums=[0.0]
	
	for (i=0; i<Datasheets[number].cellHeights.length; ++i) {
		Datasheets[number].cellHeightsSums.push(Datasheets[number].cellHeightsSums[i]+Datasheets[number].cellHeights[i])
	}
	
	function calculateWidthinCells (width) {
		var result=[0,0]
		while (Datasheets[number].cellWidthsSums[result[0]] < width) {
			++result[0]
		}
		--result[0]
		result[1]=Math.round((width-Datasheets[number].cellWidthsSums[result[0]])*7.025)
		return result
	}

	function calculateHeightinCells (height) {
		var result=[0,0]
		while (Datasheets[number].cellHeightsSums[result[0]] < height) {
			++result[0]
		}
		--result[0]
		result[1]=Math.round((height-Datasheets[number].cellHeightsSums[result[0]])*1.27)
		
		return result
	}
	
	// add image to workbook by base64
	//black an white with border left
	//var logo="data:image/png;base64,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"
	//black and white without border left
	//var logo="data:image/png;base64,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"			
	//color without boder left
	var logo="data:image/png;base64,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"
	var imageId1 = workbook.addImage({
		base64: logo,
		extension: 'png',
	});
	
	//Position fixed from left
	var headerWidth=Math.max(60, Datasheets[number].cellWidthsSums[maxMerge])
	var imageWidthStart=calculateWidthinCells(headerWidth)
	var imageWidthEnd=calculateWidthinCells(headerWidth+35)
	var imageHeightEnd=calculateHeightinCells(79)
	var imageWidthEnd2=calculateWidthinCells(33.1)
	
	//Position fixed from right
	//for (i=1; Datasheets[number].cellWidthsSums[i] < 90; ++i) {
	//	var headerWidth=Datasheets[number].cellWidthsSums[i];
	//}

	//var imageWidthStart=calculateWidthinCells(headerWidth-35)
	//var imageWidthEnd=calculateWidthinCells(headerWidth)
	//var imageHeightEnd=calculateHeightinCells(79)

	//Image to right corner
	/*worksheet.addImage(imageId1, {
		tl: { col: imageWidthStart[0], row: 0, colOff: imageWidthStart[1], rowOff: 0 },
		br: { col: imageWidthEnd[0], row: imageHeightEnd[0], colOff: imageWidthEnd[1], rowOff: imageHeightEnd[1] },
		editAs: 'absolute'
	});*/
	
	
	worksheet.addImage(imageId1, {
		tl: { col: 0, row: logoRow-1, colOff: 0, rowOff: 0 },
		br: { col: imageWidthEnd2[0], row: logoRow, colOff: imageWidthEnd2[1], rowOff: 0 },
		editAs: 'absolute'
	});
	
	worksheet.views = [
		{state: 'frozen', xSplit: 0, ySplit: headerRows, activeCell: 'A1', showGridLines:false}
	];
	 
	//Seitendefinitionen fürs Drucken
	worksheet.pageSetup.paperSize = 9;
	if(Datasheets[number].cellWidthsSums[columns.length]<=95) {
		worksheet.pageSetup.orientation = "portrait";
	} else {
		worksheet.pageSetup.orientation = "landscape";
	}
	worksheet.pageSetup.scale=78;
	 
	if (autofilters==true) {
	worksheet.autoFilter = {
	from: {
		row: headerRows,
		column: 1
	},
	to: {
		row: headerRows,
		column: columns.length
	}
	};
	}
	
	for (i=0; i<Atts[number].datatypes.length; i++) {
		switch(Atts[number].datatypes[i]) {
			case "integer":
				worksheet.getColumn(i+1).numFmt = "#,##0";
				break;
			case "float":
				worksheet.getColumn(i+1).numFmt = "#,##0.0";
				break;
			case "float2":
				worksheet.getColumn(i+1).numFmt = "#,##0.00";
				break;
			case "float6":
				worksheet.getColumn(i+1).numFmt = "#,##0.000000";
				break;
			case "percentage":
				worksheet.getColumn(i+1).numFmt = '0.00%';
				break;
			case "chf":
				worksheet.getColumn(i+1).numFmt = '"Fr." #,##0.00';
				break;
			case "miochf":
				worksheet.getColumn(i+1).numFmt = '#,##0.00 "Mio Fr."';
				break;
			case "floatha":
				worksheet.getColumn(i+1).numFmt = '#,##0.00 "ha"';
				break;
			case "dateyear":
				worksheet.getColumn(i+1).numFmt = 'yyyy';
				break;
			case "datemonthyear":
				worksheet.getColumn(i+1).numFmt = 'mmm yyyy';
				break;
		}
	}

	var buff = workbook.xlsx.writeBuffer().then(function (xlsxdata) {
		Datasheets[number].blob = new Blob([xlsxdata]/*, {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}*/);
		saveAs(Datasheets[number].blob, filename);
	});
	
}