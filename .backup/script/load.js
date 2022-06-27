let useCapture = true;
let kbUseCapture = true;


var ua = navigator.userAgent.toLowerCase(),
    isIos = /(ios|ipad|iphone)/.test(ua) || ua.indexOf('macintosh') > -1 && 'ontouchend' in document,
    isAndroid = /android/.test(ua);


function setliClass(selector = '#flex_main li') {
    [...document.querySelectorAll(selector)].map(li => {
        if (li.childElementCount == 0) {
            li.classList.add('notSet');
        } else {
            li.classList.add('branches');
        }
    });
}

function loadingMain() {
    fetch('settings.json')
        .then(response => response.ok == true ? response.json() : '')
        .then(function (json) {
            if (json == '') {
                return json
            };

            let layout = document.querySelector('#frameLayout');

            let defaultFrame = json.default;
            let iframe = document.createElement('iframe');
            iframe.src = defaultFrame.links[Math.floor(Math.random() * defaultFrame.links.length)];
            loadFrame(iframe)

            layout.classList.add('hide');



            Object.keys(json.previews).map(k => {
                let h2 = document.createElement('h2'),
                    span = document.createElement('span'),
                    p = document.createElement('p'),
                    a = document.createElement('a'),
                    a2 = document.createElement('a');
                video = document.createElement('video');

                let li = document.querySelector('.notSet');
                li.classList.remove('notSet');
                li.classList.add('item');

                li.setAttribute('name', k); // key 
                h2.innerHTML = json.previews[k].title; // title
                span.innerHTML = json.previews[k].describe; // describe

                span.innerHTML = span.innerHTML.replace(/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g,
                    `<a href="$1" style="background : ${li.getAttribute('c')};">$1</a>`);

                li.setAttribute('iframeSrc', json.previews[k].pagePath); // pagePath

                p.classList.add('links');

                a.href = json.previews[k].outlink; // link
                a.classList.add('link');
                a.classList.add('outlink');

                a2.href = json.previews[k].pagePath;
                a2.classList.add('link');
                a2.classList.add('newTab');
                a2.target = '_blank';
                a2.innerText = 'Open in new tab';
                a2.style.backgroundColor = `${li.getAttribute('c')}`;

                if (a.href.indexOf('openprocessing') != -1) {
                    a.innerText = "Go to openprocessing to browse and like 💘 "
                } else if (a.href.indexOf('github') != -1) {
                    a.innerText = "Go to github to browse and star 🌟 "

                } else {
                    a.innerText = `Go to ${a.href.match(/(\:\/\/)[^\/\?#\:]+/)[0].replace(/\//g, '')} to browse`;
                }
                a.style.cssText += ` background : ${li.getAttribute('c')};`;

                li.style.background = ` url("${json.previews[k].previewImg}")  center    no-repeat local `; // previewImg
                li.style.backgroundSize = "cover";

                li.appendChild(h2);
                h2.appendChild(span);
                // li.appendChild(a);
                li.appendChild(p);
                p.appendChild(a);
                p.appendChild(a2);

                [...p.querySelectorAll('.link')].map((_a, _idx, arr) => {
                    if (_idx == arr.length - 1) { return }
                    let i = document.createElement('i');
                    i.classList.add('spaceBetween');
                    _a.after(i);
                });

                if (!isIos) {
                    video.src = json.previews[k].previewVideo; // previewVideo
                    video.muted = true;
                    video.loop = true;
                    video.autoplay = true;
                    video.poster = json.previews[k].previewImg;
                    video.preload = "none";
                    li.appendChild(video);
                }

                li.addEventListener('click', function () {

                    li.setAttribute('data-activeEle', true);
                    let iframe = document.createElement('iframe');
                    iframe.src = li.getAttribute('iframeSrc');
                    loadFrame(iframe)

                    layout.classList.remove('hide');
                    layout.querySelector('h2').innerHTML = h2.innerHTML;
                    layout.querySelector('a.outlink').innerHTML = a.innerHTML;
                    layout.querySelector('a.outlink').href = a.href;
                    layout.querySelector('a.outlink').style.cssText = a.style.cssText;

                    layout.querySelector('a.newTab').innerHTML = a2.innerHTML;
                    layout.querySelector('a.newTab').href = li.getAttribute('iframeSrc');
                    layout.querySelector('a.newTab').target = a2.target;
                    layout.querySelector('a.newTab').style.cssText = a2.style.cssText;

                    layout.querySelector('#frameClose a').style.cssText = a.style.cssText;

                    layout.querySelector('#frameDescribe p').innerHTML = json.previews[k].operateDescribe[["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) != -1 ? 'cn' : 'en'];

                    layout.querySelector('#frameDescribe').style.cssText = `${json.previews[k].operateDescribePos[0].indexOf(':') != -1 ?
                        json.previews[k].operateDescribePos[0] :
                        json.previews[k].operateDescribePos[0] + ':0'};
                        ${json.previews[k].operateDescribePos[1].indexOf(':') != -1 ?
                            json.previews[k].operateDescribePos[1] :
                            json.previews[k].operateDescribePos[1] + ':0'};
                            text-align:${json.previews[k].operateDescribePos[1].replace(/:.*/g, '')};
                            `;
                    layout.querySelector('#frameDescribe p').style.cssText = `float: ${json.previews[k].operateDescribePos[1]};`;

                    [...layout.querySelectorAll('#frameTitle,#frameDescribe,#frameLink')].map(i => i.classList.remove('hide'));

                    if (json.previews[k].frameTitle == false) {
                        layout.querySelector('#frameTitle').classList.add('hide');
                    };

                    if (json.previews[k].frameDescribe == false) {
                        layout.querySelector('#frameDescribe').classList.add('hide');
                    };

                    if (json.previews[k].frameLink == false) {
                        layout.querySelector('#frameLink').classList.add('hide');
                    };

                    layout.querySelector('#frameClose a').onclick = function () {
                        layout.classList.add('hide');
                        //load default iframe
                        let ifra = document.createElement('iframe');
                        ifra.src = defaultFrame.link;
                        ifra.onload = function () {
                            console.log('default iframe');
                        };
                        loadFrame(ifra, scrollTarget = document.querySelector('[data-activeEle]'));
                        document.querySelector('[data-activeEle]').removeAttribute("data-activeEle")
                    };

                    [...layout.querySelectorAll('a')].map(_a => {
                        _a.style.background = li.getAttribute('c');
                    });
                });


                li.addEventListener('mouseover', function () {
                    [...document.querySelectorAll('li.item')].map(l => {
                        l.querySelector('video').pause();
                    });
                    try {
                        li.querySelector('video').load();
                        setTimeout(() => {
                            li.querySelector('video').play();
                        }, 200);
                    } catch (err) { }
                });

                li.addEventListener('mouseout', function () {
                    video.pause();
                });


            })
        });
}

function hToTop(el) {
    let root = document.body;
    let h = 0;
    do {
        h += el.offsetTop;
        el = el.offsetParent;
    } while (el !== root)
    return h;
}

function loadFrame(iframe, scrollTarget) {
    let frame = document.querySelector('#frame');
    if (arguments.length <= 1) {
        scrollTarget = frame;
    }
    iframe.onload = function (e) {
        let ev = e || event;
        this.focus();
        // console.log('onload', ev, this, document.activeElement);
        let d = document.querySelector('#frame iframe').contentWindow.document;
        [...d.querySelectorAll('html,body')].map(dom => {
            // dom.style.cssText = `margin: 0px; padding: 0px; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);`
            dom.style.cssText = `margin: 0px!important; padding: 0px!important;`;
        });
        if (d.querySelector('#p5_loading')) {
            d.querySelector('#p5_loading').style.cssText = `
        position:absolute;
        left:50%;top:50%;
        transform:translate(-50%,-50%);
        text-align:center;
        color:#fff;
        background:#333;
        font-size:2em;
        font-weight:700;
        font-style: oblique;
        `;
        }
        document.querySelector('#frameLayout').classList.remove('focus');
        setTimeout(() => {
            document.querySelector('#frameLayout').classList.add('focus');
        }, 1000);
    }
    frame.removeChild(frame.querySelector('iframe'));
    frame.appendChild(iframe);
    window.scrollTo({
        top: hToTop(scrollTarget),
        behavior: 'smooth'
    });
}