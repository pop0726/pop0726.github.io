// Copyright 1998,1999 Macromedia, Inc. All rights reserved.

//Constructs a text entry element
function MM_text(theParent, theName, theInitialValue) {
  // properties
  this.initialValue = theInitialValue?theInitialValue:'';
  this.value = null;
  this.disabled = true;
  
  this._parent = theParent;
  this._name = theName;
  this._obj = '';
  
  this.c = new Array();

  // member functions
  this.init = MM_textInit;
  this.reset = MM_textReset;
  this.enable = MM_textEnable;
  this.disable = MM_textDisable;
  this.setDisabled = MM_textSetDisabled;
  this.update = MM_textUpdate;
  this.redraw = MM_textRedraw;
  this.setValue = MM_textSetValue;
  this.focus = MM_textFocus;
}

//Initializes the element
function MM_textInit() {
  with (this) _obj = MM_intFindObject(_parent._self + _name + "Inp");
}

//Resets the element
function MM_textReset() {
  with (this) {
    _parent.disabled ? disable() : enable();
    setValue(initialValue);
  }
}

//Enables the element
function MM_textEnable() {
  var i;
  if (this._obj) with (this) {
    disabled = false;
    for (i in c) if (i != 'length') c[i].disabled = false;
    setValue(_obj.value);
  }
}

//Disables the element
function MM_textDisable() {
  this.disabled = true;
  this.redraw();
}

//Calls the approppriate disable or enable function
function MM_textSetDisabled(theDisabled) {
  if (theDisabled) this.disable();
  else this.enable();
}

//Called by onClick event to update this elements value
//We also store the object reference of the control, so that
// we can reset it later.
function MM_textUpdate() {
  var isChanged = '';
  if (!this.disabled) with (this) {
    _obj.value = MM_textStripSpaces(_obj.value);
    isChanged = (value != _obj.value);
    value = _obj.value;
    for (var i in c) if (i != 'length') c[i].validValue();
    if (isChanged && this.onChange != null) onChange(_parent._self+_name, value);
    _parent.update();   // call the parent's update
  }
}

// Sets the text value
function MM_textRedraw() {
  if (this._obj) with (this) {
    if (_obj.disabled != null) _obj.disabled = disabled;
    if (_obj.value != null) _obj.value = value;
  }
}

function MM_textSetValue(theValue) {
  var isChanged = '';
  with (this) {
    theValue = MM_textStripSpaces(theValue);
    isChanged = (value != theValue);
    value = theValue;
    redraw();
    for (var i in c) if (i != 'length') c[i].validValue();
    if (isChanged && this.onChange != null) onChange(_parent._self+_name, value);
    _parent.update(true);  // update int, no judge
  }
}

function MM_textFocus() {
  if (this.disabled) with (this._parent)
    if (browserIsNS && browserVersion >= 4.0 && osIsWindows) this._obj.blur();
}


//////////////////////////////////////////
//Create a string choice object
function MM_textComp(theParent, theElement, theName,
                     theExpectedValue, theIsCorrect, theScore,
                     theMatchCase, theMatchAll)
{
  // properties
  this.expectedValue = theExpectedValue;
  this.isCorrect = theIsCorrect;
  this.score = theScore;
  this.selected = false;
  this.disabled = false;
  
  this.matchCase = theMatchCase;
  this.matchAll = theMatchAll;
  
  this._elem = eval(theParent._self+".e['"+theElement+"']");
  this._isChoice = true;

  // methods
  this.validValue = MM_textCompValidValue;
  this.setSelected = MM_textCompSetSelected;
  this.setDisabled = MM_textCompSetDisabled;
  this.deencrypt = MM_textDeencrypt;

}

function MM_textCompValidValue() {
  var theValue, expValue;
  with (this) {
    selected = false;
    if (!disabled) {
      theValue = _elem.value;
      expValue = deencrypt(expectedValue);

      if (!matchCase) {
        theValue = theValue.toUpperCase();
        expValue = expValue.toUpperCase();
      }

      if (theValue != '') {
        if (matchAll)  selected = (theValue == expValue);
        else  selected = (theValue.indexOf(expValue) != -1);
  } } }
  return this.selected;
}

function MM_textCompSetSelected(theSelected) {
  with (this) {
    if (theSelected) {
      _elem.setValue(deencrypt(expectedValue));
    } else {
      selected = false;
      _elem._parent.update(true); // update int, no judge
  } }
}

function MM_textCompSetDisabled(theDisabled) {
  with (this) {
    disabled = theDisabled;
    validValue();
    _elem._parent.update(true); // update interaction, no judge
  }
}

function MM_textDeencrypt(theStr) {
  var decipher='',i,key,clength,part='-###-',keyOffsetObscure,keyOffset='',hyphen;
  
  if (theStr.indexOf(part)!=-1) {
    strStart = theStr.indexOf(part)+part.length;
  hyphen=theStr.indexOf('-');
    key = theStr.substring(0,hyphen);
  keyOffsetObscure=theStr.substring(hyphen+1, theStr.indexOf('-',hyphen+1));
    for (i=keyOffsetObscure.length-1;i>=0;i--)
    keyOffset+=keyOffsetObscure.charAt(i);
    clength = key-keyOffset;
    retVal = theStr.substring(strStart, theStr.length);
  for (i=0;i<retVal.length;i+=(clength+1))
    decipher=decipher+retVal.charAt(i);

  retVal = decipher;
  }
  else retVal = theStr;
    
  return retVal;
}

function MM_textStripSpaces(theStr) {
  var c,b=0,e=theStr.length-1,E=e;
  while (b<E&&((c=theStr.charAt(b))==" " || c=="\r" || c=="\n")) b++;
  while (e>0&&((c=theStr.charAt(e))==" " || c=="\r" || c=="\n")) e--;
  return theStr.substring(b,e+1);
}
