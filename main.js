window.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector(".modal__form");
	callGetData("http://localhost:3000/requests");

	bindPostData(form);

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

	// const li = document.querySelectorAll(".modal__task");
	// const checkbox = document.querySelectorAll(".modal__task-input");

	// li.forEach(item => {
	// 	item.addEventListener("change", () => {
	// 		console.log(0);
	// 	});
	// });
	// checkbox.forEach(item => {
	// 	console.log(1);
	// 	item.addEventListener("click", item => {
	// 		console.log(2);
	// 		if (item.checked) {
	// 			console.log(3);
	// 			item.nextElementSibling.classList.add("checked");
	// 		} else {
	// 			console.log(4);
	// 			item.nextElementSibling.classList.remove("checked");
	// 		}
	// 	});
	// });
});
