const serviceSearch =
  document.getElementById(
    'serviceSearch'
  );

const suggestions =
  document.getElementById(
    'suggestions'
  );

const messageInput =
  document.getElementById(
    'message'
  );

const responseDiv =
  document.getElementById(
    'response'
  );

const askBtn =
  document.getElementById(
    'askBtn'
  );

const API_URL =
  'https://services-ai-assistant.onrender.com';

let allServices = [];

let selectedService = null;

/* LOAD SERVICES */

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

/* SEARCH */

serviceSearch.addEventListener(
  'input',
  () => {

    const query =
      serviceSearch.value
        .toLowerCase()
        .trim();

    suggestions.innerHTML = '';

    if (!query) {

      suggestions.style.display =
        'none';

      askBtn.disabled =
        true;

      return;
    }

    const matches =
      allServices
        .filter(service =>
          service.Service
            .toLowerCase()
            .includes(query)
        )
        .slice(0, 20);

    matches.forEach(service => {

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
            service;

          serviceSearch.value =
            service.Service;

          suggestions.style.display =
            'none';

          messageInput.value =
            `How to apply for ${service.Service}?`;

          askBtn.disabled =
            false;
        }
      );

      suggestions.appendChild(
        item
      );
    });

    suggestions.style.display =
      matches.length
        ? 'block'
        : 'none';
  }
);

/* CLOSE DROPDOWN */

document.addEventListener(
  'click',
  event => {

    if (
      !serviceSearch.contains(
        event.target
      ) &&
      !suggestions.contains(
        event.target
      )
    ) {

      suggestions.style.display =
        'none';
    }
  }
);

/* SEND MESSAGE */

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