function getAttribute($elm, attr, def) {
  if ($elm.dataset) {
    return $elm.dataset[attr] || def;
  }

  return $elm.getAttribute(`data-${attr}`) || def;
}

function setAttribute($elm, attr, val) {
  if ($elm.dataset) {
    $elm.dataset[attr] = val;

    return;
  }

  return $elm.setAttribute(`data-${attr}`, val);
}

export { getAttribute, setAttribute };
