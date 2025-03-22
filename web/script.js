async function Submit() {
    let values = [
        document.getElementById('age').value,
        document.getElementById('sex').value,
        document.getElementById('cpt').value,
        document.getElementById('rbp').value,
        document.getElementById('chol').value,
        document.getElementById('fbs').value,
        document.getElementById('recg').value,
        document.getElementById('maxhr').value,
        document.getElementById('ea').value,
        document.getElementById('oldp').value,
        document.getElementById('stslope').value
    ];

    if (values.some(value => value.trim() === "")) {
        alert("Please fill in all fields before submitting.");
        return;
    }


    const url = `http://127.0.0.1:5000/predict/${values.join(',')}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        showPopup(data.prediction)
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch prediction.");
    }
}

function showPopup(result) {
    const popup = document.createElement("div");
    popup.className = `popup flex w-full max-w-sm py-5 px-6 bg-${result == 'YES' ? "red-200" : "green-200"} rounded-xl border border-gray-200 shadow-sm mb-4 gap-4`;
    popup.setAttribute("role", "alert");

    popup.innerHTML = `
        <div class="block">
            <h5 class="font-medium text-${result == 'YES' ? "red-500" : "green-500"} mb-1">Result:</h5>
            <p class="text-sm font-medium text-gray-600"><b>${result}:</b> "${result === 'YES' ? 'High risk detected. Please consult a doctor.' : 'Low risk detected. Stay healthy!'}"</p>
        </div>
        <button type="button" class="inline-flex flex-shrink-0 justify-center text-gray-400 transition-all duration-150" onclick="this.parentElement.remove()">
            <span class="sr-only">Close</span>
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 17L7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
    `;

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 15000);
}
