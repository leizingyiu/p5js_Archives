// // import decomp from './poly-decomp'
// import decomp from './decomp.min.js'
// window.decomp = decomp;

// var { Engine, Bodies, Bounds, World, Vertices, Mouse, MouseConstraint, Common, Runner } = Matter;

class Boundary {
    constructor(x, y, w, h, a, friction = 0, restitution = 0.95, isStatic = true, fillColor = 0, strokeColor = 0, strokeweight = 1) {
        let options = {
            friction: friction,
            restitution: restitution,
            angle: a,
            isStatic: isStatic
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);

        this.fillColor = fillColor, this.strokeColor = strokeColor,
            this.strokeweight = strokeweight;
        //console.log(this.body);

    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        if (this.strokeweight == 0) {
            noStroke();
        }
        else {
            strokeWeight(this.strokeweight);
            stroke(this.strokeColor);
        }
        fill(this.fillColor);
        rect(0, 0, this.w, this.h);
        pop();
    };
}

class Letter {
    constructor(str, x, y,
        font, fontsize,
        sampleFector = 2, simplifyThreshold = 0,
        matterOption = {
            ooption: {
                render: {
                    fillStyle: '#999',
                    strokeStyle: "#aaa",
                    lineWidth: 0
                }
            }, flagInternal: true, removeCollinear: 0.01, minimumArea: 1
        }) {
        this.str = str, this._x = x, this._y = y,
            this.x = x, this.y = y,
            this.font = font, this.fontsize = fontsize;

        let letterPoints = font.textToPoints(this.str, 0, 0, this.fontsize, {
            sampleFactor: sampleFector,
            simplifyThreshold: simplifyThreshold
        });

        let letterPointsVert = letterPoints.map(v => [v.x, v.y].map(i => Math.round(i)).join(',')).join(',').replace(/,/g, ' ');


        this.body = Matter.Bodies.fromVectices(this._x, this._y,
            Vertices.fromPath(letterPointsVert),
            ...Object.values(matterOption));

        World.add(engine.world, this.body);
    }
    show() {

        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        if (this.strokeweight == 0) {
            noStroke();
        }
        else {
            strokeWeight(this.strokeweight);
            stroke(this.strokeColor);
        }
        fill(this.fillColor);
        rect(0, 0, this.w, this.h);
        pop();
    }
}