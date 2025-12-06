import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang))
      return hljs.highlight(code, { language: lang }).value;

    return hljs.highlightAuto(code).value;
  },
  breaks: true,
});

export function renderMarkdown(text) {
  return marked.parse(text);
}
