#version 300 es

in vec4 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;

void main(void) {
    v_texCoord = a_texCoord;
    gl_Position = a_position;
}
