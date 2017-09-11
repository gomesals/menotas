/*global Vue,localStorage*/
(function() {
	"use strict";
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
		}
	});

})();
