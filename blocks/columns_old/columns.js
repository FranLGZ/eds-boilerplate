export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const blockClasses = block.getAttribute('class');

  // Setup columns based on Grid
  [...block.children].forEach((row) => {
    row.setAttribute('class', 'columns-row');
    [...row.children].forEach((col, index) => {
      if (cols.length === 3) {
        col.setAttribute('class', 'col-33');
      } else {
        const textElement = col.querySelector('p');
        const picElement = row.querySelector('picture');

        if (blockClasses.includes('col-33-66')) {
          if (index === 0) {
            col.setAttribute('class', 'col-33');
          } else {
            if (textElement && picElement) {
              const textWrapper = textElement.closest('div');
              textWrapper.classList.add('col-66-right-txt');
            }
            col.classList.add('col-66');
          }
        } else if (blockClasses.includes('col-66-33')) {
          if (index === 0) {
            if (textElement && picElement) {
              const textWrapper = textElement.closest('div');
              textWrapper.classList.add('col-66-left-txt');
            }
            col.classList.add('col-66');
          } else {
            col.classList.add('col-33', 'col-start-two-thirds');
          }
        } else {
          col.classList.add('col-half');
          if (textElement && picElement) {
            const textWrapper = textElement.closest('div');
            if (index === 0) {
              textWrapper.classList.add('col-half-left-txt');
              col.nextElementSibling.classList.add('col-start-half');
            } else {
              textWrapper.classList.add('col-half-right-txt');
            }
          }
        }
      }
    });
  });
}
