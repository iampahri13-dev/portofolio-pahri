async function loadProjects() {

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });


    if (error) {
        console.log(error);
        return;
    }


    const container = document.getElementById("projects");

    container.innerHTML = "";


    data.forEach(project => {

        container.innerHTML += `

        <div class="card">

            <span class="fullscreen-icon">⛶</span>

            <img src="${project.image_url}" onclick="openLightbox('${project.image_url}')">

            <h3>${project.title}</h3>

            <p>${project.description}</p>

        </div>

        `;

    });

}


loadProjects();



function openLightbox(image){

    document.getElementById("lightbox").style.display = "flex";

    document.getElementById("lightbox-img").src = image;

}



function closeLightbox(){

    document.getElementById("lightbox").style.display = "none";

}