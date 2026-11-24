const form = document.getElementById("bookUploadForm");
const coverInput = document.getElementById("coverImage");
const coverPreview = document.getElementById("coverPreview");
const uploadMessage = document.getElementById("uploadMessage");

coverInput.addEventListener("change", () => {
    const file = coverInput.files[0];
    if (!file) {
        coverPreview.classList.add("hidden");
        coverPreview.removeAttribute("src");
        return;
    }

    coverPreview.src = URL.createObjectURL(file);
    coverPreview.classList.remove("hidden");
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    uploadMessage.textContent = "";
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Could not upload this book.");
        }

        window.location.assign(`/books/${result.data._id}`);
    } catch (error) {
        uploadMessage.textContent = error.message || "Could not reach the server.";
        submitButton.disabled = false;
    }
});
