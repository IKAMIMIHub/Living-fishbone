const agents = [];
let subdiv;
let mic;

const n = 300;
let x, y, hist;

setup = () => {
    const canvas = createCanvas(750, 550);
    canvas.parent('#container');
    canvas.id('p5');
    
    textSize(8);
    strokeWeight(0.2);

    for (let i = 0; i < 50; i++) {
        agents.push(new Agent(i));
    }

    subdiv = new Subdiv();
}

draw = () => {
    //let volume = mic.getLevel();
    //let d = volume * 4000;//ここの数字が大きいと声が小さくても反応がいい
    //let dd = volume * 2000;

    blendMode(BLEND);
    blendMode(SCREEN);
    
    const mouse = createVector(mouseX, mouseY);

   

    
    for (const agent of agents) {

        if (mouseIsPressed) {
            agent.attract(mouse, 200);
        } else {
            agent.repel(mouse, 100);
        }
        
        agent.flock(agents);
        agent.update();
    }

   

    subdiv.compute(agents);
    //stroke(200);
    //subdiv.drawVoronoi();

    stroke(random(255),150,235,250);
    
    subdiv.drawDelaunay();

    // for (const agent of agents) {
    //     agent.draw();
    // }
}

draw2= () => {
    blendMode(BLEND);
    blendMode(SCREEN);
    
    noFill();
    stroke(random(255),150,235,250);
    rect(100,200,200,300);
}