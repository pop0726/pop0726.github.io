// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

//Constructs a drag and drop element
function MM_drag(theParent, theName, theInitialValue,
                theIsDraggable, theIsTarget,
                theSnapsOnMiss, theSnapsOnIncorrect) {
  // properties
  this.initialValue = theInitialValue;
  this.value = '';
  this.disabled = true;
  
  this.snapsOnMiss = theSnapsOnMiss;
  this.snapsOnIncorrect = theSnapsOnIncorrect;
  this.origPosX = '';
  this.origPosY = '';
  
  this._parent = theParent;
  this._name = theName;
  this._obj = '';
  this._self = theParent._self+".e['"+theName+"']";
  this._singleChoice = true;

  this._isDraggable = theIsDraggable;
  this._isTarget = theIsTarget;
  
  this._posX = '';
  this._posY = '';
  this._prevPosX = '';
  this._prevPosY = '';
  this._width = '';
  this._height = '';

  this.c = new Array();
  
  // member functions
  this.init = MM_dragInit;
  this.reset = MM_dragReset;
  this.enable = MM_dragEnable;
  this.disable = MM_dragDisable;
  this.setDisabled = MM_dragSetDisabled;
  this.update = MM_dragUpdate;
  this.getPosition = MM_dragGetPosition;
  this.snapTo = MM_dragSnapTo;
  this.snapBack = MM_dragSnapBack;
  this.moveToFront = MM_dragMoveToFront;
  this.updateValue = MM_dragUpdateValue;
  this.updateSources = MM_dragUpdateSources;
  this.changeValue = MM_dragChangeValue;
  this.setValue = MM_dragSetValue;
}

//Called to initialize the drag objects
function MM_dragInit() {
  with (this) {
    _obj = MM_intFindObject(_parent._self + _name);
    if (_obj) {
      _width =  parseInt((_parent.browserIsNS)?_obj.clip.width:_obj.offsetWidth);
      _height = parseInt((_parent.browserIsNS)?_obj.clip.height:_obj.offsetHeight);
      getPosition();
      origPosX = _posX; origPosY = _posY;
      if (_isDraggable)
        MM_dragLayer(_parent._self + _name,'',0,0,0,0,true,false,-1,-1,-1,-1,false,false,0,_self+'.update()',true,_self+'.update(true)');
  } }
}

//Resets the element and its choices
function MM_dragReset() {
  var i;
  if (this._obj) with (this) {
    _parent.disabled ? disable() : enable();
    value = initialValue;
    if (_isDraggable) {
      if (!changeValue(value)) {
        snapTo(origPosX, origPosY);
        updateValue(true);
        updateSources();
  } } }
}

//Enables the element
function MM_dragEnable() {
  var i;
  if (this._obj) with (this) {
    disabled = false;
    for (i in c)  if (i != 'length') c[i].disabled = false;
    updateValue(true);
    if (_isDraggable) _obj.MM_dragOk = true;
  }
}

//Disables the element
function MM_dragDisable() {
  with (this) {
    disabled = true;
    if (_isDraggable && _obj) _obj.MM_dragOk = null;
  }
}

//Calls the approppriate disable or enable function
function MM_dragSetDisabled(theDisabled) {
  if (theDisabled) this.disable();
  else this.enable();
}

//Called by MM_dragLayer when a drag object is dropped
// Do a hit test on each of the targets
function MM_dragUpdate(dragging) {
  var i,noJudge=false,origValue,x,y;
  with (this) {
    if (dragging) {
      if (this.onDrag != null) {
        x = parseInt((_parent.browserIsNS)?_obj.pageX:_obj.style.pixelLeft);
        y = parseInt((_parent.browserIsNS)?_obj.pageY:_obj.style.pixelTop);
        onDrag(_parent._self+_name, x, y);
      }
    } else {
      if (!_obj || disabled || !_isDraggable) return;

      origValue=value;
      getPosition();
      updateValue();

      if (snapsOnIncorrect && value && c[value].isCorrect == false) {
        c[value].selected = false; // turn off selected flag
        noJudge=true;
      } else if (snapsOnMiss && !value) {
        noJudge=true;
      }
      if (noJudge) {
        snapBack();
        if (origValue) {
          c[origValue].selected = true;
          value = origValue;
        }
        if (this.onDrag != null) onDrag(_parent._self+_name, _posX, _posY);
        if (this.onDrop != null) onDrop(_parent._self+_name, value);
      }

      if (!noJudge) updateSources();
      
      // call the parent's update
      _parent.update(noJudge);
  } }
}

//Gets the current position of the layer
function MM_dragGetPosition() {
  if (this._obj) with (this) {
    _prevPosX = _posX; _prevPosY = _posY;
    _posX = parseInt((_parent.browserIsNS)?_obj.pageX:_obj.style.pixelLeft);
    _posY = parseInt((_parent.browserIsNS)?_obj.pageY:_obj.style.pixelTop);
  }
}

//Moves the layer to the given position
function MM_dragSnapTo(newPosX, newPosY) {
  if (this._obj && newPosX && newPosY) with (this) {
    if (_parent.browserIsNS) {
      _obj.pageX = newPosX; _obj.pageY = newPosY;
    } else {
      _obj.style.pixelLeft = newPosX; _obj.style.pixelTop = newPosY;
    }
    _posX = newPosX; _posY = newPosY;
  }
}

//Moves the layer to its previous position
function MM_dragSnapBack() {
  with (this) snapTo(_prevPosX, _prevPosY);
}

function MM_dragMoveToFront() {
  var maxZ=0, i, aLayer, aLayerZ;
  with (this) {
    if (document.allLayers != null) {
      for (i=0; i<document.allLayers.length; i++) {
        aLayer = document.allLayers[i];
        aLayerZ = (_parent.browserIsNS)?aLayer.zIndex:aLayer.style.zIndex;
        if (aLayerZ > maxZ) maxZ = aLayerZ;
      }
      eval('_obj.'+((_parent.browserIsNS)?'':'style.')+'zIndex=maxZ+1');
  } }
}

//Update the value parameter and the choice selected flags
function MM_dragUpdateValue(checkOnly) {
  var i;
  with (this) {
    value = '';
    for (i in c) if (i != 'length') 
      if (value == '')  value = c[i].validValue(checkOnly);
      else  c[i].validValue(checkOnly);
  }
}

//Update the sources for which we are a target
function MM_dragUpdateSources() {
  var i;
  with (this) {
    if (_isTarget) {
      for (i in _parent.e)  if (i != 'length') {
        if (_parent.e[i].value == _name) {
          if (value != i) {  // update elem and choice
            _parent.e[i].value = _parent.e[i].c[_name].validValue(true); // check only
          } else {  // dropped on the element for which we were the target
            _parent.e[i].value = '';
            _parent.e[i].c[_name].selected = false;
    } } } }
    if (this.onDrag != null) onDrag(_parent._self+_name, _posX, _posY);
    if (this.onDrop != null) onDrop(_parent._self+_name, value);
  }
}

//Moves the layer to the named target
function MM_dragChangeValue(theValue) {
  var retVal = false;
  var choice, i;
  if (this._obj && theValue && this._isDraggable) with (this) {
    for (choice in c) if (choice != 'length' && choice == theValue) break;
    if (choice == theValue) {
      c[choice].setHotSpot();
      snapTo(c[choice]._hitX, c[choice]._hitY);
      moveToFront();
      updateValue();  // set our selected state
      updateSources();
      retVal = true;
  } }
  return retVal;
}

//Moves the layer to the named target, then updates the int
function MM_dragSetValue(theValue) {
  with (this) {
    if (changeValue(theValue))
      _parent.update(true); // update int, but don't judge
  }
}


////////////////////////////////////////
//Create a drag and drop choice object
function MM_dragTarg(theParent, theElement,
                     theTarget, theIsCorrect, theScore,
                     theTolerance, theAlignment, theOffset, theSnapsTo) {
  // properties
  this.expectedValue = theTarget;
  this.isCorrect = theIsCorrect;
  this.score = theScore;
  this.selected = false;
  this.disabled = false;
  
  this.tolerance = theTolerance;
  this.alignment = theAlignment;
  this.snapsTo = theSnapsTo;
  this.offsetX = 0;
  this.offsetY = 0
  
  this._elem = eval(theParent._self+".e['"+theElement+"']");
  this._target = eval(theParent._self+".e['"+theTarget+"']");
  this._isChoice = true;

  this._hitX = 0;
  this._hitY = 0;
  this._snapX = '';
  this._snapY = '';
  
  if (theOffset != null) {
    var  colonPos = theOffset.indexOf(":");
    if (colonPos != -1) { //if colon separated, split strings
      this.offsetX = parseInt(theOffset.substring(0,colonPos));
      this.offsetY = parseInt(theOffset.substring(colonPos+1,theOffset.length));
  } }
  
  // methods
  this.validValue = MM_dragTargValidValue;
  this.setHotSpot = MM_dragTargSetHotSpot;
  this.setSelected = MM_dragTargSetSelected;
  this.setDisabled = MM_dragTargSetDisabled;
}

function MM_dragTargValidValue(checkOnly) {
  var retVal = '';
  with (this) {
    selected = false;
    if (!disabled) {
    
      setHotSpot();

      // check if the value is within the tolerance of the hotspot
      if ((Math.pow(_hitX-_elem._posX,2) + Math.pow(_hitY-_elem._posY,2))
              <= Math.pow(tolerance,2)) {
        selected = true;
        if (snapsTo && !checkOnly) _elem.snapTo(_snapX, _snapY);
        retVal = expectedValue;
  } } }
  return retVal;
}

function MM_dragTargSetHotSpot() {
  var centerX, centerY, alignX=0, alignY=0;
  with (this) {
    // compute the center
    centerX = Math.round(0.5 * (_target._width-_elem._width));
    centerY = Math.round(0.5 * (_target._height-_elem._height));    
    
    // compute the alignment
    if (alignment != '') {
      // set to 'Center'
      alignX = centerX; alignY = centerY;
      if (alignment == 'Bottom')     alignY = _target._height;
      else if (alignment == 'Top')   alignY = -_elem._height;
      else if (alignment == 'Left')  alignX = -_elem._width;
      else if (alignment == 'Right') alignX = _target._width;
    }
  
    // update the targets position (needed for draggable targets)
    _target.getPosition();
  
    // set the snap location
    _snapX = _target._posX + alignX + offsetX;
    _snapY = _target._posY + alignY + offsetY;
    
    // set the hit location
    _hitX = _target._posX + centerX;
    _hitY = _target._posY + centerY;
    
  }
}

function MM_dragTargSetSelected(theSelected) {
  with (this) {
    if (theSelected) {
      _elem.setValue(expectedValue);
    } else {
      selected = false;
      if (_elem.value == expectedValue) _elem.value = '';
      _elem._parent.update(true);
    }
  }
}

function MM_dragTargSetDisabled(theDisabled) {
  with (this) {
    disabled = theDisabled;
    if (disabled) {
      selected = false;
      if (_elem.value == expectedValue) _elem.value = '';
    } else {
      // NOTE: the selected state won't be correct 
      //  if the snap location is outside of the tolerance
      if (_elem._obj) {
        validValue(true);
        if (selected) _elem.value = expectedValue;
      }
    }
    _elem._parent.update(true);
  }
}
