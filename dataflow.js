var p = console.log;

// data flow _js (reactive data flow negated-and universal_operation queue)
// a way of processing data which uses simple primitives
function universal_operation(a, b){
	return 1-(a&b);
}

var gate_queue = [];

function xor_circuit(in_a, in_b){

	var memory=new Array(6); // 6 undefined elements
	for(var i=0; i<memory.length; i++)
		memory[i]=9;
	memory[0]=in_a; memory[1]=in_b;

	p(memory);
	
	var gate_table=[
		[0,2,3],	// 0 acd (negated-and gate)
		[0,1,2],	// 1 abc (negated-and gate)
		[3,4,5],	// 2 deq (negated-and gate)
		[2,1,4],	// 3 cbe (negated-and gate)
		[5,1]	// 4 qb (buffer gate)
	];
	function get_gates_having_source(source){
		var gates_by_source = [
			[0,1],	// 0
			[1,3],	// 1
			[0,3],	// 2
			[2],		// 3
			[2],		// 4
			[/*4*/]		// 5
		];
		return gates_by_source[source];
	}
	//queue=[0];
	
	//	process_queue([0]);
//	process_queue([1]);
//	for(var i=0; i<5; i++){
//		console.log(memory[5]);
//		memory[1]=memory[5];
//		process_queue([1]);
//	}
//	console.log(memory[5]);

    //	var gate_q = [
//		['q', [0] ], // queue A
//		['q', [1] ], // queue B
//		//
//		['o', [5] ], // out Q
//		['q', [1] ], // queue B
//		['o', [5] ], // out Q
//		['q', [1] ], // queue B
//		['o', [5] ], // out Q
//		//
//	];

    //	var gate_list = [
//		['q', [2] ], // queue gate 2
//	];
//	];
//	var commands = gate_list;
//	var commands = gate_list;
//	commands.forEach(function(command){
//		var command_type = command[0];
//		var param1 = command[1];
//		if(command_type=='q'){
//			process_queue(param1);
//		}
//		else if(command_type=='o'){
//			param1.forEach(function(address){
//				p("out command: " + memory[address]);
//			});
//		}
//	});
    process_queue();

	function process_queue(){
	//queue.concat(queue_param);
	//input_queue=[0];
	gate_queue=[1];
	
	view('gate_queue', gate_queue);
	while(true){
		/*
		// get source from queue
		source=queue.shift();
		if(typeof source=='undefined'){
			queue = [];
			break; // exits on empty queue
		}
		*/
		
		var gate=gate_queue.shift();
		if(typeof gate=='undefined'){
			gate_queue = [];
			break; // exits on empty queue
		}

		// get gates
		//gates=get_gates_having_source(gate);
		//p('gates from source: '+gate+ ' gates: '+gates);
		
		var process_gate = function(gate_index) { // for each: gate
			p("gate index: "+ gate_index);
			var gate = gate_table[gate_index];
			p("gate wiring: "+ gate);
			//destination_before=memory[destination];
            var destination, destination_before;
			if(gate.length==2){
				var source = gate[0];
				destination = gate[1];
				destination_before=memory[destination];
				memory[destination] = memory[source];
			}else if(gate.length==3){
				var source1 = gate[0];
				var source2 = gate[1];
				destination = gate[2];
				destination_before=memory[destination];
				memory[destination]=universal_operation(memory[source1], memory[source2]);
			}
			var destination_after=memory[destination];

			if(destination==5) console.log("out from if: " + memory[destination]);
			
			if(destination_after!==destination_before) // mutation event
				// add destination to queue (as new source) on mutation event
				//queue.push(destination);
				var sourced_gates = get_gates_having_source(destination);
				gate_queue=gate_queue.concat(sourced_gates);
			
		}; // end of: process_gate
		process_gate(gate);
		
		view('gate_queue', gate_queue);
	}
	view('memory');
	}
	
	var out = memory[5];
	
	memory[1] = out; // B <= Q
	
	return out;

}
/*
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
			value=universal_operation(
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
*/
/*
p('xor_circuit implemented with queue system');
p(xor_circuit(0, 0));
p(xor_circuit(0, 1));
p(xor_circuit(1, 0));
p(xor_circuit(1, 1));
*/

p('xor_circuit with feedback implemented with queue system' );
xor_circuit(1, 0);

function view(var_name, var_value){
	if(true || ['queue'].indexOf(var_name)!=-1){
		p(var_name+': '+
			(var_value===''?global[var_name]:var_value)
		);
	}
}
