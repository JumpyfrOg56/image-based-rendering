
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;
// =====================================================

// Bunny
var OBJ1 = null;
// Porche
var OBJ2 = null;
// Mustang
var OBJ3 = null;
// Sphere
var OBJ4 = null;
// Cube
var OBJ5 = null;
var listObj = [];

var SKYBOX = null;

var CubeSize = 500.0;
var type = new Float32Array([1.0,0.0,0.0]);
var color = new Float32Array([0.0,0.0,1.0]);
var chemin = null;

const PATH_TO_SHADER = "shader/";



// =====================================================
// GENERAL FONCTIONS, INITIALISATIONS
// =====================================================


/**
 * Initialise webgl and the root component that will display the webgl scene.
 * @param {*} canvas The root component to initialize
 */
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.67, 0.92, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


/**
 * Load the .obj file that contains an mesh and store it in the object passed by parameters.
 * @param {*} Obj3D The object where store the loaded mesh.
 */
loadObjFile = function(Obj3D)
{
	var xhttp = new XMLHttpRequest();
	// function executed when the file is loaded
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			// init index/vertex/normal/texture buffers
			OBJ.initMeshBuffers(gl,tmpMesh);
			Obj3D.mesh=tmpMesh;
		}
	}
	// Load the file present locally
	xhttp.open("GET", Obj3D.objName, true);
	xhttp.send();
}


/**
 * Load the shader associated with the object passed by parameter. When there are both loaded
 * (vertex and fragment), compilation is launched.
 * @param {*} Obj3D The object whose shaders need to be loaded.
 */
function loadShaders(Obj3D) {
	// vs
	var xhttpVs = new XMLHttpRequest();
	// function executed when the file is loaded
	xhttpVs.onreadystatechange = function() {
		if (xhttpVs.readyState == 4 && xhttpVs.status == 200) {
			Obj3D.vsTxt = xhttpVs.responseText; 
			Obj3D.loaded ++;
			// if vertex shader is loaded after that fragment shader is loaded
			if(Obj3D.loaded==2) {
				Obj3D.loaded ++;
				compileShaders(Obj3D);
				Obj3D.loaded ++;
			}
		}
	}
	Obj3D.loaded = 0;
	// Load the file present locally
	xhttpVs.open("GET", PATH_TO_SHADER+Obj3D.shaderName+".vs", true);
	xhttpVs.send();
	
	// fs
	var xhttpFs = new XMLHttpRequest();
	// function executed when the file is loaded
	xhttpFs.onreadystatechange = function() {
		if (xhttpFs.readyState == 4 && xhttpFs.status == 200) {
			Obj3D.fsTxt = xhttpFs.responseText; 
			Obj3D.loaded ++;
			// if fragment shader is loaded after that vertex shader is loaded
			if(Obj3D.loaded==2) {
				Obj3D.loaded ++;
				compileShaders(Obj3D);
				Obj3D.loaded ++;
			}
		}
	}
	Obj3D.loaded = 0;
	// Load the file present locally
	xhttpFs.open("GET", PATH_TO_SHADER+Obj3D.shaderName+".fs", true);
	xhttpFs.send();
}


/**
 * Compile the shaders of the object passed by parameter and put them in a new webgl shader.
 * @param {object} object The object whose compile its vertex and fragment shaders
 */
function compileShaders(object)
{
	object.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(object.vshader, object.vsTxt);
	gl.compileShader(object.vshader);
	if (!gl.getShaderParameter(object.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+PATH_TO_SHADER+object.shaderName+".vs");
		console.log(gl.getShaderInfoLog(object.vshader));
	}

	object.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(object.fshader, object.fsTxt);
	gl.compileShader(object.fshader);
	if (!gl.getShaderParameter(object.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+PATH_TO_SHADER+object.shaderName+".fs");
		console.log(gl.getShaderInfoLog(object.fshader));
	}

	object.shader = gl.createProgram();
	gl.attachShader(object.shader, object.vshader);
	gl.attachShader(object.shader, object.fshader);
	gl.linkProgram(object.shader);
	if (!gl.getProgramParameter(object.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(object.shader));
	}
}

/**
 * Executed whe the page is loaded.
 */
function webGLStart() {
	// get the attribute in html page that show the webgl scene
	var canvas = document.getElementById("WebGL-test");

	// bind mouse events
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;

	// init the WebGl context and variables
	initGL(canvas);

	// init the camera (camera matrix)
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	// init distance cam/object
	distCENTER = vec3.create([0,-0.2,-3]);


	// init objects and skybox
	SKYBOX = new Skybox();
	OBJ1 = new MeshObject('obj/bunny.obj');
	OBJ2 = new MeshObject('obj/porsche.obj');
	OBJ3 = new MeshObject('obj/mustang.obj');
	OBJ4 = new MeshObject('obj/sphere.obj');
	OBJ5 = new MeshObject('obj/cube.obj');
	listObj = [new MeshObject('obj/bunny.obj'), 
		new MeshObject('obj/porsche.obj'), 
		new MeshObject('obj/mustang.obj'), 
		new MeshObject('obj/sphere.obj'), 
		new MeshObject('obj/cube.obj')
	]

	tick();
}

/**
 * Executed at each frame, to draw the scene visible by the cam. Get scene parameters set by the 
 * user in the html page and load object and skybox textures associated. Then object and skybox
 * are rendered.
 */
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	SKYBOX.draw();
	
	// Get object material
	var type_material = document.querySelector('input[name="type"]:checked').value;
	if ( type_material == "opaque")
		type = new Float32Array([1.0,0.0,0.0])
	else if ( type_material == "transparent")
		type = new Float32Array([0.0,1.0,0.0])
	else if ( type_material == "miroir")
		type = new Float32Array([0.0,0.0,1.0])


	// Get object to display
	var object = document.querySelector('input[name="object"]:checked').value;
	//listObj.forEach((obj) => if (object == "porsche") obj.draw());
	if ( object == "bunny")
		OBJ1.draw();
	else if ( object == "mustang")
		OBJ2.draw();
	else if ( object == "porsche")
		OBJ3.draw();
	else if ( object == "sphere")
		OBJ4.draw();
	else if ( object == "cube")
		OBJ5.draw();


	// Get color to apply
	var e_c = document.getElementById("couleur");
	var tmp_c =  e_c.options[e_c.selectedIndex].value;
	if ( tmp_c == "bleu")
		color = new Float32Array([0.0,0.0,1.0]);
	else if ( tmp_c == "noir")
		color = new Float32Array([0.0,0.0,0.0]);
	else if ( tmp_c == "marron")
		color = new Float32Array([0.5,0.0,0.0]);
	else if ( tmp_c == "vert")
		color = new Float32Array([0.0,1.0,0.0]);
	else if ( tmp_c == "gris")
		color = new Float32Array([0.5,0.5,0.5]);
	else if ( tmp_c == "orange")
		color = new Float32Array([0.9,0.5,0.13]);
	else if ( tmp_c == "rose")
		color = new Float32Array([1.0,0.75,0.79]);
	else if ( tmp_c == "violet")
		color = new Float32Array([0.5,0.0,0.5]);
	else if ( tmp_c == "rouge")
		color = new Float32Array([1.0,0.0,0.0]);
	else if ( tmp_c == "blanc")
		color = new Float32Array([1.0,1.0,1.0]);
	else if ( tmp_c == "jaune")
		color = new Float32Array([1.0,1.0,0.0]);


	// Get skybox to display
	var e = document.getElementById("skybox");
	var value = e.value;
	var tmp =  "./skybox_textures/" + e.options[e.selectedIndex].value;
	if ( tmp != chemin && SKYBOX.textureArray != null ) {
		chemin = tmp;
		SKYBOX.newTexture();
	}
	
}
