import { TextureLoader } from 'three';
import { useThree, useLoader } from '@react-three/fiber';
import { useLayoutEffect, useEffect } from 'react';

const IsObject = url => url === Object(url) && !Array.isArray(url) && typeof url !== 'function';
function useTexture(input) {
  const gl = useThree(state => state.gl);
  const textures = useLoader(TextureLoader, IsObject(input) ? Object.values(input) : input);
  useEffect(() => {
    if ('initTexture' in gl) {
      const array = Array.isArray(textures) ? textures : [textures];
      array.forEach(gl.initTexture);
    }
  }, [gl, textures]);
  if (IsObject(input)) {
    const keys = Object.keys(input);
    const keyed = {};
    keys.forEach(key => Object.assign(keyed, {
      [key]: textures[keys.indexOf(key)]
    }));
    return keyed;
  } else {
    return textures;
  }
}
useTexture.preload = url => useLoader.preload(TextureLoader, url);
useTexture.clear = input => useLoader.clear(TextureLoader, input);

export { IsObject, useTexture };
