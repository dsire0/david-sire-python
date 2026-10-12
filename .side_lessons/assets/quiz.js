/**
 * Reusable Interactive Components for .side_lessons/
 * Provides:
 *  1. Copy-to-clipboard buttons for CLI snippets
 *  2. Commit pointer state simulator
 *  3. Immediate-feedback retrieval practice quizzes
 *  4. Interactive execution checklist tracker
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Copy-to-clipboard buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetText = btn.getAttribute("data-copy");
      if (!targetText) return;
      try {
        await navigator.clipboard.writeText(targetText);
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = original;
        }, 1400);
      } catch {
        btn.textContent = "Select & Copy";
      }
    });
  });

  // 2. Interactive Commit Graph Simulator
  const simStates = {
    current: {
      activeNode: "d766ec1",
      dimNodes: [],
      tags: {
        e792e36: ["origin/main"],
        a890ff8: [],
        d766ec1: ["HEAD -> main"],
      },
      explanation:
        "<strong>Current Repo State:</strong> <code>origin/main</code> sits at your target commit <code>e792e36</code>. Local <code>main</code> is 2 unpushed commits ahead (<code>a890ff8</code> added 3 lines to <code>.gitignore</code>, and <code>d766ec1</code> removed them).",
    },
    detach: {
      activeNode: "e792e36",
      dimNodes: [],
      tags: {
        e792e36: ["HEAD (detached)", "origin/main"],
        a890ff8: [],
        d766ec1: ["main"],
      },
      explanation:
        "<strong>git switch --detach e792e36:</strong> Moves <code>HEAD</code> to inspect <code>e792e36</code> safely, but leaves your <code>main</code> branch pointer untouched at <code>d766ec1</code>.",
    },
    resetHard: {
      activeNode: "e792e36",
      dimNodes: ["a890ff8", "d766ec1"],
      tags: {
        e792e36: ["HEAD -> main", "origin/main"],
        a890ff8: [],
        d766ec1: ["backup/pre-reset (if saved)"],
      },
      explanation:
        "<strong>git reset --hard e792e36:</strong> Moves both <code>HEAD</code> and the <code>main</code> branch pointer directly back to <code>e792e36</code> and syncs all working files. Local <code>main</code> now matches <code>origin/main</code> cleanly! (Commits <code>a890ff8</code> and <code>d766ec1</code> remain recoverable via <code>git reflog</code> or your backup branch.)",
    },
  };

  const simButtons = document.querySelectorAll(".sim-btn");
  if (simButtons.length > 0) {
    const renderSim = (stateKey) => {
      const state = simStates[stateKey];
      if (!state) return;

      ["e792e36", "a890ff8", "d766ec1"].forEach((sha) => {
        const node = document.getElementById(`node-${sha}`);
        const tagContainer = document.getElementById(`tags-${sha}`);
        if (!node || !tagContainer) return;

        node.classList.toggle("active-head", state.activeNode === sha);
        node.classList.toggle("dimmed", state.dimNodes.includes(sha));

        tagContainer.innerHTML = "";
        (state.tags[sha] || []).forEach((label) => {
          const pill = document.createElement("span");
          pill.className = "tag-pill ";
          if (label.startsWith("HEAD")) pill.className += "tag-head";
          else if (label.startsWith("origin")) pill.className += "tag-origin";
          else pill.className += "tag-main";
          pill.textContent = label;
          tagContainer.appendChild(pill);
        });
      });

      const statusEl = document.getElementById("sim-explanation");
      if (statusEl) statusEl.innerHTML = state.explanation;
    };

    simButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        simButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderSim(btn.getAttribute("data-sim"));
      });
    });

    renderSim("current");
  }

  // 3. Retrieval Practice Quizzes
  document.querySelectorAll(".quiz-card").forEach((card) => {
    const options = card.querySelectorAll(".quiz-opt");
    const feedback = card.querySelector(".quiz-feedback");

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const isCorrect = opt.getAttribute("data-correct") === "true";
        const msg = opt.getAttribute("data-feedback") || "";

        options.forEach((o) => {
          o.classList.remove("correct", "incorrect");
        });

        opt.classList.add(isCorrect ? "correct" : "incorrect");
        if (feedback) {
          feedback.textContent = msg;
          feedback.style.color = isCorrect ? "#15803d" : "#a00000";
        }
      });
    });
  });

  // 4. Checklist Progress Counter
  const checkboxes = document.querySelectorAll(".step-check");
  const progressDisplay = document.getElementById("checklist-progress");
  if (checkboxes.length > 0 && progressDisplay) {
    const updateProgress = () => {
      const done = Array.from(checkboxes).filter((c) => c.checked).length;
      progressDisplay.textContent = `${done} of ${checkboxes.length} steps completed`;
    };
    checkboxes.forEach((cb) => cb.addEventListener("change", updateProgress));
    updateProgress();
  }
});

