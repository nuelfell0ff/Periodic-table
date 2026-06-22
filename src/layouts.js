import * as THREE from 'three';

export const getLayoutPositions = (data) => {
  const count = data.length;

  // 1. SPACIOUS FLAT TABLE (Added clear gaps between columns and rows)
  const table = data.map((el) => ({
    x: (el.x - 9.5) * 65,     // Expanded horizontal separation step from 40 to 65
    y: -(el.y - 5) * 85,      // Expanded vertical separation step from 54 to 85
    z: 0,
    rx: 0, ry: 0, rz: 0
  }));

  // 2. BREATHING 3D SPHERE (Expanded radius to prevent card collision)
  const sphere = data.map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    const target = new THREE.Vector3();
    target.setFromSphericalCoords(340, phi, theta); // Opened up globe radius from 190 to 340

    const lookTarget = target.clone().multiplyScalar(2);
    const dummy = new THREE.Object3D();
    dummy.position.copy(target);
    dummy.lookAt(lookTarget);

    return {
      x: target.x,
      y: target.y,
      z: target.z,
      rx: dummy.rotation.x,
      ry: dummy.rotation.y,
      rz: dummy.rotation.z,
    };
  });

  // 3. ELEVATED 3D HELIX (Stretched out spiral thread gaps)
  const helix = data.map((_, i) => {
    const theta = i * 0.22 + Math.PI; 
    const y = -(i * 7) + 200;         // Tall, elegant vertical spacing factor from 3.2 to 7

    const target = new THREE.Vector3();
    target.setFromCylindricalCoords(280, theta, y); // Expanded column core radius from 180 to 280

    const dummy = new THREE.Object3D();
    dummy.position.copy(target);
    dummy.lookAt(new THREE.Vector3(0, target.y, 0));
    dummy.rotateY(Math.PI); 

    return {
      x: target.x,
      y: target.y,
      z: target.z,
      rx: dummy.rotation.x,
      ry: dummy.rotation.y,
      rz: dummy.rotation.z,
    };
  });

  // 4. OPEN 3D GRID BLOCK (Wider 3D cube interstitial space)
  const grid = data.map((_, i) => {
    const x = (i % 5) * 100 - 200;        // Expanded step size from 55 to 100
    const y = (Math.floor(i / 5) % 5) * 100 - 200;
    const z = Math.floor(i / 25) * -120 + 120; // Deeper dimensional slice gaps

    return {
      x, y, z,
      rx: 0, ry: 0, rz: 0
    };
  });

  return { table, sphere, helix, grid };
};