function zeroBefore(arr) {
  let a = 0,
    b = 0;
  while (a < arr.length && b < arr.length) {
    if (arr[a] == 0 || arr[b] == 0) {
      if (arr[b] == 0) {
        var t = arr[a];
        arr[a] = arr[b];
        arr[b] = t;
      }
      a++;
      b++;
    } else {
      b++;
    }
  }
  return arr;
}

function zeroBefore(arr) {
  let a = 0;
  for (var i = 1; i < arr.length; i++) {
    if (arr[a] == 0) {
      a++;
      continue;
    }
    console.log(i);
    if (arr[i] == 0) {
      var t = arr[i];
      arr[i] = arr[a];
      arr[a] = t;
      a++;
      console.log(i, a);
      console.log(arr + '');
    }
  }
  return arr;
}
