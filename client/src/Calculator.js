import React from 'react';
import update from 'react-addons-update';
import ClientFetch from './utils/ClientFetch';

class Calculator extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
		      input: {
		        valueA: "",
		       	valueB: "",
		       	operation: ""
		      },
		      result: ""
		    };
		this.handleInputChange = this.handleInputChange.bind(this);
    	this.onSumbit = this.onSumbit.bind(this);
    	this.getAPIPath = this.getAPIPath.bind(this);
    	this.inputValidation = this.inputValidation.bind(this);

	}

	handleInputChange(event)
	{
		var newState = {input:{}};
		newState.input[event.target.name] = {$set: event.target.value};

		this.setState(update(this.state, newState));
	}

	getAPIPath()
	{
		var apiPath = "";
		switch(this.state.input.operation)
		{
			case "ADD":
				apiPath = "api_get_add_result";
				break;
			case "SUB":
				apiPath = "api_get_sub_result";
				break;
			case "MUL":
				apiPath = "api_get_mul_result";
				break;
			case "DIV":
				apiPath = "api_get_div_result";
				break;
			default:
				apiPath = "";
		}
		return apiPath;
	}

	inputValidation()
	{
		var valueA = this.state.input.valueA;
		var valueB = this.state.input.valueB;
		var operation = this.state.input.operation;
		if(valueA === "")
		{
			alert("Must provide a number A");
			return false;
		}
		if(valueB === "")
		{
			alert("Must provide a number B");
			return false;
		}
		if(operation==="")
		{
			alert("Must provide an operation");
			return false;
		}
		return true;
	}

	onSumbit(e)
	{
		e.preventDefault();
		console.log(this.state.input);
		
		if(!this.inputValidation())
		{
			return false;
		}
		// fill all hidden values
		var params = {
			valueA: this.state.input.valueA,
			valueB: this.state.input.valueB
		};
		
		var clientFetch = new ClientFetch();
		var apiPath = this.getAPIPath();
		clientFetch.fetch(apiPath + '?a=' + this.state.input.valueA + '&b=' + this.state.input.valueB, {method: "GET"})
			.then(res => {
		        var newState = {};
				newState["result"] = {$set: res.result};

				this.setState(update(this.state, newState));
		        return true;
      		})
      		.catch(error => {
      			throw error;
      		});
	}


	render()
	{
		return(
			<div>
				<form id="calcForm">
					<span>Please input the first number:</span><input type="number" name="valueA" onChange={this.handleInputChange} required="required"/><br/>
					<span>Please input the second number:</span><input type="number" name="valueB" onChange={this.handleInputChange} required="required"/><br/>
					<div>
					    <input type="radio" id="operation1" name="operation" value="ADD" onChange={this.handleInputChange} />
					    <label>Addition</label>

					    <input type="radio" id="operation2" name="operation" value="SUB" onChange={this.handleInputChange} />
					    <label>Subtraction</label>

					    <input type="radio" id="operation3" name="operation" value="MUL" onChange={this.handleInputChange} />
					    <label>Multiplication</label>

					    <input type="radio" id="operation3" name="operation" value="DIV" onChange={this.handleInputChange} />
					    <label>Division</label>
					</div>
					
			        <button onClick={this.onSumbit}>Calculate</button>
				</form>
				<div>
					<span id="calcResult">{this.state.result}</span>
				</div>
			</div>
			
		)
	}
}

export default Calculator;
