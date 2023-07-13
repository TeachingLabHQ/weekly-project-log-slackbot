// const { App } = require('@slack/bolt');
// const axios = require('axios');


// const app = new App({
//     signingSecret:'4f0467db4550742e8cfb92f09843004d',
//     token: 'xoxb-573391640452-5456788506535-vj62rGaBquZJ4bEHwo08IsPc'
// });

// //Start Handler

// (async () =>{
//     await app.start(12000);

//     app.message();
//     console.log("it is running");
// })();

require = require("esm")(module/*,options*/)
module.exports = require("./app.js")
