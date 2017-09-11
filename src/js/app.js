/*global Vue,localStorage,Event*/
(function() {
	"use strict";
	window.Event = new Vue();

	function updateStorage(notes) {
		localStorage.setItem('notes', JSON.stringify(notes));
	}

	function addItem(note) {
		let notes = getNotes();
		notes = notes.concat(note);
		updateStorage(notes);
	}

	function getNotes() {
		const notes = JSON.parse(localStorage.getItem('notes'));
		if (notes) {
			return notes;
		}
		return [];
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
				const index = this.notes.indexOf(note);
				this.notes.splice(index, 1);
				updateStorage(this.notes);
			},
		}
	});
	new Vue({
		el: '#editor',
		data: {
			title: '',
			content: '',
			saved: false,
		},
		methods: {
			save: function() {
				if (this.title === '' && this.content === '') {
					return false;
				}
				addItem({
					title: this.title,
					content: this.content
				});
				this.saved = true;
				this.title = '';
				this.content = '';
				setTimeout(() => {
					this.saved = false;
				}, 3500);
				Event.$emit('saved');
			}
		}
	});
})();
