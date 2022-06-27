function PC_addons(p5js_ctrler) {

    this.parent = p5js_ctrler;

    this.groupOfAddingCtrler = function (
        groupSetting = {
            'name': null,
            'displayname': 'adding ctrler group',
            'alt': ''
        },
        typeArr = ['slider', 'radio', 'button', 'checkbox', 'select', 'color'],
        nameAndAltSettings = {
            'variable_name': {
                'type': 'input',
                'displayName': '变量名称',
                'alt': ''
            },
            'p5js_ctrler_type': {
                'type': 'radio',
                'displayName': '控制器类型',
                'alt': ''
            },
            'p5js_ctrler_para_hint': {
                'type': 'textarea',
                'displayName': '控制器参数提示',
                'alt': ''
            },
            'p5js_ctrler_parameter': {
                'type': 'textarea',
                'displayName': '控制器参数',
                'alt': ''
            },
            'new_p5js_ctrler_btn': {
                'type': 'button',
                'displayName': '生成控制器',
                'alt': ''
            },

        },
        hintAndParaSettings = {
            'slider': {
                'variable_name': 'the_slider',
                'hint_text': 'defaultVal = 0.5, minVal = 0 , maxVal = 1 , precision = 0.01',
                'parameter': '0.5 , 0.0001 , 1 , 0.001'
            },
            'button': {
                'variable_name': 'the_button',
                'hint_text': 'btnText, fxn = () => { }',
                'parameter': ' "[press me]" '
            },
            'radio': {
                'variable_name': 'the_radio',
                'hint_text': 'name, options = [], fxn = () => { }',
                'parameter': '[0,1,2]'
            },
            'checkbox': {
                'variable_name': 'the_checkbox',
                'hint_text': "defaultVal = false, labelText = ['yes', 'no']",
                'parameter': "true,['yes', 'no']"
            },
            'select': {
                'variable_name': 'the_select',
                'hint_text': ' options = [], fxn = () => { }',
                'parameter': ' ["1","10","1000"] '
            },
            'color': {
                'variable_name': 'the_color',
                'hint_text': " defaultVal = '#369' ",
                'parameter': ' "#fff" '
            },
        }) {
        //this.p5js_ctrler_creater = {};
        let that = this;
        const callbackDict = {
            'p5js_ctrler_type': (e) => {
                let v = e.target.value;
                that.parent.ctrlers['variable_name'].update(hintAndParaSettings[v].variable_name);
                that.parent.ctrlers['p5js_ctrler_para_hint'].update(hintAndParaSettings[v].hint_text);
                that.parent.ctrlers['p5js_ctrler_parameter'].update(hintAndParaSettings[v].parameter);
            },
            'new_p5js_ctrler_btn': () => {
                let thatVarName = 'parent' + String(Math.random()).replace(/\./g, '');
                Object.defineProperty(window, thatVarName, {
                    get() {
                        return that.parent;
                    }
                })
                try {
                    const ctrler_type = that.parent.ctrlers['p5js_ctrler_type'].getCtrlerVal(),
                        ctrler_name = that.parent.ctrlers['variable_name'].getCtrlerVal(),
                        ctrler_para = that.parent.ctrlers['p5js_ctrler_parameter'].getCtrlerVal();

                    let newFuncText = thatVarName + `.${ctrler_type}('${ctrler_name}', ${ctrler_para})`;
                    console.log(newFuncText);
                    (new Function(newFuncText))();
                    that.parent.ctrlers[ctrler_name].input(() => {
                        redraw();
                    });

                    const url = new URL(window.location.href),
                        name = 'new_ctrler';

                    if (url && url.searchParams.has(name)) {
                        url.searchParams.set(name, url.searchParams.get(name) + ' ; ' + newFuncText);
                    } else {
                        url.searchParams.append(name, newFuncText);
                    }
                    history.pushState('', '', url.toString());

                } catch (err) {
                    that.parent.update('p5js_ctrler_para_hint', err);
                    console.log(err);
                }
            },
        };

        that.parent.hr();
        
        // console.log(this, that);
        this.group = that.parent.group(groupSetting.name);

        if (groupSetting.displayname != '') {
            this.group.displayName( groupSetting.displayname);
        }
        if (groupSetting.alt != '') {
            this.group.alt( groupSetting.alt);
        }

        Object.keys(nameAndAltSettings).map(feature => {
            let featureGroup = nameAndAltSettings[feature];
            let type = featureGroup.type;
            let para = '';

            if (feature == 'p5js_ctrler_type') {
                para = typeArr;
                that.group[type](feature, para);
            } else {
                that.group[type](feature);
            }

            if (featureGroup.displayName != '') {
                that.parent.displayName(feature, featureGroup.displayName);
            }
            if (featureGroup.alt != '') {
                that.parent.alt(feature, featureGroup.alt);
            }
        });


        Object.keys(callbackDict).map(k => {


            switch (k) {
                case 'new_p5js_ctrler_btn':
                    that.parent.ctrlers[k].mouseClicked(callbackDict[k]);
                    break;
                case 'p5js_ctrler_type':
                    that.parent.ctrlers[k].input(callbackDict[k]);
                    break;
            }
        });

        return this;
    };
    return this;
}