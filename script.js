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

// -- Typing Animation Function
function typeWords(targetElement, text, wordDelay = 50, sentencesPerParagraph = 4) {
    const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
    const paragraphs = [];

    for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
        const chunk = sentences.slice(i, i + sentencesPerParagraph).join(' ').trim();
        if (chunk.length > 0) paragraphs.push(chunk);
    }

    let paraIndex = 0;
    let wordIndex = 0;
    let words = [];

    targetElement.innerHTML = '';

    function typeNextWord() {
        if (paraIndex >= paragraphs.length) return;

        if (wordIndex === 0) {
            const p = document.createElement('p');
            targetElement.appendChild(p);
            words = paragraphs[paraIndex].split(/\s+/);
        }

        const currentPara = targetElement.lastChild;
        if (wordIndex < words.length) {
            currentPara.innerHTML += words[wordIndex] + ' ';
            wordIndex++;
            setTimeout(typeNextWord, wordDelay);
        } else {
            paraIndex++;
            wordIndex = 0;
            setTimeout(typeNextWord, 300);
        }
    }

    typeNextWord();
}

// -- Image Preview
function previewImage(file) {
    const localUrl = URL.createObjectURL(file);
    imageEl.src = localUrl;
    imageEl.style.display = "block";
    placeholder.style.display = "none";
}

// -- Handle File Upload
function handleFileUpload() {
    const file = fileInput.files[0];
    if (!file) return;

    previewImage(file);  // Show image immediately
    loadingArea.style.display = "block";
    resultModal.show();

    setTimeout(() => {
        fetch("sampleArticles.json")
            .then(res => res.json())
            .then(sampleArticles => {
                const article = sampleArticles[Math.floor(Math.random() * sampleArticles.length)];
                headlineEl.textContent = article.headline;
                bodyEl.innerHTML = '';
                typeWords(bodyEl, article.body);  // Animate text

                loadingArea.style.display = "none";
            })
            .catch(error => {
                loadingArea.style.display = "none";
                headlineEl.textContent = "Error loading article";
                bodyEl.innerHTML = "<p>There was a problem loading the article. Please try again.</p>";
                imageEl.style.display = "none";
                placeholder.style.display = "none";
                console.error("Fetch error:", error);
            });
    }, 1500);
}

// -- Drag & Drop Events
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

// -- Trigger input on dropArea click
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFileUpload);