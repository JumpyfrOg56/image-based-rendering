// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class MeshObject {

	// --------------------------------------------
	constructor(objFname) {
		this.objName = objFname;
		this.shaderName = 'obj';
		this.loaded = -1;
		this.shader = null;
		this.mesh = null;

		loadObjFile(this);
		loadShaders(this);
	}

	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
		this.shader.InverseRMatrixUniform = gl.getUniformLocation(this.shader, "uInverseRMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");

		
		this.shader.uType = gl.getUniformLocation(this.shader, "uType");
		gl.uniform3fv(this.shader.uType, type);
		this.shader.uCol = gl.getUniformLocation(this.shader, "uColor");
		gl.uniform3fv(this.shader.uCol, color);

		this.shader.uCubeSizeTexture = gl.getUniformLocation(this.shader, "uCubeSizeTexture");
		gl.uniform1f(this.shader.uCubeSizeTexture, CubeSize)

		// pass all the sampler of the cube
		this.shader.sampler0 = gl.getUniformLocation(this.shader, "uCubeTexture0");
		gl.uniform1i(this.shader.sampler0, 0);
		this.shader.sampler1 = gl.getUniformLocation(this.shader, "uCubeTexture1");
		gl.uniform1i(this.shader.sampler1, 1);
		this.shader.sampler2 = gl.getUniformLocation(this.shader, "uCubeTexture2");
		gl.uniform1i(this.shader.sampler2, 2);
		this.shader.sampler3 = gl.getUniformLocation(this.shader, "uCubeTexture3");
		gl.uniform1i(this.shader.sampler3, 3);
		this.shader.sampler4 = gl.getUniformLocation(this.shader, "uCubeTexture4");
		gl.uniform1i(this.shader.sampler4, 4);
		this.shader.sampler5 = gl.getUniformLocation(this.shader, "uCubeTexture5");
		gl.uniform1i(this.shader.sampler5, 5);
	}

	// --------------------------------------------
	setMatrixUniforms() {
		// calculate the inverse of rotation matrix
		var tmp = mat4.create();
		tmp = mat4.transpose(rotMatrix, tmp);

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader.InverseRMatrixUniform, false, tmp);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4 && this.mesh != null) {
			this.setShadersParams();
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
}