
console.log('UI:')


depp.require(['poly', 'DOM', 'xterm'], function() {
   console.log('ready')
   setupT()
}) 

// https://dev.to/davidk01/ptyjs--xtermjs--shell-in-your-browser-1f9c
function setupT() {
   window.term = new Terminal({cursorStyle: 'bar', cursorBlink: true})

   const fitAddon = new FitAddon()
   term.loadAddon(fitAddon)

   term.open(document.getElementById('terminal'))

   // ws ////////////////////
   const url = 'ws://localhost:8080'
   const socket = new WebSocket(url)

   const attachAddon = new AttachAddon(socket)
   term.loadAddon(attachAddon)

   socket.onopen = function(e) {
      console.log(e)
   }

   socket.onerror = function(error) {
      console.log(error)
   }

   socket.onclose = function(e) {
      console.log('closed', e)
   }
   
}//()


// sets the states of the view, such as buttons, click enabled/grayed and others
function pushUIState() {

}

// var vm = new ViewModel()
