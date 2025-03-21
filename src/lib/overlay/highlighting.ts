import hljs from 'highlight.js/lib/core';
import yamlHighlight from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('yaml', yamlHighlight);
