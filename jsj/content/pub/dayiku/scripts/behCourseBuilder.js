// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

var MSG_notracking = "Tracking system not found";
function MM_cmiCheckInstall(win) {
  // Done since NS blows away window variables on resize
  if (win==null) win = window;
  if (win) {
    if (window.CMIIsPresent == null) {
      if (findcmiframe != null) {
        var frm = findcmiframe(null);
        if (frm != null) frm.installcmi(win);
        else if (installcmi != null) {
          installcmi(win);
          cmiinit(win);
      } }
      if (win.CMIInitialize != null) win.CMIInitialize();
  } }
  return (win.CMIIsPresent != null);
}
function MM_cmiSendInteractionInfo(date, time, intid, objid, intrtype, correct, student, result, weight, latency) { //v1.22
  var aDt= new Date();
  var curHr=aDt.getHours()+'', curMin=aDt.getMinutes()+'', curSec=aDt.getSeconds()+'';
  var curDay=aDt.getDate()+'', curMonth=aDt.getMonth()+1+'', curYear=aDt.getYear(), dmy;

  if (curYear < 1900) curYear += 1900;
  if (curDay.toString().length==1) curDay = '0'+curDay;
  if (curMonth.toString().length==1) curMonth = '0'+curMonth;
  if (curHr.toString().length==1) curHr = '0'+curHr;
  if (curMin.toString().length==1) curMin = '0'+curMin;
  if (curSec.toString().length==1) curSec = '0'+curSec;
  tim=curHr+":"+curMin+":"+curSec;
  dmy=curDay+"/"+curMonth+"/"+curYear;
  if (date=='') date=dmy;
  if (time=='') time=tim;

  if (MM_cmiCheckInstall(window)) {
    if (CMIIsPresent()) {
      CMIAddInteraction(date, time, intid, objid, intrtype, correct, student, result, weight, latency);
      return;
  } }
}
function MM_cmiSendObjectiveInfo(theInt, index, objid, score, status) { //v1.22
  if (MM_cmiCheckInstall(window)) {
    if (CMIIsPresent()) {
      if (theInt) {
        objid = eval(theInt+".trackObjectiveId");
        score = eval(theInt+".score");
      }
      CMISetObj(index, objid, score, status, '', '', '', '');
      return;
  } }
}
function MM_cmiSendScore(theInt, theScore) { //v1.22
  if (MM_cmiCheckInstall(window)) {
    if (CMIIsPresent()) {
      if (theInt) theScore = eval(theInt+'.score');
      CMISetScore(theScore);
      return;
  } }
}
function MM_cmiSetLessonStatus(theStatus) { //v1.22
  if (MM_cmiCheckInstall(window)) {
    if (CMIIsPresent()) {
      CMISetStatus(theStatus);
      return;
  } }
}
function MM_cmiSetTime(theInt, theSeconds) { //v1.22
  if (MM_cmiCheckInstall(window)) {
    if (CMIIsPresent()) {
      if (theInt) theSeconds = eval(theInt+'.getTime()');
      CMISetTime(theSeconds);
      return;
  } }
}
function MM_judgeInt(intId) { //v1.0
  eval(intId+".judge()");
}
function MM_resetInt(intId,method,item) { //v1.0
  if (item!=null && item)
    if (method=="resetElems") {method="e['"+item+"'].reset"; item=""}
    else item = "'"+item+"'";
  else item="";
  eval(intId+"."+method+"("+item+")");
}
function MM_setIntProps(jsStr) { //v1.0
  eval(jsStr);
}
function MM_initInteractions() { //v1.0
  if (window.MM_initIntFns) {eval(window.MM_initIntFns); window.MM_initIntFns = '';}
}
