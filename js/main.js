const year = document.querySelector("#year");
    year.textContent = new Date().getFullYear();

    /* Animações de entrada */
    const revealItems = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach((item) => observer.observe(item));

    /* Tema claro/escuro com preferência persistente */
    const themeButtons = document.querySelectorAll("[data-theme-choice]");
    const savedTheme = localStorage.getItem("junior-site-theme");
    const initialTheme =
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

    function applyTheme(theme) {
      document.body.dataset.theme = theme;
      localStorage.setItem("junior-site-theme", theme);
      themeButtons.forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.themeChoice === theme)
        );
      });
    }

    themeButtons.forEach((button) => {
      button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
    });
    applyTheme(initialTheme);

    /* Dados do grafo */
    const graphNodes = [
      { id: "inicio", label: "Junior", href: "#inicio", x: 160, y: 125, type: "root", parent: null },

      { id: "trajetoria", label: "Trajetória", href: "#trajetoria", x: 94, y: 68, type: "parent", parent: "inicio" },
      { id: "carreira", label: "Carreira", href: "#carreira", x: 228, y: 64, type: "parent", parent: "inicio" },
      { id: "projetos", label: "Projetos", href: "#projetos", x: 85, y: 190, type: "parent", parent: "inicio" },
      { id: "contato", label: "Contato", href: "#contato", x: 238, y: 191, type: "parent", parent: "inicio" },

      { id: "atuacao", label: "Atuação", href: "#atuacao", x: 275, y: 97, type: "child", parent: "carreira" },
      { id: "especialidade", label: "Especialidade", href: "#especialidade", x: 280, y: 130, type: "child", parent: "carreira" },
      { id: "abordagem", label: "Abordagem", href: "#abordagem", x: 268, y: 160, type: "child", parent: "carreira" },

      { id: "memory-wiki", label: "Memory Wiki", href: "#memory-wiki", x: 28, y: 217, type: "child", parent: "projetos" },
      { id: "projeto-automacao", label: "Automação RBE", href: "#projeto-automacao", x: 59, y: 247, type: "child", parent: "projetos" },
      { id: "ia-aplicada", label: "IA Aplicada", href: "#ia-aplicada", x: 116, y: 260, type: "child", parent: "projetos" },
      { id: "stack-pessoal", label: "Stack", href: "#stack-pessoal", x: 155, y: 232, type: "child", parent: "projetos" },
      { id: "blog", label: "Blog Pessoal", href: "#blog", x: 80, y: 300, type: "child", parent: "projetos" },
      { id: "pasolini-bbs", label: "BBS", href: "#pasolini-bbs", x: 28, y: 310, type: "child", parent: "projetos" },
      { id: "emulador-msx", label: "MSX", href: "#emulador-msx", x: 55, y: 330, type: "child", parent: "projetos" },
      { id: "agente-digital-pessoal", label: "Agente Digital", href: "#agente-digital-pessoal", x: 130, y: 290, type: "child", parent: "projetos" },

      { id: "blog-contato", label: "Blog", href: "https://jrpasolini.wordpress.com", x: 250, y: 228, type: "child", parent: "contato", external: true },
      { id: "x", label: "X", href: "https://x.com/jrpasolini", x: 282, y: 250, type: "child", parent: "contato", external: true },
      { id: "instagram", label: "Instagram", href: "https://www.instagram.com/antonio.pasolini85/", x: 221, y: 259, type: "child", parent: "contato", external: true },
      { id: "github", label: "GitHub", href: "https://github.com/jrpasolini", x: 190, y: 270, type: "child", parent: "contato", external: true }
    ];

    const graphEdges = graphNodes
      .filter((node) => node.parent)
      .map((node) => ({ source: node.parent, target: node.id }));

    const viewport = document.querySelector("#graph-viewport");
    const svg = document.querySelector("#graph-canvas");
    const stage = document.querySelector("#graph-stage");
    const graphPanel = document.querySelector(".graph-panel");
    const graphBackdrop = document.querySelector(".graph-backdrop");
    const graphContextLabel = document.querySelector("#graph-context-label");
    const fullscreenButton = document.querySelector("#graph-fullscreen");
    const nodeById = new Map(graphNodes.map((node) => [node.id, node]));

    const NS = "http://www.w3.org/2000/svg";

    function createSvgElement(tag, attrs = {}) {
      const element = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
      return element;
    }

    graphEdges.forEach((edge) => {
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      const line = createSvgElement("line", {
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
        class: "graph-edge",
        "data-source": edge.source,
        "data-target": edge.target
      });
      viewport.appendChild(line);
    });

    graphNodes.forEach((node) => {
      const group = createSvgElement("g", {
        class: `graph-node is-${node.type}`,
        transform: `translate(${node.x} ${node.y})`,
        tabindex: "0",
        role: "link",
        "aria-label": node.external
          ? `${node.label}, abre em nova aba`
          : `Ir para ${node.label}`,
        "data-node-id": node.id
      });

      const circle = createSvgElement("circle", {
        r: node.type === "root" ? 7 : node.type === "parent" ? 5.3 : 4
      });

      const anchor = createSvgElement("text", {
        x: node.x > 245 ? -9 : 9,
        y: node.y > 245 ? -8 : 4,
        "text-anchor": node.x > 245 ? "end" : "start"
      });
      anchor.textContent = node.label;

      group.append(circle, anchor);
      viewport.appendChild(group);

      const activateNode = () => {
        if (node.external) {
          window.open(node.href, "_blank", "noopener");
        } else {
          document.querySelector(node.href)?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      };

      group.addEventListener("click", activateNode);
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateNode();
        }
      });
    });

    /* Pan e zoom */
    const GRAPH_BASE_SCALE = 1.32;
    const GRAPH_CHILD_SCALE = 1.53;
    let transform = { x: 0, y: 0, scale: GRAPH_BASE_SCALE };
    let dragging = false;
    let dragStart = null;

    function applyGraphTransform() {
      viewport.setAttribute(
        "transform",
        `translate(${transform.x} ${transform.y}) scale(${transform.scale})`
      );
    }

    function zoomAt(factor, clientX, clientY) {
      const rect = svg.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * svg.viewBox.baseVal.width;
      const svgY = ((clientY - rect.top) / rect.height) * svg.viewBox.baseVal.height;
      const nextScale = Math.min(2.8, Math.max(.65, transform.scale * factor));

      transform.x = svgX - ((svgX - transform.x) * nextScale) / transform.scale;
      transform.y = svgY - ((svgY - transform.y) * nextScale) / transform.scale;
      transform.scale = nextScale;
      applyGraphTransform();
    }

    stage.addEventListener("wheel", (event) => {
      event.preventDefault();
      zoomAt(event.deltaY < 0 ? 1.12 : .89, event.clientX, event.clientY);
    }, { passive: false });

    stage.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".graph-node")) return;
      dragging = true;
      dragStart = {
        clientX: event.clientX,
        clientY: event.clientY,
        x: transform.x,
        y: transform.y
      };
      stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const rect = svg.getBoundingClientRect();
      const factorX = svg.viewBox.baseVal.width / rect.width;
      const factorY = svg.viewBox.baseVal.height / rect.height;
      transform.x = dragStart.x + (event.clientX - dragStart.clientX) * factorX;
      transform.y = dragStart.y + (event.clientY - dragStart.clientY) * factorY;
      applyGraphTransform();
    });

    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    document.querySelector("#graph-zoom-in").addEventListener("click", () => {
      const rect = svg.getBoundingClientRect();
      zoomAt(1.18, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    document.querySelector("#graph-zoom-out").addEventListener("click", () => {
      const rect = svg.getBoundingClientRect();
      zoomAt(.84, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    function resetGraphView() {
      transform = { x: 0, y: 0, scale: GRAPH_BASE_SCALE };
      applyGraphTransform();
    }
    document.querySelector("#graph-reset").addEventListener("click", resetGraphView);

    /* Tela cheia */
    function setGraphFullscreen(open) {
      graphPanel.classList.toggle("is-fullscreen", open);
      graphBackdrop.hidden = !open;
      document.body.classList.toggle("graph-open", open);
      fullscreenButton.setAttribute("aria-pressed", String(open));
      fullscreenButton.setAttribute(
        "aria-label",
        open ? "Fechar tela cheia" : "Abrir grafo em tela cheia"
      );
      fullscreenButton.innerHTML = open
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M21 15h-6v6M3 15h6v6"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/></svg>';
      requestAnimationFrame(resetGraphView);
    }

    fullscreenButton.addEventListener("click", () => {
      setGraphFullscreen(!graphPanel.classList.contains("is-fullscreen"));
    });

    graphBackdrop.addEventListener("click", () => setGraphFullscreen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && graphPanel.classList.contains("is-fullscreen")) {
        setGraphFullscreen(false);
      }
    });

    /* Sincronização entre rolagem e grafo */
    const observedIds = graphNodes
      .filter((node) => !node.external)
      .map((node) => node.id);
    const observedElements = observedIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const parentSectionByNode = {
      inicio: "inicio",
      trajetoria: "trajetoria",
      carreira: "carreira",
      atuacao: "carreira",
      especialidade: "carreira",
      abordagem: "carreira",
      projetos: "projetos",
      "memory-wiki": "projetos",
      "projeto-automacao": "projetos",
      "ia-aplicada": "projetos",
      "stack-pessoal": "projetos",
      "voz-humana": "projetos",
      "blog": "projetos",
      "pasolini-bbs": "projetos",
      "emulador-msx": "projetos",
      "agente-digital-pessoal": "projetos",
      "laboratorio": "projetos",
      contato: "contato"
    };

    function getContextSet(activeId) {
      const set = new Set(["inicio", activeId]);
      const active = nodeById.get(activeId);
      if (active?.parent) set.add(active.parent);

      const sectionId = parentSectionByNode[activeId] || activeId;
      set.add(sectionId);

      graphNodes.forEach((node) => {
        if (node.parent === sectionId) set.add(node.id);
      });

      return set;
    }

    function updateGraphContext(activeId) {
      const active = nodeById.get(activeId) || nodeById.get("inicio");
      const context = getContextSet(active.id);

      document.querySelectorAll(".graph-node").forEach((element) => {
        const id = element.dataset.nodeId;
        element.classList.toggle("is-active", id === active.id);
        element.classList.toggle("is-dimmed", !context.has(id));
      });

      document.querySelectorAll(".graph-edge").forEach((line) => {
        const contextual =
          context.has(line.dataset.source) && context.has(line.dataset.target);
        line.classList.toggle("is-context", contextual);
      });

      graphContextLabel.textContent =
        active.id === "inicio" ? "Visão geral da página" : `Você está em: ${active.label}`;

      const focusNode = nodeById.get(parentSectionByNode[active.id] || active.id);
      if (focusNode && !dragging) {
        const targetScale = active.type === "child"
          ? GRAPH_CHILD_SCALE
          : GRAPH_BASE_SCALE;
        transform.scale = targetScale;
        transform.x = 160 - focusNode.x * targetScale;
        transform.y = 137 - focusNode.y * targetScale;
        applyGraphTransform();
      }
    }

    function detectCurrentSection() {
      let current = "inicio";
      const marker = window.innerHeight * .43;

      observedElements.forEach((element) => {
        if (element.getBoundingClientRect().top <= marker) {
          current = element.id;
        }
      });

      updateGraphContext(current);
    }

    let scrollTicking = false;
    window.addEventListener("scroll", () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        detectCurrentSection();
        scrollTicking = false;
      });
    }, { passive: true });
    detectCurrentSection();

    /* Popover da tag Automação */
    const popoverTriggers = document.querySelectorAll("[data-popover]");
    let activePopoverTrigger = null;

    const closeTagPopover = () => {
      if (!activePopoverTrigger) return;
      const popover = document.getElementById(activePopoverTrigger.dataset.popover);
      popover.hidden = true;
      activePopoverTrigger.setAttribute("aria-expanded", "false");
      activePopoverTrigger = null;
    };

    const positionTagPopover = (trigger, popover) => {
      const triggerRect = trigger.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const viewportPadding = 16;
      const spacing = 12;

      let left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
      left = Math.max(
        viewportPadding,
        Math.min(left, window.innerWidth - popoverRect.width - viewportPadding)
      );

      let top = triggerRect.bottom + spacing;
      if (top + popoverRect.height > window.innerHeight - viewportPadding) {
        top = triggerRect.top - popoverRect.height - spacing;
      }

      popover.style.left = `${left}px`;
      popover.style.top = `${Math.max(viewportPadding, top)}px`;
    };

    popoverTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (activePopoverTrigger === trigger) {
          closeTagPopover();
          return;
        }

        closeTagPopover();
        const popover = document.getElementById(trigger.dataset.popover);
        popover.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        activePopoverTrigger = trigger;
        positionTagPopover(trigger, popover);
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".tag-popover")) closeTagPopover();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeTagPopover();
    });

    window.addEventListener("scroll", closeTagPopover, { passive: true });
    window.addEventListener("resize", closeTagPopover);
