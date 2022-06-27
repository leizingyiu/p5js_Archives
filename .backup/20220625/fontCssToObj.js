javascript:
    cssText = document.querySelector('pre').innerText;

function copyStr(str) {
    var a = document.createElement("textarea");
    a.value = str;
    document.body.appendChild(a);
    a.select();
    document.execCommand("Copy");
    a.style.display = "none";
    a.parentElement.removeChild(a);
    window.confirm("内容已复制到剪贴板⬇️\n\n" + str);
};

result = '[' + cssText.replace(/: /g, ':')
    .replace(/([^\s:]+):([^;]+);/g, '"$1":"$2",')
    .replace(/@font-face/g, ',')
    .replace(/'"|"'/g, '"')
    .replace(/^,/, '')
    .replace(/,\s*\}/g, '}') + ']';

jsonArr = JSON.parse(result);
jsonArr.map((j, idx) => {
    if (j.src.match(/(?<=url\(['"])[^'"]+/)) {
        jsonArr[idx].src = encodeURIComponent(j.src.match(/(?<=url\(['"])[^'"]+/)[0]);
    }
});

let p5FontPreloadScript = '';

jsonArr.map((j, idx, arr) => {
    p5FontPreloadScript += `${j['font-family']}_${j['font-style']}_${j['font-weight']} = loadFont('${j.src}');\n`
});
console.log(p5FontPreloadScript);
copyStr(p5FontPreloadScript);