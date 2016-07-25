// dataflow_js (reactive dataflow nand operation queue)
// a way of processing data which uses simple primitives
function nand_operation(a, b){
	var c = 1-(a&b);
	return c;
}

function xor_circuit(in_a, in_b){

	memory=[0, 0, 0, 0, 0, 0];
	memory[0]=in_a; memory[1]=in_b;
	
	var nands_table=[
		[0,2,3], // acd
		[0,1,2], // abc
		[3,4,5], // deq
		[2,1,4], // cbe
		[5,5,1], // qqb (special)
	];
	function get_nands_having_source(source){
		var nands_by_source = [
			[0,1],
			[1,3],
			[0,3],
			[2],
			[2],
			[],
		];
		return nands_by_source[source];
	}
	//queue=[0];
	//process_queue([0]);
	//process_queue([1]);
	var gate_q = [
	['q', [0] ], // queue
	['q', [1] ], // queue
	['o', [5] ], // out
	];
	
	processes = gate_q;
	
	processes.forEach(function(process){
		var command = process[0];
		var params = process[1];
		if(command=='q')
			process_queue(params);
		else if(command=='o')
			params.forEach(function(address){
				console.log(memory[address]);
			});
	});
	
	function process_queue(queue){
	
	view('queue');
	while(true){
		// get source from queue
		source=queue.shift();
		if(typeof source=='undefined') break; // exits on empty queue

		// get nands
		nands=get_nands_having_source(source);
		view('nands');
		
		nands.forEach(function(nand_index) { // for each nand
			var nand = nands_table[nand_index];
			var source1 = nand[0];
			var source2 = nand[1];
			var destination = nand[2];
			
			view('destination', destination);

			view('memory');
			destination_before=memory[destination];
			// operation from source to destination
			
			//memory[destination]=nand_operation(memory[destination], memory[source]);
			memory[destination]=nand_operation(memory[source1], memory[source2]);
			
			destination_after=memory[destination];

			if(destination_after!=destination_before) // mutation event
				// add destination to queue (as new source) on mutation event
				queue.push(destination);
		});
		view('queue');
	}
	view('memory');
	}
	
	//var out = memory[5];
	//return out;

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

console.log('xor_circuit with queue system');
xor_circuit(0, 0);
xor_circuit(0, 1);
xor_circuit(1, 0);
xor_circuit(1, 1);

//console.log(xor_circuit_with_feedback(1, 1));

function view(var_name, var_value=''){
	if([].indexOf(var_name)!=-1){
		console.log(var_name+': '+
			(var_value===''?global[var_name]:var_value)
		);
	}
}
