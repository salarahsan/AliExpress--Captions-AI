document.addEventListener('DOMContentLoaded', async () => {
    const generateBtn = document.getElementById('generateBtn');
    const productTitle = document.getElementById('productTitle');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');

    // Browser storage se purani key load karein (agar save hai)
    const stored = await chrome.storage.local.get(['groq_key']);
    if (stored.groq_key) {
        apiKeyInput.value = stored.groq_key;
    }

    generateBtn.addEventListener('click', async () => {
        const title = productTitle.value.trim();
        const apiKey = apiKeyInput.value.trim();
        
        if (!title || !apiKey) {
            alert("Pehle Title aur API Key dono dalein!");
            return;
        }

        // Agli baar ke liye key save kar lein
        await chrome.storage.local.set({ 'groq_key': apiKey });

        loading.style.display = "block";
        output.innerText = "";
        generateBtn.disabled = true;

        const prompt = `Write an ULTRA-ATTRACTIVE social media caption for this product: "${title}".
        Keep it under 150 words.
        Structure: 
        1. Explosive Hook. 
        2. 3-4 Bullet points for features. 
        3. One urgency line. 
        4. Clear call to action with emojis.
        Spacing clean rakhein.`;

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                output.innerText = data.choices[0].message.content;
            } else {
                output.innerText = "Error: Key check karein ya quota khatam ho gaya hai.";
            }
        } catch (error) {
            output.innerText = "Error: " + error.message;
        } finally {
            loading.style.display = "none";
            generateBtn.disabled = false;
        }
    });
});
