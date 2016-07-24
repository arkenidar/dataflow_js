// dataflow_js (reactive dataflow nand operation queue)
// a way of processing data which uses simple primitives
function nand_operation(a, b){
	var c = 1-(a&b);
	return c;
}

function circuit(in_a, in_b){

	memory=[0, 0, 0];
	memory[0]=in_a; memory[1]=in_b;
	operations=[[1], [2], []];
	queue=[0];

	view('queue');
	while(true){
		// get source from queue
		source=queue.shift();
		if(typeof source=='undefined') break; // exits on empty queue

		// get destination
		destinations=operations[source];
		view('destinations');
		
		destinations.forEach(function(destination) { // for each destination
			view('destination', destination);

			view('memory');
			destination_before=memory[destination];
			// operation from source to destination
			memory[destination]=nand_operation(memory[destination], memory[source]);
			destination_after=memory[destination];

			if(destination_after!=destination_before) // mutation event
				// add destination to queue (as new source) on mutation event
				queue.push(destination);
		});
		view('queue');
	}
	view('memory');
	return memory[2];

}
console.log(circuit(0, 0));
console.log(circuit(0, 1));
console.log(circuit(1, 0));
console.log(circuit(1, 1));

function view(var_name, var_value=''){
	if([].indexOf(var_name)!=-1){
		console.log(var_name+': '+
			(var_value===''?global[var_name]:var_value)
		);
	}
}
