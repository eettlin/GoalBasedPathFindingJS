'use strict'


class PathFinder2{

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
    this.w = 100;
    this.done = false;
    // containerarrays for cells
    this.grid = [];         // whole grid
    this.openSet = [];      // available to move to
    this.closedSet = [];    // visited or occupied
    this.path = [];         // current path
    this.begin = null;
    this.end = null;
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
      if(pf.grid[col][row].color === "pink"){
        pf.grid[col][row].color = "black";
        pf.grid[col][row].occupied = true;
      } else {
        pf.grid[col][row].color = "pink";
        pf.grid[col][row].occupied = false;
      }


    }, false );

    this.canvas.addEventListener('mousemove',function(evt){
      pf.mouseX = evt.offsetX;
      pf.mouseY = evt.offsetY;
    }, false );
  }//  ++++++++++++++++++++++++++++++++++++++++++++  End init

  run(){

  }//  End run++++++++++++++++++++++++++++++++++++++++++++++++++++

  render(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // render entire grid
    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++){
        this.grid[i][j].render();
      }//loop
    }// loop
    // render openSet
    for(let i = 0; i < this.openSet.length; i++){
      this.openSet[i].color = 'purple';
      this.openSet[i].render();
    }
    // render closedSet
    for(let i = 0; i < this.closedSet.length; i++){
      if(this.closedSet[i]){
        this.closedSet[i].color = 'black';
        this.closedSet[i].render();
      }
    }//loop
    this.current.color = "green";
    this.current.render();

    // if(this.path.length > 0){
    //  for(let i = 0; i < this.path.length; i++){
    //    this.path[i].color = "red";
    //    this.path[i].render();
    // }
  //}
  } //  ++++++++++++++++++++++++++++++++++++++++  End Render
  // +++++++++++++++++++++++++++++++++++++++++++  load a 2D array with cells
  loadGrid(){

    for(var i = 0; i < this.cols; i++){
      this.grid[i] = [];
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = new Cell(new MyVector((i*this.w), (j*this.w)));
        if(Math.floor(Math.random()*100) < 15) this.grid[i][j].occupied = true;
        this.grid[i][j].id = ++cellId;
      }
    }
    //each cell gets neighbors
    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++){
        this.grid[i][j].addNeighbors(this, this.grid)
      }
    }
    //Start and end points and init openset
    this.begin = this.grid[0][0];
    this.end = this.grid[this.cols - 1][this.rows - 1];
    this.openSet[0] = this.begin;
  }  // ++++++++++++++++++++++++++++++++++++++++++++++  End LoadGrid

  removeElement(arr, elt){
    for(let i = arr.length - 1; i >= 0; i--){
      if(arr[i] === elt){
        arr.splice(i, 1);
      }
    }
  }

  heuristic(e1, e2){
    let dx = e1.loc.x - e2.loc.x;
    let dy = e1.loc.y - e2.loc.y;
    return Math.sqrt(dx*dx+dy*dy);
  }

}
