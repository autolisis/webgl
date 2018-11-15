/*
 * main.js
 * Copyright (C) 2018 g <g@ABCL>
 *
 * Distributed under terms of the MIT license.
 */
(function() {
  "use strict";

  var vertexShaderSource = `#version 300 es

      // an attribute is an input (in) to a vertex shader.
      // It will receive data from a buffer
      in vec4 a_position;
  in vec4 a_color;

  out vec4 v_color;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    v_color = a_color;
    gl_Position = a_position;
  }
  `;

  var fragmentShaderSource = `#version 300 es

      // fragment shaders don't have a default precision so we need
      // to pick one. mediump is a good default. It means "medium precision"
      precision mediump float;

  in vec4 v_color;
  // we need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
    // Just set the output to a constant redish-purple
    outColor = v_color;
  }
  `;

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader)); // eslint-disable-line
    gl.deleteShader(shader);
    return undefined;
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program)); // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
  }

  function main() {
    // Get A WebGL context
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
      return;
    }

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // prettier-ignore
    var positions = [
        0, 0, 0, 0.5, 0.5, 0,
        0.5, 0.5, 0.5, 0, 0, 0.5,

        0, 0.5, 0.5, 0.5, 0, 1,
        0.5, 0.5, 0.5, 1, 0, 1,

        0.5, 0, 0.5, 0.5, 1, 0,
        0.5, 0.5, 1, 0.5, 1, 0,

        0.5,0.5, 1,0.5, 0.5,1,
        1,1, 1,0.5, 0.5,1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to
    // get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Set the colors.
    setColors(gl);
    // tell the color attribute how to pull data out of the current ARRAY_BUFFER
    gl.enableVertexAttribArray(colorLocation);
    var size = 4;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
      colorLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 24;
    gl.drawArrays(primitiveType, offset, count);
  }

  main();
  function setColors(gl) {
    // Pick 2 random colors.
    var r1 = Math.random();
    var b1 = Math.random();
    var g1 = Math.random();

    var r2 = Math.random();
    var b2 = Math.random();
    var g2 = Math.random();

    var r3 = Math.random();
    var b3 = Math.random();
    var g3 = Math.random();

    var r4 = Math.random();
    var b4 = Math.random();
    var g4 = Math.random();
    // prettier-ignore
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array([
          r1, b1, g1, 1, r1, b1, g1, 1, r1, b1, g1, 1, r1, b1, g1, 1, r1, b1, g1, 1, r1, b1, g1, 1,
            r2, b2, g2, 1, r2, b2, g2, 1, r2, b2, g2, 1, r2, b2, g2, 1, r2, b2, g2, 1, r2, b2, g2, 1,
            r3, b3, g3, 1, r3, b3, g3, 1, r3, b3, g3, 1, r3, b3, g3, 1, r3, b3, g3, 1, r3, b3, g3, 1,
            r4, b4, g4, 1, r4, b4, g4, 1, r4, b4, g4, 1, r4, b4, g4, 1, r4, b4, g4, 1, r4, b4, g4, 1,
        ]),
        gl.STATIC_DRAW);
  }
})();
