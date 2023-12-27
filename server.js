const singleton = require('./utils/singleton');
// const Cluster = require('cluster');
// const OS = require('os');

module.exports = {
    init: (app) => {
        // const numCPU = OS.cpus().length;

        const isConnected = singleton.instanceDatabase().connected();

        console.log('connect', isConnected);
        if(isConnected) {

            // if(Cluster.isMaster) {
            //     for(let i = 0; i < numCPU; i++) {
            //         Cluster.fork();
            //     }
    
            //     Cluster.on('exit', (worker, code, signal) => {
            //         Cluster.fork();
            //     });
                
            // } else {
                const port = process.env.PORT || 3000;
    
                app.listen(port, () => {
                    console.log(`Port ${port}: Process ${process.pid}`);
                })
            // }
        } 
    }
};

