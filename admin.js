function safeText(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password) return alert("Isi email dan password terlebih dahulu.");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return alert("Login gagal: " + error.message);
  alert("Login berhasil!");
  loadAdminProjects();
}

async function uploadProject() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("desc").value.trim();
  const category = document.getElementById("category").value;
  const file = document.getElementById("file").files[0];

  if (!title) return alert("Isi judul project terlebih dahulu.");
  if (!file) return alert("Pilih gambar terlebih dahulu.");
  if (!file.type.startsWith("image/")) return alert("File harus berupa gambar.");
  if (file.size > 8 * 1024 * 1024) return alert("Ukuran gambar maksimal 8 MB.");

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error: uploadError } = await supabaseClient.storage.from("portofolio").upload(filename, file);
  if (uploadError) return alert(uploadError.message);

  const imageUrl = supabaseClient.storage.from("portofolio").getPublicUrl(filename).data.publicUrl;
  const { error } = await supabaseClient.from("projects").insert({
    title, description, category, image_url: imageUrl
  });
  if (error) return alert(error.message);

  alert("Project berhasil diupload!");
  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("file").value = "";
  loadAdminProjects();
}

async function deleteProject(id) {
  if (!confirm("Yakin ingin menghapus project ini?")) return;
  const { error } = await supabaseClient.from("projects").delete().eq("id", id);
  if (error) return alert(error.message);
  alert("Project berhasil dihapus.");
  loadAdminProjects();
}

async function loadAdminProjects() {
  const box = document.getElementById("adminProjects");
  const { data, error } = await supabaseClient.from("projects").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    box.textContent = "Project tidak dapat dimuat. Pastikan sudah login dan konfigurasi Supabase benar.";
    return;
  }
  if (!data?.length) {
    box.innerHTML = '<p class="admin-note">Belum ada project yang diunggah.</p>';
    return;
  }
  box.innerHTML = data.map(project => `
    <article class="card">
      <img src="${safeText(project.image_url || "")}" alt="${safeText(project.title || "Project")}">
      <h3>${safeText(project.title || "Untitled project")}</h3>
      <p>${safeText(project.description || "")}</p>
      <small>${safeText(project.category || "Tanpa kategori")}</small>
      <button type="button" onclick="deleteProject('${safeText(project.id)}')">Hapus project</button>
    </article>`).join("");
}

loadAdminProjects();
