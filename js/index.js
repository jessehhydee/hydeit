
const bgAnimation = () => {

  const viewportContainer   = document.querySelector('.veiwport_container');
  const bgCanvas            = document.querySelector('.bg_webgl');

  // Scene
  const scene = new THREE.Scene();

  // Init GSAP
  let lightTimeline     = gsap.timeline({repeat:-1});
  let lightTimelineTwo  = gsap.timeline({repeat:-1});

  const geometry  = new THREE.PlaneGeometry( 60, 60 );
  const material  = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  const plane     = new THREE.Mesh( geometry, material );
  plane.position.set(0, 0, -6);
  scene.add( plane );

  // Lights
  // const light = new THREE.AmbientLight( 0xffffff );
  // scene.add( light );

  const pointLight = new THREE.PointLight( 0xfaebd7, 10, 30 );
  pointLight.position.set(17.79, -2, -2);
  scene.add( pointLight );

  lightTimeline.to(pointLight, {intensity: 17, duration: 7, ease: Sine.easeInOut})
    .to(pointLight, {intensity: 7, duration: 7, ease: Sine.easeInOut})
    .to(pointLight, {intensity: 12, duration: 7, ease: Sine.easeInOut})
    .to(pointLight, {intensity: 10, duration: 7, ease: Sine.easeInOut});

  const pointLight2 = new THREE.PointLight( 0xfaebd7, 10, 40 );
  pointLight2.position.set(-24, 20, -2);
  scene.add( pointLight2 );
    
  lightTimelineTwo.to(pointLight2, {intensity: 27, duration: 5, ease: Sine.easeInOut})
    .to(pointLight2, {intensity: 7, duration: 5, ease: Sine.easeInOut})
    .to(pointLight2, {intensity: 12, duration: 5, ease: Sine.easeInOut})
    .to(pointLight2, {intensity: 10, duration: 5, ease: Sine.easeInOut});

  // Sizes
  const sizes = {
    width:  viewportContainer.clientWidth,
    height: viewportContainer.clientHeight
  };

  // Global values that are used when comparing the cameras aspect ratio.
  // This is important because when the width / height of the camera doesn't work out to be 16 / 9, our canvase begins to appear cropped.
  // Found example to solution: https://discourse.threejs.org/t/keeping-an-object-scaled-based-on-the-bounds-of-the-canvas-really-battling-to-explain-this-one/17574/9
  const bgfov               = 50;
  const bgPlaneAspectRatio  = 16 / 9;

  // Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
  camera.position.set(0, 0, 13);
  scene.add(camera);

  camera.aspect = sizes.width / sizes.height;
  if(camera.aspect > bgPlaneAspectRatio) {
    const cameraHeight     = Math.tan(THREE.MathUtils.degToRad(bgfov / 2));
    const ratio            = camera.aspect / bgPlaneAspectRatio;
    const newCameraHeight  = cameraHeight / ratio;
    camera.fov             = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
  }
  else camera.fov          = bgfov;
  camera.updateProjectionMatrix();

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: bgCanvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Animation
  const tick = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();

  window.addEventListener( 'resize', onWindowResize, false );
  const onWindowResize = () => {

    const sizes = {
      width:  viewportContainer.clientWidth,
      height: viewportContainer.clientHeight
    };
    
    camera.aspect = sizes.width / sizes.height;
    if(camera.aspect > bgPlaneAspectRatio) {
      const cameraHeight     = Math.tan(THREE.MathUtils.degToRad(bgfov / 2));
      const ratio            = camera.aspect / bgPlaneAspectRatio;
      const newCameraHeight  = cameraHeight / ratio;
      camera.fov             = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    }
    else camera.fov          = bgfov;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);

  }

}
bgAnimation();
