/*
 * main.js
 * Copyright (C) 2018 g <g@ABCL>
 *
 * Distributed under terms of the MIT license.
 */
(function() {
  "use strict";

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  loadScript("fs.shader", "fs", "fs");
  loadScript("vs.shader", "vs", "vs");

  const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
  twgl.setAttributePrefix("a_");

  // prettier-ignore
  const arrays = {
      position: [ -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5, 0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5, 0.5,  0.5,  -0.5, 0.5, -0.5,  -0.5, -0.5, -0.5,   0.5, 0.5, -0.5,   0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5, 0.5, -0.5,   0.5, 0.5,  0.5,   0.5, -0.5,   0.5, -0.5, -0.5,   0.5,  0.5, 0.5,   0.5, -0.5, -0.5,   0.5,  0.5, 0.5,   0.5,  0.5, 0.5,   0.5, -0.5, -0.5,  -0.5, -0.5, 0.5,  -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,  -0.5,  0.5, 0.5,  -0.5, -0.5, 0.5,  -0.5,  0.5, -0.5,  -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,   0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,   0.5,  0.5, -0.5,   0.5, -0.5, 0.5,  -0.5, -0.5, 0.5,   0.5, -0.5, 0.5,  -0.5,  0.5, 0.5,  -0.5,  0.5, 0.5,   0.5, -0.5, 0.5,   0.5,  0.5, ],
    texCoord: [0, 0, 0, 0.5, 0.25, 0, 0, 0.5, 0.25, 0.5, 0.25, 0, 0.25, 0, 0.5, 0, 0.25, 0.5, 0.25, 0.5, 0.5, 0, 0.5, 0.5, 0.5, 0, 0.5, 0.5, 0.75, 0, 0.5, 0.5, 0.75, 0.5, 0.75, 0, 0, 0.5, 0.25, 0.5, 0, 1, 0, 1, 0.25, 0.5, 0.25, 1, 0.25, 0.5, 0.25, 1, 0.5, 0.5, 0.25, 1, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 0.75, 0.5, 0.5, 1, 0.5, 1, 0.75, 0.5, 0.75, 1 ],
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  //prettier-ignore
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1,0 , gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([127, 127, 127, 255]));

  var image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    }
    uniforms.u_tex = texture;
    twgl.setUniforms(programInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    // twgl.drawBufferInfo(gl, bufferInfo);
  };
  image.src = "../static/noodles.jpg";

  const uniforms = {
    u_matrix: [],
    u_tex: texture
  };

  function render(time) {
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    const fov = deg2rad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.perspective(uniforms.u_matrix, fov, aspect, 1, 2000);

    const eye = [0, 0, -3];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    var camera = [];
    mat4.lookAt(camera, eye, target, up);
    var view = [];
    mat4.invert(view, camera);
    var viewProj = [];
    mat4.mul(uniforms.u_matrix, uniforms.u_matrix, view);
    // mat4.rotate(uniforms.u_matrix, uniforms.u_matrix, -Math.PI / 4, [1, 0, 0]);
    mat4.rotate(uniforms.u_matrix, uniforms.u_matrix, time, [1, 1, 0]);
    mat4.rotate(uniforms.u_matrix, uniforms.u_matrix, time, [0, 0, 1]);

    GLInit(gl);
    gl.useProgram(programInfo.program);

    uniforms.u_color = [Math.random(), Math.random(), Math.random(), 1];
    twgl.setUniforms(programInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
