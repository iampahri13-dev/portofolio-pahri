// ===============================
// DATA PROJECT
// ===============================

let allProjects = [];



// ===============================
// LOAD PROJECT
// ===============================

async function loadProjects() {

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    allProjects = data;

    renderProjects(allProjects);

}

loadProjects();



// ===============================
// TAMPILKAN PROJECT
// ===============================

function renderProjects(projects) {

    const container = document.getElementById("projects");

    container.innerHTML = "";

    if (projects.length === 0) {

        container.innerHTML = "<p>Tidak ada project.</p>";

        return;

    }

    projects.forEach(project => {

        container.innerHTML += `

        <div class="card">

            <span class="fullscreen-icon"
            onclick="event.stopPropagation(); openLightbox('${project.image_url}')">
                ⛶
            </span>

            <img
            src="${project.image_url}"
            onclick="openLightbox('${project.image_url}')">

            <h3>${project.title}</h3>

            <p>${project.description}</p>

        </div>

        `;

    });

}



// ===============================
// FILTER PROJECT
// ===============================

function filterProjects(category) {

    const buttons = document.querySelectorAll(".filter button");

    buttons.forEach(button => {

        button.classList.remove("active");

        if (button.textContent.trim() === category) {

            button.classList.add("active");

        }

    });

    if (category === "Semua") {

        renderProjects(allProjects);

        return;

    }

    const filtered = allProjects.filter(project => project.category === category);

    renderProjects(filtered);

}



// ===============================
// LIGHTBOX
// ===============================

function openLightbox(image) {

    document.getElementById("lightbox").style.display = "flex";

    document.getElementById("lightbox-img").src = image;

}

function closeLightbox() {

    document.getElementById("lightbox").style.display = "none";

}



// ===============================
// MENU HAMBURGER
// ===============================

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});