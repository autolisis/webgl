#version 300 es
#define attribute in
#define varying out
precision mediump float;

out vec4 outColor;
uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;
uniform sampler2D u_tex;
in vec4 v_color;
in vec2 v_texCoord;
in vec3 v_normal;


void main(void) {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_reverseLightDirection);
    // outColor = texture(u_tex, v_texCoord);
    outColor = u_color;
    outColor.rgb *= (light + 0.2);
}
