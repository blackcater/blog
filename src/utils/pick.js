function pick(data, keyPath) {
  if (!data || !keyPath) return data;

  const keys = keyPath.split(/[.[\]]/).filter(x => !!x);
  let result = data;

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];

    if (!result.hasOwnProperty(key)) {
      break;
    }

    result = result[key];
  }

  return result;
}

export default pick;
