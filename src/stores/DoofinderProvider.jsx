'use client';

import { useEffect } from 'react';

export default function DoofinderProvider({ children, clientType = 'particulier' }) {
  useEffect(() => {
    // Script Doofinder
    (function(l, a, y, e, r, s, _) {
      l['DoofinderAppsObject'] = r;
      l[r] = l[r] || function() {
        (l[r].q = l[r].q || []).push(arguments)
      };
      s = a.createElement(y);
      s.async = 1;
      s.src = e;
      _ = a.getElementsByTagName(y)[0];
      _.parentNode.insertBefore(s, _)
    })(window, document, 'script', 'https://cdn.doofinder.com/apps/loader/2.x/loader.min.js', 'doofinderApp');

    // Configuration avec les paramètres actuels
    window.doofinderApp("config", "store", "adbdb135-12dc-4e6c-8780-b575133b482d");
    window.doofinderApp("config", "zone", "eu1");
    
    window.doofinderApp("config", "settings", [{
      "vsn": "1.0",
      "apps": [{
        "name": "layer",
        "type": "search",
        "options": {
          "trigger": "#fsearch input#motclefold",
          "url_hash": false
        },
        "overrides": {
          "autoload": {
            "desktop": null,
            "mobile": null
          },
          "layout": "Floating",
          "custom_css": {
            "desktop": [""],
            "mobile": [""]
          },
          "custom_properties": {
            "desktop": [
              "--df-accent-primary: #00c19a;\n--df-accent-primary-hover: #00A886;\n--df-accent-primary-active: #008E71;"
            ],
            "mobile": ["--df-accent-primary: #00c19a;\n--df-accent-primary-hover: #00A886;\n--df-accent-primary-active: #008E71;"]
          },
          "search_query_retention": true
        }
      }],
      "settings": {
        "defaults": {
          "currency": "EUR",
          "hashid": "340d7d9ba034f3127410bf389e3b572d",
          "language": "fr"
        },
        "account_code": "a9e3ef4ce10d9e925c756abc5a117b",
        "search_engines": {
          "fr": {
            "EUR": "340d7d9ba034f3127410bf389e3b572d"
          }
        },
        "checkout_url": {
          "340d7d9ba034f3127410bf389e3b572d": ["https://www.automatisme-online.fr/checkout_payment.html"]
        },
        "page_type_mappings": [{
          "id": 43161,
          "type": "home",
          "match_conditions": []
        }, {
          "id": 93696,
          "type": "product_pages",
          "match_conditions": []
        }, {
          "id": 144231,
          "type": "category_pages",
          "match_conditions": []
        }, {
          "id": 194766,
          "type": "shopping_cart",
          "match_conditions": []
        }],
        "checkout_cart_url": {},
        "register_visits": true,
        "register_checkouts": true,
        "checkout_selector": {}
      }
    }]);

    // Gestion des groupes utilisateur
    window.dfGroup = clientType;

    // Fonction de gestion des prix selon le groupe utilisateur
    function handleUserScript() {
      const dfUser = document.querySelectorAll('.dfd-card-pricing.' + window.dfGroup);
      const dfHide = document.querySelectorAll('.dfd-card-pricing');

      for (let i = 0; i < dfHide.length; i++) {
        if (window.dfGroup && dfUser[i]) {
          dfUser[i].hidden = false;
        }
        if (dfHide[i] && dfHide[i].hidden) {
          dfHide[i].remove();
        }
      }
    }

    // Observer pour détecter les changements dans l'interface Doofinder
    const interval = setInterval(() => {
      const element = document.querySelector(".dfd-root");
      if (element) {
        clearInterval(interval);

        const config = {
          attributes: true,
          childList: true,
          subtree: true
        };

        const callback = (mutationsList, observer) => {
          for (let mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "attributes") {
              observer.disconnect();
              handleUserScript();
              observer.observe(element, config);
              break;
            }
          }
        };

        const observer = new MutationObserver(callback);
        observer.observe(element, config);
      }
    }, 100);

  }, [clientType]);

  return children;
}