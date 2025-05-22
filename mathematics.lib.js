const math={
    /*コンピューターならではの関数*/
  primeNumbers(a){
      if(!a){
          a=500;
      }
      let found=0;
      let res=[];
      let x=1;
      while(found<a){
          x++;
          let ans=[];
          let k=0;
          while(ans.length<2){
              k++;
      if(x/k==Math.trunc(x/k)){
        ans.push(k);
      }
    }
          if(ans[1]==x){
          res.push(x);
          found++;
          }
      }
      return res;
  },
  prime(a){
      let res=this.primeNumbers(a);
      return res[a-1];
  },
  chance(a){
    if(Math.random()*100<=a){
        return true;
        }else{
        return false;
        }
  },
    triangle(a){
        return Math.abs(Math.round(a)-a);
    },
    /*三角関数*/
  csc(a){
  return 1/Math.sin(a);
  },
  sec(a){
  return 1/Math.cos(a);
  },
  cot(a){
  return 1/Math.tan(a);
  },
    acsc(a){
        return Math.asin(1/a);
    },
    asec(a){
        return Math.acos(1/a);
    },
    acot(a){
        return (Math.PI/2)-Math.atan(a);
    },
    acsch(a){
        return Math.asinh(1/a);
    },
    asech(a){
        return Math.acosh(1/a);
    },
    acoth(a){
        return Math.atanh(1/a);
    },
    /*基本関数*/
    log(n,x){
        return Math.log(x)/Math.log(n);
    },
    ln(n){
        return Math.log1p(n-1);
    },
  sum(n,N,callback){
    let res=0;
    for(let loop=n; loop<=N; ++loop){
        res+=callback(loop);
    }
  return res;
},
prod(n,N,callback){
    let res=1;
    for(let loop=n; loop<=N; ++loop){
        res=res*callback(loop);
    }
  return res;
},
fact(a){
  if(a==Math.round(a) && a>=0){
  return this.prod(1,a,k=>k);
  }else{
  return this.gamma(a+1);
  }
},
gamma(a,b){
  if(!b){
    b=20;
  }
if(a>=1){
  return this.int(0,b,x=>Math.pow(x,a-1)*Math.exp(-x),500);
    }else{
    return this.gamma(a+1)/a;
    }
},
    mean(...args){
  let ans=0;
  for(const a of args){
    ans+=eval(a);
  }
  return ans/args.length;
},
geomean(...args){
  let ans=1;
  for(const a of args){
    ans=ans*eval(a);
  }
  return Math.pow(ans,1/args.length);
},
  median(...args){
    return (args[Math.floor((args.length-1)/2)]+args[Math.ceil((args.length-1)/2)])/2;
  },
    divisor(N){
    if(N!=Math.trunc(N)){
      console.error("小数に対応していません");
    }
    let ans=[];
    for(let k=1; k<=N; ++k){
      if(N/k==Math.trunc(N/k)){
        ans.push(k);
      }
    }
    return ans;
  },
  mod(a,b){
    return a-(b*Math.floor(a/b));
  },
  quartile(a){
    let mid1=(a.length+1)/2;
    let mid2=(a.length+1)/2;
    if(mid1!=Math.trunc(mid1)){
    mid1=mid1+0.5;
    mid2=mid2-0.5;
    }
    return [this.median(a.slice(0,mid1-1)),this.median(a),this.median(a.slice(mid2,a.length))];
  },
  syntax(f,vars,varsnum){
      for(let index=0; index<vars.length; ++index){
      f=f.replaceAll(vars[index],varsnum[index]);
          }
      f=f.replaceAll("--","+");
      return eval(f);
  },
/*場合の数*/
nPr(n,r){
  return this.fact(n)/this.fact(n-r);
},
nCr(n,r){
  return this.fact(n)/(this.fact(r)*this.fact(n-r));
},
nSk1(n,k){
if(k>n){
console.error("invalid input!");
return;
}
if(k==0){
return 0;
}else if(k==1){
return this.fact(n-1);
}else if(n==k){
return 1;
}else{
return this.nSk1(n-1,k-1)+(n-1)*this.nSk1(n-1,k)
}
},
nSk2(n,k){
    let res=0;
    for(let m=1; m<=k; ++m){
        res+=Math.pow(-1,k-m)*this.nCr(k,m)*Math.pow(m,n);
    }
    return res/this.fact(k);
},
    /*微分積分学*/
  euler(term,x,y,h,f){
    let Yarray=[y];
    function F(x,y){
      return eval(f);
    }
    for(let n=1; n<=term; ++n){
      Yarray[n]=Yarray[n-1]+h*F(x,Yarray[n-1]);
      x+=h;
    }
    return Yarray[term];
  },
  trapezoidal(a,b,f,n){
    if(!n){
    n=10001;
    }
    function F(x){
      return eval(f);
    }
    let an=[a];
    for(let i=1; i<=n; ++i){
      an[i]=an[i-1]+((b-a)/n);
    }
    let ans=0;
    for(let k=1; k<=n; ++k){
      ans+=(an[k]-an[k-1])*(F(an[k])+F(an[k-1]))/2;
    }
    return ans;
  },
  int(a,b,callback,mix){
    if(!mix){
    return ((b-a)/6)*(callback(a)+4*callback((a+b)/2)+callback(b));
    }else{
    if(mix/2!=Math.ceil(mix/2)){
      mix=2*Math.ceil(mix/2);
    }
    let an=[0];
    let h=(b-a)/mix;
    for(let i=1; i<mix; ++i){
      an[i]=a+i*h;
    }
    let ans1=0;
    for(let i=1; i<=mix/2-1; ++i){
      ans1+=callback(an[2*i]);
    }
    let ans2=0;
    for(let i=1; i<=mix/2; ++i){
      ans2+=callback(an[2*i-1]);
    }
    return (h/3)*(callback(a)+2*ans1+4*ans2+callback(b));
    }
  },
    /*近似的な微分を計算する*/
    d(X,callback,n,h){
        let res=0;
        if(!n){
        /*何回微分するか*/
        n=1;
            }
        if(!h){
        /*コンピュータに教える極めて0に近い数字は任意に変更可能。デフォで1/100000*/
        h=0.000001;
            }
        /*中心差分近似法を用いる*/
        res=(callback(X+h)-callback(X-h))/(2*h);
        //res=(f(X+h)-f(X))/(h);
        return res;
    },
    newton(Function,init,h){
        let res=init;
        function f(x){
            return eval(Function);
        }
        for(let k=0; k<h; ++k){
            res=res-(f(res)/this.d(res,Function));
        }
        return res;
    },
    Rd(X,Y,which,F,h){
        let res=0;
        if(!h){
        h=0.000001;
            }
        if(which=="x"){
        function f(x){
            var y=Y;
            return eval(F);
        }
        res=(f(X+h)-f(X-h))/(2*h);
        }
        if(which=="y"){
        function f(y){
            var x=X;
            return eval(F);
        }
        res=(f(Y+h)-f(Y-h))/(2*h);
        }
        return res;
    },
    beta(a,b){
        return this.int(0,1,`Math.pow(x,${a-1})*Math.pow(1-x,${b}-1)`);
    },
    zeta(s,n){
        if(s==0){
            return -1/2;
        }else if(s==2){
            return Math.pow(Math.PI,2)/6;
        }else{
        if(!n){
            n=10000;
        }
        return this.sum(1,n,`1/Math.pow(k,${s})`);
        }
    },
    multiZeta(a,precision){
        if(!precision){
            //precision=5000*Math.pow(2/25,a.length-2);
            if(a.length<=1){
                precision=10000;
            }
            if(a.length==2){
                precision=5000;
            }
            if(a.length==3){
                precision=400;
            }
            if(a.length>=4){
                precision=125;
            }
            //console.log(precision)
        }
        if(precision<5000){
            console.log("precisionが5000以下では精度がかなり悪いです。");
        }
        let R=0;
        let totaloop=0;
        let k=[];
        function sumation(n){
            let res=0;
            if(n==a.length){
                    let product=1;
                    for(let i=0; i<a.length; ++i){
                        product=product*(k[i]**a[i]);
                    }
                    res+=1/product;
                R+=res;
                return;
            }
            if(n==0){
                k[n]=1;
            }else{
                k[n]=k[n-1]+1;
            }
            while(k[n]<=precision){
                if(n>a.length){
                    break;
                }
                sumation(n+1);
                k[n]++;
                totaloop++;
            }
        }
        sumation(0);
        //console.log(totaloop);
        return R;
    },
    /*特殊関数*/
  B(N){
      if(N==0){
        return 1;
      }
      let ans=0;
      for(let k=0; k<N; ++k){
        ans+=this.nCr(N+1,k)*this.B(k);
      }
      return (-1/(N+1))*ans;
  },
    W0(x,n){
        if(!n){
        n=7;
        }
        let o=0;
        for(let i=0; i<=n; ++i){
        for(let j=1; j<=n; ++j){
            o+=(Math.pow((-1),i)*this.nSk1(i+j,i+1)*Math.pow(this.ln(x),-i-j)*Math.pow(this.ln(this.ln(x)),j))/this.fact(j);
        }
        }
        return this.ln(x)-this.ln(this.ln(x))+o;
    },
    dfact(x){
        if(Math.round(x)==x){
            if(x-2*Math.floor(x/2)==0){
                return this.prod(1,x/2,"2*k");
            }else{
                return this.prod(1,(x+1)/2,"2*k-1");
            }
        }else{
            console.error("整数のみしか入力できません！");
        }
    },
    factpow(x,n){
        return this.prod(1,n,k=>x+k-1);
    },
    F(a,b,c,z,n){
        if(!n){
            n=50;
        }
        return this.sum(0,n,k=>this.factpow(a,k)*this.factpow(b,k)*Math.pow(z,k)/(this.factpow(c,k)*this.fact(k)));
    },
    /*集合論*/
    union(...sets){
        let res=[];
        for(let n=0; n<sets.length; ++n){
        for(let k=0; k<sets[n].length; ++k){
            if(res.indexOf(sets[n][k])==-1){
            res.push(sets[n][k]);
            }
        }
        }
        return res;
    },
    intersection(...sets){
        let val="";
        if(sets.length>2){
            let A=sets.slice(2);
            for(let n=0; n<A.length; ++n){
            val+="[";
            for(let k=0; k<A[n].length; ++k){
                val+=A[n][k];
                if(k+1<A[n].length){
                    val+=",";
                    }
            }
            val+="]";
                if(n+1<A.length){
                    val+=",";
                }
            }
            sets=sets.slice(0,2);
        }
        let res=[];
        for(let n=0; n<sets.length; ++n){
        for(let k=0; k<sets[n].length; ++k){
        for(let N=0; N<sets.length; ++N){
            if(n!=N){
        for(let K=0; K<sets[N].length; ++K){
            if(sets[N][K]==sets[n][k]){
                if(res.indexOf(sets[n][k])==-1){
                res.push(sets[n][k]);
                    }
            }
        }
                }
        }
        }
        }
        if(val!=""){
            res=eval(`this.intersection(res,${val})`);
        }
        return res;
    },
    difference(U,set){
        let res=[];
        for(let k=0; k<set.length; ++k){
            if(set.indexOf(U[k])==-1){
                res.push(U[k]);
            }
        }
        return res;
    },
    //数学記述言語の操作
    parseTex(string){
        while(string.indexOf(`\left`)!=-1){
            let id=string.indexOf(`\left`);
        if(isFinite(string[id-1])){
            //あきらめ
        }
        }
        return string.replaceAll(`\\cdot`,"*");
    },
    toTex(string){
        let tex=string;
        tex=tex.replaceAll(`m.`,`\\`).replaceAll(`Math.`,`\\`);
        tex=tex.replaceAll("/",`\\frac{${tex[tex.indexOf("/")-1]}}{${tex[tex.indexOf("/")+1]}}`);
        tex=tex.replaceAll(`*`,`\\cdot`).replaceAll(`(`,`\\left(`).replaceAll(`)`,`\\right)`);
        console.log(tex);
        return tex;
    }
}
class complex{
    constructor(real,imag){
        this.real=real;
        this.imag=imag;
    }
    get abs(){
        return Math.hypot(this.real,this.imag);
    }
    get arg(){
        return Math.atan2(this.imag,this.real);
    }
    get angle(){
        return 180*(this.arg/Math.PI+1);
    }
    get conjugation(){
        return new complex(this.real,-this.imag);
    }
}
class complexMath{
    z(real,imag){
        return new complex(real,imag);
    }
    polar(radius,theta){
        return new complex(radius*Math.cos(theta),radius*Math.sin(theta));
    }
    arg(z){
        return z.arg;
    }
    abs(z){
        return z.abs;
    }
    conjugation(z){
        return z.conjugation;
    }
    sum(z,c){
        return this.z(z.real+c.real,z.imag+c.imag);
    }
    dec(z,c){
        return this.z(z.real-c.real,z.imag-c.imag);
    }
    prod(z,c){
        return this.polar(z.abs*c.abs,z.arg+c.arg);
    }
    quot(z,c){
        return this.prod(z,this.pow(c,this.z(-1,0)));
    }
    exp(z){
        return this.polar(Math.exp(z.real),z.imag);
    }
    ln(z){
        return this.z(Math.log(z.abs),z.arg);
    }
    pow(z,c){
        if(z.abs==0){
            return this.z(0,0);
        }
        return this.exp(this.prod(c,this.ln(z)));
    }
    log(z,c){
        return this.quot(this.ln(c),this.ln(z));
    }
    sin(z){
        return this.quot(this.dec(this.exp(this.prod(this.z(0,1),z)),this.exp(this.prod(this.z(0,-1),z))),this.z(0,2));
    }
    sinzmc(z){
        let res=this.z(0,0);
        for(let k=0; k<10; ++k){
            res=this.sum(res,this.prod(this.z(Math.pow(-1,k),0),this.quot(this.pow(z,this.z(2*k+1,0)),this.z(math.fact(2*k+1),0))));
        }
        return res;
    }
    cos(z){
        return this.quot(this.sum(this.exp(this.z(-z.imag,z.real)),this.exp(this.z(z.imag,-z.real))),this.z(2,0));
    }
    tan(z){
        return this.quot(this.sin(z),this.cos(z));
    }
    mandelbrot(z,n){
        let c=this.z(0,0);
        for(let k=0; k<n; ++k){
            c=this.sum(this.pow(c,this.z(2,0)),z);
        }
        return c;
    }
}
class quaternion{
    constructor(real,i,j,k){
        this.real=real;
        this.i=i;
        this.j=j;
        this.k=k;
    }
    get imag(){
        return new vector(this.i,this.j,this.k);
    }
    get vector(){
        //単位ベクトル
        return new vector(this.i/this.imag.length,this.j/this.imag.length,this.k/this.imag.length);
    }
    get abs(){
        return Math.hypot(this.real,this.imag.length);
    }
    get arg(){
        return Math.atan2(this.imag.length,this.real);
    }
    get arg3(){
        return [Math.atan2(this.i,this.real),Math.atan2(this.j,this.real),Math.atan2(this.k,this.real)];
    }
    get angle(){
        return 180*(this.arg/Math.PI);
    }
    get conjugation(){
        return new quaternion(this.real,-this.i,-this.j,-this.k);
    }
}
class quaternionMath{
    q(real,i,j,k){
        return new quaternion(real,i,j,k);
    }
    vecq(r,v){
        return new quaternion(r,v.x,v.y,v.z);
    }
    polar(radius,vector,theta){
        const v=vector.length;
        vector.x=vector.x/v;
        vector.y=vector.y/v;
        vector.z=vector.z/v;
        return new quaternion(radius*Math.cos(theta),radius*vector.x*Math.sin(theta),radius*vector.y*Math.sin(theta),radius*vector.z*Math.sin(theta));
    }
    arg(q){
        return q.arg;
    }
    abs(q){
        return q.abs;
    }
    sum(q,p){
        return this.q(q.real+p.real,q.i+p.i,q.j+p.j,q.k+p.k);
    }
    dec(q,p){
        return this.q(q.real-p.real,q.i-p.i,q.j-p.j,q.k-p.k);
    }
    prod(q,p){
        if(Number.isFinite(p)){
            return this.vecq(q.real*p,vec3.prod(q.imag,p));
        }
        return this.vecq(q.real*p.real-vec3.dot(q.imag,p.imag),vec3.sum(vec3.sum(vec3.prod(p.imag,q.real),vec3.prod(q.imag,p.real)),vec3.cross(q.imag,p.imag)));
    }
    exp(q){
        return this.polar(Math.exp(q.real),q.vector,q.imag.length);
    }
    ln(q){
        const l=Math.log(q.abs+0.0000000000001);
        return this.q(l,q.vector.x*q.arg,q.vector.y*q.arg,q.vector.z*q.arg);
    }
    pow(q,p){
    if(q.abs==0){
        return q;
    }else{
        if(Number.isFinite(q) && Number.isFinite(p)){
            return this.q(Math.pow(q,p),0,0,0);
        }
        if(!Number.isFinite(q) && !Number.isFinite(p) && q.imag.length==0 && p.imag.length==0){
            return this.q(Math.pow(q.real,p.real),0,0,0);
        }
        if(!Number.isFinite(q) && q.imag.length==0 && Number.isFinite(p)){
            return this.q(Math.pow(q.real,p),0,0,0);
        }
        if(!Number.isFinite(p) && Number.isFinite(q) && p.imag.length==0){
            return this.q(Math.pow(q,p.real),0,0,0);
        }
        if(Number.isFinite(q)){
            return this.exp(this.prod(p,this.q(Math.log(q),0,0,0)));
        }
        if(Number.isFinite(p)){
            return this.exp(this.prod(this.q(p,0,0,0),this.ln(q)));
        }
        if(q.imag.length==0){
            return this.exp(this.prod(p,this.q(Math.log(q.real),0,0,0)));
        }
        if(p.imag.length==0){
            return this.exp(this.prod(this.q(p.real,0,0,0),this.ln(q)));
        }
        return this.exp(this.prod(p,this.ln(q)));
    }
    }
    quot(q,p){
        if(Number.isFinite(p)){
            return this.prod(q,this.q(1/p,0,0,0));
        }
        if(p.imag.length==0){
            return this.prod(q,this.q(1/p.real,0,0,0));
        }
        return this.prod(q,this.pow(p,-1));
    }
    sin(q){
        let res=this.q(0,0,0,0);
        for(let k=0; k<10; ++k){
            res=this.sum(res,this.prod(this.q(Math.pow(-1,k),0,0,0),this.quot(this.pow(q,2*k+1),this.q(math.fact(2*k+1),0,0,0))));
        }
        return res;
    }
    toText(q){
        let real=q.real;
        let i=q.i+"";
        let j=q.j+"";
        let k=q.k+"";
        if(real==0 && i==0 && j==0 && k==0){
            real=0;
            i="";
            j="";
            k="";
        }else{
            if(parseFloat(i)>0){
                if(real!=0){
                    i="+"+i;
                }
            }
            if(parseFloat(j)>0){
                if(real!=0 || i!=0){
                    j="+"+j;
                }
            }
            if(parseFloat(k)>0){
                if(real!=0 || i!=0 || j!=0){
                    k="+"+k;
                }
            }
            if(real==0){
                real="";
            }
            if(i==0){
                i="";
            }else if(Math.abs(parseFloat(i))!=1){
                i=i+"i";
            }else{
                i=i.replaceAll("1","i");
            }
            if(j==0){
                j="";
            }else if(Math.abs(parseFloat(j))!=1){
                j=j+"j";
            }else{
                j=j.replaceAll("1","j");
            }
            if(k==0){
                k="";
            }else if(Math.abs(parseFloat(k))!=1){
                k=k+"k";
            }else{
                k=k.replaceAll("1","k");
            }
        }
        return `${real}${i}${j}${k}`;
    }
}
class octonion{
    constructor(real,i,j,k,e,f,g,h){
        if(i===undefined){
            i=0;
        }
        if(j===undefined){
            j=0;
        }
        if(k===undefined){
            k=0;
        }
        if(e===undefined){
            e=0;
        }
        if(f===undefined){
            f=0;
        }
        if(g===undefined){
            g=0;
        }
        if(h===undefined){
            h=0;
        }
        this.real=real;
        this.i=i;
        this.j=j;
        this.k=k;
        this.e=e;
        this.f=f;
        this.g=g;
        this.h=h;
    }
    get imag(){
        return [this.i,this.j,this.k,this.e,this.f,this.g,this.h];
    }
    get vector(){
        //単位ベクトル
        let res=[];
        for(let k=0; k<8-1; ++k){
            if(vec.length(this.imag)==0){
                res.push(0);
            }else{
        res.push(this.imag[k]/vec.length(this.imag));
            }
        }
        return res;
    }
    get abs(){
        return Math.sqrt(Math.pow(this.real,2)+Math.pow(this.i,2)+Math.pow(this.j,2)+Math.pow(this.k,2)+Math.pow(this.e,2)+Math.pow(this.f,2)+Math.pow(this.g,2)+Math.pow(this.h,2));
    }
    get arg(){
        return Math.atan2(vec.length(this.imag),this.real);
    }
    get conjugate(){
        return new octonion(this.real,-this.i,-this.j,-this.k,-this.e,-this.f,-this.g,-this.h);
    }
}
class octonionMath{
    o(real,i,j,k,e,f,g,h){
        return new octonion(real,i,j,k,e,f,g,h);
    }
    veco(x,v){
        return new octonion(x,v[0],v[1],v[2],v[3],v[4],v[5],v[6]);
    }
    polar(radius,vector,theta){
        for(var v of vector){
            v=v/vec.length(vector);
        }
        return this.veco(radius*Math.cos(theta),vec.prod(vec.prod(vector,radius),Math.sin(theta)));
    }
    fromQuaternion(q,p){
        return new octonion(q.real,q.i,q.j,q.k,p.real,p.i,p.j,p.k);
    }
    sum(a,b){
        return this.o(a.real+b.real,a.i+b.i,a.j+b.j,a.k+b.k,a.e+b.e,a.f+b.f,a.g+b.g,a.h+b.h);
    }
    dec(a,b){
        return this.o(a.real-b.real,a.i-b.i,a.j-b.j,a.k-b.k,a.e-b.e,a.f-b.f,a.g-b.g,a.h-b.h);
    }
    prod(a,b){
        const q=new quaternionMath();
        let aq=[new quaternion(a.real,a.i,a.j,a.k),new quaternion(a.e,a.f,a.g,a.h)];
        let bq=[new quaternion(b.real,b.i,b.j,b.k),new quaternion(b.e,b.f,b.g,b.h)];
        return this.fromQuaternion(q.dec(q.prod(aq[0],bq[0]),q.prod(bq[1].conjugation,aq[1])),q.sum(q.prod(bq[1],aq[0]),q.prod(aq[1],bq[0].conjugation)));
    }
    exp(o){
        return this.polar(Math.exp(o.real),o.vector,vec.length(o.imag));
    }
    ln(o){
        return this.veco(Math.log(o.abs),vec.prod(o.vector,o.arg));
    }
    pow(a,b){
        return this.exp(this.prod(b,this.ln(a)));
    }
    quot(a,b){
        return this.prod(a,this.pow(b,this.o(-1,0,0,0,0,0,0,0))); 
    }
    log(a,b){
        return this.quot(this.ln(b),this.ln(a));
    }
}
class sedenion{
    constructor(e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12,e13,e14,e15){
        if(e1===undefined){
            e1=0;
        }
        if(e2===undefined){
            e2=0;
        }
        if(e3===undefined){
            e3=0;
        }
        if(e4===undefined){
            e4=0;
        }
        if(e5===undefined){
            e5=0;
        }
        if(e6===undefined){
            e6=0;
        }
        if(e7===undefined){
            e7=0;
        }
        if(e8===undefined){
            e8=0;
        }
        if(e9===undefined){
            e9=0;
        }
        if(e10===undefined){
            e10=0;
        }
        if(e11===undefined){
            e11=0;
        }
        if(e12===undefined){
            e12=0;
        }
        if(e13===undefined){
            e13=0;
        }
        if(e14===undefined){
            e14=0;
        }
        if(e15===undefined){
            e15=0;
        }
        this.e0=e0;
        this.e1=e1;
        this.e2=e2;
        this.e3=e3;
        this.e4=e4;
        this.e5=e5;
        this.e6=e6;
        this.e7=e7;
        this.e8=e8;
        this.e9=e9;
        this.e10=e10;
        this.e11=e11;
        this.e12=e12;
        this.e13=e13;
        this.e14=e14;
        this.e15=e15;
    }
    get array(){
        return [this.e0,this.e1,this.e2,this.e3,
            this.e4,this.e5,this.e6,this.e7,
            this.e8,this.e9,this.e10,this.e11,
            this.e12,this.e13,this.e14,this.e15];
    }
    get imag(){
        return this.array.slice(1,16);
    }
    get vector(){
        //単位ベクトル
        let res=[];
        for(let k=0; k<16-1; ++k){
        if(vec.length(this.imag)==0){
            res.push(0);
        }else{
        res.push(this.imag[k]/vec.length(this.imag));
        }
        }
        return res;
    }
    get abs(){
        return vec.length(this.array);
    }
    get arg(){
        return Math.atan2(vec.length(this.imag),this.e0);
    }
    get conjugate(){
        let res=[this.e0];
        let S=vec.prod(this.imag,-1);
        for(const s of S){
            res.push(s);
        }
        return res;
    }
}
class sedenionMath{
    s(e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12,e13,e14,e15){
        return new sedenion(e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12,e13,e14,e15);
    }
    vecs(x,v){
        return new sedenion(x,v[0],v[1],v[2],v[3],v[4],v[5],v[6],v[7],v[8],v[9],v[10],v[11],v[12],v[13]);
    }
    polar(radius,vector,theta){
        for(var v of vector){
            v=v/vec.length(vector);
        }
        return this.vecs(radius*Math.cos(theta),vec.prod(vec.prod(vector,radius),Math.sin(theta)));
    }
    fromOctonion(a,b){
        return new sedenion(a.real,a.i,a.j,a.k,a.e,a.f,a.g,a.h,b.real,b.i,b.j,b.k,b.e,b.f,b.g,b.h);
    }
    sum(a,b){
        let res=vec.sum(a.array,b.array);
        return this.vecs(res[0],res.slice(1,16));
    }
    dec(a,b){
        let res=vec.dec(a.array,b.array);
        return this.vecs(res[0],res.slice(1,16));
    }
    prod(a,b){
        const o=new octonionMath();
        let ao=[new octonion(a.e0,a.e1,a.e2,a.e3,a.e4,a.e5,a.e6,a.e7),new octonion(a.e8,a.e9,a.e10,a.e11,a.e12,a.e13,a.e14,a.e15)];
        let bo=[new octonion(b.e0,b.e1,b.e2,b.e3,b.e4,b.e5,b.e6,b.e7),new octonion(b.e8,b.e9,b.e10,b.e11,b.e12,b.e13,b.e14,b.e15)];
        return this.fromOctonion(o.dec(o.prod(ao[0],bo[0]),o.prod(bo[1].conjugate,ao[1])),o.sum(o.prod(bo[1],ao[0]),o.prod(ao[1],bo[0].conjugate)));
    }
    exp(s){
        return this.polar(Math.exp(s.e0),s.vector,vec.length(s.imag));
    }
    ln(s){
        return this.vecs(Math.log(s.abs),vec.prod(s.vector,s.arg));
    }
    pow(a,b){
        return this.exp(this.prod(b,this.ln(a)));
    }
    quot(a,b){
        return this.prod(a,this.pow(b,this.s(-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0))); 
    }
    log(a,b){
        return this.quot(this.ln(b),this.ln(a));
    }
}
class vector{
    constructor(x,y,z){
        this.R=2;
        this.x=x;
        this.y=y;
        if(z!==undefined){
        this.z=z;
        this.R++;
        }
    }
    get length(){
        if(this.R==2){
            return Math.hypot(this.x,this.y);
        }else{
            return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.z,2));
        }
    }
}
const vec={
    length(A){
        let res=0;
        for(const a of A){
            res+=Math.pow(a,2);
        }
        return Math.sqrt(res);
    },
    sum(A,B){
        const C=[];
        for(let k=0; k<A.length; ++k){
            C.push(A[k]+B[k]);
        }
        return C;
    },
    dec(A,B){
        const C=[];
        for(let k=0; k<A.length; ++k){
            C.push(A[k]-B[k]);
        }
        return C;
    },
    prod(A,x){
        let res=[];
        for(var a of A){
            res.push(a*x);
        }
        return res;
    },
    matrix(V){
        if(V.length==2){
            return new vector(V[0][0]+V[0][1],V[1][1]+V[1][0]);
        }
        if(V.length==3){
            return new vector(V[0][0]+V[0][1]+V[0][2],V[1][1]+V[1][0]+V[1][2],V[2][2]+V[2][1]+V[2][0]);
        }
        const res=[];
        for(let i=0; i<V.length; ++i){
            var r=0;
            for(let j=0; j<V[i].length; ++j){
                r+=V[i][j];
            }
            res.push(r);
        }
        return res;
    },
    array(v){
        if(v.R==3){
            return [v.x,v.y,v.z];
        }
        if(v.R==2){
            return [v.x,v.y];
        }
        return v;
    },
    extend(vector,value){
        const a=vector.slice();
        a.push(value);
        return a;
    }
}
const vec2={
    sum(a,b){
        return new vector(a.x+b.x,a.y+b.y)
    },
    dot(a,b){
        return a.x*b.x+a.y*b.y;
    },
    prod(a,b){
        return new vector(a.x*b,a.y*b)
    },
    quot(a,b){
        return new vector(a.x/b,a.y/b)
    }
}
const vec3={
    sum(a,b){
        return new vector(a.x+b.x,a.y+b.y,a.z+b.z);
    },
    dec(a,b){
        return new vector(a.x-b.x,a.y-b.y,a.z-b.z);
    },
    prod(a,x){
        return new vector(a.x*x,a.y*x,a.z*x);
    },
    dot(a,b){
        return a.x*b.x+a.y*b.y+a.z*b.z;
    },
    cross(a,b){
        return new vector(a.y*b.z-a.z*b.y,a.z*b.x-b.z*a.x,a.x*b.y-a.y*b.x);
    },
    dist(a,b){
        return this.dec(a,b).length;
    }
}
const mat2={
    rotationMatrix(theta){
        return [[Math.cos(theta),-Math.sin(theta)],[Math.sin(theta),Math.cos(theta)]];
    }
}
const mat3={
    rotationMatrix(theta,axis){
        if(axis=="x"){
            return [
            [1,0,0],
            [0,Math.cos(theta),-Math.sin(theta)],
            [0,Math.sin(theta),Math.cos(theta)]];
        }
        if(axis=="y"){
            return [
            [Math.cos(theta),0,-Math.sin(theta)],
            [0,1,0],
            [Math.sin(theta),0,Math.cos(theta)]]
        }
        if(axis=="z"){
            return [
            [Math.cos(theta),-Math.sin(theta),0],
            [Math.sin(theta),Math.cos(theta),0],
            [0,0,1]];
        }
    }
}
const mat4={
    perspective(v,dist){
        const u=dist/(dist-v.z);
        const M=mat.vector([v.x,v.y,v.z,1]);
        return vec.matrix(mat.prod([
            [u,0,0,0],
            [0,u,0,0],
            [0,0,0,0],
            [0,0,0,1]
        ],M));
    },
    perspective4D(v,dist){
        const u=dist/(dist-v[3]);
        const M=mat.vector(v);
        return vec.matrix(mat.prod([
            [u,0,0,0],
            [0,u,0,0],
            [0,0,u,0]
        ],M).slice(0,3));
    },
    rotationMatrix(theta,axis){
        const s=Math.sin(theta);
        const c=Math.cos(theta);
        if(axis=="xw"){
            return [
            [1,0,0,0],
            [0,Math.cos(theta),-Math.sin(theta),0],
            [0,Math.sin(theta),Math.cos(theta),0],
            [0,0,0,1]];
        }
        if(axis=="yw"){
            return [
            [Math.cos(theta),0,Math.sin(theta),0],
            [0,1,0,0],
            [-Math.sin(theta),0,Math.cos(theta),0],
            [0,0,0,1]];
        }
        if(axis=="zw"){
            return [
            [Math.cos(theta),-Math.sin(theta),0,0],
            [Math.sin(theta),Math.cos(theta),0,0],
            [0,0,1,0],
            [0,0,0,1]];
        }
        //4次元の回転
        if(axis=="xy"){
            return [
                [1,0,0,0],
                [0,1,0,0],
                [0,0,c,-s],
                [0,0,s,c]
            ]
        }
        if(axis=="yz"){
            return [
                [c,0,0,-s],
                [0,1,0,0],
                [0,0,1,0],
                [s,0,0,c]
            ]
        }
        if(axis=="xz"){
            return [
                [1,0,0,0],
                [0,c,0,-s],
                [0,0,1,0],
                [0,s,0,c]
            ]
        }
    },
    //左手座標系
    perspectiveMatrix(theta,aspect,far,near){
        var fn=far-near;
        return [
            [math.cot(theta),0,0,0],
            [0,math.cot(theta)*aspect,0,0],
            [0,0,(far+near)/fn,-1],
            [0,0,2*far*near/fn,0]
        ]
    },
    perspectiveMatrix2(theta,w,h,far,near){
        var fn=far-near;
        return [
            [2*near/w,0,0,0],
            [0,2*near/h,0,0],
            [0,0,-(far+near)/fn,-2*far*near/fn],
            [0,0,-1,0]
        ]
    },
    translate(v){
        return [
            [1,0,0,v.x],
            [0,1,0,v.y],
            [0,0,1,v.z],
            [0,0,0,1]
        ]
    },
    viewport(w,h,far,near,s){
        if(!s){
            s=new vector(0,0);
        }
        return [
            [w/2,0,0,s.x+w/2],
            [0,-h/2,0,s.y+h/2],
            [0,0,(far-near)/2,(far+near)/2],
            [0,0,0,1]
        ]
    }
}
const mat={
    cofactor(matrix, row, col) {
        row-=1;
        col-=1;
  const cofactorMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    if (i !== row) {
      const rowCopy = [];
      for (let j = 0; j < matrix[i].length; j++) {
        if (j !== col) {
          rowCopy.push(matrix[i][j]);
        }
      }
      cofactorMatrix.push(rowCopy);
    }
  }
  return cofactorMatrix;
    },
    det(matrix){
        let size=matrix.length;
        if(size!=matrix[0].length){
            console.error("The determinant must be a square matrix!");
            return;
        }
let A=matrix;
        if(size==2){
            ret,urn (A[0][0]*A[1][1]-A[1][0]*A[0][1]);
        }else if(size==3){
            return (A[0][0]*A[1][1]*A[2][2]-A[0][0]*A[1][2]*A[2][1]+A[0][1]*A[1][2]*A[2][0]-A[0][1]*A[1][0]*A[2][2]+A[0][2]*A[1][0]*A[2][1]-A[0][2]*A[1][1]*A[2][0]);
        }else{
            let res=0;
            for(let i=0; i<matrix.length; i++) {
    res+=Math.pow(-1,i)*matrix[0][i]*this.det(this.cofactor(matrix, 1, i+1));
  }
  return res;
        }
    },
    isScalar(input){
        return Number.isFinite(input);
    },
    sum(A,B){
        const C=[];
        for(let i=0; i<A.length; i++){
            C.push([]);
            for(let j=0; j<A[i].length; j++){
                C[i].push(A[i][j]+B[i][j]);
            }
        }
        return C;
    },
    prod(A,B){
        if(this.isScalar(B)){
            const C=[];
            for(let i=0; i<A.length; i++){
                C.push([]);
                for(let j=0; j<A[i].length; j++){
                    C[i].push(A[i][j]*B);
                }
            }
            return C;
        }else{
            var C=[];
            const m=Math.max(A.length,A[0].length)-1;
            for(let i=0; i<A.length; i++){
                C.push([]);
                for(let j=0; j<B[0].length; j++){
                    C[i].push(math.sum(0,m,k=>A[i][k]*B[k][j]));
                }
            }
            return C;
        }
    },
    pow(A,B){
        //正方行列である必要がある。
        if(this.isScalar(B)){
            let C=this.unit(A.length);
            for(let k=0; k<B; ++k){
                C=this.prod(C,A);
            }
            return C;
        }
    },
    exp(A){
        var C=this.prod(A,0);
        for(let k=0; k<100; k++){
            C=this.sum(C,this.prod(this.pow(A,k),1/math.fact(k)));
        }
        return C;
    },
    square(n){
        const A=[];
        for(let i=0; i<n; ++i){
            A.push([]);
            for(let j=0; j<n; ++j){
                A[i].push(0);
            }
        }
        return A;
    },
    vector(v){
        if(v.x===undefined){
        var A=this.square(v.length);
        for(let k=0; k<v.length; ++k){
            A[k][k]=v[k];
        }
        return A;
    }else{
        if(v.R==3){
            return [[v.x,0,0],[0,v.y,0],[0,0,v.z]];
        }
    }
    },
    //大きさx*yの空の行列を作る。
    plane(x,y){
        var A=[];
        for(let i=0; i<x; ++i){
            A.push([]);
            for(let j=0; j<y; ++j){
                A[i].push(0);
            }
        }
        return A;
    },
    unit(n){
        const a=[];
        for(let k=0; k<n; ++k){
            a.push(1);
        }
        return this.vector(a);
    },
    //回転行列
    rotationMatrix(dimension,axis,theta){
        //軸はインデックス
        var res=this.unit(dimension);
        var b=[];
        //xyzwvなど固有の文字列を数値化
        for(let k=0; k<axis.length; ++k){
            if(axis[k]=="x"){
            axis[k]=1;
                }
            if(axis[k]=="y"){
            axis[k]=2;
                }
            if(axis[k]=="z"){
            axis[k]=3;
                }
            if(axis[k]=="w"){
            axis[k]=4;
                }
            if(axis[k]=="v"){
            axis[k]=5;
                }
            if(axis[k]=="u"){
            axis[k]=6;
                }
        }
        for(let k=1; k<=dimension; ++k){
            if(axis.indexOf(k)==-1){
            b.push(k);
            }
        }
        res[b[0]-1][b[0]-1]=Math.cos(theta);
        res[b[1]-1][b[1]-1]=Math.cos(theta);
        res[b[0]-1][b[1]-1]=Math.sign(b[0]-b[1])*Math.sin(theta);
        res[b[1]-1][b[0]-1]=Math.sign(b[1]-b[0])*Math.sin(theta);
        return res;
    },
    //回転
    rotate(vector,axis,theta){
        var R=this.rotationMatrix(vector.length,axis,theta);
        var V=this.vector(vector);
        return vec.matrix(this.prod(R,V));
    },
    //透視投影
    perspective(vector,dist){
    var R=vector.length;
        if(R==3){
            mat4.perspective(vector,dist);
        }
    //変換行列の生成
    var M=this.plane(R-1,R);
    const f=dist/(dist-vector[R-1]);
    for(let i=0; i<R-1; ++i){
        M[i][i]=f;
    }
    //積
    var v=mat.vector(vector);
    return vec.matrix(mat.prod(M,v));
    },
    multiPerspective(vector,dist){
    while(true){
    if(vector.R==2){
        break;
    }
        vector=vec.array(vector);
    vector=this.perspective(vector,dist);
    }
        return vector;
    }
}
class canvas3d{
    constructor(context){
        this.ctx=context;
    }
    fillRect(x,y,z,dx,dy,dz){
        draw([[x,y,z],[x+dx,y,z],[x,y+dy,z],[x,y,z+dz],
              [x+dx,y+dy,z],[x,y+dy,z+dz],[x+dx,y,z+dz],[x+dx,y+dy,z+dz]],
             [[0,1,6,3],[0,2,5,3],[0,2,4,1],
              [7,6,3,5],[7,4,2,6],[7,5,2,4]]);
    }
    draw(vertex,face){
        
    }
}
//双曲平面
class hyperbolicContext{
    constructor(context,width,height){
        this.ctx=context;
        this.width=width;
        this.height=height;
        this.iteration=20;
    }
    poincareDisk(){
        var hold=this.ctx.strokeStyle;
        this.ctx.beginPath();
        this.ctx.arc(this.width/2,this.height/2,this.width/2,0,2*Math.PI);
        this.ctx.strokeStyle="#000000";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.strokeStyle=hold;
    }
    point(v){
        v=this.projection(v);
        var hold=this.ctx.fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(v.x,v.y,10,0,2*Math.PI);
        this.ctx.fillStyle="#000000";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.fillStyle=hold;
    }
    pureProjection(v){
        var p=v;
        const z=Math.sqrt(Math.pow(p.x,2)+Math.pow(p.y,2)+1);
        p=vec2.quot(p,z);
        const d=1+Math.sqrt(1-Math.pow(p.x,2)-Math.pow(p.y,2));
        p=vec2.quot(p,d);
        return p;
    }
    viewport(v){
        return vec2.prod(vec2.sum(v,new vector(1,1)),this.width/2);
    }    
    projection(v){
        return this.viewport(this.pureProjection(v));
    }
    polygonh(points){
        for(let k=0; k<points.length; ++k){
            this.lineh(points[k],points[math.mod(k+1,points.length)]);
        }
    }
    polygon(points){
        for(let k=0; k<points.length; ++k){
            line(points[k],points[math.mod(k+1,points.length)]);
        }
    }
    line(s,e){
    for(let k=0; k<this.iteration; ++k){
        var p=this.projection(vec2.quot(vec2.sum(vec2.prod(s,k),vec2.prod(e,this.iteration-1-k)),this.iteration-1));
        this.ctx.lineTo(p.x,p.y);
    }
    }
    reg(p,theta,R){
        if(!R){
            R=1;
        }
        const c=new complexMath();
        const r=c.polar(1,theta);
        var a=new complex(1,0);
        const points=[];
        while(true){
            points.push(vec2.sum(vec2.prod(new vector(a.real,a.imag),R),p));
            a=c.prod(a,r);
            if(Math.abs(a.arg)<=0.01){
                break;
            }
        }
        this.polygonh(points);
    }
    lineh(a,b){
        const c=new complexMath();
        //二頂点を結ぶ双曲線
    a=this.pureProjection(a);
    b=this.pureProjection(b);
    a=new complex(a.x,a.y);
    b=new complex(b.x,b.y);
    var p=c.quot(c.dec(c.prod(a,new complex(1+b.abs**2,0)),c.prod(b,new complex(1+a.abs**2,0))),c.dec(c.prod(a,b.conjugation),c.prod(a.conjugation,b)));
    const r=c.dec(a,p).abs*canvas.width/2;
    var t1=c.dec(a,p).arg;
    var t2=c.dec(b,p).arg;
    t1+=2*Math.PI*(Math.abs(t1-t2)>Math.PI)*(t2>t1);
    t2+=2*Math.PI*(Math.abs(t1-t2)>Math.PI)*(t2<t1);
    //ビューポート変換
    p=new vector(p.real,p.imag);
    p=this.viewport(p);
    this.ctx.beginPath();
    this.ctx.arc(p.x,p.y,r,Math.min(t1,t2),Math.max(t1,t2));
    this.ctx.stroke();
    this.ctx.closePath();
    }
}