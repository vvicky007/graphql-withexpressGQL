var app = require('express')()
const expressGraphQL =  require('express-graphql').graphqlHTTP
const schema = require('./schemas/userSchema')
app.use('/graphql',expressGraphQL({
  schema,
  graphiql:true
}))
app.listen('4000',()=>{
  console.log('listening on 4000')
})