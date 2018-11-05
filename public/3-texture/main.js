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
  const m4 = twgl.m4;
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  loadScript("fs.shader", "fs", "fs");
  loadScript("vs.shader", "vs", "vs");

  const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
  twgl.setAttributePrefix("a_");

  const arrays = {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    texCoord: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]
  };
  const texture = twgl.createTexture(gl, { src: "../static/texture.jpg" });
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  function render(time) {
    const uniforms = {
      u_time: time * 0.001,
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_color: [0.72549, 0.0745, 0.23922, 1],
      u_tex: texture
    };
    GLInit(gl);
    gl.useProgram(programInfo.program);

    twgl.setUniforms(programInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
