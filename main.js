window.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector(".modal__form");
	const ul = document.querySelector("ul");

	bindPostData(form);
	callGetData("http://localhost:3000/requests");

	async function postData(url, data) {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: data,
		});

		return await response.json();
	}

	function bindPostData(form) {
		form.addEventListener("submit", event => {
			event.preventDefault();

			const formData = new FormData(form);

			const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

			postData("http://localhost:3000/requests", jsonData)
				.then(response => {
					console.log(response);
				})
				.catch(error => {
					console.log(error);
				})
				.finally(() => {
					form.reset();
					callGetData("http://localhost:3000/requests");
				});
		});
	}

	class Task {
		constructor(description, id, parentSelector) {
			this.description = description;
			this.id = id;
			this.parentSelector = document.querySelector(parentSelector);
		}

		render() {
			const element = document.createElement("li");
			element.classList.add("modal__task");
			element.innerHTML = `
				<input class="modal__task-input" id="${this.id}" type="checkbox" name="${this.id}"/>
				<label class="modal__task-label" for="${this.id}">
					${this.description}
				</label>
				<button class="modal__task-delete" type='button'></button>
			`;
			this.parentSelector.prepend(element);
		}
	}

	async function getData(url) {
		const response = await fetch(url);

		return await response.json();
	}

	function callGetData(url) {
		getData(url)
			.then(response => {
				document.querySelector(".modal__tasks").innerHTML = ``;
				response.forEach(({ task, id }) => {
					new Task(task, id, ".modal__tasks").render();
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	async function deleteData(url) {
		const response = await fetch(url, {
			method: "DELETE",
		});
		return await response.json();
	}

	ul.addEventListener("click", event => {
		const deleteBtn = event.target.className === "modal__task-delete";

		if (deleteBtn) {
			const labelFor = event.target.previousElementSibling.htmlFor;

			deleteData(`http://localhost:3000/requests/${labelFor}`)
				.then(response => {
					console.log(response);
				})
				.catch(error => {
					console.log(error);
				})
				.finally(() => {
					callGetData("http://localhost:3000/requests");
				});
		}
	});

	ul.addEventListener("change", event => {
		const checkbox = event.target.className === "modal__task-input";

		if (checkbox) {
			const label = event.target.nextElementSibling;
			label.classList.toggle("checked");
		}
	});
});
