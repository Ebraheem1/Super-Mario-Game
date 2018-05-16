import {marioY, setMarioY, setCheatingText, textToBeDisplayed, setStatistics, game} from '../game'

import {currentFrame as frame, Leap} from './leapController'
import * as C3 from 'c3';

//This variable should be taken from the hand-logger after measuring the important angles in the hand
//There is a probability that the threshold upward is different from the threshold downward
//Thus we need to handle this case.
var thresholdAngleUpward = 50;
var thresholdAngleDownward = 50;
var noCheats = true;
var maxAngleUpward = 0;
var maxAngleDownward = 0;
var wristAnglesArr = [];
var firstend = true;
var maxTime = 0;
//This array holds the times required for the transition between upward movement and downward movements
var arr = [];
var timeStart;
var firstTimeDownWard = true;


function directionUp(tipPosition, metacarpal) {
    if(tipPosition[1] > metacarpal[1]) return true;
    else return false;
}

function doStatistics(){
    maxTime = Math.max(...arr);
    maxTime /= 1000;
    setStatistics(Number.parseFloat(maxAngleUpward).toPrecision(4), Number.parseFloat(maxAngleDownward).toPrecision(4), Number.parseFloat(maxTime).toPrecision(4));
}


function checkCheats(hand){
    //Roll here represents the rotation around the z-axis
    var rotationAngle = hand.roll() * (180 / Math.PI);
    if(hand.stabilizedPalmPosition[1] < 180)
    {
        if(textToBeDisplayed == "NA")
        {
            noCheats = false;
            setCheatingText('Please, Raise your hand a bit more :)');
        }
    }
    else{
        noCheats = true;
    }

}

(function specialMovementClassifier(){
    
    if(frame && frame.hands.length > 0 && (game == 0))
    {
        var hand = frame.hands[0];
        var armDirection = hand.arm.direction();
        var handDirection = hand.direction;
        var wristAngle = Math.acos(Leap.vec3.dot(armDirection, handDirection)) * (180 / Math.PI);
        var upDirection = directionUp(hand.middleFinger.dipPosition, hand.middleFinger.mcpPosition);
        checkCheats(hand);
        wristAngle = Number.parseFloat(wristAngle).toPrecision(4);
        if(frame.hands[0].confidence > 0.7 && noCheats){
            if(upDirection)
                wristAnglesArr.push(wristAngle);
            else
                wristAnglesArr.push(-1 * wristAngle);
        }
        if(upDirection && (noCheats))
        {
            setCheatingText("NA");
            if(wristAngle >= thresholdAngleUpward)
            {
                if(! firstTimeDownWard)
                {
                    var now = new Date();
                    arr.push(now - timeStart);
                    firstTimeDownWard = true;
                }
                timeStart = new Date();
                setMarioY(marioY - 0.25);
                if(wristAngle > maxAngleUpward)
                    maxAngleUpward = wristAngle;
            }
        }else if(wristAngle >= thresholdAngleDownward && noCheats)
        {
            setCheatingText("NA");
            if(firstTimeDownWard)
            {
                var now = new Date();
                arr.push(now - timeStart);
                firstTimeDownWard = false;
            }
            timeStart = new Date();
            setMarioY(marioY + 0.25);
            if(wristAngle > maxAngleDownward)
                maxAngleDownward = wristAngle;
        }
    }
    else if(game == 1 || game == -1 || game == -3)
    {
        if(firstend)
        {
            doStatistics();
            drawScatterPlot();
            firstend = false;
            noCheats = true;
            maxAngleUpward = 0;
            maxAngleDownward = 0;
            wristAnglesArr = [];
            maxTime = 0;
            arr = [];
            timeStart;
            firstTimeDownWard = true;
        }
    }
    else if(frame && (frame.hands.length == 0 || frame.hands.length == 2))
    {
        timeStart = new Date();
        firstTimeDownWard = true;
        noCheats = false;
        setCheatingText('Please, Adjust your hand position in front of the leap device :)');
    }
    setTimeout(specialMovementClassifier, 1);
})();

/**
 * The Strategy of the timer works as follows:
 *  1) Timer starts from the last time in which the threshold upward is reached
 *      it counts until the first time in which the threshold downward is reached.
 *  2) Timer will be restarted in case of any invalid frame came through the stream
 *      of frames detected between the two threshold angles. Which means step 1 will be done.
 *  3) Timer starts from the last time in which the threshold downward is reached
 *      it counts until the first time in which the threshold upward is reached. 
 * 
 */

 function drawScatterPlot(){
    if(maxTime > 0)
    {
        var p = document.getElementById("max-time");
        p.innerHTML = "Max. Time to reach thresold: " + maxTime + " sec(s)";
    }
    var scatterPlot = document.getElementById("scatter-plot");
    scatterPlot.style.display = "block";
    scatterPlot.style.height = "50%";
    scatterPlot.style.width = "90%";
    var scatterX = [];
    var scatterY = [];
    for(var i = 0; i < wristAnglesArr.length; i++)
      scatterX.push(i+1);
    scatterX.unshift("frames");
    scatterY = wristAnglesArr;
    scatterY.unshift("Angles");
    var scatterChart = C3.generate({
      bindto: scatterPlot,
      data: {
          xs: {
              Angles: 'frames'
          },
          columns: [
              scatterX,
              scatterY
          ],
          colors: {
            Angles: '#9F3030'
        },
        type: 'scatter',
      },
      axis: {
          x: {
              
              label: 'Ordered Frames',
              tick: {
                  fit: false,
                  centered: true
              }
          },
          y: {
              label: 'Angles'
          }
      },
      title: {
        text: 'Wrist Angles in Accurate frames'
      }
    });
 };