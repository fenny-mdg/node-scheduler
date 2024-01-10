export const getVMScript = () => {
  return `
  const vm = require('vm');
  const fsPromises = require('fs/promises');
  
  async function getScriptCode(path) {
    try {
      const code = await fsPromises.readFile(path, 'utf-8');
  

      return code;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  (async () => {
    const code = await getScriptCode('./script.js');
    console.time('🕦 VM execution time');
  
    await vm.runInNewContext(code, {require, console});
  
    console.timeEnd('🕦 VM execution time');
  })();
  `;
};
