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

  const bufferInfo = twgl.primitives.createSphereBufferInfo(gl, 0.5, 100, 100);

  const uniforms = {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 1, 1, 1],
    u_ambient: [0.4, 0.4, 0.4, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 5,
    u_specularFactor: 0.1,
    u_worldViewProjection: [],
    // u_tex: texture,
    // u_color: [Math.random(), Math.random(), Math.random(), 1],
    u_color: [0.4, 0.4, 0.8, 1]
  };

  function render(time) {
    time *= 0.001;
    const fov = deg2rad(90);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projection = [];
    projection = m4.perspective(fov, aspect, 0.1, 2000);

    const eye = [0, 0, -2];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    var camera = [];
    camera = m4.lookAt(eye, target, up);
    var view = [];
    view = m4.inverse(camera);
    var viewProj = [];
    mat4.mul(viewProj, projection, view);

    var world = [];
    mat4.identity(world);
    // mat4.translate(world, world, [0, 1, 1]);
    mat4.translate(world, world, [
      0,
      Math.pow(Math.sin(time), 11),
      Math.pow(Math.sin(time), 10)
    ]);

    uniforms.u_viewInverse = camera;
    uniforms.u_world = clone(world);
    uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));

    // mat4.invert(
    //   uniforms.u_worldInverseTranspose,
    //   uniforms.u_worldInverseTranspose
    // );
    // mat4.transpose(
    //   uniforms.u_worldInverseTranspose,
    //   uniforms.u_worldInverseTranspose
    // );

    mat4.multiply(uniforms.u_worldViewProjection, viewProj, world);

    GLInit(gl);
    gl.useProgram(programInfo.program);

    twgl.setUniforms(programInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
