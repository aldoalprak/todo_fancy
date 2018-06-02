const UserModel = require("../models/user.js")
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');


class User {

	static signUp(req,res) {
		UserModel.create(req.body)
		.then(dataUser=>{
			var hash = bcrypt.hashSync(req.body.password, 10);
			dataUser.password = hash
			res.status(200).json({message:"signup succeed",dataUser})
		})
		.catch(err=>{
			res.json({message:err.message})
		})	
				
		
	}

	static show(req,res) {
		UserModel.find()
		.then(dataUsers=>{
			res.status(200).send(dataUsers)
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}

	static update(req,res) {
		bcrypt.hash(req.body.password,10,function(err,hash) {
			req.body.password = hash
			UserModel.findByIdAndUpdate(req.params.id,{$set: req.body})
				.then(dataUser=>{
					if(dataUser !== null) {
						res.status(200).send(dataUser)	
					}else{
						res.json({message:"id not found"})
					}
				})
				.catch(err=>{
					res.json({message:err.message})
				})
		})
	}

	static delete(req,res) {
		UserModel.findByIdAndDelete(req.params.id)
		.then(dataUser=>{
			if(dataUser !== null) {
				res.status(200).send(dataUser)	
			}else{
				res.json({message:"id not found"})
			}
		})
		.catch(err=>{
			res.json({message:err.message})
		})
	}

	static signIn(req,res) {
		UserModel.findOne({username:req.body.username})
		.then(dataUser=>{
			if(dataUser !== null) {
				bcrypt.compare(req.body.password,dataUser.password,function(err,response) {
					if(response) {
						var token = jwt.sign({ userId: dataUser._id }, process.env.JWT_SALT);
						res.status(200).json({message:"signin succeed",token})
					}else{
						res.status(400).json({message:"incorrect password/username"})	
					}
				})
			}else{
				res.status(400).json({message:"incorrect password/username"})
			}
			
		})
		.catch(err=>{
			res.status(500).json({message:err.message})
		})
	}
}

module.exports = User