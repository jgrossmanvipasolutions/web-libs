/**********************************************************
 * (c) 2014 Vipa Solutions L.L.C.                          *
 * MIWT Form Helper jQuery Plugin (requires jQuery 1.4.3+) *
 * @author Michael Garner                                  *
 *                                                         *
 * This library is intended to help hook into a MIWT       *
 * generated form and use its built-in helpers and API.    *
 **********************************************************/

(function($){
    var NAME_SPACE = "miwtFormHelper";
    var Helpers = function Helpers(form){
        //The Forms operated on.
        var root = form;
        /**
         * @object formData Object of arrays that store functions to be called.
         */
        var formData = {
            onSubmit: [],
            postUpdate: [],
            preUpdate: [],
            /* scroll: new Array(),TODO: MAKE THIS WORK */
            /* preProcessNode: new Array(),/* TODO: MAKE THIS WORK */
            processRedirect: []/* TODO: MAKE THIS WORK */
            /* postProcessNode: new Array(),/* TODO: MAKE THIS WORK */
        };
        /**
         * @object methods Object of api methods.
         */
        var methods = {
            /**
             * @function set
             * Sets a submit_option to the value passed in.
             * @param string option The submit option to change.
             * @param mixed value The value for the option.
             */
            set: function set(option, value){
                if(typeof option !== 'string' || typeof value === 'undefined'){
                    $.error('Incorrect call: Cannot call "set" with option: ' + option + ' or value: ' + value + ', ' + NAME_SPACE);
                    return;
                }
                if(option === "btnHit"){
                    option = "btnhit";
                }
                else if(option === "ajaxTo"){
                    option = "ajax_to";
                }
                var newOpt = {};
                newOpt[option] = value;
                root.submit_options = $.extend(newOpt, root.submit_options);
            },
            /**
             * @function add
             * Adds data to an event of the form which is passed in.
             * @param string eventType The event to add a function to.
             * @param mixed The data to be added to the form event.
             */
            add: function add(eventType, f, opts){
                var formDataItem = formData[eventType];
                var defaults;
                if(typeof formDataItem !== 'undefined' && formDataItem !== null){
                    switch(typeof formDataItem){
                        case 'object':
                            if(eventType == 'processRedirect'){
                                defaults = {
                                    ajax: true
                                };
                                if(typeof opts === 'object'){
                                    var settings = $.extend(opts, defaults);
                                    if(settings.ajax !== root.submit_options.ajax){
                                        methods.set("ajax", settings.ajax);
                                    }
                                }
                                else{
                                    methods.set("ajax", defaults.ajax);
                                }
                            }
                            formDataItem.push(f);
                            $.extend({formData: formData}, $(root).data('helpers').formData);
                            break;
                        case 'string':
                            formDataItem = f;
                            break;
                        case 'number':
                            formDataItem = f;
                            break;
                        case 'boolean':
                            formDataItem = f;
                            break;
                    }
                }
                else{
                    $.error('Incorrect call: ' + eventType + ' is not an eventType that exists on jQuery.' + NAME_SPACE);
                }
            },

            /**
             * @function remove
             * Removes a function from an event of the form.
             * @param string eventType The event to add a function to.
             * @param mixed The data to be added to the form event.
             */
            remove: function remove(eventType, f){
                var formDataItem = formData[eventType];
                var removeIndex;
                if(typeof formDataItem !== 'undefined' && formDataItem !== null){
                    switch(typeof formDataItem){
                        case 'object':
                            removeIndex = formDataItem.indexOf(f);
                            if(removeIndex > -1){
                                formDataItem.splice(removeIndex, 1);
                            }
                            break;
                        case 'string':
                            formDataItem = '';
                            break;
                        case 'number':
                            formDataItem = 60; //restores default value
                            break;
                        case 'boolean':
                            formDataItem = true; //restores default value
                            break;
                    }
                }
                else{
                    $.error('Incorrect call: ' + eventType + ' is not an eventType that exists on jQuery.' + NAME_SPACE);
                }
            },

            /**
             * @function logData
             * Logs all functions stored for an event of the form.
             * @param string eventType The event whose functions should be logged.
             */
            logData: function logData(eventType){
                var formDataItem = formData[eventType];
                if(typeof formDataItem !== 'undefined' && formDataItem !== null){
                    console.log(formDataItem);
                }
                else{
                    $.error('Incorrect call: ' + eventType + ' is not an eventType that exists on jQuery.' + NAME_SPACE);
                }
            },
            /**
             * @function logOptions
             * Logs all options store on the form.
             */
            logOptions: function logOptions(){
                console.log(root.submit_options);
            },
            /*********************
             * MIWT - onSubmit    *
             *********************/

            /**
             * @function onSubmitCaller
             * Calls all functions store for the onSubmit event of the form.
             * Should not be called directly.
             */
            onSubmitCaller: function onSubmitCaller(data, args){
                var form = data;
                var formArguments = args;
                var returnValue = true;

                $.each(formData['onSubmit'], function(idx, f){
                    returnValue = f.apply(form, formArguments) && returnValue;
                });

                return returnValue;
            },
            /*********************
             * MIWT - postUpdate  *
             *********************/

            /**
             * @function postUpdateCaller
             * Calls all functions from the postUpdate event of the form at postUpdate.
             * Should not be called directly.
             */
            postUpdateCaller: function postUpdateCaller(data, args){
                var form = data;
                var formArguments = args;
                return $.each(formData['postUpdate'], function(idx, f){
                    f.apply(form, formArguments);
                });
            },
            /*********************
             * MIWT - preUpdate  *
             *********************/

            /**
             * @function preUpdateCaller
             * Calls all functions from the preUpdate event of the form at preUpdate.
             * Should not be called directly.
             */
            preUpdateCaller: function preUpdateCaller(data, args){
                var form = data;
                var formArguments = args;
                return $.each(formData['preUpdate'], function(idx, f){
                    f.apply(form, formArguments);
                });
            },
            /*********************
             * MIWT - scroll  *
             *********************/

            /**
             * @function scroll
             * Calls all functions from the scroll event of the form at scroll.
             * Should not be called directly.

             scroll: function scroll(data, args){
      var form = data;
      var formArguments = args;
      return $.each(helpers.formData['scroll'], function(idx, f){
      f.apply(form, formArguments);
    });
    },
             */
            /*********************
             * MIWT - processRedirect  *
             *********************/

            /**
             * @function processRedirectCaller
             * Calls all functions from the processRedirect event of the form at postUpdate.
             * Should not be called directly.
             */
            processRedirectCaller: function processRedirectCaller(data, args){
                var form = data;
                var formArguments = args;
                var currReturn;
                var returnValue;

                $.each(formData['processRedirect'], function(idx, f){
                    currReturn = f.apply(form, formArguments);
                    if(typeof currReturn === "string"){
                        returnValue = currReturn;
                    }
                });
                if(typeof returnValue !== "string"){
                    returnValue = true;
                }

                return returnValue;
            }
        };
        return {methods: methods, formData: formData};
    };

    $.fn[NAME_SPACE] = function() {
        var args = arguments;
        var method = args[0].substring(0, 3);
        var event;
        if(method === "rem"){
            method = "remove";
            event = args[0].replace("remove", "").charAt(0).toLowerCase() + args[0].replace("remove", "").substring(1);
        }
        else if(method === "log"){
            method = args[0];
            event = args[1];
        }
        else{
            event = args[0].replace(method, "").charAt(0).toLowerCase() + args[0].replace(method, "").substring(1);
        }
        args = new Array(method, event, args[1]);
        return $(this).each(function(idx, el){
            if(typeof($(this).data(NAME_SPACE)) === 'undefined'){
                var helpers;
                if($(el).data('helpers')){
                    helpers = $(el).data('helpers');
                }
                else{
                    helpers = new Helpers(el);
                    $(el).data('helpers', helpers);
                }
                currOptions = el.submit_options;
                defaultOptions = {
                    postUpdate: function(){
                        var data = this;
                        var args = arguments;
                        return helpers.methods.postUpdateCaller(data, args);
                    },
                    onSubmit: function(){
                        var data = this;
                        var args = arguments;
                        return helpers.methods.onSubmitCaller(data, args);
                    },
                    processRedirect: function(){
                        var data = this;
                        var args = arguments;
                        return helpers.methods.processRedirectCaller(data, args);
                    }
                };
                el.submit_options = $.extend(defaultOptions, currOptions);
                if(helpers.methods[method]){
                    return helpers.methods[method].apply(this, Array.prototype.slice.call(args, 1));
                }
                else {
                    $.error('Method ' +  method + ' does not exist on jQuery.' + NAME_SPACE);
                }
            }
        });
    };
})(jQuery);