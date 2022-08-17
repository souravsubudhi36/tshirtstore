// for operation involving fetching data from the db or involvement of async and await 
// we can use try catch block or we can use async await and wrap that around inside bigPromise

module.exports = (func) => (req , res , next) => {
    Promise.resolve(func(req , res , next)).catch(next);
}