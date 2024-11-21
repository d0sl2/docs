Prism.languages.d0sl = {
    'property': {
		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
		lookbehind: true,
		greedy: true
	},
    'keyword': /\b(if|then|else|elif|forall|for\ all|exists|use|function|from|def|num|logical|string|fun|predicate|model|semanticmodel|signature|end|is)\b/,
    'string': {
		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
		lookbehind: true,
		greedy: true
	},
	'comment': {
		pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
		greedy: true
	},
	'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
	'punctuation': /[{}[\],]\(\)/,
    'operator': /[-+*/=<>!]/,
    'boolean': /\b(?:false|true|unknown)\b/,
};

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('pre').forEach(pre => {
        // Check if the <pre> element has a class and contains a <code> element
        if (pre.className && pre.querySelector('code')) {
            // Get the class name from the <pre> element
            const className = pre.className.trim();
            // Construct the language class
            const languageClass = `language-${className}`;
            // Get the <code> element inside the <pre>
            const codeBlock = pre.querySelector('code');
            // Append the language class to the <code> element
            codeBlock.classList.add(languageClass);
        }
    });
    
    Prism.highlightAll();
});