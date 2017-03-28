// chrome app specific implementation start here

//require(['jquery']);

//var he = require(['hex']);
//require(['STK500'],function(_){
//
//        var protocol_test = STK500;
//
//        })


function Serial(){
    this.options = {};
    this.activePort;
    this.portsArray = [];
    this.connectionId;
    this.receive;
    this.receiveData ;
    
    this._listener = function(info){
        //console.log("_listener")
        this.receiveData += info.data;
    };

    
    var _serialport = chrome.serial;
    this.getDevices=function(callback){
        var portList = [];
        _serialport.getDevices(function(portsList){
                               // console.log(portsList);
                               for(var i=0; i< portsList.length; i++){
                               portList.push(portsList[i].path);
                               if(this.portsArray.indexOf(portsList[i])<0){
                               this.portsArray.push(portsList[i]);
                               }
                               }
                               // console.log(portList);
                               callback(portList);
                               //_port.postMessage({answer:portList});
                               
                               }.bind(this));
    }.bind(this),
    
    this.connect= function(path,options,callback){
        
        if(typeof arguments[1] == "function"){
            callback = arguments[1];
            options = this.options;
            
        }
        if(typeof arguments[0] == "function"){
            callback = arguments[0];
            path = this.activePort;
            options = this.options;
        }
        if(typeof arguments[0] == "object"){
            options = arguments[0];
            path = this.activePort;
        }
        
        if(path){
            _serialport.connect(path,options,function(result){
                                console.log("start connect",this.portsArray);
                                
                                for(var i=0; i< this.portsArray.length; i++){
                                if(this.portsArray[i].path == path){
                                this.activePort = path;
                                }
                                
                                }
                                if(this.activePort){
                                
                                }else{
                                console.log("串口不匹配");
                                return;
                                }
                                if(typeof result != "undefined"){
                                this.connectionId = result.connectionId;
                                _serialport.onReceive.addListener(function(info){
                                                                  //console.log("recive data !!!");
                                                                  //console.log(ab2str(info.data));
                                                                  typeof this._listener == "function"? this._listener(info):null;
                                                                  
                                                                  typeof this.receive=="function"? this.receive(info):null;
                                                                  }.bind(this));
                                if(callback){
                                typeof callback == "function"? callback(result):null;
                                }
                                }else{
                                if(callback){
                                typeof callback == "function"? callback(null):null;
                                }
                                }
                                }.bind(this));
        }
    }.bind(this),
    
    
    this.receive = function(info){
        console.log("receive data --->"+ ab2str(info.data));
        
    },
    this.send = function(str,callback){
        if(typeof arguments[1] == 'undefined'){
            callback = function(result){};
        }
        _serialport.send(this.connectionId,str,callback);
        
    }.bind(this),
    
    this.addListener = function(callback){
        this._listener = callback;
    }.bind(this),
    
    this.flush = function(callback){
        _serialport.flush(this.connectionId,callback);
        
    }.bind(this),
    this.setControlSignals = function(isDtr,callback){
        
        if(typeof arguments[1] == 'undefined'){
            callback = function(){};
        }
        _serialport.setControlSignals(this.connectionId,isDtr,callback);
    }.bind(this),
    this.close = function(callback){
        
        if(typeof arguments[1] == 'undefined'){
            callback = function(){};
        }
        _serialport.disconnect(this.connectionId,callback);
    }.bind(this);
    
    this.read = function(dataLen,timeOut,callback){
        
        if(receiveData.length < dataLen){
            var iCount = setInterval(function(){
                                     
                                     clearInterval(iCount);
                                     }, 10);
        }
        
        
    }
}




var chromeSerialReadCallbackArm = function(dataLen) {
    if (!protocol.port) {
        console.log("chromeSerialReadCallbackArm() called without active port");
        return;
    }
    
    if (dataLen === undefined) {
        readLen = 128;
    } else {
        readLen = dataLen;
    }
    
    if (serialLogging == true) {
        console.log("chromeSerialReadCallbackArm(" + readLen + ")");
    }
    
    // setup our read callback
    chrome.serial.read(protocol.port.connectionId, readLen, chromeSerialRead);
};







