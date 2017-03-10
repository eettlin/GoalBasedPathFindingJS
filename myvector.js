
class MyVector{

  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  dist(vec){
    let dx = this.x - vec.x;
    let dy = this.y - vec.y;
    return Math.sqrt(dx*dx+dy*dy);
  }

  dist(e1, e2){
    let dx = e1.loc.x - e2.loc.x;
    let dy = e1.loc.y - e2.loc.y;
    return Math.sqrt(dx*dx+dy*dy);
  }

}
