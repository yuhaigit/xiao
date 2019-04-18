const toPromise = fn => {
  // 这个api不是一个方法，直接返回该api
  if (typeof fn !== 'function') return fn;
  return (args = {}) => {
    // 这个api的参数不是对象，直接返回方法（参数）
    if (typeof args !== 'object') {
      return fn(args);
    }
    // 这个api是有sussess和fail这样子的回调函数 就有promise方法
    return new Promise((resolve, reject) => {
      args.success = resolve;
      args.fail = reject;
      fn(args);
    });
  };
};
export default Object.keys(wx).reduce((o, name) => {
  o[name] = toPromise(wx[name]);
  return o;
}, {});
