/**
 * Created by briancharous on 11/10/14.
 */

var container;
var scene;
var camera;
var renderer;
var controls;
var molecules = [];

function initWebGL() {
    scene = new THREE.Scene();
    container = document.getElementById("container");
    camera = new THREE.PerspectiveCamera(100, 1, 1, 100);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetWidth);
    renderer.setClearColor(0xffffff, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.damping = 2.0;
    controls.z = 0;
//     controls.minPolarAngle = -Math.PI;
//     controls.maxPolarAngle = Math.PI;
    controls.addEventListener('change', render);
    requestAnimationFrame(render);
    controls.update();
    window.addEventListener('resize', onWindowResize, false);
}

function addMolecules(num) {

    var geometry = new THREE.CylinderGeometry(1, 1, 10, 30);
    var material  = new THREE.MeshLambertMaterial({color: 0xFF0000});
/*
    var axisHelper = new THREE.AxisHelper( 20 );
    scene.add( axisHelper );
*/
    for (var i = 0; i < num; i++) {
        var lc = new THREE.Mesh(geometry, material);
        lc.position.x = (i-num/2+1)*3;
        lc.rotation.x = i/(num-1) * Math.PI/2;
        molecules.push(lc);
        scene.add(lc);
    }
    
    camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = 20;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
    
    addPolarizers(i);
}

function addPolarizers(i) {
    var geometry = new THREE.PlaneGeometry( 20, 20, 5 );
    var material = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh(geometry, material);
    var plane2 = new THREE.Mesh(geometry, material);
    plane.rotation.y = Math.PI/2;
    plane2.rotation.y = Math.PI/2;
    plane.position.x = (i+1)*1.55;
    plane2.position.x = -(i+1)*1.55;
    scene.add(plane);
    scene.add(plane2);
}

function addLight() {
    //scene.add(new THREE.AmbientLight(0xffffff));

    var light;

    light = new THREE.SpotLight();
    light.intensity = 1.5;
    light.castShadow = true;
    light.position.set(50, 50, 50);

    scene.add(light);

    light = new THREE.SpotLight();
    light.intensity = 1.5;
    light.castShadow = true;
    light.position.set(-50, -50, -50);

    scene.add(light);
}


function onWindowResize() {
    container = document.getElementById("container");
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetWidth);
    render();
}

function onEFieldSliderChange(value, max) {
    var rotatePercent = value/max;
    for (var i = 0; i < molecules.length; i++) {
        var m = molecules[i];
        m.rotation.z = (rotatePercent * Math.PI/2);
    }
    render();
    
    // adjust pixel color
    pixel = document.getElementById("pixel");
    rgbVal = Math.floor(((1-rotatePercent)*255));
    pixel.style.background = "rgb(" + rgbVal + "," + rgbVal + "," + rgbVal + ")";
}

function render() {
    renderer.render(scene, camera);
}
