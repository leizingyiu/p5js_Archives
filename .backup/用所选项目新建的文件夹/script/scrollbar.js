let bar = document.createElement('b');
bar.id = 'scrollBar';
bar.style.cssText = `
background:#fff;
position:fixed;
right:0;
top:0;
width:${2}px;
height:attr( data-height );
`;

window.addEventListener('load', () => {
    bar.setAttribute('data-height', Math.pow(window.innerHeight, 2) / document.body.scrollHeight + 'px');

    document.body.addEventListener('resize', () => {
        console.log(document.body.offsetHeight, document.body.scrollHeight, window.innerHeight);
    });
    window.addEventListener('scroll', () => {
        console.log(document.body.offsetHeight, document.body.scrollHeight, window.innerHeight);
        bar.style.transform = `translate(0,${0})`
    })
});
document.body.appendChild(bar);