class textWiggle {
    constructor(freq, amp, settings = {
        letterSpace: 0,
        scaleAmp: 2,
        rotateAmp: 30,
        translateAmp: 20
    }) {
        this.freq = freq, this.amp = amp;
        this.position = [0, 0];
        this.scale = [100, 100];
        this.rotate = 0;
        this.fill = 0;
        this.stroke = 0;
        this.str = '';
        this.letterSpace = settings.letterSpace;

        this.scaleAmp = settings.scaleAmp,
            this.rotateAmp = settings.rotateAmp,
            this.translateAmp = typeof settings.translateAmp == 'number' ? [settings.translateAmp, settings.translateAmp] : settings.translateAmp;
    }

    textSize(n) {
        if (arguments.length == 1) {
            this.textsize = n;
            textSize(n);
        } else {
            this.textsize = textSize();
        }
    }
    text(str, x, y) {
        if (typeof str == 'undefined') {
            str = '';
        }
        this.str = str;

        textSize()
        let totalWidth = textWidth(str);
        for (let i = 0; i < this.str.length; i++) {
            let c = this.str.codePointAt(i);
            noiseDetail(8, 0.5)
            let n = noise(c + frameCount / frameRate() * this.freq);
            // console.log(n > 0.5);
            n = (n - 0.5) * 2;
            // console.log(n);

            push();
            translate(x, y);

            switch (rectMode()._curElement._rectMode) {
                case 'corner':
                case 'corners':
                    translate(0, 0);
                    break;
                case 'center':
                case 'radius':
                    translate(-totalWidth * (1 + this.letterSpace / textSize()) / 2, 0);
                    // translate(-totalWidth / 2, 0);
                    break;
            }

            let tAlign = textAlign();
            switch (tAlign.horizontal) {
                case 'left':
                    translate(totalWidth * (1 + this.letterSpace / textSize()) / 2, 0);
                    break;
                case 'center':
                    // translate(-totalWidth / 2, 0);

                    break;
                case 'right':
                    translate(-totalWidth * (1 + this.letterSpace / textSize()) / 2, 0);
                    break;
            }
            if (i != 0) {
                // translate(textWidth(str.slice(0, i)) * (1 + this.letterspace), 0);
                translate(textWidth(str.slice(0, i)) * (1 + this.letterSpace / textSize()), 0);
            }

            rotate(n * PI * this.amp * this.rotateAmp / 360);
            scale(1 + n * this.amp * this.scaleAmp);
            translate(
                noise(n, x) * Math.sin(n * PI * 2) * this.amp * this.translateAmp[0],
                noise(n, y) * Math.cos(n * PI * 2) * this.amp * this.translateAmp[1]
            );
            {
                push();
                translate(textWidth(str[i]) / 2, 0);
                // switch (textAlign().horizontal) {
                //     case 'center':
                //         translate(textWidth(str[i]), 0);
                //         break;
                //     case 'left':
                //         translate(textWidth(str[i]), 0);
                //         break;
                //     case 'right':
                //         translate(textWidth(str[i]), 0);
                //         break;
                // }
                textAlign(CENTER, CENTER);

                text(str[i], 0, 0);
                pop();
            }
            pop();
        }
    }
}