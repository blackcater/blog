const isType = type => obj =>
  Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`;

const isArray = isType('array');
const isObject = isType('object');

export { isType, isArray, isObject };
