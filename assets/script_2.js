console.log("Скрипт VIKHEN ініціалізується...");

// 1. Словник цін для картин
const PRICES = {
    "Картина з рамкою 'Alisa'": 650,
    "Картина з рамкою 'Mira'": 650,
    "Картина ексклюзивна": 950
};

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

    // Функція зміни кольору та стану кнопки "Додати картину"
    function updateAddButtonState() {
        if (!addBtn) return;
        const blocks = container.querySelectorAll('.product-selection');
        const lastBlock = blocks[blocks.length - 1];
        
        if (isBlockValid(lastBlock)) {
            addBtn.disabled = false;
            addBtn.style.backgroundColor = ''; 
            addBtn.style.color = '';
            addBtn.style.cursor = 'pointer';
            addBtn.style.opacity = '1';
        } else {
            addBtn.disabled = true;
            addBtn.style.backgroundColor = '#d3d3d3'; 
            addBtn.style.color = '#7a7a7a';
            addBtn.style.cursor = 'not-allowed';
            addBtn.style.opacity = '0.7';
        }
    }
    
    window.updateAddButtonState = updateAddButtonState;

    // Функція підрахунку загальної суми
    function calculateTotal() {
        let total = 0;
        const productBlocks = document.querySelectorAll('#productsContainer .product-selection');
        
        productBlocks.forEach(block => {
            const typeSelect = block.querySelector('.product-type');
            if (typeSelect && typeSelect.value && PRICES[typeSelect.value]) {
                total += PRICES[typeSelect.value];
            }
        });

        const totalDisplay = document.getElementById('totalPriceValue');
        if (totalDisplay) {
            totalDisplay.innerText = `${total} грн`;
        }
        
        return total;
    }

    window.calculateTotal = calculateTotal;

    // Оновлення суми та стану кнопки при зміні полів
    if (container) {
        container.addEventListener('change', function() {
            const blocks = container.querySelectorAll('.product-selection');
            const lastBlock = blocks[blocks.length - 1];
            if (isBlockValid(lastBlock) && messageDiv && messageDiv.innerText.includes('обов’язкові поля')) {
                messageDiv.style.display = 'none';
            }
            calculateTotal();
            updateAddButtonState();
        });
    }

    // Динамічне додавання нової картини
    if (addBtn && container) {
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const blocks = container.querySelectorAll('.product-selection');
            const lastBlock = blocks[blocks.length - 1];
            
            if (lastBlock && !isBlockValid(lastBlock)) {
                if (messageDiv) {
                    messageDiv.style.display = 'block';
                    messageDiv.style.color = 'red';
                    messageDiv.innerText = 'Будь ласка, заповніть обов’язкові поля поточної картини (тип, колір та смак шоколаду), перш ніж додавати наступну!';
                }
                
                const emptySelect = Array.from(lastBlock.querySelectorAll('select[required]')).find(select => !select.value);
                if (emptySelect) {
                    emptySelect.reportValidity();
                    emptySelect.focus();
                }
                return;
            }
            
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
            calculateTotal(); 
            updateAddButtonState();
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
        const finalPrice = calculateTotal(); 

        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', fullPhone);
        formData.append('comment', comment || 'Без коментаря');
        formData.append('date', new Date().toLocaleString('uk-UA'));
        formData.append('totalPrice', `${finalPrice} грн`);

        let itemsSummary = [];

        productBlocks.forEach((block, index) => {
            const num = index + 1;
            const type = block.querySelector('.product-type').value;
            const color = block.querySelector('.product-color').value;
            const flavor = block.querySelector('.product-flavor').value;
            const inscription = block.querySelector('.product-inscription').value.trim() || 'Без напису';
            const photoFile = block.querySelector('.product-photo').files[0];
            
            // Визначаємо вартість картини
            const itemPrice = PRICES[type] ? `${PRICES[type]} грн` : 'Ціна не вказана';

            // Формуємо рядок з додаванням ціни картини
            itemsSummary.push(`${num}) ${type} | Колір: ${color} | Шоколад: ${flavor} | Напис: ${inscription} | Ціна: ${itemPrice}`);
                
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
                calculateTotal();
                updateAddButtonState();
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

    calculateTotal();
    updateAddButtonState(); 
});

window.removeProductBlock = function(button) {
    const block = button.closest('.product-selection');
    if (block) {
        block.remove();
        reindexProducts();
        if (typeof window.calculateTotal === 'function') window.calculateTotal();
        if (typeof window.updateAddButtonState === 'function') window.updateAddButtonState();
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
