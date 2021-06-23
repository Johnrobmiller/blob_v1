export const vsSource = `

	attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;
	attribute vec2 aTextureCoord;

	uniform mat4 uNormalMatrix;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	varying highp vec2 vTextureCoord;

	void main(void) {

		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		vTextureCoord = aTextureCoord;

	}
`;

  // Fragment shader program

export const fsSource = `

	varying highp vec2 vTextureCoord;
	uniform sampler2D uSampler;

	void main(void) {

		highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = vec4(1, 0, 0, 1);

	}
`;