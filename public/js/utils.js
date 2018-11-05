/*
 * utils.js
 * Copyright (C) 2018 g <g@ABCL>
 *
 * Distributed under terms of the MIT license.
 */
"use strict";

function loadScript(url, type, id) {
  var client = new XMLHttpRequest();
  client.open("GET", url, false);
  client.addEventListener("load", function() {
    if (document.getElementById(id) == null) {
      var script = document.createElement("script");
      script.type = type;
      script.id = id;
      script.innerHTML = client.responseText;
      document.head.appendChild(script);
    }
  });
  client.send();
}

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

function deg2rad(deg) {
  return (Math.PI * deg) / 180;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function GLInit(gl) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  // twgl.

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
