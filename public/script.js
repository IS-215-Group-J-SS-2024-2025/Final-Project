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
    document.getElementById('downloadPdfBtn').style.display = 'none'; // hide button during typing

    function typeNextWord() {
        if (paraIndex >= paragraphs.length) {
            document.getElementById('downloadPdfBtn').style.display = 'inline-block'; // show after done
            return;
        }

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
            setTimeout(typeNextWord, 300); // pause between paragraphs
        }
    }

    typeNextWord();
}



// Upload handler
async function handleFile(file) {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const extension = file.name.split('.').pop().toLowerCase();

    // Validate MIME type
    if (!allowedTypes.includes(file.type)) {
        alert('Unsupported file type. Please upload a JPG or PNG image.');
        return; // Don't proceed further
    }

    // Validate extension (extra safety)
    if (!allowedExtensions.includes(extension)) {
        alert('Unsupported file extension. Please upload a JPG or PNG image.');
        return; // Don't proceed further
    }

    // ✅ If it passed checks, now show the modal
    resultModal.show();
    showLoading(); // Show loading skeleton

    try {
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

        // 3) Show the image in modal
        articleImage.src = getUrl;
        articleImage.style.display = 'block';
        lastGetUrl = getUrl;

        // 4) Trigger processing Lambda
        const proc = await fetch(processUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, style: selectedStyle }) // Pass writing style
        }).then(r => r.json());

        const { articleUrl } = proc.articleUrl ? proc : JSON.parse(proc.body);

        // 5) Fetch the article content
        const responseText = await fetch(articleUrl).then(r => r.text());

        // 6) Parse content
        let title = 'Generated Article';
        let body = responseText;

        try {
            const parsed = JSON.parse(responseText);
            if (typeof parsed === 'object' && parsed.title && parsed.article) {
                title = parsed.title;
                body = parsed.article;
            }
        } catch (e) {
            // Fallback if JSON parsing fails
            const lines = responseText.trim().split('\n');
            if (lines.length > 1 && lines[0].startsWith('# ')) {
                title = lines[0].substring(2).trim();
                body = lines.slice(2).join('\n').trim();
            }
        }

        // 7) Show headline & article
        modalHeadline.textContent = title;
        // Show writing style badge
        const prettyStyle = selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1);
        document.getElementById('styleBadge').innerHTML = `
        Writing style: 
        <span class="badge rounded-pill bg-dark p-2 px-3">${prettyStyle}</span>
`;

        modalArticleBody.textContent = '';

        typeWords(modalArticleBody, body, 50); // Animated typing
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
        document.getElementById('downloadPdfBtn').style.display = 'none';

        //resultModal.show();  // Show modal immediately

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

        //resultModal.show();

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

function downloadPDF() {
    let filename = modalHeadline.textContent.trim() || 'article';
    filename = filename.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '').slice(0, 50) + '.pdf';

    html2pdf().set({
        margin: 0.5,
        filename: filename,
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(document.getElementById('articleArea')).save();
}
