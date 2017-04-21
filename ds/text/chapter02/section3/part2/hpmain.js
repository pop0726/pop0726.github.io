//--Global declaration
var gxmlDoc = null;
var garrLayoutParts = new Array();
var arrParts = new Array("HPFrameHL", "HPFrameDL","HPFrameML");
var blnIE5    = false;
var blnBorder = false;
var blnTrack  = false;
var blnDebug  = false;
var blnMoved  = false;

var userAgent = navigator.userAgent;
var MSIEIndex = userAgent.indexOf("MSIE");
if (userAgent.indexOf("Win")  != -1 &&
	userAgent.indexOf("MSIE") != -1 &&
	userAgent.substring((MSIEIndex + 5),(MSIEIndex + 6)) > 4)
{
	blnIE5 = true;
}

//--Object declaration
function objPart(strPartName, strState, strOrder)
{
	this.name	= strPartName;
	this.state	= strState;
	this.order	= strOrder;
}

function loadPage(nthTrack,nthBorder)
{
	var sFile = new String(window.document.location);
	var blnDefault = (sFile.toLowerCase().indexOf("morenews") == -1);

	blnDebug = (QueryString('dbg') != "");
	var s = QueryString("border");
	if (s != "") nthBorder = parseInt(s);
	s = QueryString("track");
	if (s != "") nthTrack = parseInt(s);

	//--Determine whether to track.
	if (nthTrack > 0)
	{
		var td = new Date();
		var xval = 67890;
		var yval = ((Math.round(Math.abs(Math.cos(td.getTime()))*xval)%xval));
		if ((yval % nthTrack) == 0)
			blnTrack = true;
	}

	if (blnIE5)
	{
		if (blnDefault)
		{  
			for (var i = 0; i < arrParts.length; i++)
				garrLayoutParts[i] = new objPart(arrParts[i], "EXPAND", i);

			//--Initialize part display state
			RearrangePartPos();
			loadSavedShowHide();

			//--Initialize mouse even handlers
			window.document.onmousedown = Document_OnMouseDown;
			window.document.onmousemove = Document_OnMouseMove;
			window.document.onmouseup   = Document_OnMouseUp;

			//--Determine whether to show border.
			if (nthBorder > 0)
			{
				var td = new Date();
				var xval = 12345;
				var yval = ((Math.round(Math.abs(Math.cos(td.getTime()))*xval)%xval));
				if ((yval % nthBorder) == 0)
				{
					blnBorder = true;
					document.all("HPFrameHLContent").style.borderColor = "#cccccc";
					document.all("HPFrameDLContent").style.borderColor = "#cccccc";
					document.all("HPFrameMLContent").style.borderColor = "#cccccc";
				}
			}
		}
	}
	else
	{
		//--Enable collapse/expand for IE4+
		if (blnDefault &&
		    userAgent.indexOf("MSIE") != -1 &&
		    userAgent.substring((MSIEIndex + 5),(MSIEIndex + 6)) > 3)
		{
			document.all('HPFrameHLTab3').src = "../../../../images/html/collapse.gif";
			document.all('HPFrameDLTab3').src = "../../../../images/html/collapse.gif";
			document.all('HPFrameMLTab3').src = "../../../../images/html/collapse.gif";
		}
	}
}

function saveState()
{
	var udoLayout = document.all("oLayout");

	for (var i = 0; i < garrLayoutParts.length; i++)
		udoLayout.setAttribute(garrLayoutParts[i].name, (garrLayoutParts[i].state + "," + garrLayoutParts[i].order));
	
	//udoLayout.save("HPLayoutStore");
}

function loadSavedShowHide()
{
	var udoLayout = document.all("oLayout");
	if (!udoLayout)
		return;

	udoLayout.load("HPLayoutStore");
		
	for (var i = 0; i < garrLayoutParts.length; i++)
	{
		var strAttr = udoLayout.getAttribute(garrLayoutParts[i].name);
		if (strAttr)
		{
			var strstate = strAttr.split(',')[0];
			if (strstate)
			{
				if (strstate == "EXPAND")
					showHideContent(garrLayoutParts[i].name, true);
				else if (strstate == "COLLAPSE")
					showHideContent(garrLayoutParts[i].name, false);
			}
		}
	}
}

function showHideContent(id,bOn)
{
	
	var bMO = false;
	var oContent = document.all.item(id+"Content");
	var oImage   = document.all.item(id+"Tab3");
	if (!oContent || !oImage) return;

	if (event.srcElement)
	{
		bMO = (event.srcElement.src.toLowerCase().indexOf("_mo.gif") != -1);
		bOn = (oContent.style.display.toLowerCase() == "none");
	}

	if (bOn == false)
	{
		oContent.style.display = "";
		oImage.src = "../../../../images/html/expand" + (bMO? "_mo.gif" : ".gif");
	}
	else
	{
		oContent.style.display = "none";
		oImage.src = "../../../../images/html/collapse" + (bMO? "_mo.gif" : ".gif");
	}

	for (var i = 0; i < garrLayoutParts.length; i++)
	{
		if (id == garrLayoutParts[i].name)
			garrLayoutParts[i].state = bOn ? "EXPAND" : "COLLAPSE";
	}

	if (event.srcElement)
		saveState();
		MM_showHideLayers(id+'Content','','show');
}

function setBorder(id,bOn)
{
	var oTab    = document.all.item(id+"Tab");
	var oTab1   = document.all.item(id+"Tab1");
	var oTab2   = document.all.item(id+"Tab2");
	var oTab3   = document.all.item(id+"Tab3");
	var oBorder = document.all.item(id+"Content");

	if (!oTab || !oTab1 || !oTab2 || !oTab3 || !oBorder) 
		return;

	if (bOn)
	{
		
		oTab.bgColor = "#3366CC";
		oTab2.color  = "#F3F3F3";
		if (oBorder.style.display == "none")
			oTab3.src = "../../../../images/html/expand_mo.gif";
		else
			oTab3.src = "../../../../images/html/collapse_mo.gif";
	}
	else
	{
		
		oTab.bgColor = "#CCCCCC";
		oTab2.color  = "#f3f3f3";
		if (oBorder.style.display == "none")
			oTab3.src = "../../../../images/html/expand.gif";
		else
			oTab3.src = "../../../../images/html/collapse.gif";
	}
}

function trackInfoForm(param)
{
	if (blnTrack)
	{
		var sUrl = "#";
		
		if (blnDebug) alert(sUrl);

//		TrackForm.sPage.value = param;
//		TrackForm.action = sUrl;
//		TrackForm.submit();
	}
}

//-----------------------------------------------
var partMover = null;
var isPosition = false;
var orgTop;
var orgLeft;
var frmholder = null;
var zoneLeft = -1;
var zoneTop = -1;
var m_zoneElement = null;

function Document_OnMouseUp()
{
	if (!partMover) return;

	isPosition = false;
	partMover.releaseCapture();
	partMover.style.position = 'static';
	var m_prtSrc = window.event.srcElement;
	if (!CheckXPos(m_zoneElement) || !CheckYPos(m_zoneElement) || !blnMoved)
	{
		trackInfoForm(("HP_WPFound_"+(blnBorder? "BorderOn" : "BorderOff")));
		SetBorderOff();
		return;
	}

	PartSwap();
	saveState();
	blnMoved = false;
	trackInfoForm(("HP_WPSwap_"+(blnBorder? "BorderOn" : "BorderOff")));

	SetBorderOff();
	
	event.cancelBubble = true;
}

function RearrangePartPos()
{
	m_zoneElement = document.all.item("DashZoneRight");

	if (m_zoneElement)
	{
		var udoLayout = m_zoneElement.document.all("oLayout");

		if (!udoLayout)
			return false;

		udoLayout.load("HPLayoutStore");
	
		for (var i = 0; i < garrLayoutParts.length; i++)
		{
			var strAttr = udoLayout.getAttribute(garrLayoutParts[i].name);
	
			if (strAttr)
			{
				var strorder = strAttr.split(',')[1];	
				if (strorder)
				{
					if (strorder != garrLayoutParts[i].order)
					{
						PartSwap();	
						return true;
					}
				}
			}
		}
	}
	return true;
}

function PartSwap()
{
	var oPart= null;
	var oPartHolder = null;
	var oPartSpacer = null;
	var strOriginalLabel = "";
	var strReplacingLabel = "";

	outerloop:
	for (var i=0; i < m_zoneElement.children.length; i++)
	{  
		innerloop:
		for (var j=0; j < arrParts.length; j++)
		{
			var holderDiv = m_zoneElement.all.item(arrParts[j] + "Holder");
			strOriginalLabel = arrParts[j];
			var replacingDiv = null;
			if (j==0) 
			{
				replacingDiv = m_zoneElement.all.item(arrParts[j+1] + "Holder");
				strReplacingLabel = arrParts[j+1];
			}
			else
			{
				replacingDiv = m_zoneElement.all.item(arrParts[0] + "Holder");
				strReplacingLabel = arrParts[0];
			}
			
			if (holderDiv)
			{	
				if (m_zoneElement.children.item(i).id == holderDiv.id)
				{   
					var holdernext = holderDiv.nextSibling;
					var replacingnext = replacingDiv.nextSibling;
					var holdernextnext = holdernext.nextSibling;
					var replacingnextnext = replacingnext.nextSibling;

					oPartHolder = m_zoneElement.replaceChild(
											replacingDiv, holderDiv);

					oPart = m_zoneElement.replaceChild(
											replacingnext, holdernext);
											
					oPartSpacer = m_zoneElement.replaceChild(
											replacingnextnext, holdernextnext);
					break outerloop;
				}
			}
		}
	} 

	m_zoneElement.appendChild(oPartHolder);
	m_zoneElement.appendChild(oPart);
	m_zoneElement.appendChild(oPartSpacer);

	for (var i = 0; i < garrLayoutParts.length; i++)
	{
		if (strReplacingLabel == garrLayoutParts[i].name)
			garrLayoutParts[i].order = "0";
		if (strOriginalLabel == garrLayoutParts[i].name)
			garrLayoutParts[i].order = "1";
	}
}

function CheckXPos(obj)
{
	if ((partMover.style.pixelLeft + partMover.offsetWidth) < zoneLeft)
		return false;

	if (partMover.style.pixelLeft > (zoneLeft + obj.offsetWidth))
		return false;

	return true;
}

function CheckYPos(obj)
{
	var movingpart = null;
	var part = null;
	var partLeft = -1;
	var partTop = -1;

	for (var k = 0; k < arrParts.length; k++)
	{
		movingpart = partMover.all.item(arrParts[k]);

		if (movingpart)
		{
			for(var j = 0; j < arrParts.length; j++)
			{
				part = obj.all.item(arrParts[j]);

				if (part && (part != movingpart))
				{	
					partTop = GetAbsoluteTop(part);
					if ((partMover.style.pixelTop + 2*partMover.offsetHeight) < partTop)
						return false;

					if (partMover.style.pixelTop > (partTop + part.offsetHeight))
						return false;
				}
			}

			break;
		}	
	}
	return true;
}

function SetBorderOff()
{
	for (var i = 0; i < arrParts.length; i++)
	{
		var frm = partMover.all.item(arrParts[i]);
		if (frm)
		{
			setBorder(arrParts[i],false);
			break;
		}
	}

	frmholder.style.display = "none";
	frmholder.style.height = 0;
}

function Document_OnMouseDown()
{	
	//--Reinitialize partMover variable
	partMover = null;

	var m_prtSrc = window.event.srcElement;
	var tagName = event.srcElement.tagName.toUpperCase();
	if (tagName == "IMG" || tagName == "A")
		return;

	var m_tabElement = TraverseToClassName(m_prtSrc, "HPFrameTab");
	if (!m_tabElement)
		return;

	var m_classElement = TraverseToClassName(m_prtSrc, "divMoveClass");
	if (m_classElement == null)
		return;

	var strFrame = null;
	partMover = m_classElement;
	for (var i = 0; i < arrParts.length; i++)
	{
		var divPart = partMover.all.item(arrParts[i]);
		if (divPart)
		{
			strFrame = divPart.id;
			break;
		}
	}
	
	m_zoneElement = TraverseToClassName(m_prtSrc, "DashZoneRight");
	
	if ((zoneLeft == -1) || (zoneTop == -1))
	{
		zoneLeft = GetAbsoluteLeft(m_zoneElement);
		zoneTop = GetAbsoluteTop(m_zoneElement);
	}

	frmholder =  m_zoneElement.all.item(strFrame + "Holder"); 
	frmholder.style.height = partMover.offsetHeight;
	frmholder.style.display = "inline";
	
	partMover.style.position = 'absolute';
	partMover.style.width = partMover.offsetWidth;
	partMover.style.pixelLeft = event.x;
	partMover.style.pixelTop = event.y;
	
	orgLeft = partMover.style.pixelLeft;
	orgTop = partMover.style.pixelTop;
	partMover.style.display = "block";

	event.cancelBubble = true;
    isPosition = true;
    partMover.setCapture();
}

function Document_OnMouseMove()
{
		if(!isPosition || !partMover)
			return;

		partMover.style.pixelLeft = event.x;
		partMover.style.pixelTop = event.y;
		event.cancelBubble = true;
		blnMoved = true;
}

function TraverseToClassName(srcElement,ClassName)
{
	while(srcElement.className != ClassName)
	{
		srcElement = srcElement.parentElement;
		if (srcElement == null)
			return null;
	}
	return srcElement;
}

function GetAbsoluteTop(elem)
{
	var topPosition = 0;

	while (elem)
	{
		if (elem.tagName == 'BODY')
		{
			break;
		}
		topPosition += elem.offsetTop;
		elem = elem.offsetParent;
	}
	return topPosition;
}

function GetAbsoluteLeft(elem)
{
	var leftPosition = 0;

	while (elem)
	{
		if (elem.tagName == 'BODY')
		{
			break;
		}
		leftPosition += elem.offsetLeft;
		elem = elem.offsetParent;
	}

	return leftPosition;
}

function QueryString(sName)
{	
	var sSource = String(window.document.location);
	var sReturn = "";
	var sQUS = "?";
	var sAMP = "&";
	var sEQ = "=";
	var iPos;
	
	iPos = sSource.indexOf(sQUS);

	var strQuery = sSource.substr(iPos, sSource.length - iPos);
	var strLCQuery = strQuery.toLowerCase();
	var strLCName = sName.toLowerCase();
	
	iPos = strLCQuery.indexOf(sQUS + strLCName + sEQ);
	if (iPos == -1)
	{
		iPos = strLCQuery.indexOf(sAMP + strLCName + sEQ);
		if (iPos == -1)
			return "";
	}

	sReturn = strQuery.substr(iPos + sName.length + 2, 
			  strQuery.length-(iPos + sName.length + 2));
			   
	var iPosAMP = sReturn.indexOf(sAMP);
	
	if (iPosAMP == -1)
		return sReturn;
	else
	{
		sReturn = sReturn.substr(0, iPosAMP);
	}			
	
	return sReturn;
}


function MM_findObj(n, d) { //v4.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function MM_showHideLayers() { //v3.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v='hide')?'hidden':v; }
    obj.visibility=v; }
}