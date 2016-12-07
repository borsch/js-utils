/**
 * Created by Oleh on 07.12.2016.
 */
(function(){

    const DEFAULT_FORMAT_TEMPLATE = 'dd EEE MMM yyyy';

    /**
     * format date with passing template
     *
     * @param [template] {string} - template for date
     * @param [locale] {string} - locale for names of week and month. default is 'en'
     *
     * @return {string} formatted date
     */
    Date.prototype.format = function(template, locale) {
        template = template || DEFAULT_FORMAT_TEMPLATE;


        locale = locale || 'en';
        if (LOCALES.indexOf(locale) < 0)
            locale = 'en';

        var d = this;
        var date = d.getDate(),
            day = d.getDay(),
            month = d.getMonth(),
            year = d.getYear(),
            seconds = d.getSeconds(),
            minutes = d.getMinutes(),
            hours = d.getHours();

        var a = {
            date: date,
            month: month,
            year: year,
            seconds: seconds,
            minutes: minutes,
            hours: hours
        };

        var params = {
            MMMM: MONTH[locale].long[month],
            MMM: MONTH[locale].short[month],
            MM: prepend(month + 1, 2),
            M: month + 1,
            yyyy: 1900 + year,
            yy: (1900 + year + '').substr(2),
            dd: date,
            EEEE: DAYS[locale].long[day],
            EEE: DAYS[locale].short[day]
        };

        for (var key in params) {
            template = template.replace(key, params[key]);
        }

        return template;
    };

    /**
     * prepend zeros(0) to the beginning of the the string
     *
     * @param value - string should be changed
     * @param required_length - max length of string
     * @returns {string}
     */
    function prepend(value, required_length) {
        if (typeof value !== 'string')
            value = value + '';

        var diff = value.length - required_length,
            prefix = '';

        for (var i = 0; i < diff; ++i)
            prefix += '0';

        return prefix + value;
    }

    var LOCALES = ['uk', 'en'];

    var MONTH = {
        en: {
            short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }, uk: {
            short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    };

    var DAYS = {
        en: {
            short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        }, uk: {
            short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        }
    };
})();