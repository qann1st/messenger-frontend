import { classNames } from './classNames';

export const highlightMessage = (text: string, styles: CSSModuleClasses, isMyMessage: boolean) => {
  const linkPattern = /(\b(https?|ftp):\/\/[^\s/$.?#].\S*)/gi;
  const boldPattern = /\*{2}(.*?)\*{2}/g;
  const italicPattern = /__(.*?)__/g;
  let highlightedText = text.replace(
    linkPattern,
    `<a class="${classNames(styles.link, isMyMessage && styles.my_link)}" href="$1" target="_blank">$1</a>`,
  );
  if (highlightedText.match(boldPattern) && highlightedText.match(italicPattern)) {
    highlightedText = highlightedText.replace(boldPattern, `<em class="${styles.boldItalic}">$1</em>`);
    highlightedText = highlightedText.replace(italicPattern, '$1');
    return highlightedText;
  }
  highlightedText = highlightedText.replace(boldPattern, `<strong class="${styles.bold}">$1</strong>`);
  highlightedText = highlightedText.replace(italicPattern, `<em class="${styles.italic}">$1</em>`);

  return highlightedText;
};
