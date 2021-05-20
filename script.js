const SLIDESHOW  = document.querySelector('#slideshow')

//console.log('abc')

// todo: breaks when zoomed out

SLIDESHOW.addEventListener('scroll', function(e) {
//	console.log(this.scrollTop % this.offsetHeight)
	if(this.scrollTop % this.offsetHeight === 0)
		window.location.hash = `slide-${this.scrollTop / this.offsetHeight}`
})