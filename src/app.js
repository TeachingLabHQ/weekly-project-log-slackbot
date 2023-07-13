import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { SLACK_OAUTH_TOKEN } from "./constants";





const app = new App({
    signingSecret:'4f0467db4550742e8cfb92f09843004d',
    token: 'xoxb-573391640452-5456788506535-NtiIALTaIlDNpaGXEg18SJKW',
    appToken: 'xapp-1-A05DEJ10J23-5485076439345-0542ae7ba686731a5ef8cd2cf172debe3470b5b6bfab1825d3476ef0dc1c4e30',
    socketMode: true,
});

app.message('project log', async ({ message, client, say }) => {
    // say() sends a message to the channel where the event was triggered
    // console.log(message.user);
    let username = await (await app.client.users.info({token: 'xoxb-573391640452-5456788506535-NtiIALTaIlDNpaGXEg18SJKW', user: message.user})).user.profile.real_name;
    // let username = "Vee Johnson";
    await say(`Hey there <@${message.user}>! Please be patient as I'm loading the data.`);
    var totallog;
    var i = 1;
    while(i != 0){
      console.log("running");
      await say("running");
      let logArray = await fetch ("https://api.monday.com/v2", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIzNDI2ODE2OCwidWlkIjozMTI4ODQ0NCwiaWFkIjoiMjAyMy0wMi0wM1QwMDozNjoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODg4NDgxOSwicmduIjoidXNlMSJ9.oM37gRdrLf8UnnmuZIM-QWDRoT_GtgFLLyHpvnxGUtQ"
        },
        body: JSON.stringify({
            'query' : '{boards (ids: 4284585496) {items(limit: 50 page:'+ i +') {  group{title} column_values(ids:[people,date4,numbers8]) {title text} subitems { name column_values(ids:[name6,project_role,numbers]) {title text}}}}}',
            // 'variables' : JSON.stringify(req.body.vars)
        })
        }).then((res) => res.json())
        .then((result) => {return result});
        console.log(logArray);
        if(logArray.data.boards[0].items.length == 0){
          i = 0;
        }
        else{
          if(totallog == null){
            totallog=logArray;
          }
          else{
            var concatArray = totallog.data.boards[0].items.concat(logArray.data.boards[0].items);
            totallog.data.boards[0].items = concatArray;
          }
          i++;
        }
    }
   
          // console.log(JSON.stringify(totallog, null, 2));
          // console.log(totallog.data.boards[0].items.length);

          //time range(Last Sunday-Wednesday)
      var endDate = new Date();
      //range is Monday to Sunday
      var startDate = new Date(endDate);
      // endDate.setDate(endDate.getDate()-4);
      startDate.setDate(startDate.getDate()-30);
      startDate.setHours(0,0,0,0);
      endDate.setHours(0,0,0,0);

      //filter log data by time range
      var newApiDatJSON = totallog.data.boards[0].items.filter(function (a) {
          var datechecked = a.column_values.filter(function(i){ 
            return i.title == "Date"&& new Date(i.text)>=startDate && new Date(i.text)<endDate  });
        return datechecked.length==parseInt(1);
      })
      var reportData={};
      //restructure data
          newApiDatJSON.forEach(element => {
            if(element.column_values[0].text == username){
              if(!reportData[element.group.title]){
                reportData[element.group.title] = [];
              }
              var workHours={};
              workHours[element.column_values[1].text]= element.column_values[2].text
              reportData[element.group.title].push(workHours);
              
            }
           
          });

          console.log(Object.keys(reportData).length);
          console.log(Object.values(reportData));
          const reportArray = JSON.stringify(reportData, null, 2)
          if(Object.keys(reportData).length == 0){
            await say(`You don't have any direct reports as of right now.`);
          }
          else{
            await say(`You have ${Object.keys(reportData).length} direct reports, and here are their data.`);
            await say(`${reportArray}`);
          }
          
// structur paragraph
        
          
   
  });

  (async () => {
    // Start your app
    await app.start(3000);

    console.log('⚡️ Bolt app is running!');
  })();

//   await app.client.chat.postMessage({
//     token:'xoxb-573391640452-5456788506535-vj62rGaBquZJ4bEHwo08IsPc',
//     channel:'test',
//     text:'hello'
// });

