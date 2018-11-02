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

  const bufferInfo = twgl.primitives.createSphereBufferInfo(gl, 0.5, 10, 10);

  const uniforms = {
    u_matrix: [],
    // u_tex: texture,
    u_color: [Math.random(), Math.random(), Math.random(), 1],
    u_reverseLightDirection: [0, 1, -0.5]
  };

  function render(time) {
    time *= 0.001;
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
    // mat4.rotate(uniforms.u_matrix, uniforms.u_matrix, time, [1, 1, 0]);
    mat4.translate(uniforms.u_matrix, uniforms.u_matrix, [
      0,
      Math.abs(Math.pow(Math.sin(time), 11)),
      Math.pow(Math.sin(time), 10)
    ]);

    GLInit(gl);
    gl.useProgram(programInfo.program);

    twgl.setUniforms(programInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
