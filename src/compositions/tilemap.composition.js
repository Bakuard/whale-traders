export const tilemapComposition = {
  createObjectLayer(scene, map, layerName) {
    const objLayerMeta = map.getObjectLayer(layerName);
    const objLayer = scene.physics.add.staticGroup();
    objLayerMeta.objects.forEach((objMeta) => {
      const obj = objLayer.get();
      extractProperties(objMeta, obj);
      obj.setTexture(obj.imageName);
    });
    return objLayer;
  },

  getFromObjectLayer(map, layerName, objectName) {
    const objLayerMeta = map.getObjectLayer(layerName);
    const objMeta = objLayerMeta.objects.find((obj) => obj.name === objectName);
    if (objMeta) return extractProperties(objMeta, {});
    throw `Fail to find object with name '${objectName}' on layer '${layerName}'`;
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
  obj.y = objMeta.y - objMeta.height / 2;
  obj.width = objMeta.width;
  obj.height = objMeta.height;
  obj.type = objMeta.type;
  obj.setBodySize?.(objMeta.width, objMeta.height);
  obj.body?.updateFromGameObject();
  return obj;
}
