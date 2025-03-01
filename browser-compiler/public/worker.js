self.onmessage = function(event) {
    const code = event.data;
    let output = '';
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      output += args.join(' ') + '\n';
    };
    try {
      const func = new Function(code);
      const result = func();
      if (result !== undefined) {
        output += result + '\n';
      }
      self.postMessage({ output });
    } catch (error) {
      self.postMessage({ error: error.message });
    } finally {
      console.log = originalConsoleLog;
    }
  };self.onmessage = function(event) {
  const code = event.data;
  let output = '';
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    output += args.join(' ') + '\n';
  };
  try {
    const func = new Function(code);
    const result = func();
    if (result !== undefined) {
      output += result + '\n';
    }
    self.postMessage({ output });
  } catch (error) {
    self.postMessage({ error: error.message });
  } finally {
    console.log = originalConsoleLog;
  }
};