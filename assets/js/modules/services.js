import { t } from './i18n.js';
import { observeReveal } from './reveal.js';

const SERVICES = [
  { key: 'landscapeDesign', icon: 'icon-tree-row' },
  { key: 'interiorDesign', icon: 'icon-potted-plant' },
  { key: 'interiorMaintenance', icon: 'icon-watering-can' },
  { key: 'landscapeMaintenance', icon: 'icon-shears' },
  { key: 'strawberryFarm', icon: 'icon-berry' },
  { key: 'greenhouse', icon: 'icon-greenhouse' },
  { key: 'agriConsultancy', icon: 'icon-clipboard-check' },
  { key: 'diseaseDiagnosis', icon: 'icon-microscope' },
  { key: 'soilAnalysis', icon: 'icon-flask' },
  { key: 'irrigation', icon: 'icon-droplet' },
  { key: 'pestInspection', icon: 'icon-bug' },
];

function render() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map((service, i) => {
    const title = t(`services.items.${service.key}.title`, service.key);
    const description = t(`services.items.${service.key}.description`, '');
    return `
      <article class="service-card reveal">
        <span class="service-index">${String(i + 1).padStart(2, '0')}</span>
        <div class="service-icon"><svg><use href="#${service.icon}"></use></svg></div>
        <h3>${title}</h3>
        <p>${description}</p>
      </article>
    `;
  }).join('');

  observeReveal(grid);
}

export function initServices() {
  render();
  document.addEventListener('i18n:ready', render);
}
