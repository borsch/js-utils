/**
 * use this later to replace
 * @type {string}
 */
var REPLACE_STYLE = ':style';
var REPLACE_ID = ':id';
var REPLACE_TEXT = ':text';

/**
 * specify list for each instance of Autocomplete type
 * @type {string}
 */
var LIST_ID = 'suggestion-list-id-';

/**
 * html block for autocomplete list
 * @type {string}
 */
var SUGGESTION_LIST_HTML = '<div class="suggestions-list" id=":id" style=":style"></div>';
var SUGGESTION_LIST_CLASS = 'suggestions-list';
var SUGGESTION_LIST_CSS = '.' + SUGGESTION_LIST_CLASS;

/**
 * html block for described each item in autocomplete list
 * @type {string}
 */
var LIST_ITEM_HTML = '<div class="suggestion-item-class">:text</div>';
var LIST_ITEM_CLASS = 'suggestion-item-class';
var LIST_ITEM_CSS = '.' + LIST_ITEM_CLASS;

/**
 * html block for tags container
 * @type {string}
 */
var TAG_CONTAINER_HTML = '<div class="tag-container" id=":id" style=":style"></div>';
var TAG_CONTAINER_CLASS = 'tag-container';
var TAG_CONTAINER_CSS = '.' + TAG_CONTAINER_CLASS;

/**
 * specify tags container for each instance of Autocomplete type
 * @type {string}
 */
var TAGS_CONTAINER_ID = 'tags-container-id-';

/**
 * html block for tag
 * @type {string}
 */
var TAG_HTML = '<span class="tag"><font>:text</font><span class="remove-tag">x</span></span>';
var TAG_CLASS = 'tag';
var TAG_CSS = '.' + TAG_CLASS;

/**
 * html block for cross near tag
 * @type {string}
 */
var REMOVE_TAG_CLASS = 'remove-tag';
var REMOVE_TAG_CSS = '.' + REMOVE_TAG_CLASS;


var SELECTED_ITEM_CLASS = 'selected-item';
var SELECTED_ITEM_CSS = '.' + SELECTED_ITEM_CLASS;

var ITEM_IN_LIST = SUGGESTION_LIST_CSS + ' ' + LIST_ITEM_CSS;

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_ENTER = 13;
var KEY_TAB = 9;

var Autocomplete = function(options){
	var self = this;

	if(!options.input)
		throw new Error('specify input element');

	self.listID = LIST_ID + (++Autocomplete.IDS);

    if(options.tagsContainer != undefined)
        self.tagsContainer = options.tagsContainer;

	self.tagsId = TAGS_CONTAINER_ID + Autocomplete.IDS;

	self.input = options.input;
	self.items = [];

    self.suggestions = [];

	self.currentSelectedElement = 0;

	self.functions = {
		onTagRemove: isFunction(options.onTagRemove) ? options.onTagRemove : function(){},
		getSuggestions: isFunction(options.getSuggestions) ? options.getSuggestions : _getSuggestions,
		setSuggestions: setSuggestions
	};

	initContainers();

    if(options.tagsOnStart instanceof Array){
        self.items = options.tagsOnStart;
        for(var i = 0; i < options.tagsOnStart.length; ++i)
            renderTag(options.tagsOnStart[i].value);
        fixListRender();
    }

	input().focusout(function(){
		if(!listVisible()){
			list().empty();
			list().hide();
		}
	});

	input().keypress(function(e){
		if(e.keyCode == KEY_TAB){
			listVisible(false);
			input().focusout();
		} else if(e.keyCode == KEY_ENTER){
			enterClick();
		} else if(e.keyCode == KEY_DOWN){
			moveDownInList();
		} else if(e.keyCode == KEY_UP){
			moveUpInList();
		} else {
			var value = $(this).val();
			self.functions.getSuggestions(value);
		}
	});

    var _body = $('body');

    _body.on('click', LIST_ITEM_CSS, function(){
        var _input = input(),
            _list = list(),
            _elements = _list.find(LIST_ITEM_CSS),
            _current = current(),
            _suggestions = suggestions();

        $(_elements[_current]).removeClass(SELECTED_ITEM_CLASS);
        $(this).addClass(SELECTED_ITEM_CLASS);

        _current = $(ITEM_IN_LIST).index($(this));
        _input.val(_suggestions[_current].value);
        _input.focus();
        moveScroll();
    });

    _body.on('click', REMOVE_TAG_CSS, function(){
        var _value = $(this).parent().find('font').text();
        var _items = items();

        for(var i = 0; i < _items.length; ++i){
            if(_items[i].value == _value){
                self.functions.onTagRemove(_items[i]);
                _items.splice(i, 1);
                break;
            }
        }
        $(this).parent().remove();
    });

	function enterClick(){
        var _input = input(),
            _value = _input.val(),
            _items = items(),
            _list = list(),
            _suggestions = suggestions();

		if(self.listVisible && _value === _list.find(SELECTED_ITEM_CSS).text()){
			_suggestions = suggestions();
			for(var i = 0; i < _suggestions.length; ++i){
				if(_value === _suggestions[i].value){
                    _items.push(_suggestions[i]);
				}
			}
		} else {
            _items.push({value: _value});
		}
        renderTag(_value);

		_input.val('');
        _list.hide();
        _list.empty();
		listVisible(false);
        fixListRender();
        suggestions([]);
	}

	function moveUpInList() {
        var _elements = list().find(LIST_ITEM_CSS),
            _current = current(),
            _input = input(),
            _suggestions = suggestions();

        if (_suggestions && _suggestions.length > 0) {
            $(_elements[_current]).removeClass(SELECTED_ITEM_CLASS);
            if (_current == 0) _current = _suggestions.length - 1;
            else --_current;
            $(_elements[_current]).addClass(SELECTED_ITEM_CLASS);

            _input.val(_suggestions[_current].value);
            moveScroll();
            current(_current);
        }
	}

	function moveDownInList(){
        var _elements = list().find(LIST_ITEM_CSS),
            _current = current(),
            _input = input(),
            _suggestions = suggestions();

        if(_suggestions && _suggestions.length > 0) {
            $(_elements[_current]).removeClass(SELECTED_ITEM_CLASS);
            if (_current == _suggestions.length - 1) _current = 0;
            else ++_current;
            $(_elements[_current]).addClass(SELECTED_ITEM_CLASS);

            input().val(_suggestions[_current].value);
            current(_current);
            moveScroll();
        }
	}

	function setSuggestions(values){
        suggestions(values);
        var _suggestions = suggestions(),
            _list = list();
		if(values.length > 0){
			for(var i = 0; i < _suggestions.length; ++i)
				_list.append(renderListItem(_suggestions[i].value));
			var _addSelectedClass = _list.find(LIST_ITEM_CSS)[0];
			$(_addSelectedClass).addClass(SELECTED_ITEM_CLASS);
			_list.show();
			listVisible(true);
            current(0);
		} else {
			_list.empty();
			_list.hide();
		}
	}	

	function _getSuggestions(){
		setSuggestions([{value: 'suggestion1'}, {value: 'suggestion2'}]);
	}

	function renderListItem(value){
		return LIST_ITEM_HTML.replace(REPLACE_TEXT, value);
	}

	function moveScroll(){
        var _selectedItem = $(SELECTED_ITEM_CSS);
		list().scrollTop($(ITEM_IN_LIST).index(_selectedItem) * _selectedItem.height());
	}

	function renderTag(value){
		self.tagsContainer.append(TAG_HTML.replace(REPLACE_TEXT, value));
	}

	function initContainers(){
        var _input = input(),
		    _inputOffset = _input.offset(),
            _width = _input.width(),
            _top,
            _left,
            _style,
            _container;

        _top = _inputOffset.top + (self.input).height() + 7;
        _left = _inputOffset.left;
        _style = 'width: '+_width+'px; top: '+_top+'px; left: '+_left+'px; position: absolute;';
        _container = SUGGESTION_LIST_HTML.replace(REPLACE_ID, self.listID).replace(REPLACE_STYLE, _style);

		$('body').append(_container);

		self.listContainer = $('#'+self.listID);
		self.listContainer.hide();
		self.listVisible = false;

        if(self.tagsContainer == undefined){
            _top = _input.position().top;
            _left = _input.offset().left;
            _style = 'width: '+_width+'px; top: '+_top+'px; left: '+_left+'px; position: absolute;';
            _container = TAG_CONTAINER_HTML.replace(REPLACE_ID, self.tagsId).replace(REPLACE_STYLE, _style);

            $('body').append(_container);

            self.tagsContainer = $('#'+self.tagsId);
        }
	}

	function input(){
		return $(self.input);
	}

    function list(){
        return self.listContainer;
    }

    function current(value){
        if(value != undefined)
            self.currentSelectedElement = value;
        return self.currentSelectedElement;
    }

    function listVisible(bool){
        if(bool != undefined)
            self.listVisible = bool;
        return self.listVisible;
    }

    function suggestions(value){
        if(value instanceof Array){
            self.suggestions = value;
        } else if(typeof value === 'number'){
            return self.suggestions[value];
        }
        return self.suggestions;
    }

    function items(){
        return self.items;
    }

    function isFunction(value){
        return typeof value === 'function';
    }

    function fixListRender(){
        var _input = input(),
            _inputOffset = _input.offset(),
            _width = _input.width(),
            _top = _inputOffset.top + _input.height() + 7,
            _left = _inputOffset.left,
            _list = list();

        _list.css('top', _top).css('width', _width).css('left', _left);
    }
};

Autocomplete.prototype.call = function(functionName, params){
	this.functions[functionName](params);
};

Autocomplete.prototype.getItems = function(){
	return this.items;
};

Autocomplete.IDS = 0;
