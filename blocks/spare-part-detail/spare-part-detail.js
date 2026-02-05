function createAccordion(accordion) {
  // decorate accordion item label
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion';
  const label = accordion.children[0];
  const summary = document.createElement('summary');
  summary.className = 'accordion-item-label';
  summary.append(...label.childNodes);
  // decorate accordion item body
  const body = accordion.children[1];
  body.className = 'accordion-item-body';
  // decorate accordion item
  const details = document.createElement('details');
  details.className = 'accordion-item';
  wrapper.append(details);
  details.append(summary, body);
  accordion.replaceWith(wrapper);
}

export default function decorate(block) {
  const [partInfo, accordion1, accordion2, extraInfo] = [...block.children];
  partInfo.className = 'spare-part-info';
  partInfo.children[1].append(accordion1, accordion2);
  createAccordion(accordion1);
  createAccordion(accordion2);
  extraInfo.className = 'spare-part-extra-info';
}
