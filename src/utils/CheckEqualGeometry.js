function geometryAreEqual(geom1, geom2) {
  if (geom1.length !== geom2.length) {
    return false;
  }

  for (let i = 0; i < geom1.length; i++) {
    let subArrayMatch = false;

    for (let j = 0; j < geom2.length; j++) {
      if (arraysMatch(geom1[i], geom2[j])) {
        subArrayMatch = true;
        break;
      }
    }

    if (!subArrayMatch) {
      return false;
    }
  }

  return true;
}

function arraysMatch(geom1, geom2) {
  if (geom1.length !== geom2.length) {
    return false;
  }

  const sortedArr1 = geom1.slice().sort();
  const sortedArr2 = geom2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export default geometryAreEqual;
