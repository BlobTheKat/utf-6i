!(function(){
  function toBin(num, c = 1){
    return ("0".repeat(18) + num.toString(2)).slice(-6*c);
  }
  function range(val, min, max, callback){
    var prev = false;
    var all = true;
    var any = false;
    if(val>=min&&val<=max){
      callback(val-min, val);
      prev = true;
      any = true;
    }else{
      all = false;
    }
    var x = function(min, max, callback){
      if(val>=min&&val<=max){
        callback(val-min, val, prev, any, all);
        prev = true;
        any = true;
      }else{
        all = false;
      }
      return {range: x};
    } 
    return {range: x};
  }
  function toUtf6i(txt, base64 = false){
    txt = Array.from(txt);
    var res = "";
    var nums = [];
    for(var i in txt){
      nums.push(txt[i].codePointAt(0));
    }
    for(var i in nums){
      range(nums[i], 97, 122, function(r){
        res+=(toBin(r+1));
      }).range(65, 90, function(r){
        res+=("111111"+toBin(r+1));
      }).range(48, 57, function(r){
        res+=(toBin(r+27));
      }).range(0, 31, function(r){
        res+="110011000000"+toBin(r);
      }).range(126, 127, function(r){res+="110011000001"+toBin(r);
      }).range(0x2500, 0x25FF, function(r){
        res+=toBin(Math.floor(r/64)+47)+toBin(r%64);
      }).range(0x1F600, 0x1F6FF, function(r){
        res+="111111"+toBin(Math.floor(r/64)+47)+toBin(r%64);
      }).range(128, 0x7FFF, function(r,a,prev,any,all){
        if(any){return}
        res+=toBin(Math.floor(a/4096)+51)+toBin(a%4096, 2);
      }).range(0x8000, 0xFFFF, function(r,a,prev,any,all){
        if(any){return}
        res+="111111"+toBin(Math.floor(r/4096)+51)+toBin(r%4096, 2);
      }).range(0x10000, 0x10FFFF, function(r,a,prev,any,all){
        if(any){return}
        res+=toBin(Math.floor(r/4**9)+59)+toBin(r%262144, 3);
      })
      range(".,:;!?-\"()>]}&@#%$^*<[{/|\\'`+=".indexOf(String.fromCodePoint(nums[i])), 0, 19, function(r){
        res+=("111111"+toBin(r+27))
      }).range(20,29, function(r){
        res+=(toBin(r+37));
      })
      if(nums[i]==32){res+="000000"}
      if(nums[i]==95){res+="111111000000"}
    }
    if(base64){
      var y="";
      res.match(/.{6}/g).forEach(function(itm){
        y+=btoa(String.fromCharCode(parseInt(itm,2)<<2))[0];
      })
      return y;
    }
    return res;
  }
  chunkArr=function(arr,chunkSize) {
    var array = Array.from(arr);
    return [].concat.apply([],
      array.map(function(elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }
  function fromUtf6i(bin, isb64=false){
    var digs = [];
    var nums = [];
    var x = Array.from(bin);
    x.forEach(function(itm, ind, z){
      if(isb64){
        digs.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(itm))
      }else if(ind%6==0){
        parseInt(z=x.slice(ind,ind+6).join(""), 2)-(((z)[0]=="1"&&signed)?(2**((z).length)):0)
        digs.push();
      }
    });
    var carry = [];
    var symbolsN = [46, 44, 58, 59, 33, 63, 45, 34, 40, 41];
    var symbolsA = [60, 91, 123, 47, 124, 92, 39, 96, 43, 61];
    var symbolsB = [62, 93, 125, 38, 64, 35, 37, 36, 94, 42];
    for(var i = 0;i<digs.length;i++){
      if(!carry.length){
        if(digs[i]==0){nums.push(32)}
        range(digs[i], 1, 26, function(r){
          nums.push(r+97);
        }).range(27, 36, function(r){
          nums.push(r+48);
        }).range(37, 46, function(r){
          nums.push(symbolsA[r]);
        }).range(47, 63, function(r,a){
          carry.push(a);
        })
      }else if(carry[0]==63){
        if(carry[1]){
          range(carry[1], 47, 50, function(r){
            nums.push(128512+(r*64 + digs[i]))
          }).range(51, 58, function(r){
            var ex = (digs[i]*64)+digs[i+1];
            i++;
            ex+=(r*4096);
            nums.push(32768 + ex);
          }).range(59, 62, function(r){
            var ex = (digs[i]*4096)+(digs[i+1]*64)+digs[i+2];
            i+=2;
            ex+=(r*262144);
            nums.push(65536 + ex)
          });
          carry=[];
        }else{
          if(digs[i]==0){nums.push(95);carry=[]}
          if(digs[i]==63){carry=[];continue}
          range(digs[i], 1, 26, function(r){
            nums.push(r+65);carry=[];
          }).range(27, 36, function(r){
            nums.push(symbolsN[r]);carry=[];
          }).range(37, 46, function(r){
            nums.push(symbolsB[r]);carry=[];
          }).range(47, 62, function(r,a){
            carry.push(a);
          })
        }
      }else if(carry[0]>=47&&carry[0]<=50){
        nums.push(9472+((carry[0]-47)*64 + digs[i]))
        carry = []
      }else if(carry[0]>=51&&carry[0]<=58){
        var ex = (digs[i]*64)+digs[i+1];
        i++;
        ex+=((carry[0]-51)*4096);
        if(ex<128){
          range(ex, 0, 31, function(r){
            nums.push(r)
          }).range(64, 65, function(r){
            nums.push(126+r);
          })
        }else{
          nums.push(ex);
        }
        carry = []
      }else if(carry[0]>=59&&carry[0]<=62){
        var ex = (digs[i]*4096)+(digs[i+1]*64)+digs[i+2];
        i+=2;
        ex+=((carry[0]-59)*262144);
        nums.push(65536 + ex)
        carry = []
      }
    }
    var txt = "";
    chunkArr(nums, 1024).forEach(function(itm){
      txt+=String.fromCodePoint(...itm)
    });
    return txt;
  }
  var mod = {_range: range, encode: toUtf6i, decode: fromUtf6i};
  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['exports', 'b'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
      factory(exports, require('b'));
    } else {
      factory((root.commonJsStrict = {}), root.b);
    }
  })(this, function (exports, b) {
    Object.assign(exports, mod)
  });
  if(this && "window" in this){
    window.UTF6I = mod
  }
})()
