var graphql = require('graphql')
const {v4} = require("uuid")

const {GraphQLObjectType,GraphQLBoolean,GraphQLInt,GraphQLString,GraphQLSchema} = graphql
let users = [{
  id:"1",
  firstName:'Naruto',
  lastName:'Uzumaki',
  age:20,
  companyId:"1"
},{
  id:"2",
  firstName:'Sasuke',
  lastName:'Uchiha',
  age:21,
  companyId:"2"
},{
  id:"3",
  firstName:'Hinata',
  lastName:'Hyuga',
  age:20,
  companyId:"2"
}]
let companies = [{
  id:"1",
  name:"Google",
  description:"Serach"
},{
  id:"2",
  name:"Facebook",
  description:"Suckerberg"
}]
const companyType = new GraphQLObjectType({
  name:'Company',
  fields:()=>({
    id:{type:GraphQLString},
    name:{type:GraphQLString},
    description:{type:GraphQLString},
    users:{
      type: new graphql.GraphQLList(userType),
      resolve:(parentValue)=>{
        return users.filter((u)=>u.companyId===parentValue.id)
      
    }
  }
  })
})
const userType = new GraphQLObjectType({
  name:'User',
  fields:()=>({
    firstName:{type:GraphQLString},
    id:{type:GraphQLString},
    lastName:{type:GraphQLString},
    age:{type:GraphQLInt},
    company:{
      type:companyType,
      resolve:(parentValue,args)=>{
        return companies.filter((c)=>c.id===parentValue.companyId)[0]
      }
    }
  })

})

const rootQuery = new GraphQLObjectType({
  name:'rootQueryType',
  fields:{
    user:{
      type:userType,
      args:{id:{type:GraphQLString}},
      resolve(parentValue,args){
        return  users.filter((user)=>{
          return user.id===args.id
        })[0]
      }
    },
    company:{
      type:companyType,
      args:{id:{type:GraphQLString}},
      resolve(parentValue,args){
        return companies.filter((c)=>c.id===args.id)[0]
      }
    }
  }

})
const mutation = new GraphQLObjectType({
  name:'mutation',
  fields:{
    addUser:{
      type:new graphql.GraphQLList(userType),
      args:{
        firstName:{type:new graphql.GraphQLNonNull(GraphQLString)},
        lastName:{type:new graphql.GraphQLNonNull(GraphQLString)},
        age:{type:new graphql.GraphQLNonNull(GraphQLInt)},
        companyId:{type:new graphql.GraphQLNonNull(GraphQLString)}
      },
      resolve:(parentValue,{firstName,lastName,age,companyId})=>{
        users = [...users, {id:v4(),firstName,lastName,age,companyId}]
        return users
      }
    },
    deleteUser:{
      type:new graphql.GraphQLList(userType),
      args:{
        id :{type:new graphql.GraphQLNonNull(GraphQLString)}
      },
      resolve:(parentValue,{id})=>{
        users = users.filter((u)=>u.id!==id)
        return users
      }
    }
  }
})
module.exports = new GraphQLSchema({
  query:rootQuery,
  mutation
})