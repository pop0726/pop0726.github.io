// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

//Constructs a hot area element
function MM_hota(theParent, theName, theInitialValue,
                 theExpectedValue, theIsCorrect, theScore) {
  // properties
  this.initialValue = theInitialValue;
  this.value = '';
  this.disabled = false;

  this.expectedValue = theExpectedValue;
  this.isCorrect = theIsCorrect;
  this.score = theScore;
  this.selected = false;

  this._parent = theParent;
  this._name = theName;
  this._self = theParent._self+".e['"+theName+"']";
  this._obj = '';
  
  this.c = new Array(this); // NOTE: choice info stored on the element.

  // member functions
  this.reset = MM_hotaReset;
  this.init = MM_hotaInit;
  this.initBackdrop = MM_hotaInitBackdrop;
  this.enable = MM_hotaEnable;
  this.disable = MM_hotaDisable;
  this.setDisabled = MM_hotaSetDisabled;
  this.update = MM_hotaUpdate;
  this.validValue = MM_hotaValidValue;
  this.changeValue = MM_hotaChangeValue;
  this.setValue = MM_hotaSetValue;
  this.setSelected = MM_hotaSetSelected;
  
}

//Resets the element
function MM_hotaReset() {
  var isChanged = '';
  if (this._obj) with (this) {
    isChanged = (value != initialValue);
    value = initialValue;
    disabled = _parent.disabled;
    validValue();
    if (isChanged && this.onChange != null) onChange(_parent._self+_name, value);
  }
}

function MM_hotaInit() {
  with (this) {
    _obj = MM_intFindObject(_parent._self + _name); //find slider layer object
    if (_obj)
      MM_dragLayer(_parent._self + _name,'',0,0,0,0,false,false,0,0,0,0,false,false,0,_self + '.update()',true);
    initBackdrop();
  }
}

function MM_hotaInitBackdrop() {
  var theObj;
  if (this._parent.bdInited == null) with (this) {
    _parent.bdInited = true;
    theObj = MM_intFindObject(_parent._self + "backdrop"); // find backdrop layer object
    if (theObj) {
      document.allLayers = null;
      MM_dragLayer(_parent._self + "backdrop",'',0,0,0,0,false,false,0,0,0,0,false,false,0,
                   "MM_hotaUpdateBackdrop(" + _parent._self + ")",true);
  } }
}

//Enables the element
function MM_hotaEnable() {
  if (this._obj) with (this) {
    disabled = false;
  }
}

//Disables the element
function MM_hotaDisable() {
  this.disabled = true;
}

//Calls the approppriate disable or enable function
function MM_hotaSetDisabled(theDisabled) {
  if (theDisabled) this.disable();
  else this.enable();
}

//Called by onClick event to update this elements value
function MM_hotaUpdate() {
  if (!this.disabled) with (this) {
    changeValue((_parent.allowMultiSel) ? !value : true);
    _parent.update();  // call the parent's update
  }
}

function MM_hotaValidValue() {
  this.selected = (this.value == this.expectedValue);
  return this.selected;
}

function MM_hotaChangeValue(theValue) {
  var i, isChanged = '', isReset = '';
  with (this) {
    isChanged = (value != theValue);
    if (!_parent.allowMultiSel) {
      value = theValue;
      for (i in _parent.e) if (i != 'length') with (_parent) {
        if (e[i] != this) {
          isReset = (e[i].value != false);
          e[i].value = false;
        }
        e[i].validValue();
        if (e[i] != this && isReset && e[i].onChange != null) 
          e[i].onChange(e[i]._parent._self+e[i]._name, e[i].value);
      }
    } else {
      value = theValue;
      validValue();
    }
    if (isChanged && this.onChange != null) onChange(_parent._self+_name, value);
  }
}

function MM_hotaSetValue(theValue) {
  with (this) {
    changeValue(theValue);
    _parent.update(true); // update int, but don't judge
  }
}

function MM_hotaSetSelected(theSelected) {
  if (theSelected)
    this.setValue(this.expectedValue);
  else
    this.setValue(!this.expectedValue);
}

function MM_hotaUpdateBackdrop(theParent) {
  if (!theParent.allowMultiSel) {
    theParent.resetElems();
    theParent.update();
  }
}
