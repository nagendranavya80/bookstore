const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formTitle = document.getElementById("formTitle");
const switchPrompt = document.getElementById("switchPrompt");
const switchForm = document.getElementById("switchForm");
const authMessage = document.getElementById("authMessage");

switchForm.addEventListener("click", () => {
    const showingLogin = !loginForm.classList.contains("hidden");
    loginForm.classList.toggle("hidden", showingLogin);
    loginForm.classList.toggle("flex", !showingLogin);
    registerForm.classList.toggle("hidden", !showingLogin);
    registerForm.classList.toggle("flex", showingLogin);
    formTitle.textContent = showingLogin ? "Create an account" : "Log in";
    switchPrompt.textContent = showingLogin ? "Already registered?" : "New here?";
    switchForm.textContent = showingLogin ? "Log in" : "Create an account";
    authMessage.textContent = "";
});

async function submitAuthForm(form, endpoint) {
    authMessage.textContent = "";
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Unable to complete the request.");
        }

        if (result.accessToken) {
            sessionStorage.setItem("accessToken", result.accessToken);
            authMessage.textContent = `Logged in as ${result.user.email}.`;
        } else {
            authMessage.textContent = `${result.message}. You can now log in.`;
            form.reset();
        }
    } catch (error) {
        authMessage.textContent = error.message || "Unable to reach the server.";
    } finally {
        submitButton.disabled = false;
    }
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAuthForm(loginForm, "/api/auth/login");
});

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAuthForm(registerForm, "/api/auth/register");
});
