# AI News Article Generator - Frontend UI

This branch contains the **Frontend User Interface** for the AI News Article Generator project.  
Users can upload an image, and the system will automatically generate a news-style article using AI tools.

---

## 🚀 Features

- **Drag & Drop Image Upload**  
  Simple and intuitive image uploading.

- **Animated Typing for Articles**  
  Articles are revealed with a smooth typing effect for better user engagement.

- **Bootstrap 5.3 Responsive Design**  
  Clean, modern, and mobile-friendly.

- **Writing Style Options**  
  Choose between *Simple, Business, Academic, Casual* writing styles.

- **Placeholder Loading Animation**  
  Displays a skeleton UI while the article is being generated.

- **Download as PDF**  
  After the article is generated, users can download the news article as a cleanly formatted PDF (article text only).

---

## 📝 How to Use

1. Clone the repository and checkout this branch:

    ```bash
    git clone <repo-url>
    git checkout frontend-ui
    ```

2. Open `index.html` directly in your browser or use a local server:

    ```bash
    # Example using VS Code
    # Install Live Server extension, then right-click index.html > Open with Live Server
    ```

3. Drag & drop an image or click to upload.

4. Select your preferred writing style.

5. Wait while the AI generates the article.

6. After the typing animation finishes, click the **Download as PDF** button to save your article.

---

## 🛠 Technologies

- **HTML5** & **CSS3**
- **Bootstrap 5.3**
- **JavaScript ES6**
- **AWS S3** (for storage)
- **AWS Lambda** (backend processing, not included in this branch)
- **OpenAI GPT (via Lambda)**

---

## 🔒 Notes

- The **frontend-ui** branch only includes the **client-side** code.  
- Backend API keys and processing logic are handled separately by the AWS Lambda function and are not exposed here.

---

## 📄 License

MIT License
