export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const blockClasses = block.getAttribute('class');

  // const wrapper = block.firstElementChild;
  // wrapper.setAttribute('class', 'columns-row');

  // if (blockClasses.includes('onethird')) {
  //   const element1 = block.firstElementChild.children[0];
  //   element1.setAttribute('class','col-third');
  //   const element2 = block.firstElementChild.children[1];
  //   element2.setAttribute('class','col-two-thirds');
  // }

  // setup image columns
  [...block.children].forEach((row) => {
    row.setAttribute('class', 'columns-row');
    console.log("row",row);
    [...row.children].forEach((col, index) => {
      // console.log("length",[...row.children].length);
      if ([...row.children].length === 3) {
        col.setAttribute('class', 'col-third');
      } else {
        console.log('Columns');
        if (blockClasses.includes('onethird')) {
          if (index === 0) {
            col.setAttribute('class', 'col-third');
          } else {
            const text = col.querySelector('p');
            if (text) {
              col.classList.add('col-two-thirds-right-txt');
            }
            col.classList.add('col-two-thirds');
          }
        } else if (blockClasses.includes('twothirds')) {
          if (index === 0) {
            const text = col.querySelector('p');
            if (text) {
              col.classList.add('col-two-thirds-left-txt');
            }
            col.classList.add('col-two-thirds');
          } else {
            col.setAttribute('class', 'col-third col-start-two-thirds');
          }
        } else {
          col.setAttribute('class', 'col-half');
        }
      }
      // const pic = col.querySelector('picture');
      // if (pic) {
      //   const picWrapper = pic.closest('div');
      //   if (picWrapper && picWrapper.children.length === 1) {
      //     // picture is only content in column
      //     picWrapper.classList.add('columns-img-col');
      //   }
      // }
    });
  });
}
