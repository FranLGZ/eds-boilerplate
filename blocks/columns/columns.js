export default function decorate(block) {
  const rows = [...block.children];
  const colCount = rows[0]?.children.length || 0;
  block.classList.add(`columns-${colCount}-cols`);

  /* Setup columns based on Grid */
  rows.forEach((row) => {
    row.classList.add('columns-row');
    const columns = [...row.children];
    /* Determine if there is a Picture element in the current row */
    const hasImageInRow = row.querySelector('picture');
    /* If there are no Picture elements in the current row the vertical aligment is set to top */
    if (!hasImageInRow) {
      row.classList.add('col-align-top');
    }

    columns.forEach((column, index) => {
      /* Determine if there are Picture and/or Text elements in the current column */
      const isPicture = !!column.querySelector('picture');
      const isText = !!column.querySelector('p');
      const cell = index + 1;

      /* --- 3 columns (33 / 33 / 33) logic --- */
      if (colCount === 3) {
        column.classList.add('col-33');
        /* If the last column is a picture, last-col-img is added in order to
        maintain the 3 columns layout for Tablet viewports */
        if (cell === 3 && isPicture) {
          row.classList.add('last-col-img');
        }
        /* --- 2 columns variants logic --- */
      } else {
        const is3366 = block.classList.contains('col-33-66');
        const is6633 = block.classList.contains('col-66-33');
        /* -- 2 Columns (33 / 66) logic -- */
        if (is3366) {
          if (cell === 1) {
            column.setAttribute('class', 'col-33');
          } else {
            /* By default, the regular 66% space is applied */
            column.classList.add('col-66');
            /* If the element in this second column is Text and the previous column is
            an Image, a correction that adds inner padding is applied */
            if (isText) {
              column.classList.add('col-txt-spacing');
            }
          }
          /* -- 2 Columns (66 / 33) logic -- */
        } else if (is6633) {
          if (cell === 1) {
            /* By default, the regular 66% space is applied */
            column.classList.add('col-66');
            /* If the element in this first column is Text and the following column is
            an Image, a correction that adds inner padding is applied */
            if (isText) {
              column.classList.add('col-txt-spacing');
            }
          } else {
            /* By default the regular 33% space is applied to the second column */
            column.classList.add('col-33');
          }
          /* -- 2 Columns (50 / 50) logic (Default) -- */
        } else {
          /* By default the regular 50% space is applied to both columns */
          column.classList.add('col-50');
          /* If the element is Text a correction that adds inner padding is applied */
          if (isText) {
            column.classList.add('col-txt-spacing');
          }
        }
      }
    });
  });
}
