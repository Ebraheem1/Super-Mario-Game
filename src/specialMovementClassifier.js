import {marioY, setMarioY, setCheatingText, textToBeDisplayed} from '../game'

import {currentFrame as frame, Leap} from './leapController'

//This variable should be taken from the hand-logger after measuring the important angles in the hand
//There is a probability that the threshold upward is different from the threshold downward
//Thus we need to handle this case.
var thresholdAngleUpward = 50;
var thresholdAngleDownward = 50;
var noCheats = true;
function directionUp(tipPosition, metacarpal) {
    if(tipPosition[1] > metacarpal[1]) return true;
    else return false;
}

function checkCheats(hand){
    //Roll here represents the rotation around the z-axis
    var rotationAngle = hand.roll() * (180 / Math.PI);
    if(hand.stabilizedPalmPosition[1] < 180)
    {
        noCheats = false;
        setCheatingText('Please, Raise your hand a bit more :)');
    }
    else{
        noCheats = true;
    }

}

(function specialMovementClassifier(){
    if(frame && frame.hands.length > 0)
    {
        var hand = frame.hands[0];
        var armDirection = hand.arm.direction();
        var handDirection = hand.direction;
        var wristAngle = Math.acos(Leap.vec3.dot(armDirection, handDirection)) * (180 / Math.PI);
        var upDirection = directionUp(hand.middleFinger.dipPosition, hand.middleFinger.mcpPosition);
        checkCheats(hand);
        if(upDirection && (noCheats))
        {
            setCheatingText("NA");
            if(wristAngle >= thresholdAngleUpward)
            {
                setMarioY(marioY - 0.25);
            }
        }else if(wristAngle >= thresholdAngleDownward && noCheats)
        {
            setCheatingText("NA");
            setMarioY(marioY + 0.25);
            
        }
    }
    setTimeout(specialMovementClassifier, 1);
})();