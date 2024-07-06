const express = require('express')
const request = require('request')
const app = express()
const backendInstances = [
    { host: 'http://localhost:3000', isLive: true }, //0
    { host: 'http://localhost:3001', isLive: true }, //1
    { host: 'http://localhost:3002', isLive: true }, //2
    { host: 'http://localhost:3003', isLive: true }, //3
]
let currentInstanceIndex = 0

/* Health function */
function checkHealth(instance) {
    request(instance.host + '/live', (err, res) => {
        if (!err && res.statusCode == 200) {
            instance.isLive = true
            console.log(`Instance ${instance.host} is live`)
        } else {
            instance.isLive = false
            console.log(`Instance ${instance.host} is not live`)
        }
    })
}

/* Setinterval of 5 seconds */
setInterval(() => {
    backendInstances.forEach((instance) => {
        checkHealth(instance)
    })
}, 5000)

/* Middleware */
app.use((req, res) => {
    let liveInstances = []
    backendInstances.forEach((instance) => {
        if (instance.isLive == true) {
            liveInstances.push(instance)
        }
    })

    let currInstance = liveInstances[currentInstanceIndex]
    if (currInstance) {
        req.pipe(request(currInstance.host + req.url)).pipe(res)
    }

    // Move on to the next instance  
    currentInstanceIndex = (currentInstanceIndex + 1) % liveInstances.length  
})

app.listen(5000, () => {
    console.log("Load balancer running on port 5000")
})
