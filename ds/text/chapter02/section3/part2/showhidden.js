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
function hidden(){
document.all('bb').innerHTML="<img border=0 id=HPFrameHLTab3  onClick=MM_showHideLayers('HPFrameHLContent','','hide');show() src=../../../../images/html/collapse.gif style='CURSOR: hand' width=15 height=14>";
}
function show(){
document.all('bb').innerHTML="<img border=0 id=HPFrameHLTab3 onClick=showHideContent('HPFrameHL');hidden(); src=../../../../images/html/expand.gif style='CURSOR: hand' width=15 height=14>";
}
function hiddenL(){
document.all('dd').innerHTML="<img border=0 id=HPFrameDLTab3  onClick=MM_showHideLayers('HPFrameDLContent','','hide');showL() src=../../../../images/html/collapse.gif style='CURSOR: hand' width=15 height=14>";
}
function showL(){
document.all('dd').innerHTML="<img border=0 id=HPFrameDLTab3 onClick=showHideContent('HPFrameDL');hiddenL(); src=../../../../images/html/expand.gif style='CURSOR: hand' width=15 height=14>";
}
function hiddenP(){
document.all('cc').innerHTML="<img border=0 id=HPFrameMLTab3  onClick=MM_showHideLayers('HPFrameMLContent','','hide');showP() src=../../../../images/html/collapse.gif style='CURSOR: hand' width=15 height=14>";
}
function showP(){
document.all('cc').innerHTML="<img border=0 id=HPFrameMLTab3 onClick=showHideContent('HPFrameML');hiddenP(); src=../../../../images/html/expand.gif style='CURSOR: hand' width=15 height=14>";
}