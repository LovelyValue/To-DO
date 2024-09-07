window.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector(".modal__form");

	bindPostData(form);

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: data,
		});

		return await res.json();
	};

	function bindPostData(form) {
		form.addEventListener("submit", e => {
			e.preventDefault();

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData("http://localhost:3000/requests", json)
				.then(data => {
					console.log(data);
				})
				.catch(() => {
					console.log("error");
				})
				.finally(() => {
					form.reset();
				});

			callGetData();
		});
	}

	class Task {
		constructor(descr, id, parentSelector) {
			this.descr = descr;
			this.id = id;
			this.parent = document.querySelector(parentSelector);
		}

		render() {
			const element = document.createElement("li");
			element.innerHTML = `
					<li class="modal__task">
						<input class="modal__task-input" id="${this.id}" type="checkbox" name="${this.id}"/>
						<label class="modal__task-label" for="${this.id}">
							${this.descr}
						</label>
						<button class="modal__task-delete" type='button'></button>
					</li>
				`;
			this.parent.prepend(element);
		}
	}

	const getData = async url => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	function callGetData() {
		getData("http://localhost:3000/requests").then(data => {
			const parent = document.querySelector(".modal__tasks");
			parent.innerHTML = ``;
			data.forEach(({ task, id }) => {
				new Task(task, id, ".modal__tasks").render();
			});
		});
	}

	callGetData();

	function deleteData() {
		fetch("http://localhost:3000/requests/94b2", {
			method: "DELETE",
		});
		callGetData();
	}

	document.querySelector("ul").addEventListener("change", () => {
		const checkbox = document.querySelectorAll(".modal__task-input");
		checkbox.forEach(item => {
			if (item.checked) {
				item.nextElementSibling.classList.add("checked");
			} else {
				item.nextElementSibling.classList.remove("checked");
			}
		});
	});
	const deleteBtn = document.querySelectorAll(".modal__task-delete");
	deleteBtn.forEach(item => {
		item.addEventListener("click", () => {
			deleteData();
		});
	});
});
