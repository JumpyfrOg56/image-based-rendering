// =====================================================
// 3D CUBE
// =====================================================

class Skybox {
	// --------------------------------------------
	constructor() {
		this.shaderName='skybox';
		this.loaded=-1;
		this.shader=null;
		this.nbTextures = 0
		this.textureArray = null;
		this.indexBuffer = null;
		this.initAll();
	}

	// --------------------------------------------
	initAll() {
		var size = CubeSize;


		/*
				g____________ h
		Z	 _-*|		_-*	|
		c _-*_________-*	|
		 |		|	  | d	|
		 |		|     |		|
		 |	Y/f	| ____|_____| e
		 |	 _-*	  |	 _-*
		 |_-*_________|-*  X
		b			  a
		*/

		var vertices = [
			// derriere
			// abcd
			size, -size, -size,
			-size, -size, -size,
			-size, -size, size,
			size, -size, size,

			// gauche
			// bfgc
			-size, -size, -size,
			-size, size, -size,
			-size, size, size,
			-size, -size, size,

			// haut
			// ghdc
			-size, size, size,
			size, size, size,
			size, -size, size,
			-size, -size, size,
			
			

			// devant (la caméra, derrière le lapin)
			//ghef
			/*
			-size, size, size,
			-size, size, -size,
			size, size, -size,
			size, size, size,*/
			// fehg
			-size, size, -size,
			size, size, -size,
			size, size, size,
			-size, size, size,

			// bas
			//dceh
			-size, -size, -size,
			size, -size, -size,
			size, size, -size,
			-size, size, -size,

			// droite
			//ecbf
			size, size, -size,
			size, -size, -size,
			size, -size, size,
			size, size, size,

		];

		var texcoords = [
			0.0,0.0,
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,

			0.0,0.0,
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,

			// haut
			0.0,0.0,
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,

			0.0,0.0,
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,

			// bas
			0.0,0.0,
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,

			0.0,0.0,
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
		];

		var indices = [
			// devant
			0, 1, 2,
			2, 3, 0,

			// gauche
			4, 5, 6,
			6, 7, 4,

			// haut
			8, 9, 10,
			10, 11, 8,

			// derriere
			12, 13, 14,
			14, 15, 12,

			// bas
			16, 17, 18,
			18, 19, 16,

			// droite
			20, 21, 22,
			22, 23, 20,
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 24;

		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 24;

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		this.indexBuffer.itemSize = 1;
		this.indexBuffer.numItems = 36;

		this.initTextures();
		loadShaders(this);
	}


	// -------------------------------------
	initTextures() {
		var filesTextures = ["posz.jpg", "posx.jpg", "posy.jpg", "negz.jpg", "negy.jpg", "negx.jpg"];
		this.textureArray = [];

		for (var i=0; i<filesTextures.length; i++){
			var texImage = new Image();
			if (chemin == null)
				chemin = "./skybox_textures/SanFrancisco3/";
			texImage.src = chemin + filesTextures[i];
			var texture = gl.createTexture();
			texture.image = texImage;

			this.textureArray.push(texture);

			//texture.crossOrigin = "";
			texture.image.onload = (event) => {
				if (this.textureArray[this.nbTextures]) {
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);	// Flip the image's y axis
					gl.bindTexture(gl.TEXTURE_2D, this.textureArray[this.nbTextures]);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureArray[this.nbTextures].image);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);	// gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);	// Prevents s-coordinate wrapping (repeating).
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);	// Prevents t-coordinate wrapping (repeating).
					this.nbTextures ++;
				}else{
					console.log("Error during texture initialisation");
				}
			}
				
		}
	}

	newTexture() {
		var filesTextures = ["posz.jpg", "posx.jpg", "posy.jpg", "negz.jpg", "negy.jpg", "negx.jpg"];
		this.nbTextures = 0;
		for (var i=0; i<filesTextures.length; i++){
			this.textureArray[i].image = new Image();
			this.textureArray[i].image.src = chemin + filesTextures[i];


			// TODO : verify texture id (in the array) and linked image
			
			this.textureArray[i].image.onload = async () => {
				if (this.textureArray[this.nbTextures]) {
					console.log(event);
					console.log("In2 "+this.nbTextures)
					console.log(this.textureArray[this.nbTextures].image.naturalWidth+" "+this.textureArray[this.nbTextures].image.naturalHeight)
					//await this.textureArray[this.nbTextures].image.decode()
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
					gl.bindTexture(gl.TEXTURE_2D, this.textureArray[this.nbTextures]);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureArray[this.nbTextures].image);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
					this.nbTextures++;
				}else{
					console.log("Error during textures changing")
				}
			}
		}
	}


	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
		gl.enableVertexAttribArray(this.shader.tAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);

		this.shader.uCubeSize = gl.getUniformLocation(this.shader, "uCubeSize");
		gl.uniform1f(this.shader.uCubeSize, CubeSize)


		/////////////////////////////// All sampler
		// sampler 0
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textureArray[0]);
		this.shader.sampler0 = gl.getUniformLocation(this.shader, "uSampler0");
		gl.uniform1i(this.shader.sampler0, 0);
		// sampler 1
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.textureArray[1]);
		this.shader.sampler1 = gl.getUniformLocation(this.shader, "uSampler1");
		gl.uniform1i(this.shader.sampler1, 1);
		// sampler 2
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.textureArray[2]);
		this.shader.sampler2 = gl.getUniformLocation(this.shader, "uSampler2");
		gl.uniform1i(this.shader.sampler2, 2);
		// sampler 3
		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, this.textureArray[3]);
		this.shader.sampler3 = gl.getUniformLocation(this.shader, "uSampler3");
		gl.uniform1i(this.shader.sampler3, 3);
		// sampler 4
		gl.activeTexture(gl.TEXTURE4);
		gl.bindTexture(gl.TEXTURE_2D, this.textureArray[4]);
		this.shader.sampler4 = gl.getUniformLocation(this.shader, "uSampler4");
		gl.uniform1i(this.shader.sampler4, 4);
		// sampler
		gl.activeTexture(gl.TEXTURE5);
		gl.bindTexture(gl.TEXTURE_2D, this.textureArray[5]);
		this.shader.sampler5 = gl.getUniformLocation(this.shader, "uSampler5");
		gl.uniform1i(this.shader.sampler5, 5);


	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4) {
			this.setShadersParams();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			//gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer.numItems);
			//gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
		}
	}

}
