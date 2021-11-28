//Use https://webgl2fundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html

var phongProgram;
var phongFragmentShaderScript = `#version 300 es

    precision highp float;

    uniform vec4 u_color;

    out vec4 out_color;

    void main(void) 
    {
        out_color = u_color;
    }
`;

var gouraudProgram;
var gouraudFragmentShaderScript = `#version 300 es

    precision highp float;

    uniform vec4 u_color;

    out vec4 out_color;

    void main(void) 
    {
        out_color = u_color;
    }
`;

var templateVertexShaderScript = `#version 300 es

    in vec3 a_position; 

    uniform mat4 u_projectionMatrix;
    uniform mat4 u_modelViewMatrix;

    void main(void) 
    {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
    }
`;

var templateVertexArrayObject;
var lastTime = 0;
var projectionMatrix = glMatrix.mat4.create();
var modelViewMatrix = glMatrix.mat4.create();

function initMatrices()
{
    glMatrix.mat4.ortho(projectionMatrix, -gl.viewportWidth / 2, gl.viewportWidth / 2, -gl.viewportHeight / 2, gl.viewportHeight / 2, -1000, 1000);
    glMatrix.mat4.identity(modelViewMatrix);
}

function initBuffers()
{
    // Create buffer on GPU
    var vertexBuffer = gl.createBuffer();

    // Say that we're going to use that buffer as the ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Tell attribute how to get data from buffer
    // Create a vertex array object (array of attribute state)
    templateVertexArrayObject = gl.createVertexArray();

    // Make it the current vertex array
    gl.bindVertexArray(templateVertexArrayObject);

    // Turn on the attribute, without this the attribute will be a constant
    // Tell it we're going to be putting stuff from buffer into it.
    gl.enableVertexAttribArray(program.a_position);

    // How to get data out of the buffer, and bind ARRAY_BUFFER to the attribute
    // Attribute will receive data from that ARRAY_BUFFER
    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(program.a_position, size, type, normalize, stride, offset);
}

function drawScene() 
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(phongProgram);
    sendNewMatrices(phongProgram, projectionMatrix, modelViewMatrix);
    sendNewColor(phongProgram, [Math.random(), Math.random(), Math.random(), Math.random()]);
    var vertices = [
        -150, -50, 0,
        -50, -50, 0,
        -50, 50, 0,
        -150, 50, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var offset = 0;
    gl.drawArrays(gl.TRIANGLE_FAN, offset, 4);

    gl.useProgram(gouraudProgram);
    sendNewMatrices(gouraudProgram, projectionMatrix, modelViewMatrix);
    sendNewColor(gouraudProgram, [Math.random(), Math.random(), Math.random(), Math.random()]);
    vertices = [
        50, -50, 0,
        150, -50, 0,
        150, 50, 0,
        50, 50, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_FAN, offset, 4);
}

function rotateSquares(key)
{
    switch (key.code)
    {
        case 'KeyQ':
            glMatrix.mat4.rotateX(modelViewMatrix, modelViewMatrix, 0.1);
            break;
        case 'KeyW':
            glMatrix.mat4.rotateX(modelViewMatrix, modelViewMatrix, -0.1);
            break;
        case 'KeyA':
            glMatrix.mat4.rotateY(modelViewMatrix, modelViewMatrix, 0.1);
            break;
        case 'KeyS':
            glMatrix.mat4.rotateY(modelViewMatrix, modelViewMatrix, -0.1);
            break;
        case 'KeyZ':
            glMatrix.mat4.rotateZ(modelViewMatrix, modelViewMatrix, 0.1);
            break;
        case 'KeyX':
            glMatrix.mat4.rotateZ(modelViewMatrix, modelViewMatrix, -0.1);
            break;
    }

    drawScene();
}

function demoStart() 
{
    var canvas = document.getElementById("demo");
    initGl(canvas);

    initMatrices();

    phongProgram = createProgram(phongFragmentShaderScript, templateVertexShaderScript);
    getLocations(phongProgram);

    gouraudProgram = createProgram(gouraudFragmentShaderScript, templateVertexShaderScript);
    getLocations(gouraudProgram);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    initBuffers();

    document.addEventListener('keypress', rotateSquares);
    drawScene();
}
