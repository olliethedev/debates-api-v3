module.exports.promisify = (func) =>
    new Promise((resolve, reject) => {
        func.then(resolve, reject);
    });