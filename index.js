import * as THREE from 'three';

let 
viewportContainer,
bgCanvas,
lightTimelineOne,
lightTimelineTwo,
scene, 
geometry, 
material, 
plane, 
pointLightOne, 
pointLightTwo,
bgfov, 
bgPlaneAspectRatio,
camera,
sizes,
renderer,
themeColors,
currentTheme,
colorCubeBtns,
brownBtn,
blueBtn,
greenBtn,
limeBtn,
bgUpdatedViaUser,
updateBGColorLoop;

themeColors = {
  brown:  {
    light:      0xfaebd7,
    container:  '#faebd7'
  },
  blue:  {
    light:      0xa6d3e9,
    container:  '#a6d3e9'
  },
  green:  {
    light:      0xa9e9a6,
    container:  '#a9e9a6'
  },
  lime:   {
    light:      0xd8e9a6,
    container:  '#d8e9a6'
  },
};
currentTheme      = themeColors.brown;

viewportContainer = document.querySelector('.veiwport_container');
bgCanvas          = document.querySelector('.bg_webgl');
colorCubeBtns     = document.querySelectorAll('.color_cube');
brownBtn          = document.querySelector('.brown');
blueBtn           = document.querySelector('.blue');
greenBtn          = document.querySelector('.green');
limeBtn           = document.querySelector('.lime');
bgUpdatedViaUser  = false;

const getRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
}

const bgAnimation = () => {

  scene = new THREE.Scene();

  const createGeometry = () => {

    geometry  = new THREE.PlaneGeometry(60, 60);
    material  = new THREE.MeshStandardMaterial({color: 0xffffff});
    plane     = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, -6);
    scene.add(plane);

  }

  const createLights = () => {

    lightTimelineOne = lightTimelineTwo = gsap.timeline({repeat: -1});

    pointLightOne = new THREE.PointLight(currentTheme.light, 10, 30);
    pointLightOne.position.set(17.79, -2, -2);
    scene.add(pointLightOne);

    lightTimelineOne
      .to(pointLightOne, {intensity: getRandom(12, 26), duration: 7, ease: Sine.easeInOut})
      .to(pointLightOne, {intensity: getRandom(1, 11), duration: 7, ease: Sine.easeInOut})
      .to(pointLightOne, {intensity: getRandom(3, 19), duration: 7, ease: Sine.easeInOut})
      .to(pointLightOne, {intensity: 10, duration: 7, ease: Sine.easeInOut});

    pointLightTwo = new THREE.PointLight(currentTheme.light, 10, 40);
    pointLightTwo.position.set(-24, 20, -2);
    scene.add(pointLightTwo);
      
    lightTimelineTwo
      .to(pointLightTwo, {intensity: getRandom(16, 32), duration: 5, ease: Sine.easeInOut})
      .to(pointLightTwo, {intensity: getRandom(2, 13), duration: 5, ease: Sine.easeInOut})
      .to(pointLightTwo, {intensity: getRandom(6, 26), duration: 5, ease: Sine.easeInOut})
      .to(pointLightTwo, {intensity: 10, duration: 5, ease: Sine.easeInOut});

  }

  const declareSizes = () => {

    sizes = {
      width:  viewportContainer.clientWidth,
      height: viewportContainer.clientHeight
    };

  }

  const createCamera = () => {

    bgfov               = 50;  // https://discourse.threejs.org/t/keeping-an-object-scaled-based-on-the-bounds-of-the-canvas-really-battling-to-explain-this-one/17574/9
    bgPlaneAspectRatio  = 16 / 9;

    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 50);
    camera.position.set(0, 0, 13);
    scene.add(camera);

  }

  const sortCameraAspect = () => {

    camera.aspect = sizes.width / sizes.height;
    if(camera.aspect > bgPlaneAspectRatio) {
      const cameraHeight     = Math.tan(THREE.MathUtils.degToRad(bgfov / 2));
      const ratio            = camera.aspect / bgPlaneAspectRatio;
      const newCameraHeight  = cameraHeight / ratio;
      camera.fov             = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    }
    else camera.fov          = bgfov;
    camera.updateProjectionMatrix();

  }

  const createRenderer = () => {

    renderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  }

  const onWindowResize = () => {
    
    declareSizes();
    sortCameraAspect()
    renderer.setSize(sizes.width, sizes.height);

  }

  const tick = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  createGeometry();
  createLights();
  declareSizes();
  createCamera();
  sortCameraAspect();
  createRenderer();
  tick();
  window.addEventListener( 'resize', onWindowResize, false );

}

const updateTheme = (color, updatedViaUser = true) => {

  if(updatedViaUser) bgUpdatedViaUser = true;

  const updateLights = () => {

    const colorChangeTimeline = gsap.timeline();
    const colour              = new THREE.Color(themeColors[color].light);
  
    colorChangeTimeline
      .to(pointLightOne.color, {
        r: colour.r, 
        g: colour.g, 
        b: colour.b, 
        duration: 2, 
        ease: Sine.easeInOut
      })
      .to(pointLightTwo.color, {
        r: colour.r, 
        g: colour.g, 
        b: colour.b, 
        duration: 3, 
        ease: Sine.easeInOut
      });

  }

  const updateActiveColorCube = () => {

    for(const btn of colorCubeBtns) 
      btn.classList.remove('active_color_cube');
    document.querySelector(`.${color}`).classList.add('active_color_cube');

  }

  const updateContainers = () => {

    document.querySelector('.portfolio_container').style.backgroundColor 
      = `${currentTheme.container}4f`;
    currentTheme = themeColors[color];

  }

  updateLights();
  updateActiveColorCube();
  updateContainers();

}

const autoUpdateBGColors = () => {
    
  updateBGColorLoop 
    = setTimeout(() => {

      if(!bgUpdatedViaUser) {
        const color = getRandom(0, 4);
        updateTheme(
          color === 0
            ? 'brown'
            : color === 1
              ? 'blue'
              : color === 2
                ? 'green'
                : 'lime',
          false
        );
        autoUpdateBGColors();
      } else clearTimeout(updateBGColorLoop);

    }, 10000);

}

brownBtn.addEventListener('click', updateTheme.bind(this, 'brown'));
blueBtn.addEventListener('click', updateTheme.bind(this, 'blue'));
greenBtn.addEventListener('click', updateTheme.bind(this, 'green'));
limeBtn.addEventListener('click', updateTheme.bind(this, 'lime'));

bgAnimation();
autoUpdateBGColors();