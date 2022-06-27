{
    let blockMax = 2;
    let mainSelector = '#flex_main';
    let main = document.querySelector(mainSelector);
    document.querySelector('html').classList.add('loading');
    fetch('settings.json')
        .then(response => response.ok == true ? response.json() : '')
        .then(function (json) {
            let n = Object.keys(json.previews).length;
            let arr = makeArrDeep(n, blockMax);
            deepArrToUl(arr, main);
            setLiColor();
            setChildUlLiFlexType(main);
            setliClass();
        }).then(() => {
            loadingMain();
            htmlTouchDetect();
        }).then(() => {
            document.querySelector('html').classList.remove('loading');

        });
}