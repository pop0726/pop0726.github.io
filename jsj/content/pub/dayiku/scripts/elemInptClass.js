// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

//Constructs a multiple choice element
function MM_inpt(theParent, theName, theInitialValue,
                 theExpectedValue, theIsCorrect, theScore) {
  // properties
  this.initialValue = theInitialValue;
  this.value = '';
  this.disabled = true;
  
  this.expectedValue = theExpectedValue;
  this.isCorrect = theIsCorrect;
  this.score = theScore;
  this.selected = false;
  
  this.isRadioList = false;
  
  this._parent = theParent;
  this._name = theName;
  this._obj = '';
  
  this.c = new Array(this); // NOTE: choice info stored on the element.

  // member functions
  this.init = MM_inptInit;
  this.reset = MM_inptReset;
  this.enable = MM_inptEnable;
  this.disable = MM_inptDisable;
  this.update = MM_inptUpdate;
  this.setDisabled = MM_inptSetDisabled;
  this.redraw = MM_inptRedraw;
  this.validValue = MM_inptValidValue;
  this.setValue = MM_inptSetValue;
  this.setSelected = MM_inptSetSelected;
  this.changeValue = MM_inptChangeValue;
}

// Initializes the element, special case radio lists
function MM_inptInit() {
  var rlist, i, pos=0;
  with (this) { 
    _obj = MM_intFindObject(_parent._self + _name + "Inp");
    if (!_obj) { // assume radio
      rlist = MM_intFindObject(_parent._self + "RadioInp");
      if (rlist && rlist.length != null) {
          for (i in _parent.e) if (i != 'length') // get our element position
            if (_parent.e[i] == this) break; else pos++;
          if (pos < rlist.length) _obj = rlist[pos];  // get radio at same position
          isRadioList = true;
  } } } 
}

//Resets the element
function MM_inptReset() {
  var isChanged = '';
  with (this) {
    isChanged = (value != initialValue);
    value = initialValue;
    _parent.disabled ? disable() : enable();
    validValue();
    redraw();
    if (isChanged && this.onChange != null) onChange(_parent._self+_name, value);
  }
}

//Enables the element
function MM_inptEnable() {
  if (this._obj) with (this) {
    disabled = false;
    redraw();
  }
}

//Calls the approppriate disable or enable function
function MM_inptSetDisabled(theDisabled) {
  if (theDisabled) this.disable();
  else this.enable();
}

//Disables the element
function MM_inptDisable() {
  this.disabled = true;
  this.redraw();
}

//Called by onClick event to update this elements value
function MM_inptUpdate() {
  var noJudge = false;
  with (this) {
    if (disabled) {
      if (!isRadioList) 
        redraw();
      else
        for (var i in _parent.e) if (i != 'length')
          _parent.e[i].redraw();
      return;
    }
  
    if (_obj.checked != null) {
      if (isRadioList && value == _obj.checked) noJudge = true; //IE3.0 oddity
      changeValue((_obj.checked) ? true : false);  //IE3.0 oddity
    } else
      changeValue(_parent.allowMultiSel ? !value : true);
  
    // call the parent's update
    _parent.update(noJudge);
  }
}

//Sets the checked state of the form element
function MM_inptRedraw() {
  if (this._obj) with (this) {
    if (_obj.disabled != null) _obj.disabled = disabled;
    if (isRadioList) {
      if (value) _obj.checked = true;
    } else if (_obj.checked != null) _obj.checked = value;
  }
}

//Checks the value with the expectedValue
function MM_inptValidValue() {
  this.selected = (this.value == this.expectedValue);
  return this.selected;
}

//Internal routine for changing element value
function MM_inptChangeValue(theValue) {
  var i, isChanged = '', isReset = '';
  with (this) {
    isChanged = (value != theValue);
    if (!_parent.allowMultiSel || isRadioList || _obj.type == 'radio') {
      value = theValue;
      for (i in _parent.e) if (i != 'length') with (_parent) {
        if (e[i] != this) {
          isReset = (e[i].value != false);
          e[i].value = false;
        }
        e[i].validValue();
        e[i].redraw();
        if (e[i] != this && isReset && e[i].onChange != null)
          e[i].onChange(e[i]._parent._self+e[i]._name, e[i].value);
      }
    } else {
      value = theValue;
      validValue();
      redraw();
    }
    if (isChanged && this.onChange != null) onChange(_parent._self+_name, value);
  }
}

//Sets the state of the element to the given value
function MM_inptSetValue(theValue) {
  with (this) {
    changeValue(theValue);
    _parent.update(true); // update int, but don't judge
  }
}

//Sets this element to its selected state
function MM_inptSetSelected(theSelected) {
  if (theSelected)
    this.setValue(this.expectedValue);
  else
    this.setValue(!this.expectedValue);
}