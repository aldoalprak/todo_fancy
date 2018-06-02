const TodoModel = require("../models/todo.js")
var jwt = require('jsonwebtoken')


class Todo {

	static add(req,res) {
		TodoModel.create(req.body)
		.then(result=>{
			res.status(200).json({message:"task created"})
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}

	static show(req,res) {
		var decoded = jwt.verify(req.headers.token,process.env.JWT_SALT)
		TodoModel.find({ userId : decoded.userId})
		.then(dataTodos=>{
			res.status(200).send(dataTodos)
			
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}

	static update(req,res) {
		var decoded = jwt.verify(req.headers.token,process.env.JWT_SALT)
		TodoModel.findById(req.params.id)
		.then(dataTodo=>{
			if(dataTodo !== null) {
				if(dataTodo.userId == decoded.userId) {
					TodoModel.update({$set: req.body})
					.then(result=>{
						res.status(200).json({message:"todo updated",result})	
					})
					.catch(err=>{
						res.send(err.message)
					})	
				}else{
					res.json({message:"you don't have authorized to edit this todo!!!"})
				}
					
			}else{
				res.status(300).json({message:"id not found"})
			}
			
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}

	static delete(req,res) {
		var decoded = jwt.verify(req.headers.token,process.env.JWT_SALT)
		TodoModel.findById(req.params.id)
		.then(dataTodo=>{
			if(dataTodo !== null) {
				if(dataTodo.userId == decoded.userId) {
					TodoModel.deleteOne({_id:req.params.id})
					.then(result=>{
						res.status(200).json({message:"todo deleted",result})	
					})
						
				}else{
					res.json({message:"you don't have authorized to delete this todo"})
				}
					
			}else{
				res.status(300).json({message:"id not found"})
			}
				
			
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}
	
}

module.exports = Todo