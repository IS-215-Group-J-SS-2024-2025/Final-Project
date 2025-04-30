/***********TEST***********/
// const dropArea = document.getElementById('dropArea');
// const fileInput = document.getElementById('fileInput');
// const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));

// const modalBody = document.getElementById('modalBody');
// const loadingArea = modalBody.querySelector(".loading-area");
// const contentArea = modalBody.querySelector(".content-area");

// const imageEl = document.getElementById("articleImage");
// const placeholder = document.getElementById("imagePlaceholder");
// const headlineEl = document.getElementById("modalHeadline");
// const bodyEl = document.getElementById("modalArticleBody");

// let originalArticleBody = '';
// let originalHeadline = '';
// let selectedStyle = "simple"; // Default style

// // -- Typing Animation Function
// function typeWords(targetElement, text, wordDelay = 50, sentencesPerParagraph = 4) {
//     const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
//     const paragraphs = [];

//     for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
//         const chunk = sentences.slice(i, i + sentencesPerParagraph).join(' ').trim();
//         if (chunk.length > 0) paragraphs.push(chunk);
//     }

//     let paraIndex = 0;
//     let wordIndex = 0;
//     let words = [];

//     targetElement.innerHTML = '';

//     function typeNextWord() {
//         if (paraIndex >= paragraphs.length) return;

//         if (wordIndex === 0) {
//             const p = document.createElement('p');
//             targetElement.appendChild(p);
//             words = paragraphs[paraIndex].split(/\s+/);
//         }

//         const currentPara = targetElement.lastChild;
//         if (wordIndex < words.length) {
//             currentPara.innerHTML += words[wordIndex] + ' ';
//             wordIndex++;
//             setTimeout(typeNextWord, wordDelay);
//         } else {
//             paraIndex++;
//             wordIndex = 0;
//             setTimeout(typeNextWord, 300);
//         }
//     }

//     typeNextWord();
// }

// // -- Image Preview
// function previewImage(file) {
//     const localUrl = URL.createObjectURL(file);
//     imageEl.src = localUrl;
//     imageEl.style.display = "block";
//     placeholder.style.display = "none";
// }

// // -- Handle File Upload
// function handleFileUpload() {
//     const file = fileInput.files[0];
//     if (!file) return;

//     previewImage(file);
//     loadingArea.style.display = "block";
//     resultModal.show();
//     bodyEl.innerHTML = "";
//     headlineEl.textContent = "";

//     setTimeout(() => {
//         fetch("sampleArticles.json")
//             .then(res => res.json())
//             .then(sampleArticles => {
//                 const article = sampleArticles[Math.floor(Math.random() * sampleArticles.length)];

//                 originalHeadline = article.headline;
//                 originalArticleBody = article.body;

//                 headlineEl.textContent = originalHeadline;
//                 typeWords(bodyEl, originalArticleBody);

//                 loadingArea.style.display = "none";
//                 contentArea.style.display = "block";
//             })
//             .catch(error => {
//                 loadingArea.style.display = "none";
//                 contentArea.style.display = "block";
//                 headlineEl.textContent = "Error loading article";
//                 bodyEl.innerHTML = "<p>There was a problem loading the article. Please try again.</p>";
//                 imageEl.style.display = "none";
//                 placeholder.style.display = "none";
//                 console.error("Fetch error:", error);
//             });
//     }, 1500);
// }

// // -- Drag & Drop Events
// ['dragenter', 'dragover'].forEach(event => {
//     dropArea.addEventListener(event, e => {
//         e.preventDefault();
//         dropArea.classList.add('border-primary', 'drag-over');
//     });
// });
// ['dragleave', 'drop'].forEach(event => {
//     dropArea.addEventListener(event, e => {
//         e.preventDefault();
//         dropArea.classList.remove('border-primary', 'drag-over');
//     });
// });

// dropArea.addEventListener('drop', (e) => {
//     const files = e.dataTransfer.files;
//     if (files.length) {
//         fileInput.files = files;
//         handleFileUpload();
//     }
// });

// dropArea.addEventListener("click", () => fileInput.click());
// fileInput.addEventListener("change", handleFileUpload);

// document.getElementById("styleSelector").addEventListener("click", function (e) {
//     if (e.target.matches("[data-style]")) {
//         const buttons = this.querySelectorAll("[data-style]");
//         buttons.forEach(btn => btn.classList.remove("active"));
//         e.target.classList.add("active");
//         selectedStyle = e.target.getAttribute("data-style");
//         console.log("Selected style:", selectedStyle);
//     }
// });

/**********LIVE**************/
const signUrl = CONFIG.SIGN_URL;
const processUrl = CONFIG.PROCESS_URL;

const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const chooseFileBtn = dropArea.querySelector('button');
const articleImage = document.getElementById('articleImage');
const modalHeadline = document.getElementById('modalHeadline');
const modalArticleBody = document.getElementById('modalArticleBody');
const loadingArea = document.querySelector('.loading-area');
const articleArea = document.getElementById('articleArea');

let lastGetUrl = '';
let resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
let selectedStyle = "simple"; // Default style

// Helper: Show loading placeholders for article
function showLoading() {
    loadingArea.style.display = 'block';    // show skeleton
    articleArea.style.display = 'none';      // hide real article
}

// Helper: Show real article
function showArticle() {
    loadingArea.style.display = 'none';     // hide skeleton
    articleArea.style.display = 'block';    // show real article
}

// Custom Word-by-Word Typing
function typeWords(targetElement, text, wordDelay = 50, sentencesPerParagraph = 4) {
    // Break the text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
    const paragraphs = [];

    for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
        const chunk = sentences.slice(i, i + sentencesPerParagraph).join(' ').trim();
        if (chunk.length > 0) paragraphs.push(chunk);
    }

    let paraIndex = 0;
    let wordIndex = 0;
    let words = [];

    targetElement.innerHTML = ''; // Clear previous

    function typeNextWord() {
        if (paraIndex >= paragraphs.length) return;

        if (wordIndex === 0) {
            // Start new paragraph
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
            setTimeout(typeNextWord, 300); // pause between paragraphs
        }
    }

    typeNextWord();
}


// Upload handler
async function handleFile(file) {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        alert('Unsupported file type. Please upload a JPEG, PNG, GIF, or WEBP image.');
        return;
    }

    try {
        showLoading(); // Show loading skeleton

        // 1) Get presigned upload URL
        const { uploadUrl, getUrl, key } = await fetch(signUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, filetype: file.type })
        }).then(r => r.json());

        // 2) Upload the file to S3
        await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file
        });

        // 3) Show the image
        articleImage.src = getUrl;
        articleImage.style.display = 'block';
        lastGetUrl = getUrl;

        // 4) Trigger processing
        const proc = await fetch(processUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ key })
            body: JSON.stringify({ key, selectedStyle }) // with writing styles
        }).then(r => r.json());

        const { articleUrl } = proc.articleUrl ? proc : JSON.parse(proc.body);

        // 5) Fetch the article content
        const responseText = await fetch(articleUrl).then(r => r.text());

        // 6) Parse content into title & article body
        let title = 'Generated Article';
        let body = responseText;

        try {
            const parsed = JSON.parse(responseText);
            if (typeof parsed === 'object' && parsed.title && parsed.article) {
                title = parsed.title;
                body = parsed.article;
            }
        } catch (e) {
            // fallback to markdown format
            const lines = responseText.trim().split('\n');
            if (lines.length > 1 && lines[0].startsWith('# ')) {
                title = lines[0].substring(2).trim(); // Remove "# "
                body = lines.slice(2).join('\n').trim(); // Skip title and blank line
            }
        }

        // 7) Populate modal content
        modalHeadline.textContent = title;
        modalArticleBody.textContent = ''; // Clear old content

        // 8) Start animated typing
        typeWords(modalArticleBody, body, 50);

        // 9) Show article area
        showArticle();

    } catch (err) {
        console.error('Upload or processing error:', err);
        alert('Something went wrong. Please try again.');
        resultModal.hide();
    }
}


// Click "Choose File" button
chooseFileBtn.onclick = () => fileInput.click();

// Handle file input
fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
        const localImageUrl = URL.createObjectURL(file);
        articleImage.src = localImageUrl;
        articleImage.style.display = 'block';

        resultModal.show();  // Show modal immediately

        // Reset UI
        loadingArea.style.display = 'block';    // Start with loading placeholder visible
        articleArea.style.display = 'none';     // Hide article content

        handleFile(file); // Start uploading & processing
    }
};

// Drag & Drop
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('border-primary', 'drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('border-primary', 'drag-over');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('border-primary', 'drag-over');

    const file = e.dataTransfer.files[0];
    if (file) {
        const localImageUrl = URL.createObjectURL(file);
        articleImage.src = localImageUrl;
        articleImage.style.display = 'block';

        resultModal.show();

        loadingArea.style.display = 'block';
        articleArea.style.display = 'none';

        handleFile(file);
    }
});

document.getElementById("styleSelector").addEventListener("click", function (e) {
    if (e.target.matches("[data-style]")) {
        const buttons = this.querySelectorAll("[data-style]");
        buttons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        selectedStyle = e.target.getAttribute("data-style");
        console.log("Selected style:", selectedStyle);
    }
});