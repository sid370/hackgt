App = {
    loading: false,
    contracts: {},
    batchid : 0,
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0];
      console.log(App.account);
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const meditran = await $.getJSON('Meditran.json')
      App.contracts.Meditran = TruffleContract(meditran)
      App.contracts.Meditran.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.meditran = await App.contracts.Meditran.deployed()
      console.log("Contract Loaded")
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      App.batchid = 0;
      await App.renderTransactions()
      // await App.renderTransaction()
  
      // Update loading state
      App.setLoading(false)
      console.log("App rendered")
    },
    
    renderTransactions : async() => {
        console.log("Rendering Application")
        const transactionCount = await App.meditran.transactionCount()
        const $taskTemplate = $('.taskTemplate')
        // Render out each task with a new task template
        for (var i = 1; i <= transactionCount; i++) {
            // Fetch the task data from the blockchain
            const task = await App.meditran.transactions(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1].toNumber()
            const taskCompleted = task[2]

            // console.log(taskId)
            // console.log(taskContent)
            // console.log(task[4].toNumber())
            // console.log(taskId,taskContent,taskCompleted);

            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskCompleted)
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            // .prop('checked', taskCompleted)
                            // .on('click', App.toggleCompleted)
      
            // Put the task in the correct list
            $('#taskList').append($newTaskTemplate)
      
            // Show the task
            $newTaskTemplate.show()
        }

        console.log("App rendered  ll")
    },

    renderTransaction : async () => {
      console.log("Rendering Transaction Application")
      batchid = App.batchid;
      console.log("batch id : ", App.batchid)
      const transactionCount = await App.meditran.transactionCount()
      const $taskTemplate = $('.batch')
      // Render out each task with a new task template
      for (var i = 1; i <= transactionCount; i++) {
          // Fetch the task data from the blockchain
          // console.log(i)
          const task = await App.meditran.transactions(i)
          const taskId = task[0].toNumber()
          const taskContent = task[1].toNumber()
          console.log(123)
          console.log(taskContent)
          if(taskContent === batchid){
            console.log("same batch")
            const taskCompleted = task[2]

            // console.log(taskId)
            // console.log(taskContent)
            // console.log(task[4].toNumber())
            // console.log(taskId,taskContent,taskCompleted);

            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskCompleted)
            // $newTaskTemplate.find('input')
            //                 .prop('name', taskId)
                            // .prop('checked', taskCompleted)
                            // .on('click', App.toggleCompleted)
      
            // Put the task in the correct list
            $('#taskList').append($newTaskTemplate)
      
            // Show the task
            $newTaskTemplate.show()
          }
          
      }

      console.log("App rendered  ll")
  },

    createTransaction: async () => {
        App.setLoading(true)
        const batch = $('#batch_id').val()
        const hash = $('#hash').val()
        const value = $('#value').val()
        const exp = $('#expiration').val()
        // const timestamp = $('#timestamp').val()
        console.log("Loading Transation into the blockchain")
        const tran = await App.meditran.createTransaction(batch,hash,value,exp)
        console.log(tran)
        console.log("Loaded into the blockchain")
        window.location.reload()
    },

    getTransactionHash : async () => {
        App.setLoading(true)
        const batch = $('#batch_id').val()
        console.log(batch)
        console.log("Rendering the batch application")
        App.batchid = batch;
        console.log(App.batchid);
        // await App.renderTransaction()

        console.log("Rendering Transaction Application")
        batchid = App.batchid;
        console.log("batch id : ", batchid)
        const transactionCount = await App.meditran.transactionCount()
        const $taskTemplate = $('.batch')
        // Render out each task with a new task template
        // window.location.reload()
        for (var i = 1; i <= transactionCount; i++) {
            // Fetch the task data from the blockchain
            console.log(i)
            const task = await App.meditran.transactions(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1].toNumber()
            // console.log(123)
            console.log("Content: ",taskContent)
            // console.log(taskContent == batchid)
            if(taskContent == batchid){
              console.log("same batch")
              const taskCompleted = task[2]
              // const fs = require("fs");
              fs.open("test.txt", "w+", (err,fd) =>  {
                if(fd){
                  console.log("File opened");
                }
              });

              fs.writeFile("test.txt", taskCompleted.toString(), (err,done) => {
                console.log("Written to the file!");
              })

              // console.log(taskId)
              // console.log(taskContent)
              // console.log(task[4].toNumber())
              // console.log(taskId,taskContent,taskCompleted);

              // const $newTaskTemplate = $taskTemplate.clone()
              // $('.content').html(taskCompleted)
              // // $newTaskTemplate.find('.content').html(taskCompleted)
              // // $newTaskTemplate.find('input')
              // //                 .prop('name', taskId)
              //                 // .prop('checked', taskCompleted)
              //                 // .on('click', App.toggleCompleted)
        
              // // Put the task in the correct list
              // $('#taskList').append($newTaskTemplate)
        
              // // Show the task
              // $newTaskTemplate.show()
            }
            
        }

        console.log("App rendered  ll")


        // await App.renderTransaction(batchid)
        
        // const arr = await App.meditran.getTransaction();
        // console.log(arr.data);
        // const n = new Promise((resolve,reject) => {
        //   const arr = App.meditran.getTransaction()
        //   return arr;
        // })

        // console.log(n)

        // window.location.reload()
        // const transactionCount = await App.meditran.transactionCount()
        // const count = transactionCount.toNumber();
        // console.log(count)
        
        
    },


  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })
