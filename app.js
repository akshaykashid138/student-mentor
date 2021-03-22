const express=require("express")
const mongodb=require("mongodb")

const mongoClient=mongodb.MongoClient
const objectId=mongodb.ObjectID

const app=express()

var dbUrl="mongodb://localhost:27017"
app.use(express.json())

//getting all student to database
app.get("/students",async (req,res)=>{

    try{
        let clientInfo=await mongoClient.connect(dbUrl);
        let db=clientInfo.db("studMentor")
        let data=await db.collection("students").find().toArray();
        res.status(200).send(data)
        clientInfo.close()
    }
    catch(error){
        console.log(error)
    }   
})

//adding student to database
app.post("/createStudent",async (req,res)=>{
    try{
        let clientInfo=await mongoClient.connect(dbUrl)
        let db= clientInfo.db("studMentor");
        await db.collection("students").insertOne(req.body);
        res.status(200).json({message:"student created"})
        clientInfo.close()
    }
    catch(error){
        console.log(error)
    }
})

//getting all student to database
app.get("/mentors",async (req,res)=>{

    try{
        let clientInfo=await mongoClient.connect(dbUrl);
        let db=clientInfo.db("studMentor")
        let data=await db.collection("mentors").find().toArray();
        res.status(200).send(data)
        clientInfo.close()
    }
    catch(error){
        console.log(error)
    }   
})

//adding mentor to database
app.post("/createMentor",async (req,res)=>{
    try{
        let clientInfo=await mongoClient.connect(dbUrl)
        let db= clientInfo.db("studMentor");
        await db.collection("mentors").insertOne(req.body);
        res.status(200).json({message:"mentor created"})
        clientInfo.close()
    }
    catch(error){
        console.log(error)
    }
})


//update student
app.put('/mentors/:id/addStudents',async (req,res)=>{
    try{
        
        let clientInfo=await mongoClient.connect(dbUrl)
        let db=clientInfo.db("studMentor")

        // getting student info
        let student= await db.collection("students").findOne({ email: req.body.email } )
        if(!student) res.status(404).json({message:"student not found"})
        console.log(req.body.email)

        //check student is present or not in database
        let record= await db.collection("mentors").findOne({"students.email": req.body.email } )
        if(record) res.json({message:"student is already assigned to mentor"})

        await db.collection("mentors").findOneAndUpdate({_id:objectId(req.params.id)},{$push:{students:student}})
        res.status(200).json({message:"students added"})
        clientInfo.close()
    }
    catch(error){
        console.log(error)
    }
})

//Assign or update mentor for a particular student
app.put("/students/:id/assignMentor", async (req,res)=>{
    try{
        
        let clientInfo=await mongoClient.connect(dbUrl)
        let db=clientInfo.db("studMentor")

        let student= await db.collection("mentors").findOne({ "students._id": objectId(req.params.id )} )
        if(!student) res.status(404).json({message:"student not found"})

        let mentor={
            _id:student._id,
            name:student.name,
            gmail:student.gmail
        }

        await db.collection("students").findOneAndUpdate({_id:objectId(req.params.id)},{$set:{mentor:mentor}})
        res.status(200).json({message:"mentor assigned"})

    }
    catch(error){
        console.log(error)
    }
})

//
app.listen(4000)

