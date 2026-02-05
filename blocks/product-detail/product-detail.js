export default async function decorate(block) {
  const pathParts = window.location.pathname.split('/');
  const sku = pathParts[pathParts.length - 1];

  const apiUrl = `https://api.adobecommerce.live/nibegroup/sites/nibe-customerportal-poc/catalog/se/spare-part-detail/${sku}.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Product not found');
    const data = await response.json();

    const imageBase = 'https://main--nibe-customerportal-poc--nibegroup.aem.network/se/spare-part-detail/';
    const imageUrl = data.images?.[0]?.url.replace('./', imageBase) || '';

    block.innerHTML = `
      <div class="product-grid">
        <div class="product-image">
            <img src="${imageUrl}" alt="${data.name}">
        </div>
        <div class="product-content">
            <h2>${data.name}</h2>
            <p class="sku-tag">Article no : ${data.sku}</p>
            <div class="product-login">
                <a href="#" title="Melde dich an, um zu kaufen">Melde dich an, um zu kaufen</a>
                <div class="price-display">
                    <span class="amount">${data.price.final}</span>
                    <span class="currency">${data.price.currency}</span>
                </div>
            </div>
            <div class="accordion">
                <details class="accordion-item">
                    <summary class="accordion-item-label">
                        <p>Specifications</p>
                    </summary>
                    <div class="accordion-item-body">
                        <ul>
                            <li>Weight:${data.custom.specifications.weight.value} ${data.custom.specifications.weight.unit}</li>
                            <li>Breite: ${data.custom.specifications.height.value} ${data.custom.specifications.height.unit}</li>
                            <li>Length: ${data.custom.specifications.length.value} ${data.custom.specifications.length.unit}</li>
                            <li>Width: ${data.custom.specifications.width.value} ${data.custom.specifications.width.unit}</li>
                            <li>Volume: ${data.custom.specifications.volume.value} ${data.custom.specifications.volume.unit}</li>
                        </ul>
                    </div>
                </details>
            </div>
            <div class="accordion">
                <details class="accordion-item">
                    <summary class="accordion-item-label">
                        <p>Included Components</p>
                    </summary>
                    <div class="accordion-item-body">
                        <ul>
                            <li>${data.custom.includedComponents[0].name_en}: ${data.custom.includedComponents[0].quantity} ${data.custom.includedComponents[0].unit_en}</li>
                            <li>${data.custom.includedComponents[1].name_en}: ${data.custom.includedComponents[1].quantity} ${data.custom.includedComponents[1].unit_en}</li>
                        </ul>
                    </div>
                </details>
            </div>
        </div>
      </div>
      <div class="product-info">
        <h3>Produkte, die mit ${data.name} mit Dichtung kompatibel sind</h3>
        <p>Hier sind alle Produkte aufgelistet, die mit ${data.name} mit Dichtung kompatibel sind. Um alle kompatiblen Produkte zu sehen, kannst du zwischen verschiedenen Seiten navigieren oder nach einer Seriennummer, Artikelnummer oder einem Namen für ein bestimmtes Produkt suchen.</p>
      </div>
    `;
  } catch (err) {
    block.innerHTML = `<p>Sorry, we couldn't find spare part ${sku}.</p>`;
  }
}
