class Agent {

    index;
    position;
    velocity;

    maxSpeed;
    maxForce;

    separationRadius;
    alignRadius;
    cohesionRadius;

    constructor(index) {
        this.index = this.padzero(index);
        this.position = createVector(
            random(width), random(height)
        );
        this.velocity = createVector(
            random(-1, 1), random(-1, 1)
        );

        this.maxForce = 0.5;
        this.maxSpeed = 7.0;

        this.separationRadius = 10;
        this.alignRadius = 0;
        this.cohesionRadius = 40;
    }

    update() {
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.wrapBound();
    }

    draw() {
        const V = p5.Vector;
        noFill();
        stroke(200);
        //circle(this.position.x, this.position.y, this.separationRadius);
        
        stroke(255);
        this.drawArrow(V.normalize(this.velocity));
        //rect(this.position.y, this.position.x, 50);

        // noStroke();
        // fill(0);
        // text(this.index, this.position.x - 5, this.position.y + 3);
    }
    
    attract(target, radius) {
        const V = p5.Vector;
        const dist = V.dist(this.position, target);
        if (dist < radius) {
            const acceleration = p5.Vector.sub(target, this.position);
            acceleration.setMag(radius / dist);
            acceleration.limit(this.maxForce);
            this.velocity.add(acceleration);
        }
    }

    repel(target, radius) {
        const V = p5.Vector;
        const dist = V.dist(this.position, target);
        if (dist < radius) {
            const acceleration = p5.Vector.sub(this.position, target);
            acceleration.setMag(radius / dist);
            acceleration.limit(this.maxForce);
            this.velocity.add(acceleration);
        }
    }

    flock(agents) {
        const sep = this.separate(agents);
        const ali = this.align(agents);
        const coh = this.cohesion(agents);

        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);

        this.velocity.add(sep);
        this.velocity.add(ali);
        this.velocity.add(coh);
    }

    separate(agents) {
        const V = p5.Vector;

        let sum = createVector(0, 0);
        let totalCount = 0;

        for (const agent of agents) {
            if (this.index !== agent.index) {
                const dist = V.dist(this.position, agent.position);
                if (dist < this.separationRadius) {
                    const dir = V.sub(this.position, agent.position).normalize();
                    dir.div(dist);
                    sum.add(dir);
                    totalCount++;
                }
            }
        }

        if (totalCount > 0) {
            sum.div(totalCount);
            sum.setMag(this.maxSpeed);
            const steer = V.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }

    }

    align(agents) {
        const V = p5.Vector;
        
        let sum = createVector(0, 0);
        let totalCount = 0;

        for (const agent of agents) {
            const dist = V.dist(this.position, agent.position);
            if (this.index !== agent.index) {
                if (dist < this.alignRadius) {
                    sum.add(agent.velocity);
                    totalCount++;
                }
            }
        }

        if (totalCount > 0) {
            sum.div(totalCount);
            sum.setMag(this.maxSpeed);
            const steer = V.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    cohesion(agents) {
        const V = p5.Vector;
        
        let center = createVector(0, 0);
        let totalCount = 0;

        for (const agent of agents) {
            const dist = V.dist(this.position, agent.position);
            if (this.index !== agent.index) {
                if (dist < this.cohesionRadius) {
                    center.add(agent.position);
                    totalCount++;
                }
            }
        }

        if (totalCount > 0) {
            center.div(totalCount); // center
            const desired = V.sub(center, this.position);
            desired.setMag(this.maxSpeed);
            const steer = V.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    wrapBound() {
        const pos = this.position; // copy reference
        const w = width;
        const h = height;
        const pad = 10.0;

        pos.x = pos.x > w + pad ? 0 - pad : pos.x;
        pos.x = pos.x < 0 - pad ? w + pad : pos.x;
        pos.y = pos.y > h + pad ? 0 - pad : pos.y;
        pos.y = pos.y < 0 - pad ? h + pad : pos.y;
    }

    padzero(n) {
        if (n < 100) {
            return '0' + n;
        } else {
            return '' + n;
        }
    }

    drawArrow(dir) {
        push();
        translate(this.position.x*3, this.position.y*3);
        rotate(atan2(dir.y, dir.x));
        line(50, 30, 7, 3);
        line(50, 30, 7, -3);

        pop();
    }

}

function Button_Click() {
    window.location.reload();
  }