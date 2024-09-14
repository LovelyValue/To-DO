window.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector(".modal__form");
	const ul = document.querySelector("ul");

	bindPostData(form);
	callGetData("http://localhost:3000/requests");

	//Отправка данных на сервер.
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

	//Создание верстки на странице.
	class Task {
		constructor(description, id, checkbox, parentSelector) {
			this.description = description;
			this.id = id;
			this.checkbox = checkbox;
			this.parentSelector = document.querySelector(parentSelector);
		}

		render() {
			const element = document.createElement("li");
			element.classList.add("modal__task");
			element.innerHTML = `
				<input class="modal__task-input" id="${this.id}" type="checkbox" name="${this.id}" ${this.checkbox}/>
				<label class="modal__task-label ${this.checkbox}" for="${this.id}">
					${this.description}
				</label>
				<button class="modal__task-delete" type='button'></button>
			`;
			this.parentSelector.prepend(element);
		}
	}

	//Получение данных с сервера.
	async function getData(url) {
		const response = await fetch(url);

		return await response.json();
	}

	function callGetData(url) {
		getData(url)
			.then(response => {
				console.log(response);
				document.querySelector(".modal__tasks").innerHTML = ``;
				response.forEach(({ task, id, checkbox }) => {
					new Task(task, id, checkbox, ".modal__tasks").render();
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	//Удаление данных с сервера.
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

	//Изменение данных на сервере.
	async function patchDataChecked(url) {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				checkbox: "checked",
			}),
		});

		return await response.json();
	}

	async function patchDataIsChecked(url) {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				checkbox: "",
			}),
		});

		return await response.json();
	}

	ul.addEventListener("change", event => {
		const checkbox = event.target.className === "modal__task-input";
		const checkboxId = event.target.id;
		const checkboxCheck = event.target.checked;

		if (checkbox) {
			if (checkboxCheck == true) {
				patchDataChecked(`http://localhost:3000/requests/${checkboxId}`)
					.then(response => {
						console.log(response);
					})
					.catch(error => {
						console.log(error);
					})
					.finally(() => {
						callGetData("http://localhost:3000/requests");
					});
			} else {
				patchDataIsChecked(`http://localhost:3000/requests/${checkboxId}`)
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
		}
	});
});
