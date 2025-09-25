
precision mediump float;

varying vec2 tCoords;
varying vec3 vPosOrigin;
uniform float uCubeSize;

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;
uniform sampler2D uSampler4;
uniform sampler2D uSampler5;

const float epsilon = 0.01;

void main(void) {
	vec4 color = vec4(0,0,0,1);

	if ( abs(vPosOrigin.y-uCubeSize) < epsilon ){
		//color = vec4(0,vPosOrigin.y,0,1);
		color = texture2D(uSampler0, vec2(tCoords.s, tCoords.t));
	}
	else if ( abs(vPosOrigin.x-uCubeSize) < epsilon ){
		//color = vec4(0,0.0,0.3,1);
		color = texture2D(uSampler1, vec2(tCoords.s, tCoords.t));
	}
	else if ( abs(vPosOrigin.z-uCubeSize) < epsilon ){
		color = texture2D(uSampler2, vec2(tCoords.s, tCoords.t));
	}
	else if ( vPosOrigin.y < 0.0 && abs(vPosOrigin.y+uCubeSize) < epsilon ){
		//color = vec4(0,0.7,0,1);
		color = texture2D(uSampler3, vec2(tCoords.s, tCoords.t));
	}
	else if ( vPosOrigin.z < 0.0 && abs(vPosOrigin.z+uCubeSize) < epsilon ){
		color = texture2D(uSampler4, vec2(tCoords.s, tCoords.t));
		//color = vec4(0.7,0,0,1);
	}
	else {
		color = texture2D(uSampler5, vec2(tCoords.s, tCoords.t));
		//color = vec4(0.5,0,0.7,1);
	}

	gl_FragColor = color;
}
