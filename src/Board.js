import React from 'react';
import './App.css';
import Note from './Note'

var Board = React.createClass({
	propTypes: {
		count: function(props, propName) {
			if(typeof props[propName] !== 'number'){
				return new Error('The count must be a number');
			}
			if(props[propName] > 100) {
				return new Error('Creating ' + props[propName] + ' notes is too many');
			}
		}
	},
	getInitialState(){
		return {
			notes: []
		}
	},
	nextId(){
		this.uniqueID = this.uniqueID || 0
		return this.uniqueID++;
	},
	componentWillMount(){
		if (this.props.count){
			var url = `http://baconipsum.com/api/?type=all-meat&sentences=${this.props.count}`
			fetch(url)
				.then(results => results.json())
				.then(array => array[0])
				.then(text => text.split('. '))
				.then(array => array.forEach(
						sentence => this.add(sentence)))
				.catch(function(err){
					console.log('Didnt connect to the API', err);
				})
		}
	},
	add (text){
		var notes = [
			...this.state.notes,
			{
				id: this.nextId(),
				note: text
			}
		]
		this.setState({notes});
	},
	update(newText, id){
		var notes = this.state.notes.map(
			note => (note.id !== id) ? note :
			{
				...note,
				note: newText
			}
		)
		this.setState({notes});
	},
	remove (id){
		var notes = this.state.notes.filter(note => note.id !== id);
		this.setState({notes});
	},
	eachNote (note){
		return <Note key = {note.id}
									id = {note.id}
									onChange = {this.update}
									onRemove = {this.remove}>
									{note.note}
					 </Note>
	},
	render(){
		return( <div className = 'board'>
							{this.state.notes.map(this.eachNote)}
							<button onClick={() => this.add()}> + </button>
						</div>)
	}
})

export default Board;
