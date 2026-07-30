// ===============================
// LOGIN ADMIN
// ===============================

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Login gagal : " + error.message);
        return;
    }

    alert("Login berhasil!");

}



// ===============================
// UPLOAD PROJECT
// ===============================

async function uploadProject() {

    const file = document.getElementById("file").files[0];

    if (!file) {
        alert("Pilih gambar terlebih dahulu");
        return;
    }

    const filename = Date.now() + "-" + file.name;

    // Upload ke Storage
    const { error: uploadError } = await supabaseClient
        .storage
        .from("portofolio")
        .upload(filename, file);

    if (uploadError) {
        alert(uploadError.message);
        return;
    }

    // Ambil URL gambar
    const imageUrl = supabaseClient
        .storage
        .from("portofolio")
        .getPublicUrl(filename)
        .data.publicUrl;

    // Simpan ke tabel projects
    const { error } = await supabaseClient
        .from("projects")
        .insert({

            title: document.getElementById("title").value,

            description: document.getElementById("desc").value,

            category: document.getElementById("category").value,

            image_url: imageUrl

        });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Project berhasil diupload!");

    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("file").value = "";

    loadAdminProjects();

}



// ===============================
// HAPUS PROJECT
// ===============================

async function deleteProject(id) {

    const yakin = confirm("Yakin ingin menghapus project?");

    if (!yakin) return;

    const { error } = await supabaseClient
        .from("projects")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Project berhasil dihapus");

    loadAdminProjects();

}



// ===============================
// LOAD PROJECT ADMIN
// ===============================

async function loadAdminProjects() {

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    const box = document.getElementById("adminProjects");

    box.innerHTML = "";

    data.forEach(project => {

        box.innerHTML += `

        <div class="card">

            <img src="${project.image_url}">

            <h3>${project.title}</h3>

            <p>${project.description}</p>

            <small>Kategori : ${project.category ?? "-"}</small>

            <br><br>

            <button onclick="deleteProject(${project.id})">
                Hapus
            </button>

        </div>

        `;

    });

}

loadAdminProjects();