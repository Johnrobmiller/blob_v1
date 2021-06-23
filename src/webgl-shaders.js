export const vsSource = `

	attribute vec4 aVertexPosition;
	attribute vec2 aTextureCoord;

	varying highp vec2 vTextureCoord;

	void main(void) {

		gl_Position = aVertexPosition;
		vTextureCoord = aTextureCoord;

	}
`;

// Fragment shader program

export const fsSource = `

	varying highp vec2 vTextureCoord;
	uniform sampler2D uSampler;

	void main(void) {

		highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = texelColor * vec4(1, 0, 1, 1);

	}
`;