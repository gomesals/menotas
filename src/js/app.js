/*global Vue,localStorage*/
(function() {
	"use strict";

	function updateStorage(notes) {
		localStorage.setItem('notes', JSON.stringify(notes));
	}

	function addItem(note) {
		let notes = JSON.parse(localStorage.getItem('notes'));
		notes = notes.concat(note);
		updateStorage(notes);
	}
	const notes = new Vue({
		el: '#notes',
		data: {
			search: '',
			notes: [],
		},
		created() {
			this.notes = JSON.parse(localStorage.getItem('notes'));
		},
		computed: {
			filteredNotes() {
				return this.notes.filter(item => {
					return (item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || (item.content.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
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
	const editor = new Vue({
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
			}
		}
	})
})();
