console.log("Скрипт VIKHEN ініціалізується...");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM повністю завантажено.");
    
    const form = document.getElementById('productionForm');
    const addBtn = document.getElementById('add-product-btn');
    const container = document.getElementById('productsContainer');
    const messageDiv = document.getElementById('formMessage');
    
    if (!form) {
        console.error("Помилка: елемент #productionForm не знайдено на сторінці!");
        return;
    }

    let isSubmitting = false;

    // Перевірка, чи заповнені всі обов'язкові поля в конкретному блоці
    function isBlockValid(block) {
        if (!block) return true;
        const type = block.querySelector('.product-type')?.value;
        const color = block.querySelector('.product-color')?.value;
        const flavor = block.querySelector('.product-flavor')?.value;
        return Boolean(type && color && flavor);
    }

    // Автоматичне приховування повідомлення про помилку під час заповнення полів
    if (container) {
        container.addEventListener('change', function() {
            const blocks = container.querySelectorAll('.product-selection');
            const lastBlock = blocks[blocks.length - 1];
            if (isBlockValid(lastBlock) && messageDiv && messageDiv.innerText.includes('обов’язкові поля')) {
                messageDiv.style.display = 'none';
            }
        });
    }

    // Динамічне додавання нової картини з обов'язковою перевіркою попередньої
    if (addBtn && container) {
        addBtn.addEventListener('click', function() {
            const blocks = container.querySelectorAll('.product-selection');
            const lastBlock = blocks[blocks.length - 1];
            
            // Перевіряємо обов'язкові поля останнього блоку (Картина №1, Картина №2 тощо)
            if (lastBlock && !isBlockValid(lastBlock)) {
                if (messageDiv) {
                    messageDiv.style.display = 'block';
                    messageDiv.style.color = 'red';
                    messageDiv.innerText = 'Будь ласка, заповніть обов’язкові поля поточної картини (тип, колір та смак шоколаду), перш ніж додавати наступну!';
                }
                
                // Сфокусувати та підсвітити перше незаповнене обов'язкове поле
                const emptySelect = Array.from(lastBlock.querySelectorAll('select[required]')).find(select => !select.value);
                if (emptySelect) {
                    emptySelect.reportValidity();
                    emptySelect.focus();
                }
                return; // Зупиняємо виконання, нова картина не додається
            }
            
            // Очищаємо повідомлення про помилку, якщо все заповнено
            if (messageDiv) {
                messageDiv.style.display = 'none';
            }

            const itemCount = blocks.length + 1;

            const newItem = document.createElement('div');
            newItem.className = 'product-selection';
            newItem.setAttribute('data-item', itemCount);
            
            newItem.innerHTML = `
                <div class="second-item-header">
                    <h4>Картина №${itemCount}</h4>
                    <button type="button" class="btn-remove" onclick="removeProductBlock(this)">✖ Видалити</button>
                </div>
                <select class="product-type" required>
                    <option value="" disabled selected>Оберіть картину *</option>
                    <option value="Картина з рамкою 'Alisa'">Картина з рамкою 'Alisa'</option>
                    <option value="Картина з рамкою 'Mira'">Картина з рамкою 'Mira'</option>
                    <option value="Картина ексклюзивна">Ексклюзивна картина</option>
                </select>
                <select class="product-color" required>
                    <option value="" disabled selected>Оберіть колір рамки *</option>
                    <option value="Золотий">Золотий</option>
                    <option value="Срібний">Срібний</option>
                    <option value="Фіолетовий">Фіолетовий</option>
                    <option value="Аквамарин">Аквамарин</option>
                    <option value="Рожевий">Рожевий</option>
                    <option value="Зелений">Зелений</option>
                    <option value="Синій">Синій</option>
                </select>
                <select class="product-flavor" required>
                    <option value="" disabled selected>Оберіть шоколад *</option>
                    <option value="Молочний">Молочний</option>
                    <option value="Чорний">Чорний</option>
                </select>
                <input type="text" class="product-inscription" placeholder="Додати напис (необов'язково)">
                <div style="margin-top: 4px;">
                    <label style="font-size: 13px; color: var(--muted); display: block; margin-bottom: 4px;">Фото для картини (необов'язково)</label>
                    <input type="file" class="product-photo" accept="image/*">
                </div>
            `;

            container.appendChild(newItem);
        });
    }

    // Обробка відправки форми
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (isSubmitting) return;

        const submitBtn = document.getElementById('submitBtn');

        const name = document.getElementById('clientName').value.trim();
        const rawPhone = document.getElementById('clientPhone').value.trim();
        const commentInput = document.getElementById('clientComment');
        const comment = commentInput ? commentInput.value.trim() : '';

        // Валідація імені та телефону
        if (!name || rawPhone.length < 9) {
            if (messageDiv) {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'red';
                messageDiv.innerText = 'Введіть ім’я та повний номер телефону (9 цифр після +380)!';
            }
            return;
        }

        const productBlocks = document.querySelectorAll('#productsContainer .product-selection');
        let isValid = true;

        productBlocks.forEach((block) => {
            if (!isBlockValid(block)) {
                isValid = false;
            }
        });

        if (!isValid) {
            if (messageDiv) {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'red';
                messageDiv.innerText = 'Будь ласка, заповніть усі обов’язкові поля для всіх доданих картин (картина, колір та смак шоколаду)!';
            }
            return;
        }

        isSubmitting = true;
        if (submitBtn) {
            submitBtn.innerText = 'Відправка...';
            submitBtn.disabled = true;
        }

        const fullPhone = '+380' + rawPhone;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', fullPhone);
        formData.append('comment', comment || 'Без коментаря');
        formData.append('date', new Date().toLocaleString('uk-UA'));

        let itemsSummary = [];

        productBlocks.forEach((block, index) => {
            const num = index + 1;
            const type = block.querySelector('.product-type').value;
            const color = block.querySelector('.product-color').value;
            const flavor = block.querySelector('.product-flavor').value;
            const inscription = block.querySelector('.product-inscription').value.trim() || 'Без напису';
            const photoFile = block.querySelector('.product-photo').files[0];

          
            itemsSummary.push(`${num}) ${type} | Колір: ${color} | Шоколад: ${flavor} | Напис: ${inscription}`);
                
            if (photoFile) {
                formData.append('photos', photoFile, `Картина_${num}_${photoFile.name}`);
	    }
        });

        formData.append('product', itemsSummary.join('\n'));
        formData.append('quantity', productBlocks.length);

        const webhookUrl = 'https://hook.eu1.make.com/733szm3zjuokrop5n3z1p7on7tr9a947';

        fetch(webhookUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                if (messageDiv) {
                    messageDiv.style.display = 'block';
                    messageDiv.style.color = 'green';
                    messageDiv.innerText = 'Заявку успішно відправлено!';
                }
                form.reset();
                
                // Відновлюємо початковий стан форми з одним блоком
                if (container) {
                    container.innerHTML = `
                        <div class="product-selection" data-item="1">
                            <div class="second-item-header">
                                <h4>Картина №1</h4>
                            </div>
                            <select class="product-type" required>
                                <option value="" disabled selected>Оберіть картину *</option>
                                <option value="Картина з рамкою 'Alisa'">Картина з рамкою 'Alisa'</option>
                                <option value="Картина з рамкою 'Mira'">Картина з рамкою 'Mira'</option>
                                <option value="Картина ексклюзивна">Ексклюзивна картина</option>
                            </select>
                            <select class="product-color" required>
                                <option value="" disabled selected>Оберіть колір рамки *</option>
                                <option value="Золотий">Золотий</option>
                                <option value="Срібний">Срібний</option>
                                <option value="Фіолетовий">Фіолетовий</option>
                                <option value="Аквамарин">Аквамарин</option>
                                <option value="Рожевий">Рожевий</option>
                                <option value="Зелений">Зелений</option>
                                <option value="Синій">Синій</option>
                            </select>
                            <select class="product-flavor" required>
                                <option value="" disabled selected>Оберіть шоколад *</option>
                                <option value="Молочний">Молочний</option>
                                <option value="Чорний">Чорний</option>
                            </select>
                            <input type="text" class="product-inscription" placeholder="Додати напис (необов'язково)">
                            <div style="margin-top: 4px;">
                                <label style="font-size: 13px; color: var(--muted); display: block; margin-bottom: 4px;">Фото для картини (необов'язково)</label>
                                <input type="file" class="product-photo" accept="image/*">
                            </div>
                        </div>
                    `;
                }
            } else {
                throw new Error('Помилка сервера');
            }
        })
        .catch(error => {
            console.error('Помилка Webhook:', error);
            if (messageDiv) {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'red';
                messageDiv.innerText = 'Помилка відправки. Спробуйте пізніше або зв’яжіться в Telegram.';
            }
        })
        .finally(() => {
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerText = 'Залишити заявку';
                    submitBtn.disabled = false;
                }
                isSubmitting = false;
            }, 3000);
        });
    });
});

// Глобальна функція для видалення блоків
window.removeProductBlock = function(button) {
    const block = button.closest('.product-selection');
    if (block) {
        block.remove();
        reindexProducts();
    }
};

function reindexProducts() {
    const blocks = document.querySelectorAll('#productsContainer .product-selection');
    blocks.forEach((block, index) => {
        const num = index + 1;
        block.setAttribute('data-item', num);
        const header = block.querySelector('.second-item-header h4');
        if (header) {
            header.innerText = `Картина №${num}`;
        }
    });
}