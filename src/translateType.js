function translateType(type, typeConfig) {
  const foundType = typeConfig.find(t => t.types.includes(type));
  if (foundType) {
    return foundType.label;
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

module.exports = translateType;
