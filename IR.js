module.exports = function(RED){
    "use strict";
    var GrovePiBoard = require('./lib/GrovePiBoard');
    function GrovePiDigitalIRSensorNode(config) {
    // Create this node
    RED.nodes.createNode(this,config);
    
    // Retrieve the board-config node
   this.boardConfig = RED.nodes.getNode(config.board);
   this.pin = config.pin;
   this.sensor = config.sensor;
   this.repeat = config.repeat;
   if (RED.settings.verbose) { this.log("Digital Sensor: Pin: " + this.pin + ", Repeat: " + this.repeat); }

   var node = this;

   if(node.boardConfig){
     if(!node.boardConfig.board){
       node.boardConfig.board = new GrovePiBoard();
       node.boardConfig.board.init();
     }

     // Board has been initialised
     if (RED.settings.verbose) { this.log("GrovePiDigitalIRSensor: Configuration Found"); }
     
     this.sensor = node.boardConfig.board.registerSensor('digital', this.sensor, this.pin, this.repeat, function(response) {
         var msg = {};
   
              node.status({fill:"green",shape:"dot",text:"connected"});
         msg.payload = response;
         if (RED.settings.verbose) { node.log("DigitalSensor value: " + response); }
         
         node.send(msg);
     });

     this.on('close', function(done) {
        this.sensor(function(){
             done();
         });
        if (node.done) {
            node.status({});
            node.done();
        }
        else { node.status({fill:"red",shape:"ring",text:"stopped"}); }
     });

   } else {
     node.error("Node has no configuration!");
     node.status({fill:"red",shape:"ring",text:"error"});
   }
}
RED.nodes.registerType("grove digital sensor",GrovePiDigitalIRSensorNode);
}