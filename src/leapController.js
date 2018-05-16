
export var currentFrame;
export var Leap = require('leapjs'); 


var options = {
    background: true,
    useAllPlugins: true,
    enableGestures: true
};


var controller = Leap.loop(options, function (frame)
{
    currentFrame = frame;
    
});

/**
 * // part of the framework that starts the game
 * import GestureDetector from "framework/gesture-detector"
 * import GameConfiguration from "framework/game-configuration"
 * 
 * const Game = GameConfiguration.getGame()
 * Game.run()
 * GestureDetector.detectGestures(Game, GameConfiguration.getConfiguredGesture())
 * 
 * ------
 * // gesture-detector
 * 
 * import SpreadThumbGesture from "framework/gestures/SpreadThumbGesture"
 * 
 * class GestureDetector (
 *     @inject deviceFacade: DeviceFacade
 * 
 *     gestures: Gestures = [ SpreadThumbGesture, SpreadPalmGesture ]
 *     static detectGestures(game: Game, configuredGesture: Gesture) (
 *         const gesture = this.gestures.find(configuredGesture)
 *         this.deviceFacade.getNFrames(configuredGesture.requiredFrameAmount())
 *              .subscribe((frames) => {
 *                    const accuracy = gesture.detect(frames)
 *                     if (accuracy > 0.2) {
                          game.onActionHappened()
                          backend.sendAccuracy(accuracy)
                      }
 *               })
 *     )
 * )
 * 
 * 
 */