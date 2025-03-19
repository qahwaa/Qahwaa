document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalCostElement = document.getElementById("cost-value");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // التأكد من صحة الكميات
    cart = cart.map(item => ({
        ...item,
        quantity: item.quantity > 0 ? item.quantity : 1
    }));
    localStorage.setItem("cart", JSON.stringify(cart));

    // حساب التكلفة الإجمالية
    function calculateTotal() {
        let total = cart.reduce((sum, item) => sum + (400 * item.quantity), 60);
        totalCostElement.textContent = total + " LE";
    }

    // عرض السلة
    function renderCart() {
        cartItemsContainer.innerHTML = "";

        cart.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>${item.color}</td>
                <td>
                    <select class="quantity" data-index="${index}">
                        ${[1, 2, 3, 4, 5].map(q => `<option value="${q}" ${q == item.quantity ? "selected" : ""}>${q}</option>`).join("")}
                    </select>
                </td>
                <td><button class="remove-item" data-index="${index}">❌</button></td>
            `;
            cartItemsContainer.appendChild(row);
        });

        // تحديث الكمية عند تغييرها
        document.querySelectorAll(".quantity").forEach(select => {
            select.addEventListener("change", function () {
                const index = this.getAttribute("data-index");
                cart[index].quantity = parseInt(this.value);
                localStorage.setItem("cart", JSON.stringify(cart));
                calculateTotal();
                renderCart();
            });
        });

        // حذف عنصر من السلة
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                calculateTotal();
            });
        });

        calculateTotal();
    }

    // تفريغ السلة بالكامل
    document.querySelector(".clear-cart").addEventListener("click", function () {
        if (confirm("هل أنت متأكد أنك تريد مسح السلة بالكامل؟")) {
            localStorage.removeItem("cart");
            cart = [];
            renderCart();
            calculateTotal();
        }
    });

    // إرسال الطلب عبر واتساب
    document.getElementById("submit-order").addEventListener("click", function () {
        if (cart.length === 0) {
            alert("🚫 سلة التسوق فارغة! الرجاء إضافة منتجات قبل تقديم الطلب.");
            return;
        }

        const name = document.getElementById("full-name").value.trim();
        const phone = document.getElementById("phone-number").value.trim();
        const altPhone = document.getElementById("alt-phone").value.trim();
        const address = document.getElementById("full-address").value.trim();
        const notes = document.getElementById("notes").value.trim();

        if (!name || !phone || !address) {
            alert("⚠️ الرجاء ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، العنوان).");
            return;
        }

        let orderDetails = `📦 *تفاصيل الطلب:*\n\n👤 *الاسم:* ${name}\n📞 *رقم الهاتف:* ${phone}\n📞 *رقم آخر:* ${altPhone}\n📍 *العنوان:* ${address}\n📝 *ملاحظات:* ${notes}\n\n🛍 *المنتجات:*`;
        cart.forEach(item => {
            orderDetails += `\n- ${item.name} (${item.size}, ${item.color}) × ${item.quantity}`;
        });
        orderDetails += `\n\n💰 *التكلفة الإجمالية:* ${totalCostElement.textContent}`;

        let whatsappNumber = "201012207852"; // رقم الواتساب
        let whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappURL, "_blank");
    });

    // زر استكمال الشراء - التأكد من عدم إضافته مرتين
    if (!document.querySelector(".continue-shopping")) {
        const continueShoppingBtn = document.createElement("button");
        continueShoppingBtn.textContent = "🛍️ استكمال الشراء";
        continueShoppingBtn.className = "continue-shopping";
        continueShoppingBtn.style = "margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: 0.3s;";
        
        continueShoppingBtn.addEventListener("mouseover", function() {
            continueShoppingBtn.style.backgroundColor = "#0056b3";
        });
        
        continueShoppingBtn.addEventListener("mouseout", function() {
            continueShoppingBtn.style.backgroundColor = "#007bff";
        });
        
        continueShoppingBtn.addEventListener("click", function () {
            window.location.href = "index.html"; // غير هذا الرابط حسب صفحة المنتجات
        });

        document.body.appendChild(continueShoppingBtn);
    }

    // تشغيل الوظائف عند تحميل الصفحة
    renderCart();
});
