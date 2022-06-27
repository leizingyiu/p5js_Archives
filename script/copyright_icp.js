function copyrightAndICP_AtBodyEnd() {
    let icpStr = window.location.host.indexOf('leizingyiu.net') != -1 ? '粤ICP备2020086793号' : 'To learn more, please visit www.leizingyiu.net';
    let rightStr = `©${(new Date()).getFullYear()} Leizingyiu. All rights reserved.`
    let mark = document.createElement('mark');
    [icpStr, rightStr].map((str, idx) => {
        let i = document.createElement('i');
        i.innerText = str;
        i.style.cssText = `
font-style: normal;
transform:scale(0.72);
transform-origin:${idx * 100}% 100%;
`
        mark.appendChild(i)
    })
    mark.style.cssText = `
font-weight: 300;
opacity: 0.5;
background: none;
font-size: 12px;
width: 100%;
quotes: none;
text-decoration: none;
text-transform: none;
font-style: normal;
display: flex;
justify-content: space-between;
position: sticky;
top: 100vh;
margin-bottom: 0.5em;`;

    document.getElementsByTagName('body')[0].appendChild(mark);

    if (document.querySelector('body').offsetHeight < document.querySelector('html').clientHeight) {
        document.querySelector('body').style.minHeight = document.querySelector('html').clientHeight + 'px';
    }
}