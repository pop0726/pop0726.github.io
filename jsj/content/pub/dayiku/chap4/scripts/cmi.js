// Copyright 1998 Macromedia, Inc. All rights reserved.

var MM_SID="", MM_TURL="", MM_CMIDOC="", aicd = "aicc_data", co = "[core]", ls="Lesson_Status", cmnd="command", cmdArray;
var IE3 = ((navigator.appName.indexOf("Microsoft") != -1) && (parseFloat(navigator.appVersion) < 3));
if (window.cmdQueue == null)
  window.cmdQueue = new CmdQueue()

function CmdQueue() {
  this.cmd = new Array();
  this.cmdData = new Array();
  this.sIDs = new Array();
  this.qLen = 0;  
  this.latency = (navigator.appName.indexOf('Microsoft') != -1)?1250:1000;
  this.addCmd = cmdQAddCmd;
  this.delCmd = cmdQDelCmd;  
}

function cmdQAddCmd(command, sid, cmddata) {
  this.cmd[this.qLen] = command;
  this.sIDs[this.qLen] = sid;
  this.cmdData[this.qLen] = cmddata;
  this.qLen++;
  if (this.qLen == 1) { 
    if (!IE3 && (window.CmdSubmit == null))
      window.CmdSubmit = CmdSubmit; 
    setTimeout("CmdSubmit()", this.latency); 
  }
}

function cmdQDelCmd() {
  var i, len;
  if (this.qLen == 0) return;
  else if (this.qLen == 1)
    this.cmd.length = this.sIDs.length = this.cmdData.length = 0;
  else {
    for (i=1, len=this.qLen; i<len; i++) {
      this.cmd[i-1] = this.cmd[i];
      this.sIDs[i-1] = this.sIDs[i];
      this.cmdData[i-1] = this.cmdData[i];
    }
    this.cmd.length = this.sIDs.length = this.cmdData.length = this.qLen - 1;
  }
  this.qLen--;
}

function CmdSubmit() {
    document.command.elements[cmnd].value = cmdQueue.cmd[0];
    document.command.elements[aicd].value = cmdQueue.cmdData[0];
    document.command.elements["session_id"].value = cmdQueue.sIDs[0];
    document.command.submit();
    cmdQueue.delCmd();
    if (cmdQueue.qLen >= 1) {
      if (!IE3) window.CmdSubmit = CmdSubmit;
      setTimeout("CmdSubmit()", cmdQueue.latency);
    }
}

function MM_SGet() {document.command.elements["command"].value = "getparam";}
function MM_SPut() {document.command.elements["command"].value = "putparam";}
function MM_SPInt() {document.command.elements["command"].value = "putinteractions";}

function MM_SVal(idx, val0, sub) {
  document.command.elements[idx].value=val0;
  if (sub) MM_Sub();
}
function MM_ApndVal(val0) {document.command.elements[aicd].value += '\r\n'+val0;}

function MM_Sub() {
  if (MM_SID.length > 0) {
    var frm = document.command;
    cmdQueue.addCmd(frm.elements[cmnd].value,MM_SID,frm.elements[aicd].value);
  }
}

function MM_CMISetParms(url) {
  var prms="", tmpp;  
  pos=url.indexOf("#")
  if (pos==-1) pos=url.indexOf("?")
  if (pos>-1) prms=url.substring(pos+1,url.length)
  tmpp=prms.toUpperCase()
  if (tmpp.indexOf("AICC-SID")>-1) {
    alert("Lesson Server version incompatible.  Your administrator must upgrade to the latest version.");
    return false;
  }
  if ((pos=tmpp.indexOf("AICC_SID="))>-1) {
    MM_SID=prms.substring(pos+8,prms.length)
    if (MM_SID.indexOf("&")>0)
      MM_SID=unescape(MM_SID.substring(1,MM_SID.indexOf("&")))
  }
  if ((pos=tmpp.indexOf("AICC_URL"))>-1) {
    MM_TURL=prms.substring(pos+9,prms.length)
    if (MM_TURL.indexOf("&")>0)
      MM_TURL=MM_TURL.substring(1,MM_TURL.indexOf("&"))
    MM_TURL=unescape(MM_TURL)
  }
  return (MM_TURL=="" || MM_SID=="")?false:true;  
}

function findcmidocument(win) { 
  if (MM_CMISetParms(win.document.location+"") == false) {
    if (win == window.top) return null
    return findcmidocument(win.parent)
  } else {
    MM_CMIDOC = win.document;
    return win.document;
  }
} 

function cmiinit(win) {
  frm=findcmiframe(null);
  if (frm!=null)
   frm.installcmi(win);
  findcmidocument(win);
  window.CMITURL = MM_TURL;
  return CMIIsPresent();
}

function CMIInitialize() {
  if ((MM_CMIDOC!=null) && (MM_CMIDOC.length!=0)){  
    MM_SVal("session_id",MM_SID);
    retVal = true;
  } else retVal = false;
  return retVal;
}

function CMIIsPresent() {
  return MM_SID.length != 0;
}

function CMIAddInteraction(date, time, intid, objid, intrtype, correct, student, result, weight, latency) {
  MM_SVal("command","putinteractions")
  MM_SVal(aicd,'"date", "time", "interaction_id", "objective_id", "type_interaction", "correct_response", "student_response", "result", "weighting", "latency"\r\n' +
    '"' + date + '", ' +
    '"' + time + '", ' +
    '"' + intid + '", ' +
    '"' + objid + '", ' +
    '"' + intrtype + '", ' +
    '"' + correct + '", ' +
    '"' + student + '", ' +
    '"' + result + '", ' +
    '"' + weight + '", ' +
    '"' + latency+ '"',1);
}

function CMISetCompleted() { CMISetStatus("C"); }

function CMISetData(data) {
  MM_SPut()
  MM_SVal(aicd,"[Core_Lesson]\r\n"+data,1)
}

function CMISetFailed() { CMISetStatus("F"); }

function CMISetLocation(loc) {
  MM_SPut()
  MM_SVal(aicd,co+"\r\nLesson_Location="+loc,1)
}

function CMISetObj(index, id, score, status, started, completed, passed, failed) {
  MM_SPut()
  MM_SVal(aicd,"[Objectives_Status]\r\nJ_ID."+index+"="+id)
  // if objective info isn't there already need to write a not-started flag
  if (status=="")
    MM_ApndVal("J_STATUS."+index+"="+started?'I':completed?'C':passed?'P':'F');
  else 
    MM_ApndVal("J_STATUS."+index+"="+status); 
  MM_ApndVal("J_SCORE."+index+"="+score);
  MM_Sub();
}

function CMISetPassed() { CMISetStatus("P"); }

function CMISetScore(score) { 
  MM_SPut()
  MM_SVal(aicd,co+"\r\nscore="+score,1)
}

function CMISetStarted() { CMISetStatus("I"); }

function CMISetStatus(stat) {
  MM_SPut()
  MM_SVal(aicd,co+"\r\n"+ls+"="+stat,1)
}

function CMISetTime(t) {
  var x=3600;
  var y=60;
  var h=Math.round(t/x - t%x/x)+'';
  var m=Math.round((t-h*x)/y-(t-h*x)%y/y)+'';
  var s=Math.round(t-h*x-m*y)+'';
  if (h.toString().length == 1) h='0'+h;
  if (m.toString().length == 1) m='0'+m;
  if (s.toString().length == 1) s='0'+s;
  MM_SPut()
  MM_SVal(aicd,co+"\r\nTime="+h+":"+m+":"+s,1)
}

function CMISetTimedOut() {
  MM_SPut()
  MM_SVal(aicd,co+"\r\n"+ls+"=incomplete,time-out",1)
}

function installcmi(win) {
  if ((win.CMIInitialize == null) && !IE3) {
    win.CMIInitialize = CMIInitialize;
    win.CMIIsPresent = CMIIsPresent;
    win.CMIAddInteraction =CMIAddInteraction
    win.CMISetCompleted =CMISetCompleted
    win.CMISetData =CMISetData
    win.CMISetFailed =CMISetFailed
    win.CMISetLocation =CMISetLocation
    win.CMISetObj =CMISetObj
    win.CMISetPassed =CMISetPassed
    win.CMISetScore =CMISetScore
    win.CMISetStarted =CMISetStarted
    win.CMISetStatus =CMISetStatus
    win.CMISetTime =CMISetTime
    win.CMISetTimedOut =CMISetTimedOut
    win.CMITURL = MM_TURL
  }
}
