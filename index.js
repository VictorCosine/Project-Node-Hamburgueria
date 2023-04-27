const express = require("express")
const uuid = require("uuid")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())
const port = 3000

const orders = []

const checkOrderId = (request, response, next) => {
    const  { id } = request.params

    const index = orders.findIndex((fullOrder) => fullOrder.id === id)

    if (index < 0) {
        return response.status(404).json({error: "Order not found"})
    }

    request.fullOrderIndex = index
    request.fullOrderId = id

    next()

}

const methodAndUrl = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(method, url)

    next()
}

app.get('/order', methodAndUrl, (request, response) => {

      return response.json(orders)
})



app.post('/order', methodAndUrl, (request, response) => {
    const {order, clientName, price, status} = request.body

    const fullOrder = {id: uuid.v4(), order, clientName, price, status}

    orders.push(fullOrder)

    return response.status(201).json(fullOrder)


})



app.put('/order/:id', checkOrderId, methodAndUrl, (request, response) => {
    const {order, clientName, price, status} = request.body
    const index = request.fullOrderIndex
    const id = request.fullOrderId

    const updateFullOrder = {id, order, clientName, price, status}

    orders[index] = updateFullOrder

    return response.json(updateFullOrder)

})

app.delete('/order/:id', checkOrderId, methodAndUrl, (request, response) => {
    const index = request.fullOrderIndex

    orders.splice(index, 1)

    return response.status(201).json({message: "sucessfully deleted"})
})

app.get('/order/:id', checkOrderId, methodAndUrl, (request, response) => {

    const { id } = request.params
    
    const specificOrder = orders.find( order => order.id === id)


    return response.json(specificOrder)
})

app.patch('/order/:id', checkOrderId, methodAndUrl, (request, response) => {

    const index = request.fullOrderIndex

    const {id, order, clientName, price, status} = orders[index]

    const updateStatus = {id, order, clientName, price, status:"Pronto"}

    orders[index] = updateStatus

    return response.json(orders)

})




app.listen(port, () => {
    console.log(`🚀Server started on port ${port}`)
})