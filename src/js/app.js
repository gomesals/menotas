/*global Vue,localStorage,Event*/
(function() {
	"use strict";
	window.Event = new Vue();

	function updateNotes(notes) {
		localStorage.setItem('notes', JSON.stringify(notes));
	}

	function addItem(note) {
		let notes = getNotes();
		notes = notes.concat(note);
		updateNotes(notes);
	}

	function getNotes() {
		const notes = JSON.parse(localStorage.getItem('notes'));
		if (notes) {
			return notes;
		}
		return [];
	}

	function updateItem(note, index) {
		const notes = getNotes();
		notes[index] = note;
		updateNotes(notes);
	}
	new Vue({
		el: '#notes',
		data: {
			search: '',
			notes: [],
		},
		created() {
			this.notes = getNotes();
			Event.$on('saved', () => {
				this.notes = getNotes();
			});
		},
		computed: {
			filteredNotes() {
				return this.notes.filter(item => {
					return (item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || (item.content.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
				});
			},
		},
		methods: {
			deleteNote: function(note) {
				const index = this.getIndex(note);
				this.notes.splice(index, 1);
				updateNotes(this.notes);
			},
			editNote: function(note) {
				const index = this.getIndex(note);
				Event.$emit('edit', note, index);
			},
			getIndex: function(note) {
				return this.notes.indexOf(note);
			}
		}
	});
	new Vue({
		el: '#editor',
		data: {
			title: '',
			content: '',
			saved: false,
			isNew: true,
			index: null,
		},
		created() {
			Event.$on('edit', (note, index) => {
				this.title = note.title;
				this.content = note.content;
				this.isNew = false;
				this.index = index;
			});
		},
		methods: {
			save: function() {
				if (this.title === '' && this.content === '') {
					return false;
				}
				if (this.isNew) {
					addItem({
						title: this.title,
						content: this.content
					});
				}
				else {
					updateItem({
						title: this.title,
						content: this.content
					}, this.index);
				}
				this.isNew = true;
				this.saved = true;
				this.title = '';
				this.content = '';
				this.index = null;
				setTimeout(() => {
					this.saved = false;
				}, 3500);
				Event.$emit('saved');
			}
		}
	});
})();
