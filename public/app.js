const serviceSearch =
  document.getElementById(
    'serviceSearch'
  );

const suggestions =
  document.getElementById(
    'suggestions'
  );

const dropdownIcon =
  document.getElementById(
    'dropdownIcon'
  );

const askBtn =
  document.getElementById(
    'askBtn'
  );

const messageInput =
  document.getElementById(
    'message'
  );

const responseDiv =
  document.getElementById(
    'response'
  );

const API_URL =
  'https://services-ai-assistant.onrender.com';

let allServices = [];

let selectedService = null;

/* Load Services */

async function loadServices() {

  try {

    const response =
      await fetch(
        `${API_URL}/services`
      );

    allServices =
      await response.json();

  } catch (error) {

    console.error(
      'Service Load Error:',
      error
    );

    serviceSearch.placeholder =
      'Error Loading Services';
  }
}

/* Show Suggestions */

function showSuggestions(
  services
) {

  suggestions.innerHTML = '';

  if (
    services.length === 0
  ) {

    suggestions.style.display =
      'none';

    return;
  }

  services.forEach(service => {

    const item =
      document.createElement(
        'div'
      );

    item.className =
      'suggestion-item';

    item.textContent =
      `${service.Service} (${service.Category})`;

    item.addEventListener(
      'click',
      () => {

        selectedService =
          service.Service;

        serviceSearch.value =
          service.Service;

        messageInput.value =
          `How to apply for ${service.Service}?`;

        askBtn.disabled =
          false;

        suggestions.style.display =
          'none';
      }
    );

    suggestions.appendChild(
      item
    );
  });

  suggestions.style.display =
    'block';
}

/* Typing Search */

serviceSearch.addEventListener(
  'input',
  () => {

    const query =
      serviceSearch.value
        .toLowerCase();

    const filtered =
      allServices.filter(
        service =>
          service.Service
            .toLowerCase()
            .includes(query)
      );

    showSuggestions(
      filtered.slice(0, 50)
    );
  }
);

/* Arrow Click */

dropdownIcon.addEventListener(
  'click',
  () => {

    showSuggestions(
      allServices
    );
  }
);

/* Close Dropdown */

document.addEventListener(
  'click',
  e => {

    if (
      !e.target.closest(
        '.combo-box'
      )
    ) {

      suggestions.style.display =
        'none';
    }
  }
);

/* Ask */

async function sendMessage() {

  const message =
    messageInput.value.trim();

  if (!message) return;

  responseDiv.innerHTML = `
    <div class="thinking">
      Thinking...
    </div>
  `;

  try {

    const response =
      await fetch(
        `${API_URL}/chat`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            message
          })
        }
      );

    const data =
      await response.text();

    const formatted =
      marked.parse(data);

    responseDiv.innerHTML = `
      <div class="ai-message">
        ${formatted}
      </div>
    `;

  } catch (error) {

    console.error(
      'Chat Error:',
      error
    );

    responseDiv.innerHTML = `
      <div class="error">
        Error connecting to server
      </div>
    `;
  }
}

loadServices();