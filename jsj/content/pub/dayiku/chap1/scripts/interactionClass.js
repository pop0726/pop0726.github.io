// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

// Localization strings
var TRACK_system_not_found = "Tracking system not found.";

//Constructs an Interaction
function MM_interaction(theSelf,
               theJudgeOnSel, theAllowMultiSel, theAllThatApply, theUnknownIsCorrect,
               theDisabled, theTriesLimit, theTimeLimit,
               theTrackIntId, theTrackObjectiveId,
               theTrackQType,theTrackWeight, theKTrack) {
  // properties
  this.judgeOnSel = theJudgeOnSel;
  this.allowMultiSel = theAllowMultiSel;
  this.allThatApply = theAllThatApply;
  this.unknownIsCorrect = theUnknownIsCorrect;
  this.disabled = theDisabled;
  this.tries = 0;
  this.triesLimit = (theTriesLimit)?theTriesLimit:0;
  this.triesAtLimit = false;
  this.time = 0;
  this.timeLeft = 0;
  this.timeLimit = (theTimeLimit)?theTimeLimit:0;
  this.timeAtLimit = false;
  this.trackIntId = theTrackIntId;
  this.trackObjectiveId = theTrackObjectiveId;
  this.trackQType = theTrackQType;
  this.trackWeight = theTrackWeight;
  this.knowledgeTrack = theKTrack;
  this.totalElems = 0;
  this.possCorrect = 0;
  this.possIncorrect = 0;
  this.knownResponse = false;
  this.totalCorrect = 0;
  this.totalIncorrect = 0;
  this.correct = false;
  this.score = 0;

  this._self = theSelf;
  this._timeStart = 0;
  this._timerID = 0;
  
  this.browserIsNS = (navigator.appName.indexOf('Netscape') != -1);
  this.browserIsIE = (navigator.appName.indexOf('Microsoft') != -1);
  this.osIsWindows = (navigator.appVersion.indexOf('Win') != -1);
  this.osIsMac = (navigator.appVersion.indexOf('Mac') != -1); // ????
  this.browserVersion = parseFloat(navigator.appVersion);
  
  this.e = new Array();
  this.b = new Array();

  // methods
  this.init = MM_intInit;
  this.reset = MM_intReset;
  this.resetElems = MM_intResetElems;
  this.enable = MM_intEnable;
  this.disable = MM_intDisable;
  this.setDisabled = MM_intSetDisabled;
  this.update = MM_intUpdate;
  this.add = MM_intAdd;
  this.setTries = MM_intSetTries;
  this.setTriesLimit = MM_intSetTriesLimit;
  this.setTime = MM_intSetTime;
  this.setTimeLimit = MM_intSetTimeLimit;
  this.track = MM_intTrack
  this.getTime = MM_intGetTime;

  this.am = MM_intAm;
  this.judge = MM_intJudge;
  this.resetActionMgr = MM_intResetActionMgr;
  this.setSegmNode = MM_intSetSegmNode;
  this.getSegmNode = MM_intGetSegmNode;
  this.setSegmDisabled = MM_intSetSegmDisabled;
  this.getSegmDisabled = MM_intGetSegmDisabled;
}

//Calls the element init funtions if they exist, and then does a reset
function MM_intInit() {
  var i,j,localPC;

  with (this) {
    // init elems, and set totalElems, possCorrect, possIncorrect;
    totalElems = 0;
    possCorrect = 0;
    possIncorrect = 0;
    for (i in e) if (i != 'length') {
      if (e[i].init != null) e[i].init();
      totalElems++;
      localPC = 0;
      for (j in e[i].c) if (j != 'length' && e[i].c[j].isCorrect != null)
        (e[i].c[j].isCorrect) ? localPC++ : possIncorrect++;
      if (e[i]._singleChoice != null && localPC > 1)
        localPC = 1;
      possCorrect += localPC;
    }
    reset();
    if (knowledgeTrack) {
      var frm = findcmiframe(null);
      if (frm == null) {
        installcmi(window); //layers in NS
        if (!CMIIsPresent()) {
          var cmi = cmiinit(window);
          if (cmi) CMIInitialize();
          else if (!window.trackwarning) {
            alert(TRACK_system_not_found);
            window.trackwarning = true;
      } } } 
      else {
        if (window.CMIInitialize == null) frm.installcmi(window);
        if (window.CMIInitialize != null) CMIInitialize();
        if (!CMIIsPresent() && !window.trackwarnings) {
          alert(TRACK_system_not_found);
          window.trackwarning = true;
  } } } }
  window["'"+this._self+"'"] = this._self; //redeclare global on window in case inserted in layer
}

//Called to reset the interaction
function MM_intReset() {
  with (this) {
    tries = 0;
    triesAtLimit = false;
    _timeStart = Math.floor((new Date()).getTime()/1000);
    if (_timerID) clearTimeout(_timerID);
    if (!disabled && timeLimit) _timerID = setTimeout(_self+".judge()",(timeLimit+1)*1000);
    time = 0;
    timeLeft = timeLimit;
    timeAtLimit = false;
  
    resetActionMgr();
    resetElems();
    update(true);
  }
}

//Calls the reset for the individual elements
function MM_intResetElems() {
  with (this) {
    for (var i in e) if (i != 'length')
      if (e[i].reset != null)  e[i].reset();
    update(true);
  }
}

//Enables the interaction
function MM_intEnable() {
  if (this.disabled) with (this) {
    _timeStart = Math.floor((new Date()).getTime()/1000) - time;
    if (timeLimit)
      _timerID = setTimeout(_self+".judge()",Math.max(0,(timeLimit-time)+1)*1000);
    disabled = false;
    update(true);
    for (var i in e) if (i != 'length')
      if (e[i].enable != null)  e[i].enable();
  }
}

//Disables the interaction
function MM_intDisable() {
  if (!this.disabled) with (this) {
    update(true);  // update 'time'
    if (_timerID) clearTimeout(_timerID);  // clear the timer
    disabled = true;
    for (var i in e) if (i != 'length')
      if (e[i].disable != null)  e[i].disable();
  }
}

//Calls the approppriate disable or enable function
function MM_intSetDisabled(theDisabled) {
  if (theDisabled) this.disable();
  else this.enable();
}

//Update the interaction state
// Note: tries will be updated by the judge method, and time will
//       be updated by both this method and the judge method.
function MM_intUpdate(noJudge) {
  if (!this.disabled) with (this) {
    knownResponse = false;
    totalCorrect = 0;
    totalIncorrect = 0;
    correct = false;
    score = 0;
    for (var i in e) if (i != 'length') {
      for (var j in e[i].c) if (j != 'length') {
        if (e[i].c[j].selected) {
          knownResponse = true;
          score += e[i].c[j].score;
          if (e[i].c[j].isCorrect != null)
            (e[i].c[j].isCorrect) ? totalCorrect++ : totalIncorrect++;
    } } }
    if (!knownResponse) correct = unknownIsCorrect;
    else if (totalIncorrect != 0) correct = false;
    else if (totalCorrect == 0) correct = null; // not judged
    else correct = (!allThatApply || totalCorrect >= possCorrect);
  
    time = Math.floor((new Date()).getTime()/1000) - _timeStart;
    if (timeLimit && !timeAtLimit) {
      timeLeft = Math.max(0, timeLimit - time);
      timeAtLimit = (time > timeLimit);
    }
  
    if (judgeOnSel && !noJudge)  judge();
  }
}

function MM_intSetTries(theTries) {
  with (this) {
    tries = theTries;
    triesAtLimit = (triesLimit) ? (tries >= triesLimit) : false;
  }
}

function MM_intSetTriesLimit(theTriesLimit) {
  with (this) {
    triesLimit = theTriesLimit;
    triesAtLimit = (triesLimit) ? (tries >= triesLimit) : false;
  }
}

function MM_intSetTime(theTime) {
  with (this) {
    time = Math.max(0, theTime);
    _timeStart = Math.floor((new Date()).getTime()/1000) - time;
    timeLeft = (timeLimit) ? Math.max(0, timeLimit - time) : timeLimit;
    timeAtLimit = (timeLimit) ? (time > timeLimit) : false;
    if (_timerID) clearTimeout(_timerID);  // clear the timer
    if (!disabled && timeLimit)
      _timerID = setTimeout(_self+".judge()",Math.max(0,(timeLimit-time)+1)*1000);
  }
}

function MM_intSetTimeLimit(theTimeLimit) {
  with (this) {
    if (!disabled)
      time = Math.floor((new Date()).getTime()/1000) - _timeStart;
    timeLimit = theTimeLimit;
    timeLeft = (timeLimit) ? Math.max(0, timeLimit - time) : timeLimit;
    timeAtLimit = (timeLimit) ? (time > timeLimit) : false;
    if (_timerID) clearTimeout(_timerID);  // clear the timer
    if (!disabled && timeLimit)
      _timerID = setTimeout(_self+".judge()",Math.max(0,(timeLimit-time)+1)*1000);
  }
}

function MM_intAdd(theType, A, B, C, D, E, F, G, H, I, J, K, L, M) {
  var theObj = eval("new MM_" + theType + "(" + this._self + ", A, B, C, D, E, F, G, H, I, J, K, L, M)");
  if (theObj._isChoice != null)
    this.e[A].c[B] = theObj;
  else
    this.e[A] = theObj;
}

function MM_intTrack() {
  var  aDt= new Date();
  var curHr=aDt.getHours()+'', curMin=aDt.getMinutes()+'', curSec=aDt.getSeconds()+'';
  var curDay=aDt.getDate()+'', curMonth=aDt.getMonth()+1+'', curYear=aDt.getYear(), dmy;
  var lat = Math.floor(aDt.getTime()/1000) - this._timeStart;
  var x=3600;
  var y=60;
  var hrs=Math.round(lat/x - lat%x/x)+'';
  var min=Math.round((lat-hrs*x)/y-(lat-hrs*x)%y/y)+'';
  var sec=Math.round(lat-hrs*x-min*y)+'';
  var sRes,cRes,res,aName,bName,isC,isNC,isSel,iType;

  if (curYear < 1900) curYear += 1900;
  if (curDay.toString().length==1) curDay = '0'+curDay;
  if (curMonth.toString().length==1) curMonth = '0'+curMonth;
  dmy = curDay+"/"+curMonth+"/"+curYear;
  
  sRes=cRes=res=aName=bName=""

  with (this) {  
    if (trackQType.length==0) return;
    iType=trackQType.charAt(0).toLowerCase();
    if (allThatApply&&possCorrect>1) sRes=cRes='{';
    
    for (var i in e) if (i != 'length') {
      for (var j in e[i].c) if (j != 'length') {
        isC=e[i].c[j].isCorrect;
        isSel=e[i].c[j].selected;
        if (iType=='m') {
          aName=e[i].c[j]._elem._name;
          bName=e[i].c[j]._target._name;
          if (isC) cRes+=aName+'.'+bName+',';
          if (isSel) sRes+=aName+'.'+bName+',';
        }
        else if (iType=='f') {
          aName=e[i].value;
          bName=MM_textDeencrypt(e[i].c[j].expectedValue);
          if (isC) cRes+=bName+',';
          if (isSel) sRes+=aName+',';
        }
        else if ((iType=='c')||(iType=='t')) {
          if (e[i]._trkObj!=null) {
            aName=e[i].c[j].expectedValue;
            x=aName.indexOf(':');
            aName=aName.substring(0,x)+'-'+aName.substring(x+1,aName.length)
            bName=e[i].value
          }
          else if (e[i]._tick!=null) {
            aName=e[i].c[j].expectedValue;
            if (isSel) bName = aName;
          }
          else if (e[i]._stateMask!=null && totalElems==1) {
            aName=e[i].expectedValue;
            bName=e[i].value;
          }
          else
            aName=bName=e[i].c[j]._name;

          if (isC) cRes+=aName+',';
          if (isSel) sRes+=bName+',';
        }
        else {
          aName=bName='';
          if (isC) cRes+=',';
          if (isSel) sRes+=',';
        }

        isNC=(isC==false)&&isSel;
        isC=isC&&isSel;
        if (possCorrect>1)  res=res+(isC?'c,':isNC?'w,':isSel?'n,':'');
        else if (isSel) res = isC?'c':isNC?'w':'n';
      }
    }
    
    if (sRes.charAt(sRes.length-1)==',') sRes=sRes.substring(0,sRes.length-1);
    if (cRes.charAt(cRes.length-1)==',') cRes=cRes.substring(0,cRes.length-1);
    if (res.charAt(res.length-1)==',') res=res.substring(0,res.length-1);
    if (allThatApply&&possCorrect>1) {
      sRes=sRes+'}';
      cRes=cRes+'}';
    }
    if (window.CMIIsPresent && CMIIsPresent()) {
      if (hrs.toString().length==1) hrs = '0'+hrs;
      if (min.toString().length==1) min = '0'+min;
      if (sec.toString().length==1) sec = '0'+sec;
      if (curHr.toString().length==1) curHr = '0'+curHr;
      if (curMin.toString().length==1) curMin = '0'+curMin;
      if (curSec.toString().length==1) curSec = '0'+curSec;
      CMIAddInteraction(dmy, curHr+":"+curMin+":"+curSec, 
       trackIntId, trackObjectiveId, trackQType, 
       cRes, sRes, res, trackWeight, hrs+":"+min+":"+sec);
    }
  }  
}


function MM_intGetTime() { 
  var date = new Date();
  this.time = (date.getTime()/1000 - this._timeStart)*1000;
  return this.time/1000;
}


//Finds any object in either browser using recursion.
//Only pass the first argument, the name of the object to find.
//Returns a pointer the object if found, else an empty string.
//  MM_intFindObject('bar') returns the object
//  document.layers['foo'].document.layers['bar']

function MM_intFindObject(objName,  parentObj) {
  var i,tempObj="",found=false,curObj = "";
  var NS = (navigator.appName.indexOf("Netscape") != -1);
  if (!NS && document.all) curObj = document.all[objName]; //IE4
  if (!curObj) {
    parentObj = (parentObj != null)? parentObj.document : document;
    if (parentObj[objName] != null) curObj = parentObj[objName]; //at top level
    else { //if in form
      if (parentObj.forms) for (i=0; i<parentObj.forms.length; i++) {  //search level for form object
        if (parentObj.forms[i][objName]) {
          curObj = parentObj.forms[i][objName];
          found = true; break;
      } }
      if (!found && NS && parentObj.layers && parentObj.layers.length > 0) {
        parentObj = parentObj.layers;
        for (i=0; i<parentObj.length; i++) { //else search for child layers
          tempObj = MM_intFindObject(objName,parentObj[i]); //recurse
          if (tempObj) { curObj = tempObj; break;} //if found, done
  } } } }
  return curObj;
}

//Called from within conditions to check document properties
function MM_getDocProp(theName, theProp, theType) {
  var theObj = MM_intFindObject(theName);
  if (theObj) return eval('theObj.' + theProp);
  else return null;
}


//*********  ACTION MGR METHODS  *********

function MM_intJudge(treeRoot,curRoot,level) {
  var i=0,theNode,retVal=true,firstCond = true;
  level = (curRoot == null)?0:level+1;
  if (!level) {
    curRoot = this; //set tree to highest level
    if (this.disabled) retVal=false;
    else {
      this.time = Math.floor((new Date()).getTime()/1000) - this._timeStart;
      if (this.timeLimit && !this.timeAtLimit) {
        this.timeLeft = Math.max(0, this.timeLimit - this.time);
        this.timeAtLimit = (this.time > this.timeLimit);
      }
      this.tries++;
      if (this.triesLimit)
        this.triesAtLimit = (this.tries >= this.triesLimit);
  } } else if (treeRoot.curNode != null && curRoot == treeRoot.curNode) //if at curNode
    i = treeRoot.curIndex;  //offset by index
  for (i; (retVal && i<curRoot.b.length); i++) {
    theNode = curRoot.b[i];
    if (this.disabled) retVal=false;
    else if (theNode.disabled) continue;
    else if (theNode.type == "segm") { //SEGMENT
      curNode = (theNode.curNode)?theNode.curNode:theNode;
      if (curNode != 'done')
        retVal = MM_intJudge(theNode,curNode,level);   //start from that node
      else if (!level) continue;
    } else if (theNode.type == 'cond') { //CONDITION
      if (eval(theNode.data)) {
        if (!treeRoot.data) treeRoot.curNode = 'done';  //if not "auto-reset tree", set curNode
        retVal = MM_intJudge(treeRoot,theNode,level);
        if (level) break;
      } else if (firstCond) {
        firstCond = false;
        if (!treeRoot.data) {treeRoot.curNode = curRoot;  treeRoot.curIndex = i;}
      }
    } else if (theNode.type == 'actn') { //ACTION
      if (!treeRoot.data) //not auto-reset
        if (i<(curRoot.b.length-1)) { //not last node
          treeRoot.curNode = curRoot;  treeRoot.curIndex = i+1; //set curNode to next node
        } else treeRoot.curNode = 'done'; //last node, clear curNode
      if (theNode.data == 'stop') retVal=false; //STOP
      else eval(theNode.data);
  } }
  if (!level && curRoot!=null && curRoot.knowledgeTrack) curRoot.track();
  return retVal
}


//Disables or enables ActionMgr segments. If no segment passed,
//disables *all* segments. Returns false if segment not found.

function MM_intSetSegmDisabled(segmName,disable) {
  var i, retVal=false;
  for (i=0; i<this.b.length; i++) //search for segment
    if (!segmName || this.b[i].name==segmName) {
      this.b[i].disabled=disable; retVal = true;
      if (segmName) break;
    }
  return retVal
}


//Returns the disabled flag from an ActionMgr segment.
//Returns null if segment not found.

function MM_intGetSegmDisabled(segmName) {
  var i, retVal=null;
  for (i=0; i<this.b.length; i++) //search for segment
    if (this.b[i].name==segmName) {
      retVal = this.b[i].disabled; break;
    }
  return retVal
}


function MM_intResetActionMgr(segmName) {
  var i;
  if (segmName != null) MM_intTreeSetCurNode(segmName,null,this); //clear single curNode
  else for (i=0;i<this.b.length;i++) this.b[i].curNode = null; //clear all curNodes
}


function MM_intSetSegmNode(segmName,condName) {
  var i, curRoot=null;
  if (!condName) this.resetActionMgr(segmName);
  else {
    for (i=0; i<this.b.length; i++) //search for segment, set as curRoot
      if (this.b[i].name == segmName) { curRoot = this.b[i]; break; }
    MM_intTreeSetCurNode(condName,null,curRoot,curRoot);
  }
}


function MM_intTreeSetCurNode(nodeName,newVal,treeRoot,curRoot) {
  var i,theNode;
  if (curRoot==null) curRoot = treeRoot; //if first time, use treeRoot
  for (i=0; i<curRoot.b.length; i++) {
    theNode = curRoot.b[i];
    if (theNode.type == "segm") { //SEGMENT
      if (theNode.name == nodeName) theNode.curNode  = newVal;
      else MM_intTreeSetCurNode(nodeName,newVal,theNode,theNode);
    } else if (theNode.type == 'cond') { //CONDITION
      if (theNode.name == nodeName) {  //if name found
        treeRoot.curNode = curRoot;  treeRoot.curIndex = i;
        break;
      } else MM_intTreeSetCurNode(nodeName,newVal,treeRoot,theNode);
  } }
}


//Returns the current node for the given Segment, returned as:
// top of segment    - "" (empty string)
// middle of segment - condition name
// end of segment    - "done"

function MM_intGetSegmNode(segmName) {
  var i, curNode='';
  for (i=0; i<this.b.length; i++) //search for segment
    if (this.b[i].name == segmName) { 
      curNode = this.b[i].curNode;
      if (curNode==null) curNode = "";
      else if (curNode!="done") curNode = curNode.b[this.b[i].curIndex].name;
      break; 
    }
  return curNode
}



//*********  ACTION MGR NODE CLASS  *********

function MM_intNode(theType,theName,theData) {
  this.type = (theType)?theType:'';
  this.name = (theName)?theName:'';
  this.data = (theData)?theData:'';
  this.b = new Array();
}


//Create Action Manager (tree)

function MM_intAm(theType,theName,theData) {
  if (theType == "segm") {
      if (!this.tParent) { //initialize system
        this.tParent = new Array(); //tree parent nodes
        this.tIndex = new Array();  //child indexes
        this.tIndex[0] = -1;        //set index for root depth
      }
      this.tLevel = 0;            //reset level to 0
      this.tIndex[this.tLevel]++; //increment the index
      this.b[this.tIndex[this.tLevel]] = new MM_intNode("segm", theName,theData); //create tree
      this.tParent[this.tLevel] = this.b[this.tIndex[this.tLevel]]; //put this tree root at top level
      this.tIndex[this.tLevel+1] = -1;                              //reset child level index

  } else if (theType == "actn") {
     var parentNode = this.tParent[this.tLevel];    //get parent
     var levelIndex = ++this.tIndex[this.tLevel+1]; //get index
     parentNode.b[levelIndex] = new MM_intNode('actn',theName,theData); //add action

  } else if (theType == "cond") {
     var parentNode = this.tParent[this.tLevel];    //get parent
     var levelIndex = ++this.tIndex[this.tLevel+1]; //get index
     parentNode.b[levelIndex] = new MM_intNode('cond',theName,theData); //add condition

     this.tLevel++; //go down a level
     this.tParent[this.tLevel] = parentNode.b[levelIndex]; //save this node as parent
     this.tIndex[this.tLevel+1] = -1;                      //reset child level index

  } else if (theType == "end") {
     this.tLevel--;  //go up a level
  }
}
