// chrome app specific implementation start here

//require(['jquery']);

//var he = require(['hex']);
//require(['STK500'],function(_){
//        
//        var protocol_test = STK500;
//        
//        })

var test = {
    a: function(a){
        
        console.log(parseInt("00",16))
        console.log(a);
    }
}



b = 0x33

test.a("hahha test"+b)



var protocol = STK500;

var serialLogging = false;

var readLen = 128;

console.log("starting up!");

var bufferToString = function(buffer) {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
};


//字符串转arraybufer
function str2ab(str){
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    
    for(var i=0 ; i<str.length; i++){
        bufView[i]= str.charCodeAt(i);
    }
    return bufView.buffer; //return buf;
}

//arraybuffer 转字符串
function ab2str(buf){
    return String.fromCharCode.apply(null,new Uint8Array(buf));
}



var serial = new Serial()
serial.options = {bitrate: 115200};
serial.getDevices(function (pathList){
                  console.log(pathList);
                  var eligiblePorts = pathList.filter(function(port){
                                                      console.log(port)
                                                      //return port.match("/dev/tty.*-?[1-9]\d*")
                                                      //return port.match("/dev/tty.*-?[1-9]\d*")
                                                      return port.match("/dev/tty.usbmodem1411")
                                                      //return (!port.match(/[Bb]luetooth/) && port.match(/tty/));
                                                      })
                  console.log(eligiblePorts)
                  serial.connect(eligiblePorts[0],function(result){
                                 console.log(result);
                                 setTimeout(function(){
                                            //serialConnectThen();
                                            serialStartBurner()
//                                            serial.send(s("0C9434000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C9446000C944600"))
                                            
                                            },1000)
                                 })
                  });

var sigal_flag = false;
var sigal_times_flag = 0;

serial.addListener(function(info){
                   
                   var data = new Uint8Array(info.data);
                   console.log("info--"+data[0]+ "--"+ data[1]+"--")
                   
                   if(data[0]=0x14){
                   
                        console.log("signal ok");
                  
                   }
                   });
var time = {
        base:0,
    interval:100,
    next:function(){
        this.base += this.interval;
        console.log(this.base);
        return this.base;
    },
    customeInterval:function(_interval){
    this.base += _interval;
    console.log(this.base);
    return this.base;
    }
    
}

var stepEval = {
       t:time,
    eval:function(num_str){
                setTimeout(function(){
                   
                  console.log("send-->"+num_str)

                   serial.send(s(num_str))
                   },this.t.next())
    }
}

//unsigned char size  = 64;    //默认值
//unsigned char pageSize = 128;
//unsigned int address = 0;
//
//for(int  i = 0 ; i < tempListIndex ; i++)
//{
//    if(tempCount[i] > 0)
//    {
//        size = tempCount[i] / 2;
//        pageSize = size * 2;
//        
//        unsigned int  laddress = address % 256;
//        unsigned int  haddress = address / 256;
//        
//        address += size;
//        
//        [self writeByte:0x55];  //"loading page address");
//        [self writeByte:laddress];
//        [self writeByte: haddress];
//        [self writeByte:0x20];
//        [NSThread sleepForTimeInterval:0.05];
//        
//        
//        
//        [self writeByte:0x64];
//        [self writeByte:0x00];
//        [self writeByte:(Byte)(pageSize)];
//        [self writeByte:0x46];
//
var h = lh(test_blink,64);

var hd = {
    index:0,
    getData:function(x){
        var t = x[this.index ++]+"20"
        console.log("->"+ t)
        return s(t)
    }
}


function enumBuffer(buf,callback){
    
    var bfl = buf
    if(typeof callback != 'function'){
        return ;
    }
    
    for(var i = 0; i < bfl.byteLength; i++)
    {
        var t = buf.slice(i,i+1)
        var result = callback(t,i)
        if(typeof result == 'boolean' && result == true){
            return ;
        }
    }
}


function serialStartBurner()
{
    stepEval.eval("3020");
    stepEval.eval("3020");
    
//    stepEval.eval("418020");
//    stepEval.eval("418020");
    stepEval.eval("418120");
    stepEval.eval("418220");
    
    stepEval.eval("5020");
    stepEval.eval("7520");

    //var h = Hex.strTohex(test_str,64);
    //var h = Hex.strTohex(test_blink,32);
    var pageSize = 64 ;
    var address = 0x0000;
    
    time.interval = 50;
    for(var i = 0; i<h.length ;i++)
    {
        var ladd = address % 256;
        var hadd = parseInt(address / 256);
        address += 32;
        
        ladd_str = (ladd < 16? "0":"")+ladd.toString(16)
        hadd_str = (hadd < 16? "0":"")+hadd.toString(16)
        
        console.log("address"+ address + "ladd->"+ ladd_str +"hadd->"+hadd_str)
        
        stepEval.eval("55"+ ladd_str + hadd_str +"20")
        stepEval.eval("6400"+pageSize.toString(16)+"46")
        
        setTimeout(function(){
                   serial.send(hd.getData(h))
//                   enumBuffer(hd.getData(h),function(x){
//                              
//                              serial.send(x);
//                              
//                              });
//                   
                   },time.next())
        //time.base += 200;
        }
        stepEval.eval('5120');


      setTimeout(function(){console.log("start send code data")
               serial.close()
               },time.next()+2000)
    
 }


function serialConnectThen(){

    
    // execute all setup methods here to avoid chrome specifics within the STK500 object
    protocol.port = serial.activePort;
    
    // overwrite our protocol port methods
    protocol.portSend = chromeSerialWrite;
    protocol.portFlush = chromeSerialFlush;
    protocol.portSetDTR_RTS = chromeSerialSetDTR_RTS;
    protocol.portClose = chromeSerialClose;
    protocol.portReadCallbackArm = chromeSerialReadCallbackArm;
    
    // initialize the protocol
    protocol.initialize({   success: function(data) {
                                console.log("Initialized - Hardware Version: " + data.hardwareVersion + ", Firmware Version: " + data.versionMajor + "." + data.versionMinor + " Signature: " + data.signature);
                            },
                            error: function() {
                                console.log("Error Initializing");
                            }
                        
                        
                         });

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
  //  serial.read( readLen, chromeSerialRead);
};

var chromeSerialRead = function(readData) {
    
    if (!protocol.port) {
        console.log("chromeSerialRead() called without active port");
        return;
    }
    
    if (readData && readData.bytesRead > 0 && readData.data) {
        if (serialLogging == true) {
            console.log("chromeSerialRead(): " + bufferToString(readData.data));
        }
        
        // call the actual protocol recieve method
        protocol.recieve(readData.data);
        
    } else {
      //  serial.recieve( readLen, chromeSerialRead);
    }
    
};

serialLogging = true

var chromeSerialWrite = function(data) {
    if (!protocol.port) {
        console.log("chromeSerialWrite() called without active port");
        return;
    }
    
    if (serialLogging == true) {
        console.log("chromeSerialWrite(): " +  bufferToString(data.buffer));
    }
    
    serial.send(data.buffer, function() {});
};

var chromeSerialFlush = function() {
    if (!protocol.port) {
        console.log("chromeSerialFlush() called without active port");
        return;
    }
    
    if (serialLogging == true) {
        console.log("chromeSerialFlush()");
    }
    serial.flush(function() {});
};

var chromeSerialSetDTR_RTS = function(state) {
    if (!protocol.port) {
        console.log("chromeSerialSetDTR_RTS() called without active port");
        return;
    }
    
    if (serialLogging == true) {
        console.log("chromeSerialSetDTR_RTS(): " + state);
    }
    
   // serial.setControlSignals(protocol.port.connectionId, { dtr: state, rts: state}, function() {});
};

var chromeSerialClose = function() {
    if (!protocol.port) {
        console.log("chromeSerialClose() called without active port");
        return;
    }
    
    if (serialLogging == true) {
        console.log("chromeSerialClose()");
    }
    
    serial.close( function() {});
};


/*
console.log(h.originHexString)
//处理 hex文件生成对应 字符串数组
function lh(m,d){
    var l = (function f(e){ //hex 处理
             var t = [];
             var s = "";
             if(typeof e == "string" && e.length){
             t = e.split('\n');
             }
             for(var i=0; i<t.length; i++)
             {   var x = t[i].substring(9,t[i].length-2);
             s+=x;
             }
             return s;
             })(m);
    var t = [];  //补填数组最后一组
    if(typeof d == "undefine"  || d == null)
    {
        d = 64;
    }
    var i = 0;
    for( ; i < l.length; i+= 2*d){
        var str = l.substr(i,2*d);
        //console.log(str);
        t.push(str);
    }
    var n = t[t.length - 1];
    if(n.length < 2*d){
        var b = "";
        for(var i = 0; i< (2*d - n.length);i++){
            b += 'F';
        }
        t[t.length - 1]+=b;
    }
   // console.log(t);
    return t;
}

//十进制字符串数组 生成 二进制数组
function d(l){
    var li = [];
    for(var i = 0; i<l.length; i++){
        li[i] = s(l[i]);
    }
    return li;
}

// (十进制)字符串转 二进制.
function u(e) {
    for (var t = e, n = new Uint8Array(t.length), r = 0; r < t.length; ++r) n[r] = t.charCodeAt(r);
    return n.buffer
}

function s(e)  //十进制字符串转 数组
{
    if(e.length%2 != 0)
    {
        console.log("data length error");
        return;
    }
    var n = new Uint8Array(e.length/2);
    for(var i = 0 ;i < e.length ; i += 2)
    {
        var str = e.substr(i,2);
        console.log(str +"--->"+ parseInt(str,16));
        n[i/2] = parseInt(str,16);
    }
    return n.buffer;
    // return n;
};

//console.log(lh(test_str))

//require(['hex'])



//var h2 = new hex.hex()
//console.log(h2)
*/


/*
function pySegSort2(arr,empty) {
    if(!String.prototype.localeCompare)
        return null;
    
    var letters ="*abcdefghjklmnopqrstwxyz".split('');
    var zh ="啊把差大额发噶哈级卡啦吗那哦爬器然啥他哇西呀咋".split('');
    var segs = [];
    var curr;
    $.each(letters, function(i){
           curr = {letter: this, data:[]};
           $.each(arr, function() {
                  if((!zh[i-1] || zh[i-1].localeCompare(this) <= 0) && this.localeCompare(zh[i]) == -1) {
                  curr.data.push(this);
                  }
                  });
           if(empty || curr.data.length) {
           segs.push(curr);
           curr.data.sort(function(a,b){
                          return a.localeCompare(b);
                          });
           }
           });
    return segs;
}


function pySegSort(arr,empty) {
    if(!String.prototype.localeCompare)
        return null;
    var letters ="*abcdefghjklmnopqrstwxyz".split('');
    var zh ="啊把差大额发噶哈级卡啦吗那哦爬器然啥他哇西呀咋".split('');
    console.log(letters);
    console.log(zh)
    var segs = [];
    var curr;
    for (var l in letters){
        curr = {letter:letters[l], data:[]};
        for(var i=0 ;i < arr.length; i++){
            _this = arr[i]
            if((!zh[l-1] || zh[l-1].localeCompare(_this) <= 0) && _this.localeCompare(zh[l]) == -1) {
                curr.data.push(_this);
            }
        }
        if(empty || curr.data.length) {
            segs.push(curr);
            curr.data.sort(function(a,b){
                           return a.localeCompare(b);
                           });
        }
    }
    return segs;
}
console.log( pySegSort2(["哈","我"])) */


// serial setup

/*
chrome.serial.getDevices(function(ports) {
	
	// filter out bluetooth port
	var eligiblePorts = ports.filter(function(port) {
		return (!port.path.match("/[Bb]luetooth/") && port.path.match("/tty/"));
	});
 
    ports.sort(function(a,b){
        return a>b;
    })
	
	console.log("ports:");
	for (var i = 0; i < eligiblePorts.length; i++) {
	    console.log("\t" + eligiblePorts[i]);
	}

	// TODO currently hardcoding to the first found port
	var selectedPort = eligiblePorts[0];
	
	console.log("opening port: " + selectedPort);
	
	chrome.serial.connect(selectedPort.path, {bitrate: protocol.baudrate},  function(port) {
		if (!port || !port.connectionId || port.connectionId < 0) {
			console.log(selectedPort + " failed to open");
			return;
		}
		
		console.log(selectedPort + " opened successfully");
		
		// execute all setup methods here to avoid chrome specifics within the STK500 object
		protocol.port = port;
		
		// overwrite our protocol port methods
		protocol.portSend = chromeSerialWrite;
		protocol.portFlush = chromeSerialFlush;
		protocol.portSetDTR_RTS = chromeSerialSetDTR_RTS;
		protocol.portClose = chromeSerialClose;
		protocol.portReadCallbackArm = chromeSerialReadCallbackArm;		
		
		// initialize the protocol
		protocol.initialize({
			success: function(data) {
				console.log("Initialized - Hardware Version: " + data.hardwareVersion + ", Firmware Version: " + data.versionMajor + "." + data.versionMinor + " Signature: " + data.signature);
 
    */
				/* This doesnt work (at least for what im looking at right now)
				STK500.getBoardDetails({
					success: function(data) {
						console.log("Board Details fetched");
					}
				});
				*/ /*
			},
			error: function() {
				console.log("Error Initializing");
			}
		
		});
	});
});   */

