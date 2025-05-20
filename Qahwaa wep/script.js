document.addEventListener("DOMContentLoaded", function () {
    // ========================== تنبيه عند استخدام الوضع الرأسي ==========================
    if (window.matchMedia("(orientation: portrait)").matches) {
        alert("يفضل استخدام الموقع في الوضع الأفقي للحصول على أفضل تجربة. يرجى تدوير جهازك.");
    }

    // ========================== زر الهامبرغر (القائمة الجانبية) ==========================
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = "&#9776;"; // أيقونة الهامبرغر (3 خطوط)

    const header = document.querySelector("header");
    const nav = document.querySelector(".navigation");

    if (header && nav) {
        header.insertBefore(hamburger, nav); // إضافة الزر قبل القائمة

        hamburger.addEventListener("click", function () {
            nav.classList.toggle("active"); // إظهار أو إخفاء القائمة
        });
    }

    // ========================== تحميل بيانات السلة من localStorage ==========================
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            console.log("🚀 زر Add to Cart تم الضغط عليه!");

            const product = this.closest(".product");
            if (!product) {
                console.error("❌ لم يتم العثور على العنصر الأب (product)!");
                return;
            }

            const productName = product.querySelector("h3")?.innerText || "غير معروف";
            const productImage = product.querySelector(".image-container img")?.src || "";
            const sizeSelect = product.querySelector("select[name='size']");
            const colorSelect = product.querySelector("select[name='color']");
            const productSize = sizeSelect ? sizeSelect.value : "Default";
            const productColor = colorSelect ? colorSelect.value : "Default";

            console.log("🛒 إضافة المنتج: ", productName, productSize, productColor);

            let existingItem = cart.find(item => item.name === productName && item.size === productSize && item.color === productColor);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    image: productImage,
                    size: productSize,
                    color: productColor,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert("✅ Order added to cart successfully!");
        });
    });

    function updateCartCount() {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        } else {
            console.warn("⚠️ warning: cart-count element not found!");
        }
    }

    updateCartCount();

    // ========================== تحسين تبديل الصور ==========================
    function changeImage(button, direction) {
        const container = button.closest(".image-container");
        const img = container.querySelector("img");

        if (!img) return;

        let imageList = img.getAttribute("data-images").split(",").map(img => img.trim());
        let currentSrc = img.src.split("/").pop();
        let currentIndex = imageList.findIndex(image => image.includes(currentSrc));

        if (currentIndex === -1) currentIndex = 0;

        let newIndex = (currentIndex + direction + imageList.length) % imageList.length;
        img.src = imageList[newIndex];
    }

    document.querySelectorAll(".prev, .next").forEach(button => {
        button.addEventListener("click", function () {
            let direction = this.classList.contains("prev") ? -1 : 1;
            changeImage(this, direction);
        });
    });
});
