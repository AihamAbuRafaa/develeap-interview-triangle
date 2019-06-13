import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('canvas', {})
  canvas: ElementRef<HTMLCanvasElement>;
  title = 'triangle-exam';
  private ctx: CanvasRenderingContext2D;
  onSubmit(f: NgForm) {
    if (f.valid) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.ctx.beginPath();
      this.ctx.font = '20px Sans-serif';
      f.value.y1 = 600 - f.value.y1;
      f.value.y2 = 600 - f.value.y2;
      f.value.y3 = 600 - f.value.y3;
      let dist1 = this.distance(f.value.x1, f.value.y1, f.value.x2, f.value.y2);  // get the 3 distance of the lines
      let dist2 = this.distance(f.value.x2, f.value.y2, f.value.x3, f.value.y3);
      let dist3 = this.distance(f.value.x3, f.value.y3, f.value.x1, f.value.y1);
      console.log(dist1)
      console.log(dist2)
      console.log(dist3)
      let ang1 = Math.acos(((Math.pow(dist1, 2) + Math.pow(dist3, 2) - Math.pow(dist2, 2)) / (2 * dist1 * dist3)))
      let ang2 = Math.acos(((Math.pow(dist2, 2) + Math.pow(dist1, 2) - Math.pow(dist3, 2)) / (2 * dist2 * dist1)))
      let ang3 = Math.acos(((Math.pow(dist2, 2) + Math.pow(dist3, 2) - Math.pow(dist1, 2)) / (2 * dist3 * dist2)))
      ang1 = (ang1 * 180 / Math.PI)//to degrees
      ang2 = (ang2 * 180 / Math.PI)//to degrees
      ang3 = (ang3 * 180 / Math.PI)//to degrees
      let minDist = Math.min(dist1, dist2, dist3); // get the min dist;
      if (minDist === 0) {
        return; // there are no angles to draw and exit 
        // to avoid divide by zero in direction function
      }
      minDist /= 20; // get the amgle arc radius 1/5th
      var dir1 = this.direction(f.value.x1, f.value.y1, f.value.x2, f.value.y2);  // get the 3 directions of the lines
      var dir2 = this.direction(f.value.x2, f.value.y2, f.value.x3, f.value.y3);
      var dir3 = this.direction(f.value.x3, f.value.y3, f.value.x1, f.value.y1);


      this.ctx.moveTo(f.value.x1, f.value.y1);
      this.ctx.lineTo(f.value.x2, f.value.y2);
      this.ctx.lineTo(f.value.x3, f.value.y3);
      this.ctx.closePath();
      this.ctx.lineWidth = 10;
      this.ctx.strokeStyle = '#666666';
      this.ctx.stroke();
      this.ctx.fillStyle = "#FFCC00";
      this.ctx.fill();

      this.drawAngle(f.value.x1, f.value.y1, dir1, dir3, ang1); // draw the angle stoke first corner;
      this.drawAngle(f.value.x2, f.value.y2, dir2, dir1, ang2); // draw the angle stoke second corner;
      this.drawAngle(f.value.x3, f.value.y3, dir3, dir2, ang3); // draw the angle stoke third;
    }
    console.log(f.value);  // { first: '', last: '' }

  }

  drawAngle(x, y, dirA, dirB, angl: number) {
    dirB += Math.PI;              // revers second direction
    var sweepAng = dirB - dirA;   // angle between lines
    var startAng = dirA;          // angle to start the sweep of the arc
    if (Math.abs(sweepAng) > Math.PI) {  // if the angle us greater the 180
      sweepAng = Math.PI * 2 - sweepAng;  // get the smaller angle
      startAng = dirB;          // and change the start angle
    }
    this.ctx.beginPath();
    if (sweepAng < 0) {                  // if the angle is sweeping anticlockwise
      this.ctx.arc(x, y, 100, startAng + sweepAng, startAng);
      this.ctx.fillStyle = 'black';
      this.ctx.font = '20px Sans-serif';
      this.ctx.fillText("(" + x + "," + (600 - y) + ")", x, y);
      this.ctx.font = '15px Sans-serif';
      this.ctx.fillText(angl.toString(), x - 30, y - 30);
    } else {                        // draw clockwise angle
      this.ctx.arc(x, y, 100, startAng, startAng + sweepAng);
      this.ctx.fillStyle = 'black';
      this.ctx.font = '20px Sans-serif';
      this.ctx.fillText("(" + x + "," + (600 - y) + ")", x, y);
      this.ctx.font = '15px Sans-serif';
      this.ctx.fillText(angl.toString(), x - 30, y - 30);
    }
    this.ctx.stroke();                 // all done
  }

  distance(x, y, xx, yy) {
    return Math.sqrt(Math.pow(x - xx, 2) + Math.pow(y - yy, 2));
  }

  direction(x, y, xx, yy) {
    var angV = Math.acos((xx - x) / Math.sqrt(Math.pow(x - xx, 2) + Math.pow(y - yy, 2)));
    if (y - yy > 0) angV = - angV; // check the sign
    return (angV + Math.PI * 2) % (Math.PI * 2); // makes the angle positive. 
    // Not needed but for this 
    // makes it easier to understand
  }

}
