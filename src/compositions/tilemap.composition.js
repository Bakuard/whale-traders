export const tilemapComposition = {
  createObjectLayerWithTexture(scene, map, layerName) {
    const objLayerMeta = map.getObjectLayer(layerName);
    const objLayer = scene.physics.add.staticGroup();
    objLayerMeta.objects.forEach((objMeta) => {
      const obj = scene.add.tileSprite();
      extractProperties(objMeta, obj, true);
      scene.physics.add.existing(obj, true);
      objLayer.add(obj);
    });
    return objLayer;
  },

  createObjectLayerWithSprite(scene, map, layerName) {
    const objLayerMeta = map.getObjectLayer(layerName);
    const objLayer = scene.physics.add.staticGroup();
    objLayerMeta.objects.forEach((objMeta) => {
      const obj = objLayer.get();
      extractProperties(objMeta, obj, false);
    });
    return objLayer;
  },

  getFromObjectLayer(map, layerName, filterProperties) {
    const objLayerMeta = map.getObjectLayer(layerName);
    for (let obj of objLayerMeta.objects) {
      obj = extractProperties(obj, {});
      if (Object.entries(filterProperties).every(([key, value]) => obj[key] === value)) return obj;
    }
    throw `Fail to find object with properties '${JSON.stringify(filterProperties)}' on layer '${layerName}'`;
  },

  createTileLayer(map, tilesetName, layerId, collisionIndexes) {
    const tileset = map.addTilesetImage(tilesetName);
    const tileLayer = map.createLayer(layerId, [tileset]);
    map.setCollision(collisionIndexes);
    return tileLayer;
  },
};

function extractProperties(objMeta, obj, isTexture) {
  objMeta.properties?.forEach((property) => (obj[property.name] = property.value));
  obj.name = objMeta.name;
  obj.x = objMeta.x + objMeta.width / 2;
  obj.y = obj.anchorY === "bottom" ? objMeta.y + objMeta.height / 2 : objMeta.y - objMeta.height / 2;
  obj.setTexture?.(obj.imageName, obj.imageIndex);
  if (isTexture) {
    obj.width = objMeta.width;
    obj.height = objMeta.height;
  } else {
    obj.displayWidth = objMeta.width;
    obj.displayHeight = objMeta.height;
  }
  if (obj.animation) obj.play(obj.animation, true);
  obj.class = objMeta.type;
  obj.body?.setSize(objMeta.width, objMeta.height);
  obj.body?.reset(obj.x, obj.y);
  return obj;
}
