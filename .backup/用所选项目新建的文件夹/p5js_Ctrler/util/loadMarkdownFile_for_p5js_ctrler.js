enMdPath = typeof enMdPath != 'undefined' && enMdPath ? enMdPath : './README_en.md',
    cnMdPath = typeof cnMdPath != 'undefined' && cnMdPath ? cnMdPath : './README.md',
    mdtempletsPath = typeof mdtempletsPath != 'undefined' && mdtempletsPath ? mdtempletsPath : './mdTemplets',
    mdtempletsHrefPrefix = typeof mdtempletsHrefPrefix != 'undefined' && mdtempletsHrefPrefix ? mdtempletsHrefPrefix : '',
    path_base = typeof path_base != 'undefined' && path_base ? path_base : window.location.href;

mdTempletsList = [
    'links_cn', 'links_en',
    'ver_links_cn', 'ver_links_en',
    'thanks'];
mdTempletsListReg = new RegExp('(' + mdTempletsList.map(word => `(${word})`).join('|') + ')', 'g');



function mdTempletsInsert(dom) {
    console.trace();

    [...dom.querySelectorAll('*')].map(d => {
        let match = (d.innerText.match(mdTempletsListReg));
        if (match && d.children.length == 0) {
            d.setAttribute('data-md-templet', match[0]);
        }
    });
    mdTempletsList.map(filename => {
        let fileUrl = mdtempletsPath + '/' + filename + '.md';
        let reg = new RegExp(`<#${filename}#>`, 'g');
        if ([...dom.querySelectorAll(`[data-md-templet=${filename}]`)].some(d => d.innerText.match(reg))) {
            fetch(fileUrl).then(response => response.text()).then(r => {
                [...dom.querySelectorAll(`[data-md-templet=${filename}]`)].map(d => {
                    let match = d.innerText.match(reg);
                    if (match) {
                        let temp = document.createElement(d.localName);
                        temp.innerText = match[0];
                        let htmlReg = new RegExp(temp.innerHTML, 'g');
                        let innerHtml = marked.marked(r);
                        console.log(innerHtml);
                        temp.innerHTML = innerHtml;
                        [...temp.querySelectorAll('a')].filter(a => a.href.match(window.location.hostname) != null).map(a => {
                            // if (a.href.match(window.location.hostname) != null) {
                            a.setAttribute('href', mdtempletsHrefPrefix + a.getAttribute('href'));
                            // }
                        });
                        console.log(temp.innerHTML);
                        d.innerHTML = d.innerHTML.replace(htmlReg, temp.innerHTML);
                        delete temp;
                    }
                });
            }).then(_ => {
                relative_path_to_full_path(path_base);
                hljs.initHighlightingOnLoad();
            });
        }
    });
}

function loadMarkdownFile(callback = () => {
    hljs.initHighlightingOnLoad();

}) {
    console.trace();

    /* 加载写人 markdown 文件 */
    [...document.querySelectorAll(".markdown-body")].map(function (dom) {
        fetch(dom.getAttribute("data-mdfile")).then(function (response) {
            return response.text();
        }).then(function (r) {
            dom.innerHTML = marked.marked(r);
        }).then(callback);

    });



    var arg = [...arguments];
    arg.map(a => a());
    return this;
}
function addBackToCatalog() {
    console.trace();

    let language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? 'en' : 'cn';
    let html = {
        'cn': '<small style="float:right;font-weight:400;font-size: 0.5em; margin-top: 1em;">返回<a href="#目录">目录</a></small>',
        'en': '<small style="float:right;font-weight:400;font-size: 0.5em; margin-top: 1em;">return to <a href="#directory">directory</a></small > '
    }[language];
    [...document.body.querySelectorAll('h2,h3')].map(dom => {
        dom.insertAdjacentHTML('beforeend', html);
    });
}

function loadReadmeFile(callback = (p) => { }) {
    console.trace();
    let p = document.createElement('p'),
        language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? 'en' : 'cn';

    p.id = 'readme' + String(Math.random()).replace(/\./, ''),
        p.classList.add('markdown-body'),
        p.setAttribute('data-mdfile',
            language == 'en' ? enMdPath : cnMdPath
        );

    if (document.body.clientHeight > document.body.clientWidth) {
        p.classList.add('mob');
    }

    let style = document.createElement('style');
    style.innerHTML = `#${p.id}{
margin: 0;
max-height: 100vh;
min-height: 90vh;
max-width: 48vw;
min-width: 400px;
opacity:1;

padding: 1em;
overflow: scroll;
position: fixed;
right: 0;
top: 0;
z-index: 0;
background-color: #ffffffcc;

white-space: inherit;
word-break: break-all;
transition: max-width 0.5s ease ,
min-width 0.5s ease ,
max-height 0.5s ease ,
min-height 0.5s ease ,
padding 0.5s ease ,
margin 0.5s ease ,
border 0.5s ease ,
opacity 0.5s ease ;
}

#${p.id}.mob {
max-width: unset;
max-height: unset;
min-width: unset;
width: 80vw;
position: relative;
left: 50%;
transform: translate(-50%,0);
overflow: auto;
}

#${p.id}.hide{
    max-width:0;
    min-width:0;
    opacity:0;
    padding: 0;
    margin:0;
    border:0;
}

#${p.id}.mob.hide {
    min-height:0!important;
    max-height:0!important;
}
`;

    [p, style].every(dom => document.body.appendChild(dom));
    loadMarkdownFile(() => {
        callback(p);
    });
};

function relative_path_to_full_path(path_base = top.location.href) {
    console.trace();

    console.log(path_base, 'relative path to full path');

    [...document.querySelectorAll('a')].map(a => {
        let ahref = new URL(a.getAttribute('href'), path_base);
        let u = new URL(ahref);
        if (u.search) {
            let obj = {};
            let replaceBoo = false;

            u.search.replace(/^\?/, '').split('&').map(i => {
                i.replace(/([^=]+)=(.*)/, function () {
                    if (arguments[2].match(/^[.\/]/)) {
                        obj[arguments[1]] = (new URL(arguments[2], path_base)).href;
                        replaceBoo = true;
                    } else {
                        obj[arguments[1]] = arguments[2];
                    }
                });
            });

            if (replaceBoo == true) {
                u.search = '?' + Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('&');
                let href = new URL(u.href, path_base);
                a.setAttribute('href', href);
                console.log(a, '\nhref of this <a> have been converted to absolute paths');
            }
        };

        // console.log(a, a.hasAttribute('href'));
        // console.log(a, a.getAttribute('href'), a.getAttribute('href').match(/^[.\/]/));

        if (a.hasAttribute('href') &&
            a.getAttribute('href').match(/^[.\/]/) != null) {
            let href = new URL(a.getAttribute('href'), path_base);
            console.log(a.getAttribute('href'), href, path_base);
            a.setAttribute('href', href);
            console.log(a, '\nhref of this <a> have been converted to absolute paths');
        }
    });
}