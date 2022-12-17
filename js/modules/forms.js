function forms() {
	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

	modalTrigger.forEach((btn) => {
		btn.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.style.display = 'none';
		document.body.style.overflow = '';
	}

	function openModal() {
		modal.style.display = 'block';
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.style.display) {
			closeModal();
		}
	});
	const modalTimerId = setTimeout(openModal, 50000);

	function showModalByScroll() {
		if (
			window.pageYOffset + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight
		) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
			clearInterval(modalTimerId);
		}
	}
	window.addEventListener('scroll', showModalByScroll);

 // forms

	const forms = document.querySelectorAll('form');

	const message = {
		loading: '/project_1.64/icons/spinner.svg',
		success: 'Спасибо, скоро мы с Вами свяжемся',
		failure: 'что-то пошло не так',
	};

	forms.forEach((item) => {
		bindPostData(item);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: data,
		});
		return await res.json();
	};

	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			let statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
			form.insertAdjacentElement('afterend', statusMessage);
			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			const obj = { a: 23, b: 50 };
			console.log(Object.entries(obj));

			postData('http://localhost:3000/requests', json)
				.then((data) => {
					console.log(data);
					showThanksModal(message.success);

					statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					form.reset();
				});
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.style.display = 'none';
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
		<div class="modal__content">
		<div class="modal__close" data-close>&times;</div>
		<div class="modal__title">${message}</div>
		</div>`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.style.display = 'block';
			closeModal();
		}, 4000);
	}
}
fetch('http://localhost:3000/menu')
	.then((data) => data.json())
	.then((res) => console.log(res));
export default forms;

