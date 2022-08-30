let viewportContainer,
bgCanvas,
lightTimeline,
lightTimelineTwo,
scene, 
geometry, 
material, 
plane, 
pointLight, 
pointLight2,  
bgfov, 
bgPlaneAspectRatio,
camera,
sizes,
renderer;

viewportContainer   = document.querySelector('.veiwport_container');
bgCanvas            = document.querySelector('.bg_webgl');

lightTimeline       = gsap.timeline({repeat:-1});
lightTimelineTwo    = gsap.timeline({repeat:-1});

const bgAnimation = () => {

  scene = new THREE.Scene();

  const createGeometry = () => {

    geometry  = new THREE.PlaneGeometry( 60, 60 );
    material  = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    plane     = new THREE.Mesh( geometry, material );
    plane.position.set(0, 0, -6);
    scene.add( plane );

  }

  const createLights = () => {

    pointLight = new THREE.PointLight( 0xfaebd7, 10, 30 );
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

  }

  const declareSizes = () => {

    sizes = {
      width:  viewportContainer.clientWidth,
      height: viewportContainer.clientHeight
    };

  }

  const createCamera = () => {

    bgfov               = 50;           // https://discourse.threejs.org/t/keeping-an-object-scaled-based-on-the-bounds-of-the-canvas-really-battling-to-explain-this-one/17574/9
    bgPlaneAspectRatio  = 16 / 9;

    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
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

bgAnimation();


let aboutContainer,
portfolioContainer,
aboutTimeline,
portfolioTimeline;

aboutContainer      = document.querySelector('.about_container');
portfolioContainer  = document.querySelector('.portfolio_container');

aboutTimeline       = gsap.timeline({repeat:-1});
portfolioTimeline   = gsap.timeline({repeat:-1});

const animateElements = () => {

  aboutTimeline.to(aboutContainer, {y: 30, duration: 6, ease: Sine.easeInOut})
                .to(aboutContainer, {y: 0, duration: 6, ease: Sine.easeInOut});

  portfolioTimeline.to(portfolioContainer, {y: 15, duration: 5, ease: Sine.easeInOut})
                    .to(portfolioContainer, {y: 0, duration: 5, ease: Sine.easeInOut});

}

animateElements();