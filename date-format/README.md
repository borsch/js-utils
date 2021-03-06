# data format template parts 

<h2>Date formatting</h2>

```javascript
'yyyy'  //4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
'yy'  //2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
'y'  //1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
'MMMM'  //Month in year (January-December)
'MMM'  //Month in year (Jan-Dec)
'MM'  //Month in year, padded (01-12)
'M'  //Month in year (1-12)
'dd'  //Day in month, padded (01-31)
'd'  //Day in month (1-31)
'EEEE'  //Day in Week,(Sunday-Saturday)
'EEE'  //Day in Week, (Sun-Sat)
'HH'  //Hour in day, padded (00-23)
'H'  //Hour in day (0-23)
'hh'  //Hour in AM/PM, padded (01-12)
'h'  //Hour in AM/PM, (1-12)
'mm'  //Minute in hour, padded (00-59)
'm'  //Minute in hour (0-59)
'ss'  //Second in minute, padded (00-59)
's'  //Second in minute (0-59)
```

gets info from [templates from angular](https://docs.angularjs.org/api/ng/filter/date)

<h2>Add own localization</h2>

```javascript
Date.add_locale('ru', {
    short: ["Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Октб", "Нояб", "Дек"],
    long: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сетябрь", "Октябрь", "Ноябрь", "Декабрь"]
}, {
    short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    long: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Чеверг", "Пятница", "Суббота"]
});
```

Using this you can add your own localization
