let port = 3000;
let id = "";

const getApiBase = () => `http://localhost:${port}/api/v1/notes`;

document.addEventListener("DOMContentLoaded", () => {
    const inputPort = prompt(`Masukkan port BE\nPort default: 3000`);
    
    if (inputPort && inputPort.trim() !== "") {
        port = inputPort.trim();
    }

    getNotes();
});

const formulir = document.querySelector(".btn-add");

formulir.addEventListener("click", async (e) => {
    e.preventDefault();

    const elementTitle = document.querySelector("#title");
    const elementContent = document.querySelector("#content");

    const title = elementTitle.value.trim();
    const content = elementContent.value.trim();

    if (!title || !content) return alert("Judul dan isi notes tidak boleh kosong!");

    try {
        id = elementTitle.dataset.id || "";
        if (id == "") {
            await axios.post(getApiBase(), { title, content});
        } else {
            await axios.put(`${getApiBase()}/${id}`, { title, content });
        }
        id = "";
        elementTitle.dataset.id = "";
        elementTitle.value = "";
        elementContent.value = "";

        getNotes();
    } catch (error) {
        console.log(error.response?.data || error.message);
    }

});

async function getNotes() {
    try {
        const response = await axios.get(getApiBase());
        const notes = response.data?.data || [];

        const container = document.querySelector(".notes-grid");
        let interface = "";
        let no = 1;

        // pengecekan database yg kosong
        if  (notes.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>Notes Anda masih kosong</p></div>`;
            return;
        }

        for (const note of notes) {
            interface += showNotes(no, note);
            no++;
        }

        container.innerHTML = interface;
        deleteNote();
        editNote();
    } catch (error) {
        console.log(error.response?.data || error.message);
    }
}

function showNotes(no, notes) {
    const colors = ["bg-yellow", "bg-blue", "bg-green"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `<div class="note-card ${randomColor}">
                <div class="note-content">
                    <h3 class="note-title">${notes.title ?? "Tidak Ada Judul"}</h3>
                    <p class="note-body">${notes.content ?? "Tidak Ada Isi"}</p>
                </div>
                <div class="note-footer">
                    <button data-id="${notes.id}" class="btn-action btn-edit">UBAH</button>
                    <div class="divider"></div>
                    <button data-id="${notes.id}" class="btn-action btn-delete">HAPUS</button>
                </div>
            </div>`;
}

function deleteNote() {
    const deleteButton = document.querySelectorAll(".btn-delete");

    deleteButton.forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.dataset.id;

            try {
                await axios.delete(`${getApiBase()}/${id}`);
                getNotes();
            } catch (error) {
                console.log(error.response?.data || error.message);
            }
        });
    });
}

function editNote() {
    const editButton = document.querySelectorAll(".btn-edit");

    editButton.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const container = button.closest(".note-card");
            const title = container.querySelector(".note-title").innerText;
            const content = container.querySelector(".note-body").innerText;
            
            const elementTitle = document.querySelector("#title");
            const elementContent = document.querySelector("#content");

            elementTitle.dataset.id = id;
            elementTitle.value = title;
            elementContent.value = content;
        });
    });
}