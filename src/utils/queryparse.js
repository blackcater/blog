export function parse(str) {
  const text = str.replace(/^\?/, '');
  const list = text.split('&');
  const query = {};

  if (!text) return {};

  list.forEach(text => {
    const [key, value] = text.split('=');

    query[key] = decodeURIComponent(value);
  });

  return query;
}

export function stringify(data) {
  const list = [];

  for (const key in data) {
    list.push(`${key}=${encodeURIComponent(`${data[key]}`)}`);
  }

  return list.join('&');
}

export default { parse, stringify };
