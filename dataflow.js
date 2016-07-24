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

function xor_circuit_with_feedback(in_a, in_b){
	var memory_array=[];
	for(var i=0; i<10; i++) memory_array.push(0);

	memory_array[0]=in_a;
	memory_array[1]=in_b;
	
	var mapping={};
	mapping.a=[0, 'in_a'];
	mapping.b=[1, 'in_b'];
	mapping.c=[2, 'a', 'b'];
	mapping.d=[3, 'a', 'c'];
	mapping.e=[4, 'b', 'c'];
	mapping.q=[5, 'd', 'e'];

	var update_list={};
	update_list.in_a=['c', 'd', 'q'];
	update_list.in_b=['c', 'e', 'q'];

	function update(item){
		var size = mapping[item].length;
		var value;
		if(size==3){
			value=nand_operation(
				update(mapping[item][1]),
				update(mapping[item][2])
			);
		}else{
			value=memory_array[mapping[item][0]];
		}
		memory_array[mapping[item][0]]=value;
		return value;
	}

	function update_from_list(list){
		for(var i=0; i<list.length; i++){
			var current_update=list[i];
			update(current_update);
		}
	}
	
	update_from_list(update_list.in_a);
	update_from_list(update_list.in_b);
	while(true){
		
		var q = memory_array[mapping.q[0]];
		console.log(q);
		
		in_b = q;
		
		//memory_array[0]=in_a;
		//update_from_list(update_list.in_a);
		memory_array[1]=in_b;
		update_from_list(update_list.in_b);
	}
	//return q;
}

/*
console.log(xor_circuit(0, 0));
console.log(xor_circuit(0, 1));
console.log(xor_circuit(1, 0));
console.log(xor_circuit(1, 1));
*/
console.log(xor_circuit_with_feedback(1, 1));

function view(var_name, var_value=''){
	if([].indexOf(var_name)!=-1){
		console.log(var_name+': '+
			(var_value===''?global[var_name]:var_value)
		);
	}
}
