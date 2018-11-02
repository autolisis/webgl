#version 300 es
#define attribute in
#define varying out
precision mediump float;

out vec4 outColor;
uniform vec4 u_color;
uniform sampler2D u_tex;
in vec4 v_color;
in vec2 v_texCoord;


void main(void) {
    outColor = texture(u_tex, v_texCoord);
    // outColor = u_color;
}
