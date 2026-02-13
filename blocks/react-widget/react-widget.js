import './widget/course-detail-widget.js';

export default function decorate(block) {
  const widget = document.createElement('course-detail-widget');
  widget.setAttribute('course-id', '6f333f63-9785-ec11-8d21-000d3a4b370b');
  widget.setAttribute('locale', 'sv-se');
  widget.setAttribute('authority', 'https://login.microsoftonline.com/your-tenant-id');
  block.appendChild(widget);
}
