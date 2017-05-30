const env = process.env.NODE_ENV;

var storage = {};

if (env === 'development') {
  storage.set = function (items) {
    var key, value;
    for (let k in items) {
      key = k;
      value = items[k];
      if (typeof value === 'object') {
        try {
          value = JSON.stringify(value);
        } catch (e) {
          console.log(e);
        }
      }
      localStorage.setItem(key, value)
    }
  };

  storage.get = function (key) {
    if (typeof key === 'string') {
      var value = localStorage.getItem(key);
      try {
        value = JSON.parse(value)
      } catch (e) {
        console.log(e)
      }

      return Promise.resolve(value);
    }
  };
}

if (env === 'production') {
  storage.set = function (items) {
    chrome.storage.sync.set(items);
  };

  storage.get = function (key) {
    return new Promise(function (resolve) {
      chrome.storage.sync.get(key, function (rs) {
        resolve(rs[key])
      });
    })
  }
}

export default storage;
