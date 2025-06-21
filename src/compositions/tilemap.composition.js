export const tilemapComposition = {
  createObjectLayer(scene, map, layerName) {
    const objLayerMeta = map.getObjectLayer(layerName);
    const objLayer = scene.physics.add.staticGroup();
    objLayerMeta.objects.forEach((objMeta) => {
      const obj = scene.add.tileSprite();
      extractProperties(objMeta, obj);
      scene.physics.add.existing(obj, true);
      objLayer.add(obj);
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

function extractProperties(objMeta, obj) {
  objMeta.properties?.forEach((property) => (obj[property.name] = property.value));
  obj.name = objMeta.name;
  obj.x = objMeta.x + objMeta.width / 2;
  obj.y = obj.anchorY === "bottom" ? objMeta.y + objMeta.height / 2 : objMeta.y - objMeta.height / 2;
  obj.setTexture?.(obj.imageName, obj.imageIndex);
  obj.width = objMeta.width;
  obj.height = objMeta.height;
  obj.class = objMeta.type;
  obj.body?.setSize(objMeta.width, objMeta.height);
  obj.body?.reset(obj.x, obj.y);
  return obj;
}
