
class Cell{
  constructor(loc, pf){
    this.pf = pf;
    this.loc = new vector2d(loc.x, loc.y);
    this.center = new vector2d(loc.x+(pf.w)/2, loc.y+(pf.w)/2);
    this.color = 'pink';
    this.id;
    this.neighbors = [];
    this.occupied = false;
	  this.hasParent = false;
    this.parent;  //  this is the parent cell
    this.isEmpty = true;
    this.dist = 100;
    this.vec = null;

  }

  render(){
    let pf = this.pf;
    pf.context.strokeStyle = 'white';
    pf.context.strokeRect(this.loc.x, this.loc.y, pf.w, pf.w);
    if(this.occupied) this.color = "darkSlateGray";
    pf.context.fillStyle = this.color;
    pf.context.fillRect(this.loc.x, this.loc.y, pf.w, pf.w);

    // draw vector
    if(this.vec && !this.occupied){
      pf.context.beginPath();
      pf.context.moveTo(this.center.x, this.center.y);
      pf.context.lineTo(this.center.x + this.vec.x, this.center.y + this.vec.y);
      pf.context.stroke();

    }
           this.getText();
  }

  addNeighbors(pf, grid){
    let x = this.loc.x/pf.w;
    let y = this.loc.y/pf.w;

    if(y > 0 ){
          this.neighbors.push(grid[x][y-1]);    //N
        }

        if( x < pf.cols-1 &&  y > 0){           //  NE
          this.neighbors.push(grid[x+1][y-1]);
        }
        if( x < pf.cols-1){
          this.neighbors.push(grid[x+1][y]);    //E
        }
        if(x < pf.cols-1 &&  y < pf.rows){      //  SE
          this.neighbors.push(grid[x+1][y+1]);
        }
        if(y < pf.rows){
          this.neighbors.push(grid[x][y+1]);    //S
        }
        if(x > 0 &&  y < pf.rows ){             //  SW
          this.neighbors.push(grid[x-1][y+1]);
        }
        if(x > 0){
          this.neighbors.push(grid[x-1][y]);    //W
        }
        if(x > 0 && y > 0){                     //  NW
          this.neighbors.push(grid[x][y+1]);
        }
  }

  getVector(){
    if(!this.neighbors) return new vector2d(-1, -1);
    let dist = 10000;
    let index = 0;
    //find smallest tist in neighbors
    for(let i = 0; i < this.neighbors.length; i++){
       if(this.neighbors[i] && dist > this.neighbors[i].dist){
          dist = this.neighbors[i].dist
          index = i;
       }
    }
    // make a vector
    let dx = this.neighbors[index].loc.x - this.loc.x;
    let dy = this.neighbors[index].loc.y - this.loc.y;
    let v = new vector2d(dx, dy);
    return v;
  }

  getText(){

    var context = pf.context;
    context.save();
    context.fillStyle = "white";
    context.font = "14px sans-serif";
    context.fillText(""+this.dist, this.loc.x+.2*pf.w/2, this.loc.y+pf.w/2 - 5);
    context.fillStyle = "black";
    context.fillText(""+this.id, this.loc.x+.2*pf.w/2, this.loc.y+pf.w/2 +15);
    //if(this.vec) context.fillText(""+this.vec.toString(), this.loc.x+.2*pf.w/2, this.loc.y+pf.w/2 +15);

    context.restore();
  }



}
