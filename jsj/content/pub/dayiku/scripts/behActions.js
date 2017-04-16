// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

function MM_callJS(jsStr) { //v2.0
  return eval(jsStr)
}
function MM_changeProp(objName,x,theProp,theValue) { //v3.0
  var obj = MM_findObj(objName);
  if (obj && (theProp.indexOf("style.")==-1 || obj.style)) eval("obj."+theProp+"='"+theValue+"'");
}
function MM_checkBrowser(NSvers,NSpass,NSnoPass,IEvers,IEpass,IEnoPass,OBpass,URL,altURL) { //v3.0
  var newURL='', verStr=navigator.appVersion, app=navigator.appName, version = parseFloat(verStr);
  if (app.indexOf('Netscape') != -1) {
    if (version >= NSvers) {if (NSpass>0) newURL=(NSpass==1)?URL:altURL;}
    else {if (NSnoPass>0) newURL=(NSnoPass==1)?URL:altURL;}
  } else if (app.indexOf('Microsoft') != -1) {
    if (version >= IEvers || verStr.indexOf(IEvers) != -1)
     {if (IEpass>0) newURL=(IEpass==1)?URL:altURL;}
    else {if (IEnoPass>0) newURL=(IEnoPass==1)?URL:altURL;}
  } else if (OBpass>0) newURL=(OBpass==1)?URL:altURL;
  if (newURL) { window.location=unescape(newURL); document.MM_returnValue=false; }
}
function MM_checkPlugin(plgIn, theURL, altURL, IEGoesToURL) { //v3.0
  with (navigator) if ((plugins && plugins[plgIn]) || (appName.indexOf('Microsoft') != -1 && 
    (IEGoesToURL? (appVersion.indexOf('Mac') == -1 && appVersion.indexOf('3.1') == -1) :
    ((plgIn.indexOf("Flash")!=-1 && window.MM_flash) || (plgIn.indexOf("Director")!=-1 && window.MM_dir))))) {
     if (theURL.length>2) window.location = theURL;
  } else if (altURL.length>2) window.location = altURL; document.MM_returnValue = false;
}
function MM_controlShockwave(objStr,x,cmdName,frameNum) { //v3.0
  var obj=MM_findObj(objStr);
  if (!obj) obj=MM_findObj(x);
  if (obj) eval('obj.'+cmdName+'('+((cmdName=='GotoFrame')?frameNum:'')+')');
}
function MM_controlSound(x, _sndObj, sndFile) { //v3.0
  var i, method = "", sndObj = eval(_sndObj);
  if (sndObj != null) {
    if (navigator.appName == 'Netscape') method = "play";
    else {
      if (window.MM_WMP == null) {
        window.MM_WMP = false;
        for(i in sndObj) if (i == "ActiveMovie") {
          window.MM_WMP = true; break; 
      } }
      if (window.MM_WMP) method = "play";
      else if (sndObj.FileName) method = "run";
  } }
  if (method) eval(_sndObj+"."+method+"()");
  else window.location = sndFile; 
}
function MM_displayStatusMsg(msgStr) { //v1.0
  status=msgStr;
  document.MM_returnValue = true;
}
function MM_findObj(r, d) { //v3.0  special CourseBuilder version of findObj
  var p,n,i,x;  if (!d) d=document; n=r.substring(r.lastIndexOf(".")+1);
  if (n.indexOf("layers[")==0) n=n.substring(8,n.length-2);
  if (parent.frames.length) { if (r.indexOf(".frames[")==6) d=eval(r.substring(0,r.indexOf("]")+10));
    if ((p=r.indexOf("?"))!=-1) {n=r.substring(0,p); d=parent.frames[r.substring(p+1)].document;} }
  if (!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for (i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document); return x;
}
function MM_goToURL() { //v3.0
  var i, args=MM_goToURL.arguments; document.MM_returnValue = false;
  for (i=0; i<(args.length-1); i+=2) eval(args[i]+".location='"+args[i+1]+"'");
}
function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}
function MM_popupMsg(msg) { //v1.0
  alert(msg);
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}
function MM_setTextOfFrame(frameRef,newHTML,preserveBg) { //v2.0
  var bodyAttr="", frameObj=eval(frameRef);
  if (frameObj) with (frameObj.document) { //if frame found
    if (preserveBg) bodyAttr = " BGCOLOR='"+bgColor+"' TEXT='"+fgColor+"'";
    write("<HTML><BODY"+bodyAttr+">"+unescape(newHTML)+"</BODY></HTML>");
    close();
  }
}
function MM_setTextOfLayer(objName,x,newText) { //v3.0
  if ((obj=MM_findObj(objName))!=null) with (obj)
    if (navigator.appName=='Netscape') {document.write(unescape(newText)); document.close();}
    else innerHTML = unescape(newText);
}
function MM_setTextOfTextfield(objName,x,newText) { //v3.0
  var obj = MM_findObj(objName); if (obj) obj.value = newText;
}
function MM_showHideLayers() { //v3.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v='hide')?'hidden':v; }
    obj.visibility=v; }
}
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
function MM_validateForm() { //v3.0
  var i,p,q,nm,test,num,min,max,errors='',args=MM_validateForm.arguments;
  for (i=0; i<(args.length-2); i+=3) { test=args[i+2]; val=MM_findObj(args[i]); 
    if (val) { nm=val.name; if ((val=val.value)!="") {
      if (test.indexOf('isEmail')!=-1) { p=val.indexOf('@');
        if (p<1 || p==(val.length-1)) errors+='- '+nm+' must contain an e-mail address.\n';
      } else if (test!='R') { num = parseFloat(val);
        if (val!=''+num) errors+='- '+nm+' must contain a number.\n';
        if (test.indexOf('inRange') != -1) { p=test.indexOf(':');
          min=test.substring(8,p); max=test.substring(p+1);
          if (num<min || max<num) errors+='- '+nm+' must contain a number between '+min+' and '+max+'.\n';
    } } } else if (test.charAt(0) == 'R') errors += '- '+nm+' is required.\n'; }
  } if (errors) alert('The following error(s) occurred:\n'+errors);
  document.MM_returnValue = (errors == '');
}