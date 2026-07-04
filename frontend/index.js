(function () {
  var TOKEN = (document.currentScript && document.currentScript.dataset && document.currentScript.dataset.extensionToken) || "";
  if (!TOKEN) throw new Error("Missing extension activation token");
  window.registerExtension(function (api) {
    var R = api.React, el = R.createElement;
    var CU = api.ChakraUI;
    var Box=CU.Box, HStack=CU.HStack, VStack=CU.VStack, Text=CU.Text, Heading=CU.Heading, Badge=CU.Badge, Button=CU.Button;

    function sGet(k,d){ try{var v=localStorage.getItem("sw-"+k);return v!==null?JSON.parse(v):d}catch(e){return d} }
    function sSet(k,v){ try{localStorage.setItem("sw-"+k,JSON.stringify(v))}catch(e){} }

    var _c=null, _a=null, _p=[], _t="rain", _int=50, _run=false, _frm=0;

    function mkC(){
      if(_c) return _c;
      _c=document.createElement("canvas");
      _c.id="sw-bg";
      _c.style.cssText="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;";
      document.body.insertBefore(_c,document.body.firstChild);
      _c.width=window.innerWidth; _c.height=window.innerHeight;
      return _c;
    }
    function rmC(){
      if(_a){cancelAnimationFrame(_a);_a=null}
      if(_c&&_c.parentNode)_c.parentNode.removeChild(_c);
      _c=null;_p=[];_run=false;_frm=0;
    }

    function initP(c,type,cnt){if(!c||!c.width)c={width:window.innerWidth,height:window.innerHeight};
      var p=[];
      for(var i=0;i<cnt;i++){
        if(type==="rain") p.push({x:Math.random()*c.width,y:Math.random()*c.height,len:10+Math.random()*22,speed:5+Math.random()*8,wind:1.5+Math.random()*2.5,op:0.15+Math.random()*0.3,w:0.5+Math.random()*1.0,l:Math.floor(Math.random()*3)});
        else if(type==="snow") p.push({x:Math.random()*c.width,y:Math.random()*c.height,sz:1+Math.random()*5,sp:0.5+Math.random()*2.5,wb:Math.random()*Math.PI*2,ws:0.003+Math.random()*0.015,wa:0.3+Math.random()*1.5,op:0.2+Math.random()*0.4,l:Math.floor(Math.random()*3)});
        else if(type==="sand") p.push({x:Math.random()*c.width,y:Math.random()*c.height,sz:0.5+Math.random()*3,sp:2+Math.random()*5,dr:0.3+Math.random()*1.5,op:0.1+Math.random()*0.25,wb:Math.random()*Math.PI*2,ws:0.002+Math.random()*0.01,wa:0.5+Math.random()*2,l:Math.floor(Math.random()*3)});
        else if(type==="stars") p.push({x:Math.random()*c.width,y:Math.random()*c.height,sz:0.5+Math.random()*2.5,b:0.3+Math.random()*0.7,ph:Math.random()*Math.PI*2,sp:0.005+Math.random()*0.03});
        else if(type==="aurora") p.push({x:i/cnt*c.width,y:Math.random()*c.height*0.6,sz:3+Math.random()*5,sp:0.2+Math.random()*0.5,ph:Math.random()*Math.PI*2,ws:0.005+Math.random()*0.015,cl:Math.floor(Math.random()*3)});
        else if(type==="leaves") p.push({x:Math.random()*c.width,y:Math.random()*c.height*-1,sz:3+Math.random()*8,sp:0.5+Math.random()*2,wb:Math.random()*Math.PI*2,ws:0.01+Math.random()*0.03,wa:0.5+Math.random()*3,op:0.5+Math.random()*0.5,cl:Math.floor(Math.random()*5),rot:Math.random()*Math.PI*2});
        else if(type==="water") p.push({x:Math.random()*c.width,y:Math.random()*c.height,sz:1+Math.random()*4,sp:0.3+Math.random()*1.5,wb:Math.random()*Math.PI*2,ws:0.005+Math.random()*0.02,wa:5+Math.random()*20,op:0.1+Math.random()*0.3});
        else if(type==="fire") p.push({x:c.width*0.2+Math.random()*c.width*0.6,y:c.height*0.5+Math.random()*c.height*0.5,sz:1+Math.random()*5,sp:0.5+Math.random()*3,wb:Math.random()*Math.PI*2,ws:0.01+Math.random()*0.05,wa:2+Math.random()*10,op:0.3+Math.random()*0.7,cl:Math.floor(Math.random()*3)});
        else if(type==="sunset") p.push({x:i/cnt*c.width,y:Math.random()*c.height*0.4,sz:5+Math.random()*20,sp:0.1+Math.random()*0.3,op:0.1+Math.random()*0.3});
        else if(type==="mc") p.push({x:Math.random()*c.width,y:Math.random()*c.height*0.5,sz:5+Math.random()*15,sp:0.1+Math.random()*0.3,op:0.3+Math.random()*0.5,wb:Math.random()*Math.PI*2});
      }
      return p;
    }

    // ===== Draw Functions =====
    function drRain(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<p.length;i++){
        var d=p[i],a=d.op*(intens/100);
        ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+d.wind*0.8,d.y-d.len);
        ctx.strokeStyle="rgba(160,200,255,"+a+")";ctx.lineWidth=d.w;ctx.lineCap="round";
        ctx.shadowColor="rgba(100,150,255,"+(a*0.25)+")";ctx.shadowBlur=(4+d.l*2)*(1+intens/200);
        ctx.stroke();ctx.shadowBlur=0;
        d.x+=d.wind*(d.l+1)*0.15;d.y+=d.speed*(0.8+d.l*0.3);
        if(d.y>h+30){d.y=-30;d.x=Math.random()*w}if(d.x>w+15)d.x=-15;if(d.x<-15)d.x=w+15;
      }
    }
    function drSnow(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<p.length;i++){
        var d=p[i],sz=d.sz*(0.7+d.l*0.4)*(intens/100),a=d.op*(intens/100);
        var gr=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,sz*(5+intens/25));
        gr.addColorStop(0,"rgba(200,220,255,"+(a*0.4)+")");gr.addColorStop(0.2,"rgba(180,210,240,"+(a*0.15)+")");gr.addColorStop(1,"rgba(180,210,240,0)");
        ctx.fillStyle=gr;ctx.beginPath();ctx.arc(d.x,d.y,sz*5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="rgba(220,235,255,"+(a*0.5)+")";ctx.beginPath();ctx.arc(d.x,d.y,sz*0.5,0,Math.PI*2);ctx.fill();
        d.wb+=d.ws;d.x+=Math.sin(d.wb)*d.wa+0.2;d.y+=d.sp*(0.7+d.l*0.4);
        if(d.y>h+15){d.y=-15;d.x=Math.random()*w}if(d.x>w+10)d.x=-10;if(d.x<-10)d.x=w+10;
      }
    }
    function drSand(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      var hz=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*0.7);
      hz.addColorStop(0,"rgba(200,170,120,"+(0.06*intens/100*(1+intens/100))+")");hz.addColorStop(1,"rgba(180,150,100,0)");
      ctx.fillStyle=hz;ctx.fillRect(0,0,w,h);
      for(var i=0;i<p.length;i++){
        var d=p[i],s=d.sz*(0.7+d.l*0.4)*(intens/100),a=d.op*(intens/100);
        var gr=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,s*6);
        gr.addColorStop(0,"rgba(220,190,140,"+(a*0.3)+")");gr.addColorStop(0.3,"rgba(200,170,120,"+(a*0.12)+")");gr.addColorStop(1,"rgba(200,170,120,0)");
        ctx.fillStyle=gr;ctx.beginPath();ctx.arc(d.x,d.y,s*6,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="rgba(220,195,150,"+(a*0.3)+")";ctx.beginPath();ctx.arc(d.x,d.y,s,0,Math.PI*2);ctx.fill();
        d.wb+=d.ws;d.x+=Math.sin(d.wb)*d.wa+d.dr;d.y+=d.sp*0.15*(0.7+d.l*0.4);
        if(d.y>h+10){d.y=-10;d.x=Math.random()*w}if(d.x>w+20)d.x=-20;if(d.x<-20)d.x=w+20;
      }
    }
    function drStars(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      // Night sky subtle overlay
      var ov=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*0.8);
      ov.addColorStop(0,"rgba(0,0,20,0)");ov.addColorStop(1,"rgba(0,0,20,"+(0.06*intens/100)+")");
      ctx.fillStyle=ov;ctx.fillRect(0,0,w,h);
      // Milky Way
      var mw=ctx.createRadialGradient(w*0.35,h*0.35,0,w*0.35,h*0.35,Math.min(w,h)*0.6);
      mw.addColorStop(0,"rgba(150,180,255,"+(0.03*intens/100)+")");mw.addColorStop(0.5,"rgba(120,150,220,"+(0.015*intens/100)+")");mw.addColorStop(1,"rgba(150,180,255,0)");
      ctx.fillStyle=mw;ctx.beginPath();ctx.ellipse(w*0.35,h*0.35,Math.min(w,h)*0.6,Math.min(w,h)*0.2,0.4,0,Math.PI*2);ctx.fill();
      // Stars
      _frm++;
      for(var i=0;i<p.length;i++){
        var d=p[i],tw=0.5+0.5*Math.sin(d.ph+_frm*d.sp),a=d.b*Math.max(0.2,tw)*(intens/100);
        ctx.fillStyle="rgba(200,220,255,"+a+")";ctx.shadowColor="rgba(180,210,255,"+(a*0.3)+")";ctx.shadowBlur=d.sz*3;
        ctx.beginPath();ctx.arc(d.x,d.y,d.sz*(0.5+tw*0.5),0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      }
      // Shooting stars
      var ssCount=Math.floor(1+intens/33);
      for(var i=0;i<ssCount;i++){
        var sx=Math.random()*w,sy=Math.random()*h*0.3,angle=0.6+Math.random()*0.8,len=30+Math.random()*80;
        var gr=ctx.createLinearGradient(sx,sy,sx+Math.cos(angle)*len,sy+Math.sin(angle)*len);
        gr.addColorStop(0,"rgba(200,220,255,"+(0.6*intens/100)+")");gr.addColorStop(1,"rgba(200,220,255,0)");
        ctx.strokeStyle=gr;ctx.lineWidth=1.5*(intens/100);ctx.beginPath();ctx.moveTo(sx,sy);
        ctx.lineTo(sx+Math.cos(angle)*len,sy+Math.sin(angle)*len);ctx.stroke();
      }
    }
    function drAurora(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      var colors=[["rgba(0,255,100","rgba(0,200,150","rgba(0,150,200"],["rgba(100,200,255","rgba(150,100,255","rgba(200,50,255"],["rgba(0,200,200","rgba(0,255,150","rgba(100,255,100"]];
      _frm++;
      for(var l=0;l<3;l++){
        ctx.beginPath();ctx.moveTo(0,h*0.9);
        for(var x=0;x<=w;x+=15){
          var y=h*0.2+Math.sin(x*0.008+_frm*0.005+l*2)*h*0.25*Math.sin(x*0.003+l*1.5)*h*0.15;
          ctx.lineTo(x,y);
        }
        ctx.lineTo(w,h*0.9);ctx.closePath();
        var gr=ctx.createLinearGradient(0,0,0,h*0.6);
        gr.addColorStop(0,colors[l][0]+","+(0.12*intens/100)+")");gr.addColorStop(0.5,colors[l][1]+","+(0.08*intens/100)+")");gr.addColorStop(1,colors[l][2]+","+(0.02*intens/100)+")");
        ctx.fillStyle=gr;ctx.fill();
      }
      // Subtle glow particles
      for(var i=0;i<p.length;i++){
        var d=p[i],a=d.op*(intens/100);
        d.ph+=d.ws;d.y+=Math.sin(d.ph)*0.3;
        var gr=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.sz*8);
        gr.addColorStop(0,"rgba("+(d.cl===0?"150,255,100":d.cl===1?"100,200,255":"200,150,255")+","+(a*0.15)+")");
        gr.addColorStop(1,"rgba("+(d.cl===0?"150,255,100":d.cl===1?"100,200,255":"200,150,255")+",0)");
        ctx.fillStyle=gr;ctx.beginPath();ctx.arc(d.x,d.y,d.sz*8,0,Math.PI*2);ctx.fill();
        d.x+=d.sp;if(d.x>w+20){d.x=-20;d.y=Math.random()*h*0.6}
      }
    }
    function drLeaves(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      var leafColors=["#d4441a","#e87020","#e8b830","#8ab830","#c87830"];
      for(var i=0;i<p.length;i++){
        var d=p[i],a=d.op*(intens/100),sz=d.sz*(intens/100);
        d.wb+=d.ws;d.rot+=0.02;d.x+=Math.sin(d.wb)*d.wa+0.3;d.y+=d.sp*(0.5+d.sz/8);
        if(d.y>h+20){d.y=-20;d.x=Math.random()*w;d.cl=Math.floor(Math.random()*5)}
        if(d.x>w+20)d.x=-20;if(d.x<-20)d.x=w+20;
        ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.rot);
        ctx.shadowColor="rgba(100,50,0,"+(a*0.2)+")";ctx.shadowBlur=4;
        ctx.fillStyle=leafColors[d.cl];ctx.globalAlpha=a;
        ctx.beginPath();ctx.ellipse(0,0,sz,sz*0.5,0,0,Math.PI*2);ctx.fill();
        ctx.restore();ctx.shadowBlur=0;ctx.globalAlpha=1;
      }
    }
    function drWater(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      // Subtle blue overlay
      var ov=ctx.createRadialGradient(w/2,h*0.3,0,w/2,h*0.3,Math.max(w,h)*0.7);
      ov.addColorStop(0,"rgba(50,100,180,"+(0.04*intens/100)+")");ov.addColorStop(1,"rgba(20,50,100,"+(0.06*intens/100)+")");
      ctx.fillStyle=ov;ctx.fillRect(0,0,w,h);
      // Light rays (caustics)
      _frm++;
      for(var r=0;r<8;r++){
        var rx=(r/8)*w+Math.sin(_frm*0.002+r*2)*80,cw=30+Math.sin(_frm*0.003+r*3)*15;
        var gr=ctx.createLinearGradient(rx,0,rx+cw,0);
        gr.addColorStop(0,"rgba(180,230,255,0)");gr.addColorStop(0.5,"rgba(180,230,255,"+(0.025*intens/100)+")");gr.addColorStop(1,"rgba(180,230,255,0)");
        ctx.fillStyle=gr;ctx.beginPath();
        ctx.moveTo(rx-20,0);ctx.quadraticCurveTo(rx-10+Math.sin(_frm*0.005+r)*30,h*0.7,rx-5+Math.sin(_frm*0.004+r*1.5)*20,h);
        ctx.lineTo(rx+cw+5+Math.sin(_frm*0.004+r*1.5)*10,h);ctx.quadraticCurveTo(rx+cw+10+Math.sin(_frm*0.005+r)*20,h*0.7,rx+cw+20,0);
        ctx.fill();
      }
      // Bubbles
      for(var i=0;i<p.length;i++){
        var d=p[i],sz=d.sz*(intens/100);
        d.wb+=d.ws;d.x+=Math.sin(d.wb)*d.wa*0.02;d.y-=d.sp*(0.5+d.sz/5);
        if(d.y<-10){d.y=h+10;d.x=Math.random()*w;d.sz=1+Math.random()*4;d.sp=0.3+Math.random()*1.5}
        ctx.strokeStyle="rgba(180,220,255,"+(d.op*(intens/100))+")";ctx.lineWidth=0.5;
        ctx.beginPath();ctx.arc(d.x,d.y,sz,0,Math.PI*2);ctx.stroke();
        ctx.fillStyle="rgba(200,230,255,"+(d.op*0.3*(intens/100))+")";ctx.beginPath();ctx.arc(d.x-sz*0.2,d.y-sz*0.2,sz*0.2,0,Math.PI*2);ctx.fill();
      }
    }
    function drFire(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      // Warm glow at base
      var gl=ctx.createRadialGradient(w/2,h,0,w/2,h,Math.max(w,h)*0.5);
      gl.addColorStop(0,"rgba(255,150,30,"+(0.08*intens/100)+")");gl.addColorStop(0.5,"rgba(200,80,20,"+(0.04*intens/100)+")");gl.addColorStop(1,"rgba(150,50,10,0)");
      ctx.fillStyle=gl;ctx.beginPath();ctx.arc(w/2,h,Math.max(w,h)*0.5,0,Math.PI*2);ctx.fill();
      for(var i=0;i<p.length;i++){
        var d=p[i];
        d.wb+=d.ws;d.x+=Math.sin(d.wb)*d.wa*0.1;d.y-=d.sp*(0.8+d.sz/5);
        if(d.y<-20||d.x<0||d.x>w){d.y=h*0.5+Math.random()*h*0.5;d.x=w*0.2+Math.random()*w*0.6}
        var sz=d.sz*(intens/100),a=d.op*(intens/100);
        var colors=[["255,200,50","255,150,30","255,100,20"],["255,150,30","255,100,20","200,50,10"],["200,80,20","150,50,10","100,30,0"]];
        var gr=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,sz*6);
        gr.addColorStop(0,"rgba("+colors[d.cl][0]+","+(a*0.5)+")");gr.addColorStop(0.3,"rgba("+colors[d.cl][1]+","+(a*0.25)+")");gr.addColorStop(1,"rgba("+colors[d.cl][2]+",0)");
        ctx.fillStyle=gr;ctx.beginPath();ctx.arc(d.x,d.y,sz*6,0,Math.PI*2);ctx.fill();
        ctx.shadowColor="rgba(255,200,50,"+(a*0.3)+")";ctx.shadowBlur=10;
        ctx.fillStyle="rgba("+colors[d.cl][0]+","+(a*0.4)+")";ctx.beginPath();ctx.arc(d.x,d.y,sz,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;
      }
      // Flickering light overlay
      var fl=ctx.createRadialGradient(w*0.3+Math.sin(_frm*0.01)*w*0.2,h*0.7,0,w*0.3+Math.sin(_frm*0.01)*w*0.2,h*0.7,Math.max(w,h)*0.6);
      fl.addColorStop(0,"rgba(255,200,100,"+(0.03*intens/100)+")");fl.addColorStop(1,"rgba(255,200,100,0)");
      ctx.fillStyle=fl;ctx.beginPath();ctx.arc(w*0.3+Math.sin(_frm*0.01)*w*0.2,h*0.7,Math.max(w,h)*0.6,0,Math.PI*2);ctx.fill();
      _frm++;
    }
    function drSunset(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      _frm++;
      // Sky gradient
      var sky=ctx.createLinearGradient(0,0,0,h);
      var sunY=0.2+Math.sin(_frm*0.003)*0.3;
      sky.addColorStop(Math.max(0,sunY-0.3),"rgba(100,150,220,"+(0.1*intens/100)+")");
      sky.addColorStop(sunY,"rgba(255,200,100,"+(0.15*intens/100)+")");
      sky.addColorStop(Math.min(1,sunY+0.3),"rgba(240,120,60,"+(0.12*intens/100)+")");
      sky.addColorStop(1,"rgba(180,80,40,"+(0.08*intens/100)+")");
      ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
      // Sun
      var sx=w*0.5+Math.sin(_frm*0.002)*w*0.2,sy=h*sunY,sw=40*(intens/100);
      var sg=ctx.createRadialGradient(sx,sy,0,sx,sy,sw*3);
      sg.addColorStop(0,"rgba(255,220,150,"+(0.3*intens/100)+")");sg.addColorStop(0.5,"rgba(255,180,80,"+(0.15*intens/100)+")");sg.addColorStop(1,"rgba(255,180,80,0)");
      ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,sw*3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="rgba(255,220,180,"+(0.6*intens/100)+")";ctx.beginPath();ctx.arc(sx,sy,sw,0,Math.PI*2);ctx.fill();
      // Clouds
      for(var i=0;i<p.length;i++){
        var d=p[i],sz=d.sz*(intens/100),a=d.op*(intens/100);
        d.x+=d.sp;if(d.x>w+50)d.x=-50;
        ctx.fillStyle="rgba(200,180,160,"+(a*0.3)+")";
        ctx.beginPath();ctx.ellipse(d.x,d.y,sz,sz*0.4,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="rgba(255,200,150,"+(a*0.2)+")";ctx.beginPath();ctx.ellipse(d.x+sz*0.5,d.y-sz*0.1,sz*0.5,sz*0.3,0,0,Math.PI*2);ctx.fill();
      }
    }
    function drMC(ctx,w,h,p,intens){
      ctx.clearRect(0,0,w,h);
      _frm++;
      // Sky gradient (Minecraft sky colors)
      var sky=ctx.createLinearGradient(0,0,0,h*0.5);
      sky.addColorStop(0,"rgba(100,180,255,"+(0.15*intens/100)+")");sky.addColorStop(1,"rgba(135,200,235,"+(0.08*intens/100)+")");
      ctx.fillStyle=sky;ctx.fillRect(0,0,w,h*0.5);
      // Pixel block terrain
      var groundH=Math.min(80,h*0.15);
      ctx.fillStyle="rgba(100,160,60,"+(0.3*intens/100)+")";ctx.fillRect(0,h-groundH,w,groundH);
      for(var x=0;x<w;x+=12){var gh=5+Math.sin(x*0.1)*8;ctx.fillStyle="rgba(120,180,70,"+(0.25*intens/100)+")";ctx.fillRect(x,h-groundH-gh,12,gh);}
      // Block sun
      var sunX=w*0.15+Math.sin(_frm*0.003)*w*0.35,sunY=h*0.1,ss=20*(intens/100);
      ctx.fillStyle="rgba(255,220,100,"+(0.4*intens/100)+")";ctx.fillRect(sunX-ss,sunY-ss,ss*2,ss*2);
      // Pixel clouds
      for(var i=0;i<p.length;i++){
        var d=p[i];
        d.x+=d.sp;if(d.x>w+30)d.x=-30;
        for(var j=-2;j<=2;j++){
          ctx.fillStyle="rgba(255,255,255,"+(d.op*0.3*(intens/100))+")";
          ctx.fillRect(d.x+j*10,d.y+Math.sin(j)*3,12,8);
        }
      }
    }

    function animLoop(){
      if(!_c||!_run)return;
      var ctx=_c.getContext("2d");if(!ctx)return;
      switch(_t){
        case"rain":drRain(ctx,_c.width,_c.height,_p,_int);break;
        case"snow":drSnow(ctx,_c.width,_c.height,_p,_int);break;
        case"sand":drSand(ctx,_c.width,_c.height,_p,_int);break;
        case"stars":drStars(ctx,_c.width,_c.height,_p,_int);break;
        case"aurora":drAurora(ctx,_c.width,_c.height,_p,_int);break;
        case"leaves":drLeaves(ctx,_c.width,_c.height,_p,_int);break;
        case"water":drWater(ctx,_c.width,_c.height,_p,_int);break;
        case"fire":drFire(ctx,_c.width,_c.height,_p,_int);break;
        case"sunset":drSunset(ctx,_c.width,_c.height,_p,_int);break;
        case"mc":drMC(ctx,_c.width,_c.height,_p,_int);break;
      }
      _a=requestAnimationFrame(animLoop);
    }

    function startEf(type,intensity){
      _t=type||"rain";_int=intensity||50;
      var c=mkC();_p=initP(c,_t,Math.floor(500*(_int/100)));_run=true;_frm=0;animLoop();
      function rs(){if(_c){_c.width=window.innerWidth;_c.height=window.innerHeight;try{_p=initP(_c,_t,Math.floor(500*(_int/100)))}catch(e){}}}
      window.addEventListener("resize",rs);
      window.addEventListener("beforeunload",function(){rmC()});
      sSet("type",_t);sSet("intensity",_int);sSet("enabled",true);
      return function(){window.removeEventListener("resize",rs);rmC()};
    }
    function stopEf(){rmC();sSet("enabled",false);}
    function updEf(type,intensity){
      if(type!==undefined)_t=type;
      if(intensity!==undefined)_int=intensity;
      sSet("type",_t);sSet("intensity",_int);
      if(!_run||!_c)return;
      var cnt=Math.floor(500*(_int/100));
      while(_p.length<cnt)_p.push(initP(_c||{width:window.innerWidth,height:window.innerHeight},_t,1)[0]);
      while(_p.length>cnt)_p.pop();
    }

    // Auto restore (wait for body to be ready, prevent duplicates)
    var aE=sGet("enabled",false),aT=sGet("type","rain"),aI=sGet("intensity",50);
    if(aE&&document.body&&!document.getElementById("sw-bg")){try{startEf(aT,aI)}catch(e){}}

    var WEATHER_OPTIONS=[
      {v:"rain",l:"☔ 雨天"},{v:"snow",l:"❄ 雪天"},{v:"sand",l:"🌪 沙暴"},
      {v:"stars",l:"🌃 星空"},{v:"aurora",l:"🌌 极光"},{v:"leaves",l:"🍂 落叶"},
      {v:"water",l:"🌊 水下"},{v:"fire",l:"🔥 火焰"},{v:"sunset",l:"🌅 日落"},{v:"mc",l:"🏔 MC风景"}
    ];

    function WeatherControl(props){return el(VStack,{spacing:3,align:"stretch"},
      el(HStack,{justify:"space-between",align:"center"},
        el(Text,{fontSize:"sm",fontWeight:"bold",color:"white"},"🌦 动态背景"),
        el(Badge,{colorScheme:_run?"green":"gray",variant:"solid",fontSize:"xs"},_run?"已开启":"已关闭")),
      el("select",{
        value:_t,
        onChange:function(e){updEf(e.target.value);if(props.onTypeChange)props.onTypeChange(e.target.value)},
        style:{width:"100%",padding:"8px 12px",borderRadius:"8px",background:"#1a202c",color:"#e2e8f0",border:"1px solid #4a5568",fontSize:"14px",cursor:"pointer"}
      },WEATHER_OPTIONS.map(function(o){return el("option",{value:o.v},o.l)})),
      el(HStack,{spacing:2},
        el(Button,{size:"xs",colorScheme:_run?"red":"green",onClick:function(){
          if(_run){stopEf();if(props.onToggle)props.onToggle(false)}
          else{startEf(_t,_int);if(props.onToggle)props.onToggle(true)}
        }},_run?"关闭":"开启")),
      _run?el("input",{type:"range",min:10,max:100,step:10,value:_int,
        onChange:function(e){var v=parseInt(e.target.value);updEf(null,v);if(props.onIntensity)props.onIntensity(v)},
        style:{width:"100%",accentColor:"#4299ff"}}):null,
      el(Text,{fontSize:"xs",color:"gray.400",fontStyle:"italic"},"全屏动态背景，不影响操作。设置自动保存。"))}

    function HomeWidget(){
      var host=api.getHostContext(),es=host.state.useExtensionState;
      var wT=es("wT",aT),wI=es("wI",aI),wE=es("wE",aE);
      return el(Box,{p:4,borderWidth:1,borderRadius:"lg",bg:"rgba(8,12,24,0.9)",backdropFilter:"blur(4px)"},
        el(WeatherControl,{onTypeChange:function(v){wT[1](v)},onIntensity:function(v){wI[1](v)},onToggle:function(v){wE[1](v)}}));}

    function SettingsPage(){
      var host=api.getHostContext(),es=host.state.useExtensionState;
      var wT=es("wT",aT),wI=es("wI",aI),wE=es("wE",aE);
      return el(Box,{p:6,borderRadius:"lg",bg:"rgba(8,12,24,0.95)",backdropFilter:"blur(4px)"},
        el(Heading,{size:"md",color:"white",mb:4},"🌦 动态背景合集"),
        el(WeatherControl,{onTypeChange:function(v){wT[1](v)},onIntensity:function(v){wI[1](v)},onToggle:function(v){wE[1](v)}}));}

    return {
      homeWidget:{title:"粒子特效",defaultWidth:320,minWidth:260,Component:HomeWidget},
      settingsPage:{Component:SettingsPage}};
  }, TOKEN);
})();
