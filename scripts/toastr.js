// By: Hans Fjällemark and John Papa
// https://github.com/KnockedUp/toastR
// 
// Modified to support css styling instead of inline styling
// Based on original version at https://github.com/Srirangan/notifer.js/

(function(window, $) {
    window.toastR = (function() {
        var 
            defaults = {
                debug: false,
                containerId: 'toast-container',
                defaultIconClass: 'toast-info',
                fadeIn: 300,
                fadeOut: 300,
                iconClasses: {
                    error: 'toast-error',
                    info: 'toast-info',
                    success: 'toast-success',
                    warning: 'toast-warning'
                },
                timeOut: 5000, // Set timeOut to 0 to make it sticky
                positionClass: 'toast-top-right',
                stacked: true,
                titleClass: 'toast-title'
            },

            error = function(message, title) {
                notify({
                    iconClass: getOptions().iconClasses.error,
                    message: message,
                    title: title
                })
            },

            getContainer = function(options) {
                var $container = $('#' + options.containerId)

                if ($container.length)
                    return $container

                $container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass)

                $container.appendTo($('body'))

                return $container
            },

            getOptions = function() {
                return $.extend({}, defaults, toastR.options)
            },

            info = function(message, title) {
                notify({
                    iconClass: getOptions().iconClasses.info,
                    message: message,
                    title: title
                })
            },

            notify = function(map) {
                var 
                    options = getOptions(),
                    iconClass = map.iconClass || options.defaultIconClass,
                    $container = getContainer(options),
                    $toastElement = $('<div/>'),
                    $titleElement = $('<div/>'),
                    $messageElement = $('<div/>')

                if (options.debug)
                    console.log({ options: options, map: map })

                if (map.iconClass)
                    $toastElement.addClass(iconClass)

                if (map.title) {
                    $titleElement.append(map.title).addClass(options.titleClass)
                    $toastElement.append($titleElement)
                }

                if (map.message) {
                    $messageElement.append(map.message)
                    $toastElement.append($messageElement)
                }

                var fadeAway = function() {
                    var fade = function() {
                        return $toastElement.fadeOut(options.fadeOut)
                    }

                    $.when(fade()).done(function() {
                        $toastElement.remove()

                        if ($container.children().length === 0)
                            $container.remove()
                    })
                }

                if (!options.stacked)
                    $container.children().remove()

                $toastElement.hide()
                $container.prepend($toastElement)
                $toastElement.fadeIn(options.fadeIn)

                if (options.timeOut > 0)
                    setTimeout(fadeAway, options.timeOut)

                $toastElement.click(fadeAway)
            },

            success = function(message, title) {
                notify({
                    iconClass: getOptions().iconClasses.success,
                    message: message,
                    title: title
                })
            },

            warning = function(message, title) {
                notify({
                    iconClass: getOptions().iconClasses.warning,
                    message: message,
                    title: title
                })
            }

        return {
            error: error,
            info: info,
            options: {},
            success: success,
            warning: warning
        }
    })()
} (window, jQuery))