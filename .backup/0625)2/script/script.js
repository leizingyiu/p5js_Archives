function setLiColor() {
    [...document.querySelectorAll('li')].map((li, idx) => {// 为每个li 添加不同的颜色
        if (li.childElementCount == 0) {
            let c = `hsl(${Math.floor(Math.random() * 10) * 20 + 160}, ${(Math.random() - 0.5) * 2 * 4 + 68}%, ${(Math.random() - 0.5) * 2 * 3 + 45}%)`;
            document.querySelector('html').style.cssText += `--c-${idx}:${c}`;
            li.style.borderColor = `var(--c-${idx})`;
            li.setAttribute('c', c);
            li.setAttribute('idx', idx);
            // li.classList.add('grid');
        }
    });
}

function setChildUlLiFlexType(dom, sameBoolean = true) {
    let typeAttrName = "data-flex-type";
    let typeAttrArr = ['col', 'row'];
    let type = 'col';

    if (dom.parentElement.hasAttribute(typeAttrName) &&
        typeAttrArr.indexOf(dom.parentElement.getAttribute(typeAttrName)) != -1) {
        let parentType = dom.parentElement.getAttribute(typeAttrName);
        if (dom.localName == "li") {
            sameBoolean = true;
        } else {
            sameBoolean = false;
        }
        type = typeAttrArr[(typeAttrArr.indexOf(parentType) + Number(sameBoolean) + 1) % typeAttrArr.length];


    }

    dom.setAttribute(typeAttrName, type);
    if (dom.querySelectorAll('li') != null) {
        [...dom.querySelectorAll('li')].map(li => {
            setChildUlLiFlexType(li, true);
        })
    }

    if (dom.querySelectorAll('ul') != null) {
        [...dom.querySelectorAll('ul')].map(ul => {
            setChildUlLiFlexType(ul, false);
        })
    }

}

function deepArrToUl(arr, ulDom) {
    arr.map(a => {
        let li = document.createElement('li');
        ulDom.appendChild(li);
        if (typeof a == 'object') {
            let ul = document.createElement('ul');
            li.appendChild(ul);
            deepArrToUl(a, ul);
        }
    });
}

function htmlTouchDetect() {
    // console.log('load');
    let t = document.querySelector('html');

    document.querySelector('html').addEventListener('touchstart', _ => {
        console.log(t);
        t.classList.add('touched');
    });
    document.querySelector('html').addEventListener('touchend', _ => {
        console.log(t);
        t.classList.remove('touched');
    });

}