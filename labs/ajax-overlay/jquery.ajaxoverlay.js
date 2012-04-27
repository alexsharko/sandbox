/*
 date created  17/01/2011 by matt andrews
 date modified 11/07/2011 by matt andrews - v1.6

 requires /common/styles/ajaxoverlay.css

 example usage:
 jQ('a.ajax-link').ajaxoverlay();
 jQ('.magic-button').ajaxoverlay({ 'columnwidth' : 'two-col', 'background' : 'red' });

 changelog:
    23/06/2011 - added a plethora of callback functions and unbinding events
    11/07/2011 - now supports form submission for ajax content
*/

(function ($) {

    $.fn.ajaxoverlay = function (settings) {

        // all options are optional
        var options = {
            'overlay'               : true,     	    // allow users to remove the overlay bg
            'background'            : '#000',   	    // background colour of the div for the overlay
            'showclosebutton'       : true,     	    // show a close button, auto bound to closing the box
            'recursiveselector'     : false,    	    // pass a selector and any links inside the loaded popup with this class will be loaded into the popup
            'width'                 : '450',    	    // default width of the popup (number only, no px)
            'height'                : '',       	    // default height of the popup (number only, no px)
            'extraclass'            : '',       	    // added to the overlay/popup if you want to change default styling
            'opacity'               : 0.7,      	    // default opacity of overlay bg
            'columnwidth'           : '',       	    // used to override width if set
            'closebuttonselector'   : '',       	    // used if the popup needs a custom close button
            'source'                : '',       	    // allows user to pass an existing div rather than url to get content from - should be a string, not jquery object
            'dobeforeopen' 	        : function() {},	// callback function - fires before the container has appeared
            'doafteropen' 	        : function() {},	// callback function - fires after the container has appeared
            'dobeforeclose' 	    : function() {},	// callback function - fires before everything is about to be hidden
            'doafterclose' 	        : function() {},	// callback function - fires after everything has been hidden
            'form'                  : {                 // specify a selector for a form which the plugin will automatically submit via ajax into the overlay
					selector: '',	// the selector of the form itself (required if 'form' is specified)
					trigger: '',	// a custom selector to trigger the form submit (optional, falls back to the form.submit() event)
					url: '',	    // optional, falls back to the form's default action
					customField: ''	// optional, if specified, this key will be sent (with a value of "1") along with the form submit.
							        // this could be useful to pass an "is_ajax" parameter so a form controller can return different results
            },
            'debugmode'		        : false		        // if enabled, logs messages about function calls to the console
        };

        var $current_item; // used to hold a reference to the element we're operating upon

        var methods = {

            debug : function (msg) {
                if (options.debugmode) {
                    console.log(msg);
                }
            },

            init : function (elm) {
                var event = this;

                methods.debug('initialising overlay');

                if (!options.source && !options.form.selector) {
                    var click_url = $(elm).attr('href');
                    methods.spawnOverlay();

                    $.ajax({
                        type: 'get',
                        url: click_url,
                        success: function (content) {
                            methods.spawnPopup(content, methods.bindEvents);
                        },
                        error: function () {
                            methods.removeEverything(false);
                        }
                    });
                } else if (options.source) { // the user passed an existing jquery element
                    methods.spawnOverlay();
                    methods.spawnPopup($(options.source), methods.bindEvents);
                } else if (options.form.selector) { // the user passed a form to submit

                    var form = $(options.form.selector);
                    var url = form.attr('action');

                    if (options.form.url) {
                        url = options.form.url;
                    }

                    if (options.form.trigger) { // user specified a custom form submit event
                        $(options.form.trigger).live('click', function(){
                            methods.interceptFormViaAjax(form, url);
                        });
                    } else { // default to form.submit() instead
                        form.live('submit', function(){
                            methods.interceptFormViaAjax(form, url);
                        });
                    }

                }

              //  toggleHideOnPopupElements("hidden"); // gu-specific code, needs to be removed for open sourcing process

                return event.preventDefault();
            },

            interceptFormViaAjax : function (form, url) {

                methods.debug('submitting form via ajax');

                var data = form.serialize();
                if (options.form.customField) {
                    data += '&' + options.form.customField + '=1';
                }

                $.ajax({
                    url: url,
                    data: data,
                    type: form.attr('method'),
                    success: function(response) {
                        var temp_form = $('#ajaxoverlay-formresponse-temp');
                        temp_form.remove(); // in case it previous existed
                        temp_form = $('<div id="ajaxoverlay-formresponse-temp">'+response+'</div>').appendTo('body');
                        methods.spawnOverlay();
                        methods.spawnPopup(temp_form, methods.bindEvents);
                    },
                    error: function () {
                        methods.removeEverything(false);
                    }
                });
                return false;
            },

            spawnOverlay : function () {

                // hide existing if necessary
                //methods.removeEverything(false);
                methods.removeEverything(true);

                if (options.overlay) {

                    methods.debug('creating background overlay');

                    // create overlay bg first
                    if (options.extraclass !== '') {
                        options.extraclass = ' ' + options.extraclass;
                    }

                    var pageheight = $(document).height();
                    var overlay = $('<div class="ajax-overlay-bg' + options.extraclass + '"></div>');
                    overlay.prependTo('body').css({ 'background' : options.background, 'height' : pageheight + 'px' }).fadeTo(0, options.opacity);

                }

            },

            spawnPopup : function (content, callback) {

                methods.debug('adding popup and positioning it onscreen');

                // by default assume the popup should be inserted before the first element inside <body>
                var bottomlayer = $('body').children().first();

                if (options.overlay) {
                    // if we're using an overlay then insert the popup before that
                    bottomlayer = 'div.ajax-overlay-bg';
                }

                // add the popup div, set up its dimensions and hide it
                var popup = $('<div class="ajax-popup-window' + options.extraclass + ' ' + options.columnwidth + '"></div>');

                // figure out a default width/height
                var css = { width: options.width + 'px' };

                if (options.columnwidth) {
                    css.width = '';
                }
                if (options.height) {
                    css.height = options.height + 'px';
                }

                // have to do these as separate steps or browser hangs
                popup.insertBefore(bottomlayer).css(css).hide();
                var c = $(content);
		        c.appendTo(popup);
                popup.show();

                if (options.dobeforeopen) {
                    options.dobeforeopen.call($current_item); // receives the original link element as an argument
                }

                if (options.source) {
                    $(options.source).show(); // breaks popup
                }

                // calculate center coords, then position and show it
                var top  = (($(window).height() - popup.outerHeight()) / 2 + $(window).scrollTop() + "px");
                var left = (($(window).width() - popup.outerWidth()) / 2 + $(window).scrollLeft() + "px");
                popup.css({top: top, left: left}).show();
                
                if (options.showclosebutton) {
                    popup.prepend('<div class="ajax-close-button"><a href="#">x</a></div>');
                }

                popup.attr('tabindex', '-1').focus();

                // call the event binder
                if (typeof callback === 'function') {
                    callback.call(this);
                }

            },

            bindEvents : function () {

                methods.debug('binding click events for close buttons etc');

                // if recursive, bind on links inside the new div... careful.
                if (options.recursiveselector) {
                    $('div.ajax-popup-window ' + options.recursiveselector).ajaxoverlay(settings);
                }

                $('div.ajax-close-button a').live('click', function (event) {
                    methods.removeEverything(true);
                    return event.preventDefault();
                });

                if (options.overlay) {
                    $('div.ajax-overlay-bg').live('click', function (event) {
                        methods.removeEverything(true);
                        return event.preventDefault();
                    });
                }

                if (options.closebuttonselector) {
                    $(options.closebuttonselector).live('click', function (event) {
                        methods.removeEverything(true);
                        return event.preventDefault();
                    });
                }

                $(document).keydown(function (event) {
                    if (event.keyCode === 27) {
                        methods.removeEverything(true);
                    }
                });

                if (options.doafteropen) {
                    options.doafteropen.call($current_item); // receives the original link element as an argument
                }

            },

            removeEverything : function (use_callback) {

                methods.debug('removing overlay elements from page and unbinding events');

                if (options.dobeforeclose && use_callback) {
                    options.dobeforeclose.call($current_item); // receives the original link element as an argument
                }

                var content = $('.ajax-popup-window').children();

                if (content.length !== 0) {
                    $(content.get(1)).appendTo('body').hide();
                }
                $('.ajax-popup-window, .ajax-overlay-bg').remove();

                if (options.doafterclose && use_callback) {
                    options.doafterclose.call($current_item); // receives the original link element as an argument
                }

                // remove original bindings
                //($current_item).unbind('mousedown');
                $('div.ajax-close-button a').die('click');
                if (options.overlay) { $('div.ajax-overlay-bg').die('click'); }
                if (options.closebuttonselector) { $(options.closebuttonselector).die('click'); }
                $(document).unbind('keydown');

                // clear form bindings if set
                if (options.form.selector) { // the user passed a form to submit
                    if (options.form.trigger) {
                        $(options.form.trigger).die('click');
                    } else {
                        var form = $(options.form.selector);
                        form.die('submit');
                    }
                }

              //  toggleHideOnPopupElements("visible"); // also gu-specific
                return false;
            }

        };

        return this.each(function () {

            if (settings) {
                $.extend(options, settings);
            }
            var $me = $(this); // prevents confusion with 'this', the plugin itself

            $me.mousedown(function (e) {

                methods.debug('user has clicked on element');

                $current_item = $me; // store the current item for use later
                return methods.init.call(e, $current_item);
            });

        });

    };

})(jQuery);
