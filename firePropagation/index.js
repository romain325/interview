const config = require("./config.json")
const utils = require("./utils.js")

// state enum
const  state = {
    ALIVE: "🌳",
    DEAD: ".",
    FIRE: "🔥"
}

if(process.argv.includes("-d")){
    state.ALIVE = 1;
    state.DEAD = 0;
    state.FIRE = 2;
}




// lambdas
const willBurn = () => (Math.random() < config.prob);
const limitPos = (x,y) => x >= 0 && y >= 0 && x < config.height && y < config.width;
const tryBurnPos = (forest, x, y) => (limitPos(x,y) && forest[x][y] === state.ALIVE && willBurn());

async function main(){
    // Generate alive forest
    // don't use of const bc of forest.map
    let forest = []
    for (let h = 0; h < config.height; h++) {
        forest[h] = [];
        for (let w = 0; w < config.width; w++) {
            // represent alive trees
            forest[h][w] = state.ALIVE;        
        }
    }

    // Add a dead tree
    const rand_max = (max) => Math.floor(Math.random() * max);
    for(let initial_fire = 0; initial_fire < config.initial; initial_fire++){
        forest[rand_max(config.height)][rand_max(config.width)] = state.FIRE;
    }

    // While any tree is on state.FIRE, burn the others
    while(forest.some(sub => sub.includes(state.FIRE))){
        // future state.FIRE holder
        let fire = [];
        for (let h = 0; h < forest.length; h++) {
            for (let w = 0; w < forest[h].length; w++) {
                // if is on state.FIRE
                if(forest[h][w] === state.FIRE){
                    // change surrounding of fire
                    [1,-1].forEach(movement => {
                        tryBurnPos(forest, h + movement, w) && fire.push([h+movement, w]);
                        tryBurnPos(forest, h, w + movement) && fire.push([h, w + movement]);
                    });
                }
            }
        }
        
        // iterate through, if on state.FIRE -> set as dead
        forest = forest.map(sub => sub.map(v => v == state.FIRE ? state.DEAD : v));

        //set new fire
        fire.forEach(val => forest[val[0]][val[1]] = state.FIRE);
        
        // print forest state
        utils.display(forest);
        // For vision purpose
        await utils.sleep(800);
        console.clear();
    }
    return forest;
}

(async() => {
    const final = await main();
    let count = 0;
    utils.display(final);
    for (let i = 0; i < final.length; i++) {
        count += final[i].filter(val => val === state.DEAD).length;   
    }
    console.log("Dead trees: " + count);
})()


