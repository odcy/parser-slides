#!/usr/bin/env -S deno run --allow-read --allow-write

const slides_str = new TextDecoder().decode(await Deno.readFile('slides.md'))

const blocks = ['<pre', '<h1', '<h2', '<h3']

const markdown = str => {
	const b64s = new Set()
	const b64ified = str
		.replace(/^```\n*(.+?)^```/smg, (_, contents) => {
			contents = contents.split('\n').map(line => line.startsWith('!') ? `<span class=highlight-code>${line.slice(1)}</span>` : line).join('\n')
			const b64 = btoa(`<pre><code>${contents.replace(/\n*$/, '')}</code></pre>`)
			b64s.add(b64)
			return b64
		})
		.replace(/`(.+?)`/g, '<code>$1</code>')
		.replace(/_(\w+)_/g, '<i>$1</i>')
		.replace(/^# (.+)/mg, '<h1>$1</h1>')
		.replace(/^## (.+)/mg, '<h2>$1</h2>')
		.replace(/^### (.+)/mg, '<h3>$1</h3>')
		.split(/\n+/)
		.map(x => b64s.has(x)
			? atob(x)
			: blocks.some(b => x.startsWith(b))
				? x
				: `<p>${x}</p>`
		    )
		.join('')

	return b64ified//[...b64s].reduce((s, b64) => s.replaceAll(b64, atob(b64)), b64ified)
}

const slide = (str, i) => `<div id='slide-${i}' class=slide>${str}</div>`

const slides = slides_str.split(/^---+/mg)
	.map(x => x.trim())
	.map(markdown)
	.map(slide)
	.join('\n')

console.log(`<link rel=stylesheet href=style.css /><div id=slideshow>${slides}</div><script src=script.js></script>`)