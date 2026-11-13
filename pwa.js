/* PWA — registra o service worker e preenche os links discretos do rodapé.
   Só aparece na tela inicial; nada de alertas. */
(function () {
  "use strict";
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  var p = document.querySelector("[data-app-links]");
  if (!p) return;

  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) return; // já instalado: não mostra os links

  var central = document.createElement("a");
  central.href = "https://fau009.github.io/";
  central.textContent = "Central de projetos";

  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var baixe = document.createElement("span");
  baixe.textContent = "Baixe o app";

  p.appendChild(baixe);
  p.appendChild(document.createTextNode(" · "));
  p.appendChild(central);

  if (isIOS) {
    var hint = document.createElement("span");
    hint.style.display = "block";
    hint.style.marginTop = "4px";
    hint.style.opacity = ".8";
    hint.textContent = "No iPhone: Compartilhar → Adicionar à Tela de Início";
    p.appendChild(hint);
  }
})();
