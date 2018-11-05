#version 300 es
#define attribute in
#define varying out
precision mediump float;

in vec4 v_color;
in vec2 v_texCoord;
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_lightColor;
uniform vec4 u_ambient;
uniform sampler2D u_tex;
uniform vec3 u_reverseLightDirection;
uniform vec4 u_specular;
uniform float u_shininess;
uniform float u_specularFactor;
uniform vec4 u_color;

out vec4 outColor;


vec4 lit(float l ,float h, float m) {
  return vec4(1.0,
              max(l, 0.0),
              (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
              1.0);
}

void main(void) {
    vec4 diffColor = u_color;
    vec3 a_normal = normalize(v_normal);
    vec3 surfaceToLight = normalize(v_surfaceToLight);
    vec3 surfaceToView = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLight + surfaceToView);

    vec4 litR = lit(dot(a_normal, surfaceToLight),
            dot(a_normal, halfVector), u_shininess);

    outColor = vec4((
                u_lightColor * (diffColor * litR.y + diffColor * u_ambient +
                    u_specular * litR.z * u_specularFactor)).rgb,
            diffColor.a);
}
