let preload = {};

export function setPreload(next) {
  preload = next || {};
}

export function getPreload() {
  return preload || {};
}
