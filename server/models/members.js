const mongoose=require('mongoose')

const singleSchema=new mongoose.Schema({
    memberId:{type:String,unique:true},
    name:{type:String},
    phone:{type:String,required:true},
    designation:{type:String},
    status:Boolean,
    password:String,
})

const memberSchema=new mongoose.Schema(({
    businessId:{type: mongoose.Schema.Types.ObjectId},
    members:[singleSchema]
}))

module.exports=mongoose.model("Members",memberSchema)