// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

//Constructs a timer element
function MM_timr(theParent, theName, theInitialValue,
                 theNumberOfFrames, theTimeLimit,
                 theReverseFrames) {
  // properties
  this.initialValue = theInitialValue;
  this.value = '';
  this.disabled = true;

  this.timeLeft = '';
  this.timeLimit = theTimeLimit;
  this.timeStart = '';

  this._parent = theParent;
  this._name = theName;
  this._self = theParent._self+".e['"+theName+"']";
  this._obj = '';
  this._fileExt = '';
  this._filePre = '';
  this._preloadFrame = 1;
  this._preloadInterval = 1;
  this._preloadObj = new Image();
  this._tick = (theTimeLimit/theNumberOfFrames)/3;
  this._numberOfFrames = theNumberOfFrames;
  this._currentFrame = 0;
  this._reverseFrames = theReverseFrames;
  this._timeoutWaiting = false;
  this.c = new Array();

  // member functions
  this.init = MM_timrInit;
  this.reset = MM_timrReset;
  this.enable = MM_timrEnable;
  this.disable = MM_timrDisable;
  this.setDisabled = MM_timrSetDisabled;
  this.update = MM_timrUpdate;
  this.setValue = MM_timrSetValue;

  this.step = MM_timrStep;
  this.getClosestFrame = MM_timrGetClosestFrame;
  this.waitTick = MM_timrWaitTick;
  this.preloadFrame = MM_timrPreloadFrame;
  this.getFrameSrc = MM_timrGetFrameSrc;

}

// Initializes the element
function MM_timrInit() {
  var theSrc, extIndex, undIndex;
  with (this) {
    _obj = MM_intFindObject(_parent._self + _name + "Img");
    if (_obj && _obj.src != null) {
      theSrc = _obj.src;
      extIndex = theSrc.lastIndexOf(".");
      if (extIndex != -1) { // save the extension
        _fileExt = theSrc.substring(extIndex, theSrc.length);
        theSrc = theSrc.substring(0, extIndex); // remove extension
      }
      undIndex = theSrc.lastIndexOf("_");
      if (undIndex != -1)
        _filePre = theSrc.substring(0, undIndex+1);

      preloadFrame();
    }
    if (_tick > 100) _tick = 100;
  }
}

//Resets the element
function MM_timrReset() {
  var i;
  with (this) {
    value = initialValue;
    timeLeft = Math.max(0, timeLimit - value);
    for(i in c) if (i != 'length' && c[i].expectedValue >= value)
      c[i].selected = c[i].judged = false;
    if (_obj) {
      _currentFrame = getClosestFrame(value);
      _obj.src = getFrameSrc(_currentFrame);
      preloadFrame();
    }
    timeStart = Math.floor((new Date()).getTime()/1000) - value;
    _parent.disabled ? disable() : enable();
  }
}

//Enables the element
function MM_timrEnable() {
  var i;
  with (this) {
    if (disabled) {
      disabled = false;
      timeStart = Math.floor((new Date()).getTime()/1000) - value;
    }
    for (i in c) if (i != 'length') c[i].disabled = false;
    update();
    waitTick();
  }
}

//Disables the element
function MM_timrDisable() {
  with (this) {
    if (!disabled) {
      disabled = true;
      value = Math.floor((new Date()).getTime()/1000) - timeStart;
      timeLeft = timeLimit - value;
  } }
}

//Calls the approppriate disable or enable function
function MM_timrSetDisabled(theDisabled) {
  if (theDisabled) this.disable();
  else this.enable();
}

//Called by onClick event to update this elements value
function MM_timrUpdate() {
  var i,judgeInt=false;

  with (this) {
    if (disabled) return;

    // walk the list of choices, setting selected
    for (i in c) if (i != 'length') {
      if (!c[i].judged && c[i].validValue()) {
        judgeInt = true;
        c[i].judged = true;
    } }

    // call the parent's update
    _parent.update(!judgeInt);
  }
}

function MM_timrSetValue(theValue) {
  with (this) {
    value = Math.max(0, theValue);
    timeStart = Math.floor((new Date()).getTime()/1000) - value;
    timeLeft = Math.max(0, timeLimit - value);
    for(i in c) if (i != 'length' && c[i].expectedValue >= value)
      c[i].selected = c[i].judged = false;
    if (_obj) {
      _currentFrame = getClosestFrame(value);
      _obj.src = getFrameSrc(_currentFrame);
      preloadFrame();
    }
    _parent.update(true); // update int, no judge
  }
}

//Calls the setTimeout() function for this element.
function MM_timrWaitTick() {
  with (this) {
    if (!_timeoutWaiting) {
      _timeoutWaiting = true;
      setTimeout(_self + ".step()", _tick);
  } }
}

//Returns the "best guess" of the frame to show for the current time.
// theTime - the time to find the frame for in seconds
function MM_timrGetClosestFrame(theTime) {
  var frame;
  with (this) {
    frame = Math.floor((theTime * (_numberOfFrames - 1)) / timeLimit);
    if (theTime >= timeLimit)
      frame = _numberOfFrames - 1;
    else if (frame > (_numberOfFrames - 2))
      frame = _numberOfFrames - 2;
  }
  return frame;
}

//Returns the URL for the given frame image.
// theFrame - the frame to get the source file name for
function MM_timrGetFrameSrc(theFrame) {
  var iTest, numberStr;
  with (this) {
    numberStr = (_reverseFrames) ? (_numberOfFrames - theFrame) : (theFrame + 1);
    // add pad zeros
    for (iTest=10; (this._numberOfFrames >= iTest); iTest*=10)
      if (numberStr < iTest) numberStr = "0" + numberStr;
  }
  return this._filePre + numberStr + this._fileExt;
}

//Preload the "best guess" next frame that we can use.
function MM_timrPreloadFrame() {
  with (this) {
    _preloadFrame = _currentFrame + _preloadInterval;
    if (_preloadFrame >= _numberOfFrames)
      _preloadFrame = _numberOfFrames - 1;
    _preloadObj.src = getFrameSrc(_preloadFrame);
  }
}

//Catches the timeout event and updates the timer display
// and element values.  Args:
function MM_timrStep() {
  var doPreload, closestFrame;
  with (this) {
    _timeoutWaiting = false;
    if (!disabled) {
      value = Math.floor((new Date()).getTime()/1000) - timeStart;
      timeLeft = timeLimit - value;
      if (_obj) {
        doPreload=false;
        closestFrame=getClosestFrame(value);
        if (_preloadObj.complete) {
          if (closestFrame >= _preloadFrame) {
            _obj.src = _preloadObj.src;
            doPreload = true;
          } 
        } else if (closestFrame > _preloadFrame) {
          _preloadInterval++;
          doPreload = true;
        } 
        if (doPreload) {
          _currentFrame = closestFrame;
          preloadFrame();
      } }
      
      if (this.onTick != null) onTick(_parent._self+_name, value);

      waitTick();
      update();
  } }
}


/////////////////////////////////////////
//Create a range choice object
function MM_timrTrig(theParent, theElement, theName,
                     theExpectedValue, theIsCorrect, theScore) {
  // properties
  this.expectedValue = theExpectedValue;
  this.isCorrect = theIsCorrect;
  this.score = theScore;
  this.selected = false;
  this.disabled = false;

  this.judged = false;

  this._elem = eval(theParent._self+".e['"+theElement+"']");
  this._isChoice = true;

  // method
  this.validValue = MM_timrTrigValidValue;
  this.setDisabled = MM_timrTrigSetDisabled;
  this.setSelected = MM_timrTrigSetSelected;
}

//Returns true if value is above this threshold.
function MM_timrTrigValidValue() {
  with (this) {
    selected = false;
    if (!disabled && _elem.value != null)
      selected = (expectedValue <= _elem.value);
  }
  return this.selected;
}

function MM_timrTrigSetDisabled(theDisabled) {
  with (this) {
    disabled = theDisabled;
    validValue();
    _elem._parent.update(true); // update int, no judge
  }
}

function MM_timrTrigSetSelected(theSelected) {
  with (this) {
    if (theSelected) {
      _elem.setValue(expectedValue);
    } else {
      this.selected = false;
      _elem._parent.update(true); // update int, no judge
  } }
}