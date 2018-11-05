#version 300 es
#define attribute in
#define varying out
precision mediump float;

in vec2 v_texCoord;

uniform vec4 u_color;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;

out vec4 outColor;

bool isBorder(vec2 uv) {
    if (uv.y < 0.7 && uv.y > 0.3)
        return false;
    else
        return true;
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float color = 0.0;
    if (isBorder(uv)) {
        outColor = texture(u_tex, v_texCoord);
    }
    else {
        if (sin(uv.x * 120.0) < 0.01 && sin(uv.y * 120.0) < 0.9)
            outColor = u_color * 0.9;
        else outColor = u_color;
    }

}
