const express=require("express");
const bodyParsar=require("body-parser");
const request=require("request");
const https=require("https");
const { urlToHttpOptions } = require("url");
const app=express();
app.use(express.static("public"));
app.use(bodyParsar.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/failure",function (req,res){
    res.redirect("/");
});

app.post("/",function (req,res) {
    const firstName= req.body.firstN;
    const secondName=req.body.secondN;
    const email=req.body.email;
    
    const data={
        members: [
            {
             email_address: email,
             status:"subscribed",
             merge_fields:{
                FNAME:firstName,
                LNAME:secondName,
             }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url ="https://us17.api.mailchimp.com/3.0/lists/1f53f480c3";
    const options={
        method:"POST",
        auth:"Sujan:bb2b9ca6bd4a1f0s37de7e6fdea12e0a5-us17"
    }
    const request=https.request(url, options, function(response){
        if(response.statusCode==200){res.sendFile(__dirname+"/success.html");}
            else{res.sendFile(__dirname+"/failure.html");}
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000,function(){
    console.log('Server is running at 3000');
});

//bb2b9ca6bd4a1f037de7e6fdea12e0a5-us17
//1f53f480c3