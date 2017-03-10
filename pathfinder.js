'use strict'

// wait for the window to load and than call back setup()
window.addEventListener('load', setup, false);
var count = 0;
var cellId = 0;
var pf;   // the global path finder object
const TWO_PI = 6.28318530718;
const FRAME_RATE=10;

function setup() {
  pf = new PathFinder();
  window.setTimeout(draw, 100);    // wait 100ms for resources to load then start draw loop
}

function draw() {   // the animation loop
  pf.run();
  pf.render();
  window.setTimeout(draw, 1000/FRAME_RATE);  // come back here every interval
}


class PathFinder{

  constructor(){
    // get and validate canvas and context
    this.canvas = document.getElementById('canvas');
    if (!this.canvas || !this.canvas.getContext)
    throw "No valid canvas found!";
    this.context = this.canvas.getContext("2d");
    if(!this.context)
    throw "No valid context found!";
    // pf properties

    this.isRunning = true;
    this.mouseX = 0;
    this.mouseY = 0;
    this.w = 70;
    this.done = false;
    // containerarrays for cells
    this.grid = [];
    this.queue = [];
    this.empty = [];         // whole grid
    this.root = null;
    this.empty.push(this.root);
    this.current;

    this.cols = Math.floor(this.canvas.width / this.w);
    this.rows = Math.floor(this.canvas.height / this.w);

    // init class methods
    this.init();

  }

  init(){
    this.loadGrid();
    //  add listeners
    this.canvas.addEventListener('mousedown',function(evt){
      pf.mouseX = evt.offsetX;
      pf.mouseY = evt.offsetY;
      let row = Math.floor(pf.mouseY/pf.w);
      let col = Math.floor(pf.mouseX/pf.w);

      //  on mouse click, change color
      if(pf.grid[col][row].color === "cadetBlue"){
        pf.grid[col][row].color = "darkSlateGray";
        pf.grid[col][row].occupied = true;
      } else {
        pf.grid[col][row].color = "cadetBlue";
        pf.grid[col][row].occupied = false;
      }
    }, false );

    this.canvas.addEventListener('mousemove',function(evt){
      pf.mouseX = evt.offsetX;
      pf.mouseY = evt.offsetY;
    }, false );
  }//  ++++++++++++++++++++++++++++++++++++++++++++  End init

  run(){

    let start = this.grid[0][0];
    if(this.queue.length >0 || this.queue.includes(start)){
      //check each node in queue
      for(let i = 0; i < this.queue.length; i++){
        this.current = this.queue[0];
        //check each neighbor
        for(let j =0; j < this.current.neighbors.length; j++){
          let node = this.current.neighbors[j];
          if(node && !node.occupied && !node.hasParent){
            node.parent = this.current;
            node.hasParent = true;
            node.dist = this.current.dist + 1;
            this.queue.push(node);
          }

        }
        this.removeElement(this.queue, this.current);
      }
    } else{

      console.log("reached end");
      for(var i = 0; i < this.cols; i++){
        for(var j = 0; j < this.rows; j++){
          this.grid[i][j].vec = this.grid[i][j].getVector();
        }
      }
    }

  }//  End run++++++++++++++++++++++++++++++++++++++++++++++++++++

  render(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // render entire grid
    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++){
        this.grid[i][j].render();
      }//loop
    }// loop
    // render queue
    // for(let i = 0; i < this.queue.length; i++){
    //    this.queue[i].render();
    // }// loop


  } //  ++++++++++++++++++++++++++++++++++++++++  End Render
  // +++++++++++++++++++++++++++++++++++++++++++  load a 2D array with cells
  loadGrid(){
    for(var i = 0; i < this.cols; i++){
      this.grid[i] = [];
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = new Cell(new vector2d((i*this.w), (j*this.w)), this);
        if(Math.floor(Math.random()*100) < 9) this.grid[i][j].occupied = true;
        this.grid[i][j].id = ++cellId;
      }
    }
    //  For each cell in grid, fill the neighbors array
    for(var i = 0; i < this.cols; i++){
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j].addNeighbors(this,  this.grid);
      }
    }
    this.root = this.grid[this.cols - 1][this.rows -1];
    this.root.dist = 0;
    this.root.hasParent = true;
    this.root.isEmpty = false;
    this.queue.push(this.root);
    this.current = this.root;
    this.current.color = "red";




  }  // ++++++++++++++++++++++++++++++++++++++++++++++  End LoadGrid

  removeElement(arr, elt){
    for(let i = arr.length - 1; i >= 0; i--){
      if(arr[i] === elt){
        arr.splice(i, 1);
      }
    }
  }




}/// pathfinder
