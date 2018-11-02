#version 300 es
// #define attribute in
// #define varying out

in vec4 a_position;
in vec4 a_color;
in vec3 a_normal;
in vec2 a_texCoord;
uniform mat4 u_matrix;
out vec4 v_color;
out vec2 v_texCoord;
out vec3 v_normal;

void main(void) {
    gl_Position = u_matrix * a_position;
    // v_color = a_color;
    v_normal = a_normal;
    v_texCoord = a_texCoord;
}
