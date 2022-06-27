a = ``

a = a.replace(/\d{4}/g, function (key, idx, str) {
    key = key.split('').map((i, dx) => dx == 1 ? i + ':' : i).join('');
    return `[${key}]`
}).replace(/\]\s*\[/g, '][');
console.log(a);