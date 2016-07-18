// dataflow_js (reactive dataflow nand operation queue)
// a way of processing data which uses simple primitives
function nand_operation(a, b){
  return !(a&&b);
}

memory=[false, false, false];
operations=[[1], [0,2], []];
queue=[0];

log('queue');
while(true){
  // get source from queue
  source=queue.shift();
  if(typeof source=='undefined') break; // exits on empty queue

  // get destination
  destinations=operations[source];
  log('destinations');
  
  destinations.forEach(destination => { // for each destination
    log('destination', destination);

    log('memory');
    destination_before=memory[destination];
    // operation from source to destination
    memory[destination]=nand_operation(memory[destination], memory[source]);
    destination_after=memory[destination];

    if(destination_after!=destination_before) // mutation event
      // add destination to queue (as new source) on mutation event
      queue.push(destination);
  })
  log('queue');
}
log('memory');

function log(var_name, var_value=''){
  if(['queue'].indexOf(var_name)!=-1){
    console.log(var_name+': '+
      (var_value===''?global[var_name]:var_value)
    );
  }
}
