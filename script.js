const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));

const modalBody = document.getElementById('modalBody');
const loadingArea = modalBody.querySelector(".loading-area");
const contentArea = modalBody.querySelector(".content-area");

const imageEl = document.getElementById("articleImage");
const placeholder = document.getElementById("imagePlaceholder");
const headlineEl = document.getElementById("modalHeadline");
const bodyEl = document.getElementById("modalArticleBody");

// Click entire drop area to trigger input
dropArea.addEventListener("click", () => fileInput.click());

// Highlight on drag
['dragenter', 'dragover'].forEach(event => {
    dropArea.addEventListener(event, e => {
        e.preventDefault();
        dropArea.classList.add('border-primary');
    });
});

['dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, e => {
        e.preventDefault();
        dropArea.classList.remove('border-primary');
    });
});

dropArea.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        handleFileUpload();
    }
});

fileInput.addEventListener("change", handleFileUpload);

function handleFileUpload() {
    const file = fileInput.files[0];
    if (!file) return;

    loadingArea.style.display = "block";
    contentArea.style.display = "none";
    resultModal.show();

    setTimeout(() => {
        fetch("sampleArticles.json")
            .then(res => res.json())
            .then(sampleArticles => {
                const article = sampleArticles[Math.floor(Math.random() * sampleArticles.length)];

                headlineEl.textContent = article.headline;
                bodyEl.innerHTML = article.body;

                const randomSeed = Date.now();
                imageEl.style.display = "none";
                placeholder.style.display = "block";
                imageEl.src = `https://picsum.photos/1280/720?random=${randomSeed}`;

                imageEl.onload = () => {
                    placeholder.style.display = "none";
                    imageEl.style.display = "block";
                };

                loadingArea.style.display = "none";
                contentArea.style.display = "block";
            })
            .catch(error => {
                loadingArea.style.display = "none";
                contentArea.style.display = "block";
                headlineEl.textContent = "Error loading article";
                bodyEl.innerHTML = "<p>There was a problem loading the article. Please try again.</p>";
                imageEl.style.display = "none";
                placeholder.style.display = "none";
                console.error("Fetch error:", error);
            });
    }, 1500);
}