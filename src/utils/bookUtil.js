/* eslint-disable */

function getCoverURL(book, callback) {
    book.coverUrl().then(function (blobUrl) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var recoveredBlob = xhr.response;
            var reader = new FileReader();
            reader.onload = function () {
                callback && callback(reader.result);
            };
            reader.readAsDataURL(recoveredBlob);
        };
        xhr.open('GET', blobUrl);
        xhr.send();
    });
}

const format = function (date, f) {
    var o = {
        'M+': date.getMonth() + 1, // month
        'd+': date.getDate(),    // day
        'h+': date.getHours(),   // hour
        'm+': date.getMinutes(), // minute
        's+': date.getSeconds(), // second
        'q+': Math.floor((date.getMonth() + 3) / 3),  // quarter
        'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(f)) f = f.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(f)) f = f.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
    return f
}