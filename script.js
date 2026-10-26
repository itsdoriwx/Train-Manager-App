document.addEventListener('DOMContentLoaded', () => {

    // перемикання вкладок
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // завдання 1:
    let trainFlights = [
        { route: "Харків – Київ", price: 420, departureDate: "2026-10-28" },
        { route: "Київ – Перемишль", price: 1250, departureDate: "2026-10-25" },
        { route: "Львів – Ужгород", price: 280, departureDate: "2026-10-21" },
        { route: "Одеса – Кишинів", price: 890, departureDate: "2026-11-05" }
    ];

    function getDaysLeft(dateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);

        const diff = target - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    function renderTrainTable() {
        const container = document.getElementById('flights-result'); // шукаємо пустий div у html
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Маршрут потяга</th>
                        <th>Ціна квитка</th>
                        <th>Дата відправлення</th>
                        <th>Днів до відправки</th>
                        <th>Статус рейсу</th>
                    </tr>
                </thead>
                <tbody>
        `;

        trainFlights.forEach(f => {
            const days = getDaysLeft(f.departureDate);
            let rowClass = "row-success";
            let status = "Заплановано"; // default status

            if (days < 0) {
                rowClass = "row-danger";
                status = "Рейс закінчено";
            } else if (days === 0) {
                rowClass = "row-danger";
                status = "Відправлення сьогодні!";
            } else if (days >= 1 && days <= 5) {
                rowClass = "row-warning";
                status = "Скоро відправлення";
            }

            html += `
                <tr class="${rowClass}">
                    <td><strong>${f.route}</strong></td>
                    <td>${f.price} грн</td>
                    <td>${f.departureDate}</td>
                    <td>${days < 0 ? 0 : days} дн.</td> 
                    <td>${status}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html; // вставляємо сформовану таблицю (штмл-код) у div
    }

    // сортування за датою
    document.getElementById('btn-sort-date').addEventListener('click', () => { // шукаємо кнопку "сортувати за датою" в html
        trainFlights.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
        renderTrainTable();
    });

    document.getElementById('btn-refresh').addEventListener('click', renderTrainTable);
    renderTrainTable(); // оновлюємо таблицю при завантаженні сторінки


    // завдання 2.1: додавання рейсу з валідацією
    const inputName = document.getElementById('input-flight-name');
    const inputPrice = document.getElementById('input-flight-price');
    const inputDate = document.getElementById('input-flight-date');
    const btnAddManual = document.getElementById('btn-add-flight-manual');
    const successMsg = document.getElementById('add-success-msg');
    const errorMsg = document.getElementById('add-error-msg');

    function addNewTrain() {
        const routeName = inputName.value.trim(); // отримуємо значення з поля вводу і видаляємо пробіли на початку та в кінці
        const priceValue = parseFloat(inputPrice.value);
        const dateValue = inputDate.value;

        if (!routeName) {
            showError("Будь ласка, введіть маршрут потяга!");
            return;
        }

        if (isNaN(priceValue) || priceValue < 30) {
            showError("Введіть коректну ціну квитка (не менше 30 грн)!");
            return;
        }

        if (!dateValue) {
            showError("Будь ласка, оберіть дату відправлення!");
            return;
        }

        errorMsg.style.display = 'none'; // приховуємо повідомлення про помилку, якщо все ок

        trainFlights.push({
            route: routeName,
            price: priceValue,
            departureDate: dateValue
        });

        renderTrainTable();

        inputName.value = ''; // очищаємо поля вводу після додавання
        inputPrice.value = '';
        inputDate.value = '';

        successMsg.style.display = 'block'; // показуємо повідомлення про успішне додавання
        setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
    }

    inputPrice.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTrain();
        }
    });

    btnAddManual.addEventListener('click', addNewTrain);


    // завдання 2.2:
    const editableTable = document.getElementById('editable-tariffs-table');

    editableTable.addEventListener('click', function(e) {
        const cell = e.target.closest('td'); // шукаємо найближчу комірку (td) до елемента, на який клікнули
        
        if (!cell || cell.cellIndex === 0 || cell.querySelector('.edit-wrapper')) return;

        const currentText = cell.textContent.trim(); // отримуємо поточний текст комірки

        cell.innerHTML = `
            <div class="edit-wrapper">
                <input type="text" value="${currentText}">
                <button class="save-btn">Зберегти</button>
            </div>
        `;

        const input = cell.querySelector('input');
        const saveBtn = cell.querySelector('.save-btn');

        input.focus(); // встановлюємо фокус на поле вводу

        saveBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const newText = input.value.trim();
            cell.textContent = newText ? newText : currentText;
        });
    });

});