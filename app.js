
const express = require("express");
const path=require('path');
const mongoose=require('mongoose')
const bodyParser = require("body-parser");
// const Customer =require('./models/customer');

const app = express();
const ejsMate=require('ejs-mate');
const ejs =require("ejs");
const { url } = require("inspector");
app.use(express.static("public"));
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended:true}));
mongoose.connect("mongodb+srv://khushi:5050217k@cluster0.w2rxzni.mongodb.net/bankDB",{useNewUrlParser:true});

// mongoose.connect("mongodb://localhost:27017/bankDB",{useNewUrlParser:true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connected to mongodb atlas");
});

const transactionSchema= new mongoose.Schema({
  transactionType:
  {
      type:String,
},
transactiondetails:{
transferredFrom:{
  type:String,
  default:"",
},
transferredTo:{
  type:String,
  default:"",
},
amount:{
type:Number,
default:0,
},
balance:{
  type:Number,
  default:0,
},
},
},{
  timestamps:true,
}
);
const Transaction=mongoose.model('Transaction',transactionSchema);

const customerSchema=new mongoose.Schema({
  CustomerName: {
     type: String,
     required:[true,"Please provide a customer name"],
  },
  AccountNumber: {
     type:String,
     required:true,
     },
     image:{
type:String,
required:true,
     },
  AccountType:{
     type:String,
     required:[],
     },
     dateOfBirth: {
      type: Date,
      required: true, 
     },  
  citizenship: String,

  Email:{
     type:String,
     required:[true,"Please provide an email id"],
     },
     phoneNumber: {
      type: String,
      required: true,
    },
    
     transactions:[transactionSchema],


     CurrentBalance:{
     type:Number,
 required:[true,"Please provide a valid balance"],
 default:0,
 min:0,
 },
 
 },
 {
     timestamps:true,
 }
 );



const Customr=mongoose.model('Customr',customerSchema);
Customr.insertMany=[
  {
    CustomerName:'Khushi Gangwar',
    AccountNumber:'UN1234',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'khushi@gmail.com',
    CurrentBalance:10000,
    timestamps:true,
    image: "public\images\female.png",
    phoneNumber:"555-555-1234"

  },
  {
    CustomerName:'Riya',
    AccountNumber: 'UN2875',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'riyas@gmail.com',
    CurrentBalance:1789,
    timestamps:true,
    image: "https://source.unsplash.com/random/900×700/?fruit",
    phoneNumber:  "555-555-2345",

  },{
    CustomerName:'Laksh',
    AccountNumber: 'UN5210',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'lakshg@gmail.com',
    CurrentBalance:1789,
    timestamps:true,
    image: "https://source.unsplash.com/random/900×700/?fruit",
    phoneNumber:  "555-555-3456",



  },
  {
    CustomerName:'Sarthak',
    AccountNumber:' UN9472',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'sarthaaks@gmail.com',
    CurrentBalance:12067,
        image: "customer.png",
        phoneNumber:  "555-555-4567",


  },
  {
    CustomerName:'Manisha',
    AccountNumber: 'UN0039',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'manu@gmail.com',
    CurrentBalance:17640,
        image: "customer.png",
        phoneNumber:  "555-555-5678",


  },{
    CustomerName:'Rahul',
    AccountNumber: 'UN7052',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'rahuls@gmail.com',
    CurrentBalance:5021,
        image: "customer.png",
        phoneNumber:  "555-555-6789",


  },{
    CustomerName:'Akash',
    AccountNumber:'UN1125',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'akash@gmail.com',
    CurrentBalance:2298,
        image: "customer.png",
        phoneNumber:  "555-555-7890",


  },{
    CustomerName:'Saurav',
    AccountNumber:' UN2986',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'saurav@gmail.com',
    CurrentBalance:1789,
        image: "customer.png",
        phoneNumber:  "555-555-8901",


  },{
    CustomerName:'Sushi',
    AccountNumber:' UN4005',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'sush@gmail.com',
    CurrentBalance:4049,
        image: "customer.png",
        phoneNumber:  "555-555-9012",


  },{
    CustomerName:'Om',
    AccountNumber:' UN6732',
    AccountType:'Saving',
    citizenship:'Indian',
    Email:'om@gmail.com',
    CurrentBalance:15089,
        image: "customer.png",
        phoneNumber:  "555-555-0123",


  }
    ];
  
    
app.get("/", function(req, res){
  res.render('customers/home')
});

app.get("/customers",async function(req,res){
  const customrs=await Customr.find({});
  res.render('customers/customers',{customrs});
})


app.get("/customers/:id",async function(req,res){
  const customers=await Customr.findById(req.params.id)
  res.render('customers/show',{customers});

})



app.get("/transfer",async function(req,res){
  const transfermoney=await Customr.find({});
  res.render('customers/transfer',{transfermoney});
})


app.get("/transfersuccessfull",async function(req,res)
{
  const sender=req.body.senderemail
  const reciever=req.body.recieveremail
  const money= req.body.amount
  Customr.findOne({Email:sender},(err,foundsender)=>{
    if(err){
      res.render('failed',{msg:'sender not found'})
    }
    else{
      if(foundsender){
        Customr.findOne({Email:reciever},(err,foundreciever)=>
        {
          if(err){
            res.render('failed',{msg:'reciever not found'})
          }
          else{
            if(foundreciever){
              if(money > foundsender.CurrentBalance){
                res.render("failed",{msg:'sender doesnt have enough balance'})
              }else{
                const SenderAmount=foundsender.CurrentBalance-money;
                Customr.updateOne({Email:sender},{CurrentBalance:SenderAmount},(err)=>{
                  if(err){
                    res.redirect("failed")
                  }else{
                    console.log("Update Successfully");
                  }
                  const RecieverAmount=foundreciever.CurrentBalance + Number(money);
                  Customr.updateOne({Email:reciever},{CurrentBalance:RecieverAmount},(err)=>{
                    if(err){
                      res.redirect("failed",{msg:'transaction failed'})
                    }else{
                      console.log("Update Successfully");
                 
                    }

                  })
                })
              }
            }
          }
        })
      }
    }
    Transaction.insertMany({
      transferredFrom:sender,
      transferredTo:reciever,
      amount:money
    },(err)=>{
      if(err){
        res.render("failed",{msg:"transaction failed"})
      }else{
        console.log("table updated");
        res.render('customers/transfersuccessfull',{senderEmail:sender,recieverEmail:reciever ,amount:money});

      }
    })
  })

})

// app.get("/transfersuccessfull",async(req,res)=>{
//   Customr.findOne({},(err,customer)=>{
//      res.render("customers/transfersuccessfull" ,{customer});
//    })
//    })
 



app.post("/transfersuccessfull",async function(req,res)
{
  const sender=req.body.senderemail
  const reciever=req.body.recieveremail
  const money= req.body.amount
  Customr.findOne({Email:sender},(err,foundsender)=>{
    if(err){
      res.render('failed',{msg:'sender not found'})
    }
    else{
      if(foundsender){
        Customr.findOne({Email:reciever},(err,foundreciever)=>
        {
          if(err){
            res.render('failed',{msg:'reciever not found'})
          }
          else{
            if(foundreciever){
              if(money > foundsender.CurrentBalance){
                res.render("failed",{msg:'sender doesnt have enough balance'})
              }else{
                const SenderAmount=foundsender.CurrentBalance-money;
                Customr.updateOne({Email:sender},{CurrentBalance:SenderAmount},(err)=>{
                  if(err){
                    res.redirect("failed")
                  }else{
                    console.log("Update Successfully");
                  }
                  const RecieverAmount=foundreciever.CurrentBalance + Number(money);
                  Customr.updateOne({Email:reciever},{CurrentBalance:RecieverAmount},(err)=>{
                    if(err){
                      res.redirect("failed",{msg:'transaction failed'})
                    }else{
                      console.log("Update Successfully");
                      Transaction.insertMany({
                        transferredFrom:sender,
                        transferredTo:reciever,
                        amount:money
                      },(err)=>{
                        if(err){
                          res.render("failed",{msg:"transaction failed"})
                        }else{
                          console.log("table updated");
                          
                        }
                      })
                    }

                  })
                })
              }
            }
          }
        })
      }
    }
    res.render('customers/transfersuccessfull',{senderEmail:sender,recieverEmail:reciever ,amount:money});

  })

})



app.listen(3000, function(){
  console.log("Server started on port 3000.");
});


 
