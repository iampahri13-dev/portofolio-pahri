async function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });


    if(error){
        alert("Login gagal: " + error.message);
    } else {
        alert("Login berhasil");
        loadAdminProjects();
    }

}



async function uploadProject(){

    const file = document.getElementById("file").files[0];

    if(!file){
        alert("Pilih gambar dulu");
        return;
    }


    const filename = Date.now() + "-" + file.name;


    // Upload gambar ke Storage
    const { error: uploadError } = await supabaseClient
        .storage
        .from("portofolio")
        .upload(filename, file);


    if(uploadError){
        alert(uploadError.message);
        return;
    }


    // Ambil URL gambar
    const imageUrl = supabaseClient
        .storage
        .from("portofolio")
        .getPublicUrl(filename)
        .data.publicUrl;



    // Simpan data ke tabel projects
    const { error } = await supabaseClient
        .from("projects")
        .insert({
            title: document.getElementById("title").value,
            description: document.getElementById("desc").value,
            image_url: imageUrl
        });



    if(error){
        alert(error.message);
    } else {
        alert("Project berhasil diupload");
        loadAdminProjects();
    }

}




async function deleteProject(id, imageUrl){

    const confirmDelete = confirm("Yakin ingin menghapus project ini?");

    if(!confirmDelete) return;


    // Ambil nama file dari URL gambar
    const fileName = imageUrl.split("/").pop();


    // Hapus gambar dari Storage
    const { error: storageError } = await supabaseClient
        .storage
        .from("portofolio")
        .remove([fileName]);


    if(storageError){
        console.log(storageError);
    }


    // Hapus data dari tabel projects
    const { error } = await supabaseClient
        .from("projects")
        .delete()
        .eq("id", id);


    if(error){
        alert(error.message);
        return;
    }


    alert("Project berhasil dihapus");

    loadAdminProjects();

}




async function loadAdminProjects(){

    const {data, error} = await supabaseClient
        .from("projects")
        .select("*")
        .order("created_at", {ascending:false});


    if(error){
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

            <button onclick="deleteProject(${project.id}, '${project.image_url}')">
                Hapus
            </button>

        </div>

        `;

    });

}


loadAdminProjects();