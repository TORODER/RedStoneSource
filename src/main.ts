import express from "express";
import { Car } from "./class";
import bodyParser from "body-parser";

const openHttpPort= 6789;

const carElem = new Car();

const app=express();

const reqMsgList:[number,number][]=[[0,0]];


app.listen(openHttpPort,"0.0.0.0",()=>console.log("http server run .... "));

app.post("/conCarRun",bodyParser.json(),(req,res)=>{
    console.log(
        "recv msg",req.body
    );
    reqMsgList.push(req.body);
});
app.get("/test",bodyParser.json(),(req,res)=>{
    console.log(
        "recv test hello"
    );
    res.send("Hello");
});
    
(async () => {
    while (true) {
        const shiftRes=reqMsgList.shift();
        if(shiftRes){
            await carElem.setState(shiftRes);
        }
        await new Promise((res) => setTimeout(res, 80));
    }
  
})().catch(console.error);