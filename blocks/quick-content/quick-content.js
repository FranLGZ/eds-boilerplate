function createMarkUp(block) {
  const contentDiv = document.createElement('div');
  const headerElement = document.createElement('h2');
  const mainTextElement = document.createElement('p');
  const linkElement = document.createElement('a');

  const imageDiv = block.children[0];
  const headerDiv = block.children[1];
  const headerContent = headerDiv.textContent.trim();
  const mainTextDiv = block.children[2];
  const mainTextContent = mainTextDiv.textContent.trim();
  const linkTextDiv = block.children[3];
  const linkUrlDiv = block.children[4];
  const linkTextContent = linkTextDiv.textContent.trim();
  const linkUrlContent = linkUrlDiv.textContent.trim();
  linkElement.innerHTML = linkTextContent;
  linkElement.setAttribute('href', linkUrlContent);

  imageDiv.append(contentDiv);
  headerElement.textContent = headerContent;
  mainTextElement.textContent = mainTextContent;
  contentDiv.append(headerElement);
  contentDiv.append(mainTextElement);
  contentDiv.append(linkElement);
  headerDiv.remove();
  mainTextDiv.remove();
  linkTextDiv.remove();
  linkUrlDiv.remove();
  block.append(imageDiv);
}

export default function decorate(block) {
  createMarkUp(block);
  const rows = [...block.children];
  const colCount = rows[0]?.children.length || 0;
  block.classList.add(`columns-${colCount}-cols`);

  /* Setup columns based on Grid */
  rows.forEach((row) => {
    row.classList.add('quick-content-row');
    const columns = [...row.children];
    /* Determine if there is a Picture element in the current row */
    const hasImageInRow = row.querySelector('picture');
    /* If there are no Picture elements in the current row the vertical aligment is set to top */
    if (!hasImageInRow) {
      row.classList.add('col-align-top');
    }

    columns.forEach((column) => {
      // console.log(column);
      /* Determine if there are Picture and/or Text elements in the current column */
      // const isPicture = !!column.querySelector('picture');
      const isText = !!column.querySelector('p');

      /* By default the regular 50% space is applied to both columns */
      column.classList.add('col-50');
      /* If the element is Text a correction that adds inner padding is applied */
      if (isText) {
        column.classList.add('col-txt-spacing');
      }
    });
  });
}
