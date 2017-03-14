var nmlInFile = document.getElementById("nmlInFile");
var nmlDisplay = document.getElementById("nmlDisplay");
var xmlInFile = document.getElementById("xmlInFile");
var xmlDisplay = document.getElementById("xmlDisplay");
var xslt4IndentDisplay = document.getElementById("xslt4IndentDisplay");
var xslt4AltIndentDisplay = document.getElementById("xslt4AltIndentDisplay");
var xslt4NmlDisplay = document.getElementById("xslt4NmlDisplay");
var xslt4HtmlDisplay = document.getElementById("xslt4HtmlDisplay");
var htmlDisplay = document.getElementById("htmlDisplay");
var xslt4HtmlToXmlDisplay = document.getElementById("xslt4HtmlToXmlDisplay");
var distilledXmlDisplay = document.getElementById("distilledXmlDisplay");
var xslt4XsdDisplay = document.getElementById("xslt4XsdDisplay");
var xsdDisplay = document.getElementById("xsdDisplay");

window.onload = function() {

	nmlInFile.addEventListener('change', function(e) {
		var file = nmlInFile.files[0];
		loadText( file, nmlDisplay );
	}, false);

	xmlInFile.addEventListener('change', function(e) {
		var file = xmlInFile.files[0];
		loadText( file, xmlDisplay );
	}, false);

	nmlDisplay.addEventListener('dragover', function(e) {
		e.preventDefault();
	},false);

	xmlDisplay.addEventListener('dragover', function(e) {
		e.preventDefault();
	},false);

	nmlDisplay.addEventListener('drop', function(e) {
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		loadText( file, nmlDisplay );
	},false);
	
	xmlDisplay.addEventListener('drop', function(e) {
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		loadText( file, xmlDisplay );
	},false);

}

function loadText( file, displayTarget ) {
	var reader = new FileReader();
	reader.onload = function( event ) {
		displayTarget.value = reader.result;
	}
	reader.readAsText( file );
}

function reloadText( inputFileId, displayTargetId ) {
	var file = document.getElementById( inputFileId ).files[0];	
	var displayTarget = document.getElementById( displayTargetId );		
	loadText( file, displayTarget );
}

function saveText( displayedText, outputFile )
{
	var textToWrite = document.getElementById( displayedText ).value;
	var textAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileToSaveAs = document.getElementById( outputFile ).value;
	
	if ( window.navigator.msSaveBlob != null ) {
		window.navigator.msSaveBlob( textAsBlob, fileToSaveAs );
	}
	else {
		var downloadLink = document.createElement("a");
		downloadLink.download = fileToSaveAs;
		if (window.webkitURL != null) {
			downloadLink.href = window.webkitURL.createObjectURL( textAsBlob );
		}
		else {
			downloadLink.href = window.URL.createObjectURL( textAsBlob );
			downloadLink.style.display = "none";
			document.body.appendChild( downloadLink );
		}
		downloadLink.click();
	}
}

function toggleFold( foldId, detailId ) {
	var foldId = document.getElementById( foldId );
	var foldState = foldId.getAttribute("data-fold");
	var detailId = document.getElementById( detailId );

	if( foldState == "fold" ) {
		//foldId.innerHTML = "&triangledown;";
		foldId.innerHTML = "&#x25bd;";
		detailId.setAttribute("style","display: inline;");
		foldId.setAttribute("data-fold","unfold");
	}
	else
	{
		//foldId.innerHTML = "&triangleright;";
		foldId.innerHTML = "&#x25b7;";
		detailId.setAttribute("style", "display: none;");
		foldId.setAttribute("data-fold","fold");
	}
}

function setSelected( selectId ) {
	var selectId = document.getElementById( selectId );
	var selectValue = selectId.value;
	selectId.setAttribute("data-type", selectValue);
}

function toggleDisplay( buttonId, displayId ) {
	var button = document.getElementById( buttonId );
	var display = document.getElementById( displayId ).style;
	var buttonText = button.value;
	if ( button.value.match( /^Show/ ) ) {
		display.display = "inline";
		button.value = button.value.replace( "Show", "Hide" );
	}
	else {
		display.display = "none";
		button.value  = button.value.replace( "Hide", "Show" );
	}		
}

function contract( valueListId ) {
	var sequential, repeat, checked, cellStart, sequentialStart;
	var checkedStart = false;
	var repeatTotal = 0;
	var cellToDel = 0;
	var valueList = document.getElementById( valueListId );
	var len = valueList.cells.length;
	
	for( var i=0; i<len; i++ ) {
		var lst = locateTableElement( valueList.cells[i] ).tBodies[0].rows[0].cells[0];
		
		for( var j=0; j<lst.childNodes.length; j++ ) {
			var itm = lst.childNodes[j];
			if( itm.nodeType == 1 ) {
				if( itm.nodeName == "SPAN" ) {
					var datcls = itm.getAttribute( "data-class" );
					if( datcls == "sequential" ) {
						sequential = Number( itm.textContent );
					} else if( datcls == "repeat" ) {
						repeat = Number( itm.textContent );
					}
				} else if( itm.nodeName == "INPUT" ) {
						checked = Number( itm.checked );
				}
			}
		}
		
		if( ( !checkedStart ) && ( checked ) ) {
			checkedStart = true;
			cellStart = i;
			sequentialStart = sequential;
			repeatTotal += repeat;
		} else if( (!checked) && ( checkedStart ) ) {
			break;
		} else if( checkedStart && checked ) {
			repeatTotal += repeat;
			cellToDel++;
		}
	}

	if( repeatTotal > 1 ) {
		for( var j=cellStart+cellToDel; j>cellStart; j--) {
			valueList.deleteCell( j );
		}
		valueList.cells[cellStart].setAttribute("style","border: solid thin;box-shadow: 10px 10px 5px #888888;");
		var lst = locateTableElement( valueList.cells[cellStart] ).tBodies[0].rows[0].cells[0];

		for( var j=0; j<lst.childNodes.length; j++ ) {
			var itm = lst.childNodes[j];
			if( itm.nodeType == 1 ) {
				if( itm.nodeName == "SPAN" ) {
					var datcls = itm.getAttribute( "data-class" );
					if( datcls == "sequential" ) {
						//itm.textContent = sequential + k;
					} else if( datcls == "repeat" ) {
						itm.textContent = repeatTotal;
					}
				} else if( itm.nodeName == "INPUT" ) {
					itm.checked = false;
				}
			}
		}				
	}
}

function expand( valueListId ) {
	var sequential, repeat, checked;
	var valueList = document.getElementById( valueListId );
	var len = valueList.cells.length;
	
	for( var i=0; i<len; i++ ) {
		var lst = locateTableElement( valueList.cells[i] ).tBodies[0].rows[0].cells[0];

		for( var j=0; j<lst.childNodes.length; j++ ) {
			var itm = lst.childNodes[j];
			if( itm.nodeType == 1 ) {
				if( itm.nodeName == "SPAN" ) {
					var datcls = itm.getAttribute( "data-class" );
					if( datcls == "sequential" ) {
						sequential = Number( itm.textContent );
					} else if( datcls == "repeat" ) {
						repeat = Number( itm.textContent );
					}
				} else if( itm.nodeName == "INPUT" ) {
						checked = Number( itm.checked );
				}
			}
		}
		
		if( checked && ( repeat > 1 ) ) {
			valueList.cells[i].setAttribute("style","border: solid thin;");

			for( var j=1; j<repeat; j++ ) {
				var clone = valueList.cells[i].cloneNode( true );
				valueList.insertCell(i+1);
				valueList.cells[i+1].setAttribute("style","border: solid thin;");
				valueList.cells[i+1].appendChild( locateTableElement( clone ) );

			}
			for( var k=0; k<repeat; k++ ) {
				var lst = locateTableElement( valueList.cells[i+k] ).tBodies[0].rows[0].cells[0];

				for( var j=0; j<lst.childNodes.length; j++ ) {
					var itm = lst.childNodes[j];
					if( itm.nodeType == 1 ) {
						if( itm.nodeName == "SPAN" ) {
							var datcls = itm.getAttribute( "data-class" );
							if( datcls == "sequential" ) {
								itm.textContent = sequential + k;
							} else if( datcls == "repeat" ) {
								itm.textContent = 1;
							}
						} else if( itm.nodeName == "INPUT" ) {
							itm.checked = false;
						}
					}
				}		
			}	
			break;
		}
	}
}

function locateTableElement( tdElem ) {
	var len = tdElem.childNodes.length;
	for( var j=0; j<len; j++ ) {
		var child = tdElem.childNodes[j];
		if( child.nodeType == 1 ) {
			if( child.nodeName == "TABLE" ) {
				return child;
			}
		}
	}
}

function nmlToXml() {
	var namelistString = nmlDisplay.value;
	var tokens = parseNamelist( namelistString );
	var xmlString = tokensToXml( tokens );
	xmlDisplay.value = xmlString;
}	

function xmlToNml() {
	var xmlString = xmlDisplay.value;
	var xsltString = xslt4NmlDisplay.value;
	nmlDisplay.value = applyXslt( xmlString, xsltString );
}	

function xmlToHtml() {
	var xmlString = xmlDisplay.value;
	var xsltString = xslt4HtmlDisplay.value;
	htmlDisplay.innerHTML = applyXslt( xmlString, xsltString );
}

function xmlToXsd() {
	var xmlString = distilledXmlDisplay.value;
	var xsltString = xslt4XsdDisplay.value;
	if( isIndentEffective() ){
		xsdDisplay.value = applyXslt( xmlString, xsltString );
	} else {
		xsdDisplay.value = prettyPrint( applyXslt( xmlString, xsltString ) );	
	}
}

function generateHtmlSource() {
	var xmlString = serializeXml( htmlDisplay );
	htmlSourceDisplay.value = prettyPrint( xmlString );
}

function isIndentEffective() {
	var testString = "<a><b><c></c></b></a>";
	xsltString = xslt4IndentDisplay.value;
	var testOut = applyXslt(testString, xsltString);
	console.log("testOut: "+testOut);
	var isIndentEffective = testOut.match( /<a>\n\s+<b>\n\s+<c/ );
	if( isIndentEffective ) {
		console.log("xsl:output indent works");
	} else {
		console.log("xsl:output indent does not work");
	}
	return isIndentEffective;
}

function prettyPrint( xmlString ) {
	/* xsl:output indent works for Safari, Chrome, Opera (WebKit) */

	var xsltString;

	if( isIndentEffective() ) {
		xsltString = xslt4IndentDisplay.value;
	} else {
		xsltString = xslt4AltIndentDisplay.value;
	}

	return applyXslt( xmlString, xsltString );
}

function htmlToXml() {
	var xmlString = serializeXml( htmlDisplay );
	var xsltString = xslt4HtmlToXmlDisplay.value;

	if( isIndentEffective() ) {
		distilledXmlDisplay.value = applyXslt( xmlString, xsltString );
	} else {
		distilledXmlDisplay.value = prettyPrint( applyXslt( xmlString, xsltString ) );
	}

}

function copyTextArea( sourceId, destId ) {
	var sourceId = document.getElementById( sourceId );
	var destId = document.getElementById( destId );
	destId.value = sourceId.value;
}

//function applyXslt( xmlString, xsltString ) {
function applyXslt( xmlStringOrg, xsltString ) {
/* Internet Explorer (Microsoft Edge works fine) emits an extraneous tbody closing tag when transforming XML to HTML with XSLT, but complains that the tbody it emits does not have a matching tag in the consecutive XSLT transformation.  To work around this problem, remove this extra tag anyway. */ 
	var xmlString = xmlStringOrg.replace( /<\/tbody>\s*<\/tbody>/gi, "</tbody>" );
	var xmlDom = parseXml( xmlString );
	var xsltDom = parseXml( xsltString );

	if ( window.ActiveXObject || "ActiveXObject" in window ) {
	/*
		var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
		xslDoc.loadXML( xsltString );
		var xsltTemplate = new ActiveXObject("Msxml2.XSLTemplate");
		xsltTemplate.stylesheet = xslDoc;
		var xsltProcessor = xsltTemplate.createProcessor();
		xsltProcessor.input = xmlDom;
		xsltProcessor.transform();
		return xsltProcessor.output;
	*/
		/* Another possibility */
		var stylesheet = new ActiveXObject("Msxml2.DOMDocument");
		stylesheet.loadXML( xsltString );
		var source = new ActiveXObject("Msxml2.DOMDocument");
		source.loadXML( xmlString );
		return source.transformNode( stylesheet )

		/* May work? */
		//return xmlDom.transformNode( xsltDom );

	}
	else {

		var output = xsltDom.getElementsByTagNameNS("http://www.w3.org/1999/XSL/Transform", "output")[0];
		var method = output.getAttribute("method");
		console.log("method: "+method);
		var xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet( xsltDom );
		var fragment = xsltProcessor.transformToFragment( xmlDom, document );
		if ( method == "text" ) {
			return fragment.firstChild.nodeValue;
		}
		else if ( method == "html" || method == "xml" ) {
			return serializeXml ( fragment );
		}
		
	}
}

function parseXml( xmlString ) {
	var xmlDom = null;
	// if ( typeof ActiveXObject != "undefined" ) {
	if ( window.ActiveXObject || "ActiveXObject" in window ) {
		// xmlDom = createDocument();
		/* Another possibility */
		xmlDom = new ActiveXObject("Msxml2.DOMDocument");
		
		xmlDom.loadXML( xmlString );
		if ( xmlDom.parseError != 0 ) {
			throw new Error ( "XML parsing error: " + xmlDom.parseError.reason );
		}
	}
	else if ( typeof DOMParser != "undefined" ) {
		var parser = new DOMParser();
		xmlDom = parser.parseFromString( xmlString, "text/xml" );
		var errors = xmlDom.getElementsByTagName( "parsererror" );
		if ( errors.length ) {
			throw new Error ( "XML parsing error: " + errors[0].textContent );
		}
	}
	else {
		throw new Error ( "No XML parser available.");
	}
	return xmlDom;
}

function serializeXml( xmlDom ) {
	if ( typeof XMLSerializer != "undefined" ) {
		var serializer = new XMLSerializer;
		return serializer.serializeToString( xmlDom );
	}
	else if ( typeof xmlDom.xml != "undefined" ) {
		return xmlDom.xml;
	}
	else {
		throw new Error("Could not serialize XML DOM." );
	}
}

function escapeSpecial( anyString ) {
	var xmlValidString = "";
	for( var i = 0; i < anyString.length; i++ ){
		var chr = anyString[i];
		switch ( chr ) {
			case "<":
				chr = "&lt;";
				break;
			case ">":
				chr = "&gt;";
				break;
			case "&":
				chr = "&amp;";
				break;
			case "'":
				chr = "&apos;";
				break;
			case '"':
				chr = "&quot;";
				break;
			default:
		}
		xmlValidString += chr;
	}
	return xmlValidString;
}


/* 
 * Tokenize namelist and return as JavaScript object
 * tokens { pos: position in namelist string
 *              name: category of item, i.e. group, object, value
 *              value: name of item
 *              index: index for array
 *             }
 */
function parseNamelist(string)
{		
	var tokens = [];
	
	function addElement(pos, name, value, index) {
		index = typeof index !== 'undefined' ?  index : null;
		tokens.push({
			pos: pos,
			name: name,
			value: value,
			index: index
		});
	}
		
	var cur;
	var curstr;
	var prev = "initial";
	var str;
	var subst;
	var i = 0;

	// regular expression for each item	
	var re_comment = /(!.*)\n\s*/;
	
	var re_group = /(?:&|\$)\s*([a-zA-Z_][\w]*)\s*/;

	var re_array = /([a-zA-Z_][\w]*)\s*(\(\s*((\s*:\s*(\-|\+)?\d*){1,2}|((\-|\+)?\d+(\s*:\s*(\-|\+)?\d*){0,2}))(\s*,\s*(((\-|\+)?\d*(\s*:\s*(\-|\+)?\d*){0,2})))*\s*\)(\s*\(\s*(:\s*\d*|\d+(\s*:\s*\d*)?)\s*\))?)\s*=\s*/;

	var re_object = /([a-zA-Z_][\w]*)\s*=\s*/;
	
	var re_repeat = /([0-9]+)\s*\*\s*/;
	
	var re_complex_start = /\(\s*/;
	var re_complex_end = /\)\s*,?\s*/;
	
	var re_string = /('((?:[^']+|'')*)'|"((?:[^"]+|"")*)")\s*,?\s*/;

	var re_nondelimited_c = /([^'"\*\s,\/!&\$(=%\.][^\*\s,\/!&\$(=%\.]*)\s*,?\s*/;
	var re_nondelimited_d = /(\d+[^\*\s\d,\/!&\$\(=%\.][^\s,\/!&\$\(=%\.]*)\s*,?\s*/;

	var re_real = /(((\-|\+)?\d*\.\d*([eEdDqQ](\-|\+)?\d+)?)|((\-|\+)?\d+[eEdDqQ](\-|\+)?\d+))\s*,?\s*/;

	var re_integer = /((\-|\+)?\d+)\b\s*,?\s*/;
	
	var re_logical_c = /([tT][rR][uU][eE]|[tT]|[fF][aA][lL][sS][eE]|[fF])\s*,?\s*/;
	var re_logical_p = /(\.(([tT][rR][uU][eE]|[[fF][aA][lL][sS][eE])\.?|[tTfF]\w*))\s*,?\s*/;
	
	var re_null = /\s*\b|\s*,\s*/;
	
	var re_orphan = /[^&]*/;
	
	while( i < string.length ) {
		cur = string[i];
		curstr = string.substr(i);
		// [1] EXCLAMATION MARK
		// (1-1) a comment
		if ( cur .match(/!/) ) {
			// COMMENT
			str = re_comment.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				//console.log("found comment: " + str);
				//addElement(i, "comment", str);
				console.log("found comment: " + str[1]);
				addElement(i, "comment", str[1]);

				i += str[0].length;
				prev = "comment";
			}
			else {
				console.log("error at exclamation");
				break;
			}
		}
		// [2] SINGLE OR DOUBLE QUOTATION MARK
		// (2-1) a character constant
		else if ( cur.match(/['"]/) ) {
			// CHARACTER CONSTANT
			str = re_string.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				console.log("found character: " + str[1]);
				addElement(i,  "character", str[1] );
				i += str[0].length;
				prev = "character";
			}
			else {
				console.log("error at quotation");
				break;
			}
		}
		// [3] SLASH
		// (3-1) the end of a group
		else if( cur.match(/\//) ){
			// GROUP END
			if ( prev == "object" ) {
				console.log("found null #1");
				addElement(i-1, "null", "");
			}
			addElement(i, "group", "end");
			console.log("found group: end");
			i++;
			prev = "group_end";
		}
		// [4] DOLLAR MARK OR AMPERSAND
		// (4-1) the start or the end of a group
		else if( cur.match(/[$&]/) ){
			// GROUP
			str = re_group.exec(curstr);
			if ( str && ( str.index == 0 ) ) {
				if ( str[1].match(/^end$/i) ) {
					if ( prev == "object" ) {
						console.log("found null #2");
						addElement(i-1, "null", "");
					}
					prev = "group_end";
				}
				else {
					prev = "group_start";
				}
				console.log("found group: " + str[1]);
				addElement(i, "group", str[1]);
				i += str[0].length;				
			}
			else {
				console.log("error at ampersand");
				break;
			}
		}
		// [5] PERIOD
		// (5-1) a logical constant
		// (5-2) a real constant
		else if ( cur.match(/\./) ) {				
			// LOGICAL CONSTANT
			str = re_logical_p.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				console.log("found logical: " + str[1]);
				addElement(i,  "logical", str[1] );
				i += str[0].length;
				prev = "logical";				
			}
			else {				
				// REAL			
				str = re_real.exec(curstr);
				if( str && ( str.index == 0 ) ) {
					console.log("found real: " + str[1]);
					addElement(i, "real", str[1]);
					i += str[0].length;
					prev = "real";											
				}
				else {
					console.log("error at period");
					break;
				}
			}
		} 
		// [6] ALPHABET OR UNDERSCORE
		// (6-1) an object
		// (6-2) an array
		// (6-3) a logical constant
		// (6-4) a nondelimited character constant
		
		else if( cur.match(/[[a-zA-Z_]/) ){
			if( prev == "group_end" || prev == "initial" ) {
				str = re_orphan.exec(curstr);
				if( str && ( str.index == 0 ) ) {
					console.log("found orphan: " + str[0]);
					addElement(i, "orphan", str[0]);
					i += str[0].length;
					prev = "orphan";
				}
			}
			else
			{
				// OBJECT
				str = re_object.exec(curstr);
				if( str && ( str.index == 0 ) ) {
					if ( prev == "object" ) {
						addElement(i-1, "null", "");
						console.log("found null #3");
					}
					console.log("found object: " + str[1]);
					addElement(i, "object", str[1]);
					i += str[0].length;
					prev = "object";
				}
				else
				{
					// ARRAY
					str = re_array.exec(curstr);
					if( str && ( str.index == 0 ) ) {
						console.log("found array: " + str[1] + " index: " + str[2]);
						addElement(i, "array", str[1], str[2]);
						i += str[0].length;
						prev = "array";
					}
					else
					{				
						// LOGICAL CONSTANT
						str = re_logical_c.exec(curstr);
						if ( str && ( str.index == 0 ) ) {
							console.log("found logical: " + str[1]);
							addElement(i, "logical", str[1]);
							i += str[0].length;
							prev = "logical";
						}
						else {				
							// NONDELIMITED CHARACTER CONSTANT
							str = re_nondelimited_c.exec(curstr);
							if( str && ( str.index == 0 ) ) {
								console.log("found nondelimited: " + str[1]);
								addElement(i, "nondelimited", str[1]);
								i += str[0].length;
								prev = "nondelimited";
							}
							else
							{
								console.log("found unknown");
								addElement(i, "unknown",null);
								i++;
							}
						}
					}
				}
			}
		}
		// [7] LEFT PARENTHESIS
		// (7-1) the start of a complex number
		else if( cur.match(/\(/) ) {
			str = re_complex_start.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				// COMPLEX START
				console.log("found complex start");
				addElement(i,"complex","start");
				i += str[0].length;
				prev = "complex_start";
			}
			else {
				console.log("error at complex start");
				break;
			}
		}
		// [8] RIGHT PARENTHESIS
		// (8-1) the end of a complex number
		else if( cur.match(/\)/) ) {
			str = re_complex_end.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				// COMPLEX END
				console.log("found complex end");
				addElement(i, "complex", "end");
				i += str[0].length;
				prev = "complex_end";
			}
			else {
				console.log("error at complex end");
				break;
			}
		}
		// [9] PLUS OR MINUS SIGN
		// (9-1) a real constant
		// (9-2) an integer constant
		else if( cur.match(/[\+\-]/) ) {
			str = re_real.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				// REAL
				console.log("found real: " + str[1]);
				addElement(i, "real", str[1]);
				i += str[0].length;
				prev = "real";
			}
			else {
				str = re_integer.exec(curstr);
				if( str && ( str.index == 0 ) ) {
					// INTEGER
					console.log("found integer: " + str[1]);
					addElement(i, "integer", str[1]);
					i += str[0].length;
					prev = "integer";
				}
				else {
					console.log("error at +-.");
					break;
				}
			}
		}
		// [10] DECIMAL
		// (10-1) a nondelimited character constant
		// (10-2) a repetition
		// (10-3) a real constant
		// (10-4) an integer constant
		else if( cur.match(/[\d]/) ) {			
			str = re_repeat.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				// REPEAT
				console.log("found repeat: " + str[1]);
				addElement(i, "repeat", str[1]);
				i += str[0].length;
				prev = "repeat";
			}			
			else {	
				str = re_real.exec(curstr);
				if( str && ( str.index == 0 ) ) {
					// REAL
					console.log("found real: " + str[1]);
					addElement(i, "real", str[1]);
					i += str[0].length;
					prev = "real";
				}
				else {
					str = re_integer.exec(curstr);
					if( str && ( str.index == 0 ) ) {
						// INTEGER
						console.log("found integer: " + str[1]);
						addElement(i, "integer", str[1]);
						i += str[0].length;
						prev = "integer";
					}
					else {
						str = re_nondelimited_d.exec(curstr);
						if( str && ( str.index == 0 ) ) {
							// NONDELIMITED CHARACTER CONSTANT
							console.log("found nondelimited: " + str[1]);
							addElement(i, "nondelimited", str[1]);
							i += str[0].length;
							prev = "nondelimited";
						}
						else {
							console.log("error at digit");
							break;
						}
					}				
				}
			}
		}
		// [11] BLANK OR CONSECUTIVE COMMAS
		// (11-1) null
		else {
			// NULL
			str = re_null.exec(curstr);
			if( str && ( str.index == 0 ) ) {
				console.log("found null #4");
				addElement(i, "null", "");
				i += str[0].length;
				prev = "null";
			}
			else {
				i++;
			}
		}
	}
	return tokens;
}

function indent( n ) {
	var str = "";
	for ( var i = 0; i < n; i++ ) {
		str += "  ";
	}
	return str;
}

/*
 * Transform namelist tokens to XML
 */
function tokensToXml( tokens ) {
	var xmlString = "";
	var prev = null;
	var ind = 0;
	
	xmlString += "<namelist>\n";
	ind++;
	
	for ( var i = 0; i < tokens.length; i++ ) {
		var name = tokens[i].name;
		var value = tokens[i].value;
		var index = tokens[i].index;
		var pos = tokens[i].pos;
		
		if ( name == "orphan" ) {
			xmlString += indent(ind) + "<orphan>\n" + value + "\n" + indent(ind) + "</orphan>\n";
		}
		else if ( name == "group" ) {
			if ( !value.match(/^end$/i) ) {
				xmlString += indent(ind) + "<group name=\"" + value + "\">\n";
				ind++;
			}
			else {
				ind--;
				xmlString += indent(ind) + "</object>\n"
				ind--;
				xmlString += indent(ind) + "</group>\n";
			}
		}
		else if ( name == "object" ) {
			if ( prev != "group" && prev != "comment" ) {
				ind--;
				xmlString += indent(ind) + "</object>\n";
			}
			xmlString += indent(ind) +"<object name=\"" + value + "\">\n";
			ind++;
		}
		else if ( name == "array" ) {
			if ( prev != "group" ) {
				ind--;
				xmlString += indent(ind) + "</object>\n";
			}
			xmlString += indent(ind) +"<object name=\"" + value 
				+ "\" index=\"" + index +  "\">\n";
			ind++;
			name = "object";
		}
		else if ( name == "repeat" ) {
			xmlString += indent(ind) + "<repeat times=\"" + value + "\">\n";
			ind++;
		}
		else if ( name == "comment" ) {
			// Wrap comment in quotes to prevent decoding XML escaping characters
			xmlString += indent(ind) + "<comment>" + escapeSpecial( '"' + value + '"' ) + "</comment>\n";
		}
		else if ( name == "complex" ) {
			if ( value == "start" ) {
				xmlString += indent(ind) + "<complex>\n";
				ind++;
			}
			else {
				ind--;
				xmlString += indent(ind) + "</complex>\n";
				if ( ind == 4 ) {
					ind--;
					xmlString += indent(ind) + "</repeat>\n";
				}
			}
		}
		else {
			if ( name == "character" || name == "nondelimited" ) {
				xmlString += indent(ind) + "<value type=\"" + name + "\">" 
				+ escapeSpecial(value) + "</value>\n";
			}
			else {
				xmlString += indent(ind) + "<value type=\"" + name + "\">" 
				+ value + "</value>\n";
			}
			
			if ( prev == "repeat" ) {
				ind--;
				xmlString += indent(ind) + "</repeat>\n";
			}
			
		}
		if ( name != "comment" ) {
			prev = name;
		}
	}
	ind--;
	xmlString += "</namelist>";
	return xmlString;
}