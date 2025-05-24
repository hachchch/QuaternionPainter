var movemode=false;
var pen=new quaternion(1,0,0,0);
var m=new vector(0,0,0);
const obj=[];
function generateVertex(obj){
    const res=[];
    for(const o of obj){
        for(let k=0; k<o.vertex.length; ++k){
          const v=o.vertex[k];
            const c=o.color[k];
            res.push(v[0]);
            res.push(v[1]);
            res.push(v[2]);
            res.push(1);
            res.push(c[0]);
            res.push(c[1]);
            res.push(c[2]);
            res.push(c[3]);
        }
    }
    return res;
}
function generateIndex(obj){
    const res=[];
    var n=0;
    for(const o of obj){
        for(const i of o.index){
            res.push(i+n);
        }
        n+=o.vertex.length;
    }
    return res;
}
console.log(generateIndex(obj));
const camera={
    position:new vector(0,0,0),
    velocity:10
}
const angle={
    xy:0,
    xz:0,
    yz:0
}
const vertWGSL=`
struct Uniforms {
  projectionMatrix : mat4x4<f32>,
  rotationMatrix:mat4x4<f32>,
  translateMatrix:mat4x4<f32>
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  //フラグメントでのもの
  @location(0) fragColor : vec4<f32>,
}
@vertex
fn main(@location(0) position: vec4<f32>,@location(1) color: vec4<f32>) -> VertexOutput {
  var output : VertexOutput;
  output.Position = uniforms.projectionMatrix*uniforms.rotationMatrix*(uniforms.translateMatrix*position);
  output.fragColor = color;  
  return output;
}
`;
const fragWGSL=`
@fragment
fn main(@location(0) fragColor: vec4<f32>) -> @location(0) vec4<f32> {
  return fragColor;
}
`;
function createBuffer(M){
  var m=[];
for(let i=0; i<M.length; ++i){
  for(let j=0; j<M[i].length; ++j){
    m.push(M[j][i]);
  }
}
return new Float32Array(m);
}
const canvas=document.querySelector(".canvas");
async function main(){
// webgpuコンテキストの取得
const context = canvas.getContext('webgpu');

// deviceの取得
const g_adapter = await navigator.gpu.requestAdapter();
const g_device = await g_adapter.requestDevice();

//デバイスを割り当て
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device: g_device,
  format: presentationFormat,
  alphaMode: 'opaque'
});

//深度テクスチャ
var depthTexture;
if (!depthTexture ||
        depthTexture.width !== canvas.width ||
        depthTexture.height !== canvas.height){
      if (depthTexture) {
        depthTexture.destroy();
      }
      depthTexture =g_device.createTexture({
    size: [canvas.width,canvas.width],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
});
}

const quadVertexSize = 4*8; // Byte size of a vertex.
const quadPositionOffset = 0;  // Byte offset of quad vertex position attribute.
const quadColorOffset = 4*4; // Byte offset of quad vertex color attribute.

function render(){
//頂点配列
const quadVertexArray = new Float32Array(generateVertex(obj));
// 頂点データを作成.
const verticesBuffer = g_device.createBuffer({
  size: quadVertexArray.byteLength,
  usage: GPUBufferUsage.VERTEX,
  mappedAtCreation: true,
});
new Float32Array(verticesBuffer.getMappedRange()).set(quadVertexArray);
verticesBuffer.unmap();

//インデックス配列
const quadIndexArray = new Uint16Array(generateIndex(obj));
const indicesBuffer = g_device.createBuffer({
  size: quadIndexArray.byteLength,
  usage: GPUBufferUsage.INDEX,
  mappedAtCreation: true,
});
//マップしたバッファデータをセッ
new Uint16Array(indicesBuffer.getMappedRange()).set(quadIndexArray);
indicesBuffer.unmap();

//Uniformバッファ
const uniformBufferSize = 4*16*3;
  const uniformBuffer = g_device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
var bufferPosition=0;
//透視投影変換行列を与える。
const p=createBuffer(mat4.perspectiveMatrix(4*Math.PI/5,1,100,0.5));
g_device.queue.writeBuffer(
  uniformBuffer,
  //バッファのバイト位置
  bufferPosition,
  //データ
  p.buffer,
  //データの位置
  p.byteOffset,
  //大きさ
  p.byteLength
);
bufferPosition+=p.byteLength;

//回転行列を与える。
const Rxy=mat.rotationMatrix(4,[3,4],angle.xy);
const Ryz=mat.rotationMatrix(4,[1,4],angle.yz);
const Rxz=mat.rotationMatrix(4,[2,4],angle.xz);
const R=createBuffer(mat.prod(Rxz,mat.prod(Ryz,Rxy)));
g_device.queue.writeBuffer(
  uniformBuffer,
  //バッファのバイト位置
  bufferPosition,
  //データ
  R.buffer,
  //データの位置
  R.byteOffset,
  //大きさ
  R.byteLength
);
bufferPosition+=R.byteLength;

//回転行列を与える。
const ct=createBuffer(mat4.translate(camera.position));
g_device.queue.writeBuffer(
  uniformBuffer,
  //バッファのバイト位置
  bufferPosition,
  //データ
  ct.buffer,
  //データの位置
  ct.byteOffset,
  //大きさ
  ct.byteLength
);
bufferPosition+=ct.byteLength;

//レンダーパイプラインの設定
const pipeline = g_device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    //頂点シェーダーのWGSLをここに。
    module: g_device.createShaderModule({
      code: vertWGSL,
    }),
    //エントリーポイントとなる関数を指定
    entryPoint: 'main',
    //バッファデータの設定
    buffers: [
      {
        // 配列の要素間の距離をバイト単位で指定します。
        arrayStride: quadVertexSize,

        // 頂点バッファの属性を指定します。
        attributes: [
          {
            // position
            shaderLocation: 0, // @location(0) in vertex shader
            offset: quadPositionOffset,
            format: 'float32x4',
          },
          {
            // color
            shaderLocation: 1, // @location(1) in vertex shader
            offset: quadColorOffset,
            format: 'float32x4',
          },
        ],
      },
    ],
  },
  fragment: {
    //フラグメントシェーダーのWGSLをここに。
    module: g_device.createShaderModule({
      code: fragWGSL,
    }),
    entryPoint: 'main',
    //レンダー先(canvas)のフォーマットを指定
    targets: [
      { // @location(0) in fragment shader
        format: presentationFormat,
      },
    ],
  },
  primitive: {
    topology: 'triangle-list',
  },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
});
    
//バインドグループを作成
const bindGroup = g_device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [
    {
      binding: 0, // @binding(0) in shader
      resource: {
        buffer: uniformBuffer,
      },
    },
  ],
});
//コマンドバッファの作成
const commandEncoder = g_device.createCommandEncoder();
//レンダーパスの設定
const textureView = context.getCurrentTexture().createView();
  const renderPassDescriptor/*: GPURenderPassDescriptor */= {
    colorAttachments: [
      {
        view: textureView,
        //画面clearの色
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        //まずclearする。
        loadOp: 'clear',
        //命令が終われば、状態を保持
        storeOp: 'store',
      },
    ],
      //深度テスター
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  //GPUに命令を設定

  //レンダーパイプラインを与える
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.setVertexBuffer(0, verticesBuffer);
  passEncoder.setIndexBuffer(indicesBuffer, 'uint16');
  passEncoder.drawIndexed(quadIndexArray.length);
  // レンダーパスコマンドシーケンスの記録を完了する。
  passEncoder.end();
  //命令を発行
  g_device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(render);
    translate();
}
    render();
}
//簡単...?
main();
var key="";
window.addEventListener("keydown",e=>{
    if(movemode && (e.code=="KeyW" || e.code=="KeyA" || e.code=="KeyS" || e.code=="KeyD" || e.code=="Space" || e.code=="ShiftLeft")){
        function pointerMove(v){
            m=vec3.sum(m,v);
            for(const o of obj){
                if(o.name=="pointer"){
                    o.vertex=move(o.vertex,v);
                }
            }
        }
        if(e.code=="KeyW"){
            pointerMove(new vector(0,0,1));
        }
        if(e.code=="KeyA"){
            pointerMove(new vector(1,0,0));
        }
        if(e.code=="KeyS"){
            pointerMove(new vector(0,0,-1));
        }
        if(e.code=="KeyD"){
            pointerMove(new vector(-1,0,0));
        }
        if(e.code=="Space"){
            pointerMove(new vector(0,-1,0));
        }
        if(e.code=="ShiftLeft"){
            pointerMove(new vector(0,1,0));
        }
    }else{
        if(e.code=="KeyQ"){
            movemode=!movemode;
        }else{
    key=e.code;
            if(key=="KeyZ"){
                cube(m.x,m.y,m.z,1,1,1,[Math.random(),Math.random(),Math.random()]);
            }
        }
    }
});
window.addEventListener("keyup",e=>{
    key="";
});
//描画毎に行う処理
function translate(){
    const cv=camera.velocity/60;
    if(key=="KeyW"){
        let v=mat.rotate(vec.array(mat.rotate(vec.array(mat.rotate([0,0,-1],[2],-angle.xz)),[1],-angle.yz)),[3],-angle.xy);
        v=vec3.prod(v,cv);
        camera.position=vec3.sum(camera.position,v);
    }
    if(key=="KeyA"){
        let v=mat.rotate(vec.array(mat.rotate(vec.array(mat.rotate([-1,0,0],[2],-angle.xz)),[1],-angle.yz)),[3],-angle.xy);
        v=vec3.prod(v,cv);
        camera.position=vec3.sum(camera.position,v);
    }
    if(key=="KeyS"){
        let v=mat.rotate(vec.array(mat.rotate(vec.array(mat.rotate([0,0,1],[2],-angle.xz)),[1],-angle.yz)),[3],-angle.xy);
        v=vec3.prod(v,cv);
        camera.position=vec3.sum(camera.position,v);
    }
    if(key=="KeyD"){
        let v=mat.rotate(vec.array(mat.rotate(vec.array(mat.rotate([1,0,0],[2],-angle.xz)),[1],-angle.yz)),[3],-angle.xy);
        v=vec3.prod(v,cv);
        camera.position=vec3.sum(camera.position,v);
    }
    if(key=="ShiftLeft"){
        let v=mat.rotate(vec.array(mat.rotate(vec.array(mat.rotate([0,-1,0],[2],-angle.xz)),[1],-angle.yz)),[3],-angle.xy);
        v=vec3.prod(v,cv);
        camera.position=vec3.sum(camera.position,v);
    }
    if(key=="Space"){
        let v=mat.rotate(vec.array(mat.rotate(vec.array(mat.rotate([0,1,0],[2],-angle.xz)),[1],-angle.yz)),[3],-angle.xy);
        v=vec3.prod(v,cv);
        camera.position=vec3.sum(camera.position,v);
    }
    if(key=="KeyI"){
        angle.xy+=0.1;
    }
    if(key=="KeyO"){
        angle.xz+=0.1;
    }
    if(key=="ArrowLeft"){
        angle.xz+=0.05;
    }
    if(key=="ArrowRight"){
        angle.xz-=0.05;
    }
    if(key=="ArrowUp"){
        angle.xy+=0.05*Math.sin(angle.xz);
        angle.yz-=0.05*Math.cos(angle.xz);
    }
    if(key=="ArrowDown"){
        angle.xy-=0.05*Math.sin(angle.xz);
        angle.yz+=0.05*Math.cos(angle.xz);
    }
    if(key=="ShiftRight"){
        angle.xy=0;
    }
    if(key=="KeyP"){
        angle.yz+=0.1;
    }
    behave();
}
function cube(x,y,z,dx,dy,dz,color,inc){
    if(!inc){
        inc="global";
    }
    if(!color){
        color=[];
        for(let i=0; i<8; ++i){
            color.push([Math.random(),Math.random(),Math.random(),1]);
        }
    }else{
      var dcolor=[];
        for(let i=0; i<8; ++i){
            dcolor.push(color);
        }
        color=dcolor
    }
    obj.push({
        name:inc,
        vertex:[
            [x,y,z],[x+dx,y,z],[x,y+dy,z],[x+dx,y+dy,z],
            [x,y,z+dz],[x+dx,y,z+dz],[x,y+dy,z+dz],[x+dx,y+dy,z+dz]
        ],
        index:[
            0,1,2,1,2,3,
            4,5,6,5,6,7,
            4,0,5,0,5,1,
            2,6,3,6,3,7,
            1,5,3,5,3,7,
            0,4,2,4,2,6
        ],
        color:color
    });
}
function waku(x,y,z,dx,dy,dz,color,inc){
    const n=29;
    const f=1-1/n;
    cube(x,y,z,dx/n,dy/n,dz,color,inc);
    cube(x+dx*f,y,z,dx/n,dy/n,dz,color,inc);
    cube(x,y+dy*f,z,dx/n,dy/n,dz,color,inc);
    cube(x+dx*f,y+dy*f,z,dx/n,dy/n,dz,color,inc);

    cube(x,y,z,dx,dy/n,dz/n,color,inc);
    cube(x,y+dy*f,z,dx,dy/n,dz/n,color,inc);
    cube(x,y,z+dz*f,dx,dy/n,dz/n,color,inc);
    cube(x,y+dy*f,z+dz*f,dx,dy/n,dz/n,color,inc);

    cube(x,y,z,dx/n,dy,dz/n,color,inc);
    cube(x+dx*f,y,z,dx/n,dy,dz/n,color,inc);
    cube(x,y,z+dz*f,dx/n,dy,dz/n,color,inc);
    cube(x+dx*f,y,z+dz*f,dx/n,dy,dz/n,color,inc);
}
waku(m.x,m.y,m.z,1,1,1,[1,1,1],"pointer");
for(let k=0; k<100; ++k){
    const d=30;
    waku(Math.round(d*Math.random()-d/2),Math.round(d*Math.random()-d/2),Math.round(d*Math.random()-d/2),1,1,1)
}
function move(vertex,vector){
    const res=[];
    for(let v of vertex){
        res.push([v[0]+vector.x,v[1]+vector.y,v[2]+vector.z]);
    }
    return res;
}
function behave(){
    /*for(const o of obj){
        if(o.name=="waku"){
        }
    }*/
}
