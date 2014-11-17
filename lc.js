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
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0xffffff, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.damping = 2.0;
    controls.z = 1;
    controls.addEventListener('change', render);
    requestAnimationFrame(render);
    controls.update();
    window.addEventListener( 'resize', onWindowResize, false );
}

function addMolecules(num) {

    var geometry = new THREE.CylinderGeometry(1, 1, 10, 30);
    var material  = new THREE.MeshLambertMaterial({color: 0xFF0000});
    var axisHelper = new THREE.AxisHelper( 20 );
    scene.add( axisHelper );
    for (var i = 0; i < num; i++) {
        var lc = new THREE.Mesh(geometry, material);
        lc.position.x = (i-num/2+1)*3;
        lc.rotation.x = i/(num-1) * Math.PI/2;
        molecules.push(lc);
        scene.add(lc);
    }
    
    camera.position.z = 20;
    camera.position.x = 20;
    camera.position.y = 20;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
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
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    render();

}

function onEFieldSliderChange(value, max) {
    var rotatePercent = value/max;
    for (var i = 0; i < molecules.length; i++) {
        var m = molecules[i];
//         var axis = new THREE.Vector3(0, 0, 0);
//         m.rotateOnAxis(axis, rotatePercent * Math.PI/2);
        m.rotation.z = (rotatePercent * Math.PI/2);
//         m.position.z = m.position.z + rotatePercent;
//         m.rotation.x = rotatePercent * Math.PI/2;
    }
    render();
}

function render() {
    renderer.render(scene, camera);
}
