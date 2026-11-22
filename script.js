let allProjects = [];
let currentCategory = "Semua";

const projectsContainer = document.getElementById("projects");
const projectCount = document.getElementById("projectCount");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
}

async function loadProjects() {
  if (typeof supabaseClient === "undefined") {
    projectsContainer.innerHTML = '<div class="empty-state"><strong>Portfolio belum terhubung.</strong>Periksa konfigurasi Supabase di file supabase.js.</div>';
    return;
  }
  const { data, error } = await supabaseClient.from("projects").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Gagal memuat project:", error);
    projectsContainer.innerHTML = '<div class="empty-state"><strong>Project belum dapat dimuat.</strong>Silakan coba lagi beberapa saat.</div>';
    return;
  }
  allProjects = data || [];
  renderProjects();
}

function renderProjects() {
  const projects = currentCategory === "Semua"
    ? allProjects
    : allProjects.filter(project => project.category === currentCategory);

  projectCount.textContent = String(projects.length).padStart(2, "0");

  if (!projects.length) {
    projectsContainer.innerHTML = `<div class="empty-state"><strong>${allProjects.length ? "Belum ada karya di kategori ini." : "Karya sedang disiapkan."}</strong>${allProjects.length ? "Coba pilih kategori lainnya." : "Project yang diunggah akan tampil di sini."}</div>`;
    return;
  }

  projectsContainer.innerHTML = projects.map((project, index) => `
    <article class="project-card" style="animation-delay:${Math.min(index * 70, 350)}ms">
      <div class="project-image-wrap" data-image="${escapeHTML(project.image_url || "")}" data-title="${escapeHTML(project.title || "Project")}">
        <img src="${escapeHTML(project.image_url || "")}" alt="${escapeHTML(project.title || "Project")}" loading="lazy">
        <button class="project-open" type="button" aria-label="Perbesar gambar">↗</button>
      </div>
      <div class="project-info">
        <span class="project-category">${escapeHTML(project.category || "Project")}</span>
        <h3>${escapeHTML(project.title || "Untitled project")}</h3>
        ${project.description ? `<p>${escapeHTML(project.description)}</p>` : ""}
      </div>
    </article>`).join("");

  projectsContainer.querySelectorAll(".project-image-wrap").forEach(wrap => {
    wrap.addEventListener("click", () => openLightbox(wrap.dataset.image, wrap.dataset.title));
  });
}

document.querySelectorAll(".filter button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    renderProjects();
  });
});

function openLightbox(image, title = "") {
  if (!image) return;
  const lightbox = document.getElementById("lightbox");
  document.getElementById("lightbox-img").src = image;
  document.getElementById("lightbox-caption").textContent = title;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.getElementById("lightbox-img").src = "";
  document.body.style.overflow = "";
}
document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox").addEventListener("click", event => {
  if (event.target.id === "lightbox") closeLightbox();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open", !expanded);
});
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));
}
document.getElementById("year").textContent = new Date().getFullYear();
loadProjects();
